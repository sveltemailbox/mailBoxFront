import { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  GET_FOLDER,
  CREATE_FOLDER,
  EDIT_FOLDER,
  REMOVE_FOLDER,
} from "../../config/constants";

import {
  updateFolderList,
  updateActiveModule,
  updateSeachText,
  updateFolderCachedData,
} from "../../redux/action/InboxAction";
import * as Api from "../../util/api/ApicallModule";
import { toast } from "react-toastify";
import Modal from "react-awesome-modal";
import Toaster from "../../util/toaster/Toaster";
import { MAIL_ACTIONS } from "../../util";
import Loader from "react-loader-spinner";
const Sidebar = (props) => {
  const [openDropDown, setOpenDropDown] = useState("");
  const [createFolder, setCreateFolder] = useState(false);
  const [error, setError] = useState("");
  const [index, setIndex] = useState(0);
  const [folderName, setFolderName] = useState("");
  const [folderId, setFolderId] = useState(0);
  const [folderColorCode, setFolderColorCode] = useState("");
  const [folderList, setFolderList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [data, setData] = useState(0);
  const [disableCheckButton, setDisableCheckButton] = useState(false);
  const [isActive, setIsActive] = useState("All");
  const [visible, setVisible] = useState(false);
  const [myId, setMyId] = useState([]);
  let logData = {};
  const logDataFunction = (type, mail_id, attachId) => {
    logData = {
      type: type,
      mail_id: mail_id,
      attach_id: attachId,
    };
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    if (props?.userData?.designations) {
      getAllFolders();
    }
  }, [props?.userData]);

  const getAllFolders = async () => {
    logDataFunction("GET LIST OF FOLDER", 0, 0);
    const apiData = [];
    const resp = await Api.ApiHandle(`${GET_FOLDER}`, "", "GET", logData);

    if (resp?.status === 1) {
      resp.data?.forEach((folder) => {
        const obj = {
          apiFolderId: folder?.id,
          apiFolderName: folder?.name,
          apiColorCode: folder.Color?.text,
          isFolderCached: false,
        };
        apiData.push(obj);
      });

      setFolderList(apiData);
    }
  };

  useEffect(() => {
    const finalFolderData = [...folderList];
    props.updateFolderList(Array.from(new Set(finalFolderData)));
  }, [folderList]);

  const handleSetOpenDropDown = (id) => {
    if (openDropDown === "") {
      setOpenDropDown("show");
      setData(id);
    } else {
      setOpenDropDown("");
      setData(0);
    }
  };

  const handleCreateFolder = () => {
    setCreateFolder((createFolder) => !createFolder);
  };

  const handleCloseCreateFolder = () => {
    setError("");
    setCreateFolder((createFolder) => !createFolder);
    if (isEdit === true) {
      if (folderName !== "") {
        const folder = {
          apiFolderId: folderId,
          apiFolderName: folderName,
          apiColorCode: folderColorCode,
        };
        const _folderList = [];
        _folderList.push(folder);
        setCreateFolder(false);
        setFolderList([..._folderList, ...folderList]);
        setFolderName("");
        setFolderColorCode(null);
        setFolderId(null);
        props.updateFolderList([..._folderList, ...folderList]);
        setIsEdit(false);
        getAllFolders();
      }
    } else {
      setCreateFolder(false);
      setFolderName("");
      setFolderColorCode(null);
      setIsEdit(false);
      setFolderId(null);
    }
  };

  const handleFolderName = (e) => {
    setError("");
    setFolderName(e.currentTarget.value);
  };
  const handleKeypress = (e, folderId) => {
    if (e.keyCode == 13) {
      isEdit ? handleEditFolderResponse(folderId) : handleFolderCreation();
    }
  };

  const handleFolderCreation = async () => {
    logDataFunction("CREATE FOLDER", 0, 0);
    if (folderName !== "") {
      const payload = {
        name: folderName,
      };
      setDisableCheckButton(true);
      const resp = await Api.ApiHandle(CREATE_FOLDER, payload, "POST", logData);

      if (resp.status === 1) {
        const folder = {
          apiFolderId: resp?.data[0]?.id,
          apiFolderName: folderName,
          apiColorCode: resp?.data[0]?.Color?.text,
        };
        const _folderList = [];
        _folderList.push(folder);
        setCreateFolder(false);
        setFolderList([..._folderList, ...folderList]);
        setFolderName("");
        setDisableCheckButton(false);
        props.updateFolderList([..._folderList, ...folderList]);
      } else {
        Toaster(
          "error",
          `${
            typeof resp?.message === "string"
              ? resp?.message
              : "Folder Name Too Long !"
          }`
        );
        setDisableCheckButton(false);
      }
    } else {
      setError("Folder Name Cannot Be Empty !!");
    }
  };

  const handleEditFolder = (index) => {
    let name = folderList[index];
    setFolderName(name?.apiFolderName);
    setFolderId(name?.apiFolderId);
    setFolderColorCode(name?.apiColorCode);
    setIsEdit(true);
    setCreateFolder(true);
    folderList.splice(index, 1);
    setFolderList(folderList);
    props.updateFolderList(folderList);
  };

  const handleEditFolderResponse = async (folderId) => {
    logDataFunction("EDIT FOLDER", 0, 0);
    const resp = await Api.ApiHandle(
      EDIT_FOLDER + `${folderId}`,
      { name: folderName },

      "PUT",
      logData
    );

    const folder = {
      apiFolderId: folderId,
      apiFolderName: folderName,
      apiColorCode: folderColorCode,
    };
    const _folderList = [];
    _folderList.push(folder);

    if (resp.status === 1) {
      setCreateFolder(false);
      setFolderList([..._folderList, ...folderList]);
      setFolderName("");
      setFolderColorCode(null);
      setFolderId(null);
      props.updateFolderList([..._folderList, ...folderList]);
      setIsEdit(false);
    } else {
      Toaster("error", `${resp?.message}`);
    }
  };

  const handleDeleteFolder = async () => {
    logDataFunction("DELETE FOLDER", 0, 0);
    const resp = await Api.ApiHandle(
      `${REMOVE_FOLDER}${folderId}`,
      {},

      "DELETE",
      logData
    );

    if (resp.status === 1) {
      folderList.splice(index, 1);
      setFolderList(folderList);
      props.updateFolderList(folderList);
      getAllFolders();
      props.setFilterOptions({
        mail_action: MAIL_ACTIONS.UNREAD,
      });
      props.setActiveModule("inbox");
      setVisible(false);
      props?.updateActiveModule("Unread");
      setFolderId(null);
      setIndex(null);
    } else {
      toast.error("Something went wrong, try again");
      setVisible(false);
    }
  };

  const handleRemoveFolder = async (i, id) => {
    setVisible(true);

    setFolderId(id);
    setIndex(i);
  };

  const onFolderClick = async (folder) => {
    if (props?.isAction || props?.isMailAddedToFolder) {
      props.updateFolderCachedData("delete");
      props?.setLoader(true);
      setTimeout(() => {
        props?.setLoader(false);
      }, [1000]);
    }
    props.updateSeachText({});
    getFilteredMailList(folder.apiFolderId);
    props.setFilterOptions({
      folder: folder.apiFolderId,
    });
    props.setActiveModule("inbox");
    props.setIsAction(false);
    props?.setIsMailAddedToFolder(false);
  };

  const getFilteredMailList = async (filter) => {
    props.setInboxMailData([]);
    props.updateSeachText({});
    if (props.page > 2) props.getAllMails("refresh");
    if (typeof filter === "string") {
      switch (filter) {
        case "Unread":
          props.setFilterOptions({
            mail_action: MAIL_ACTIONS.UNREAD,
          });
          props.updateActiveModule("Unread");

          setIsActive("Unread");
          break;
        case "Sent":
          props.setFilterOptions({ is_sent: 1 });
          props.updateActiveModule("Sent");
          setIsActive("Sent");
          break;
        case "All":
          props.setFilterOptions({});
          props.updateActiveModule("All");

          setIsActive("All");
          break;
        case "Archive":
          props.setFilterOptions({ mail_action: MAIL_ACTIONS.READ });
          props.updateActiveModule("Archive");

          setIsActive("Archive");
          break;
        case "Starred":
          props.setFilterOptions({ mail_action: MAIL_ACTIONS.STARRED });
          props.updateActiveModule("Starred");

          setIsActive("Starred");
          break;
        case "Crashed":
          props.setFilterOptions({ mail_action: MAIL_ACTIONS.CRASHED });
          props.updateActiveModule("Crashed");

          setIsActive("Crashed");
          break;
      }
    } else {
      setIsActive(filter);
      props.updateActiveModule(filter);
    }

    props.setActiveModule("inbox");
  };

  return (
    <>
      <div className="nk-ibx-aside-update">
        <div className="nk-ibx-head">
          <div className="mr-n1" onClick={props.openComposeModel}>
            <span className="link link-text">
              <em className="icon-circle icon ni ni-plus"></em>
              <span>Compose Mail</span>
            </span>
          </div>
        </div>
        <div className="nk-ibx-nav jumbotron-overflow">
          <ul className="nk-ibx-menu" style={{ cursor: "pointer" }}>
            <li
              className={props.isActiveModule === "Unread" ? "active" : ""}
              onClick={() => {
                getFilteredMailList("Unread");
              }}
            >
              <a className="nk-ibx-menu-item">
                <em className="icon ni ni-inbox-in"></em>
                <span className="nk-ibx-menu-text">Unread messages</span>
                <span className="badge badge-pill badge-primary">
                  {props.unreadMailsCount}
                </span>
              </a>
            </li>

            <li
              className={props.isActiveModule === "Archive" ? "active" : ""}
              onClick={() => {
                getFilteredMailList("Archive");
              }}
            >
              <a className="nk-ibx-menu-item">
                <em className="icon ni ni-inbox-in-fill"></em>
                <span className="nk-ibx-menu-text">Archive messages</span>
                {props?.archiveLoader && (
                  <div className="ml-auto">
                    <Loader
                      type="ThreeDots"
                      color="#6576ff"
                      height={20}
                      width={20}
                    />
                  </div>
                )}
              </a>
            </li>

            <li
              className={props.isActiveModule === "All" ? "active" : ""}
              onClick={() => {
                getFilteredMailList("All");
              }}
            >
              <a className="nk-ibx-menu-item">
                <em className="icon ni ni-emails"></em>
                <span className="nk-ibx-menu-text">All mails</span>
              </a>
            </li>

            <li
              className={props.isActiveModule === "Sent" ? "active" : ""}
              onClick={() => {
                getFilteredMailList("Sent");
              }}
            >
              <a className="nk-ibx-menu-item">
                <em className="icon ni ni-send"></em>
                <span className="nk-ibx-menu-text">Sent</span>
              </a>
            </li>

            <li
              className={props.isActiveModule === "Crashed" ? "active" : ""}
              onClick={() => {
                getFilteredMailList("Crashed");
              }}
            >
              <a className="nk-ibx-menu-item">
                <em className="icon ni ni-briefcase"></em>
                <span className="nk-ibx-menu-text">Crash messages</span>
              </a>
            </li>
            <li
              className={props.isActiveModule === "Starred" ? "active" : ""}
              onClick={() => {
                getFilteredMailList("Starred");
              }}
            >
              <a className="nk-ibx-menu-item">
                <em className="icon ni ni-star"></em>
                <span className="nk-ibx-menu-text">Starred</span>
              </a>
            </li>
          </ul>
          <div className="nk-ibx-nav-head">
            {/* Folder Creation */}
            <h6 className="title">Folders</h6>
            <a>
              {!createFolder ? (
                <abbr title="Add folder">
                  <em
                    onClick={handleCreateFolder}
                    style={{ cursor: "pointer" }}
                    className="icon ni ni-plus-c"
                  ></em>
                </abbr>
              ) : (
                <em
                  onClick={handleCloseCreateFolder}
                  style={{ cursor: "pointer", color: "red" }}
                  className="icon ni ni-cross-c"
                ></em>
              )}
            </a>
          </div>
          <ul className="nk-ibx-label">
            {createFolder && (
              <li style={{ backgroundColor: "#ffff" }}>
                <div className="nk-reply-form-field">
                  {error !== "" && <p style={{ color: "red" }}>{error}</p>}
                  <input
                    className="form-control form-control-simple no-resize"
                    value={folderName}
                    type="text"
                    placeholder="Folder Name"
                    onChange={handleFolderName}
                    onKeyDown={(e) => {
                      !disableCheckButton && handleKeypress(e, folderId);
                    }}
                    autoFocus
                  />
                </div>
                <div style={{ marginLeft: "7%", cursor: "pointer" }}>
                  {isEdit ? (
                    <em
                      className="ni ni-check-fill-c"
                      style={{ color: "#798bff" }}
                      onClick={() => {
                        handleEditFolderResponse(folderId);
                      }}
                    ></em>
                  ) : (
                    <em
                      className="ni ni-check-fill-c"
                      style={{ color: "#798bff" }}
                      onClick={() => {
                        !disableCheckButton && handleFolderCreation();
                      }}
                    ></em>
                  )}
                </div>
              </li>
            )}

            {/* listing of folders */}
            {props.folderList?.map((folder, i) => {
              return (
                <li
                  key={`folderList${i}`}
                  style={{ cursor: "pointer" }}
                  className={
                    props.isActiveModule === folder?.apiFolderId ? "active" : ""
                  }
                >
                  <a
                    onClick={() => onFolderClick(folder)}
                    style={{ width: "80%" }}
                  >
                    <em
                      className="ni ni-folder-fill"
                      style={{ color: folder?.apiColorCode }}
                    ></em>

                    <span className="nk-ibx-label-text folder-styling">
                      <abbr title={folder?.apiFolderName}>
                        <div className="folder-name ">
                          {folder?.apiFolderName}
                          {props?.loader &&
                          folder?.apiFolderId === props.isFolderLoaderId ? (
                            <div className="ml-auto">
                              <Loader
                                type="ThreeDots"
                                color="#6576ff"
                                height={30}
                                width={30}
                              />
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </abbr>
                    </span>
                  </a>

                  <div data-index={i} className={`dropdown ${openDropDown}`}>
                    <a
                      className="dropdown-toggle"
                      data-toggle="dropdown"
                      aria-expanded={openDropDown === "show" ? "true" : "false"}
                    >
                      <em
                        className="icon ni ni-more-v"
                        onClick={() =>
                          handleSetOpenDropDown(folder?.apiFolderId)
                        }
                      ></em>
                    </a>
                    {data === folder?.apiFolderId && (
                      <div
                        className={`dropdown-menu dropdown-menu-sm dropdown-menu-right ${openDropDown}`}
                      >
                        <ul className="link-list-opt no-bdr">
                          <li onClick={() => handleEditFolder(i)}>
                            <a>
                              <span>Edit Folder</span>
                            </a>
                          </li>
                          <li
                            onClick={() =>
                              handleRemoveFolder(i, folder?.apiFolderId)
                            }
                          >
                            <a>
                              <span>Remove Folder</span>
                            </a>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {visible && (
        <Modal
          // className="modal fade"
          visible={visible}
          id="remove-folder"
          width="800"
          height="170"
          effect="fadeInUp"
          onClickAway={() => {
            setVisible(false);
          }}
        >
          <div className="nk-reply-form-header">
            <div className="nk-reply-form-group">
              <div className="nk-reply-form-input-group">
                <div className="mark-leave-tag-container">
                  <h2 style={{ fontSize: "161%" }}>Delete Folder</h2>
                  <em
                    className="icon ni ni-cross"
                    onClick={() => {
                      setVisible(false);
                    }}
                  />
                </div>
                <hr />
                <div
                  className="nk-reply-form-input nk-reply-form-input-to overflow"
                  style={{ display: "block", fontSize: 17 }}
                >
                  <ul style={{ marginRight: "3%" }}>
                    Are you sure you permanently want to delete this folder ?
                  </ul>
                  <div className="remove-folder-options">
                    <div
                      className="remove-folder-yes"
                      onClick={handleDeleteFolder}
                    >
                      Yes
                    </div>
                    <div
                      className="remove-folder-yes"
                      onClick={() => {
                        setVisible(false);
                      }}
                    >
                      No
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

const mapActionToProps = {
  updateFolderList,
  updateActiveModule,
  updateSeachText,
  updateFolderCachedData,
};

const mapStateToProps = (state) => ({
  folderList: state.folderList,
  userData: state.userData,
  unreadMailsCount: state.unreadMailsCount,
  isActiveModule: state.isActiveModule,
  archiveLoader: state.archiveLoader,
});

export default connect(mapStateToProps, mapActionToProps)(Sidebar);
