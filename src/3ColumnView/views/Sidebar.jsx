import { useEffect, useState } from 'react';
import Modal from 'react-awesome-modal';
import { connect } from 'react-redux';
import {
  Button,
  OverlayTrigger,
  renderTooltip,
  Tooltip,
} from 'react-bootstrap';
import {
  updateFolderList,
  updateIsActiveModule3Column,
  updateSortFilter,
} from '../../redux/action/InboxAction';
import {
  CREATE_FOLDER,
  EDIT_FOLDER,
  GET_ALL_MAIL,
  GET_FOLDER,
  REMOVE_FOLDER,
} from '../../config/constants';
// import Inbox from "./Inbox";
import * as Api from '../../util/api/ApicallModule';
import Toaster from '../../util/toaster/Toaster';

const Sidebar = (props) => {
  const sidebarOptions = [
    {
      id: 'unread',
      sidabarName: 'Unread Mails',
      icon: 'inbox-fill',
      count: props.unreadCount,
    },
    {
      id: 'archive',
      sidabarName: 'Archive Mails',
      icon: 'emails-fill',
    },
    {
      id: 'sent',
      sidabarName: 'Sent Mails',
      icon: 'send',
    },
    {
      id: 'crashed',
      sidabarName: 'Crash Mails',
      icon: 'briefcase',
    },
    {
      id: 'starred',
      sidabarName: 'Starred Mails',
      icon: 'star-fill',
    },
  ];

  const defaultFolderList = [
    {
      id: '',
      folderName: '',
      folderColor: '',
    },
  ];

  const [folder, setFolder] = useState(defaultFolderList);
  const [visiable, setVisiable] = useState(false);
  const [selectedOption, setSelectedOption] = useState('unread');
  const [addFolder, setAddFolder] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [folderId, setFolderId] = useState(null);
  const [folderColor, setFolderColor] = useState(null);
  const [folderOptions, setFolderOptions] = useState(false);
  const [error, setError] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  // console.log(props, 'props');
  useEffect(async () => {
    if (props?.userData?.designations) getAllFolders();
  }, [props?.userData?.designations]);

  useEffect(() => {
    const finalFolderData = [...folder];
    props.updateFolderList(Array.from(new Set(finalFolderData)));
  }, [folder]);

  const openModal = () => {
    setVisiable(true);
  };

  const closeModal = () => {
    if (folderName === '') {
      setVisiable(false);
      setAddFolder(false);
      setFolderName('');
      setFolderColor(null);
      setFolderId(null);
      setIsEdit(false);
    } else {
      const folderData = {
        id: folderId,
        folderName: folderName,
        folderColor: folderColor,
      };
      const _folderList = [];
      _folderList.push(folderData);
      setVisiable(false);
      setAddFolder(false);
      setFolder([..._folderList, ...folder]);
      setFolderName('');
      setFolderColor(null);
      setFolderId(null);
      setIsEdit(false);
    }
    if (props?.userData?.designations) getAllFolders();
  };

  const handleAddFolder = async () => {
    const payload = {
      name: folderName,
      designation_id: props?.userData?.designations[0]?.id,
    };

    const resp = await Api.ApiHandle(CREATE_FOLDER, payload, 'POST');

    if (resp.status === 1) {
      const folderResp = {
        id: resp?.data[0]?.id,
        folderName: folderName,
        folderColor: resp?.data[0]?.Color?.text,
      };
      const _folderList = [];
      _folderList.push(folderResp);
      setAddFolder(false);
      setFolder([..._folderList, ...folder]);
      setFolderName('');
      Toaster('success', 'Folder added successfully');
      props.updateFolderList([..._folderList, ...folder]);
    } else {
      Toaster('error', `${resp?.message}`);
    }
  };

  const handlefolderOptions = (e) => {
    e.stopPropagation();
    setFolderOptions((folderOptions) => !folderOptions);
  };

  const getAllFolders = async () => {
    const apiData = [];
    const resp = await Api.ApiHandle(
      `${GET_FOLDER}${props?.userData?.designations[0]?.id}`,
      '',
      'GET'
    );

    if (resp.status === 1) {
      resp.data?.forEach((folder) => {
        const obj = {
          id: folder?.id,
          folderName: folder?.name,
          folderColor: folder.Color?.text,
        };
        apiData.push(obj);
      });

      setFolder(apiData);
    }
  };

  const handleEditFolder = (index) => {
    let name = folder[index];
    // console.log(name);
    setFolderName(name?.folderName);
    setFolderId(name?.id);
    setFolderColor(name?.folderColor);
    setIsEdit(true);
    folder.splice(index, 1);
    setFolder(folder);
    setAddFolder(true);
  };

  const handleEditFolderResponse = async () => {
    const payload = {
      name: folderName,
      designation_id: props?.userData?.designations[0]?.id,
    };
    const resp = await Api.ApiHandle(
      `${EDIT_FOLDER}${folderId}`,
      payload,
      'PUT'
    );

    const folderData = {
      id: folderId,
      folderName: folderName,
      folderColor: folderColor,
    };
    const _folderList = [];
    _folderList.push(folderData);

    if (resp.status === 1) {
      setAddFolder(false);
      setFolder([..._folderList, ...folder]);
      setFolderName('');
      setFolderColor(null);
      setFolderId(null);
      setIsEdit(false);
      Toaster('success', 'Folder updated successfully');
    } else {
      setAddFolder(false);
      setFolder([..._folderList, ...folder]);
      setFolderName('');
      setFolderColor(null);
      setFolderId(null);
      setIsEdit(false);

      Toaster('error', `${resp?.message}`);
    }
  };

  const handleRemoveFolder = async (i, id) => {
    const resp = await Api.ApiHandle(`${REMOVE_FOLDER}${id}`, '', 'DELETE');

    if (resp.status === 1) {
      folder.splice(i, 1);
      setFolder(folder);
      getAllFolders();
      Toaster('success', 'Folder removed successfully');
    } else {
      Toaster('error', `${resp?.message}`);
    }
  };

  return (
    <>
      <div id="threeColumnSidebar">
        <div className="nk-ibx-aside-update-3">
          <div className="nk-ibx-head">
            <div className="mr-n1">
              <strong>Mailbox</strong>
            </div>
          </div>
          <div className="nk-ibx-nav jumbotron-overflow">
            <ul className="nk-ibx-menu">
              <li onClick={props.openComposeModel}>
                <OverlayTrigger
                  placement="right"
                  overlay={
                    <Tooltip className="tooltip-right">Compose Mail</Tooltip>
                  }
                >
                  <span className="d-inline-block">
                    <div href="javascript:void(0)">
                      <span className="link link-text">
                        <em className="icon-circle icon ni ni-plus"></em>
                      </span>
                    </div>
                  </span>
                </OverlayTrigger>
              </li>
              {sidebarOptions.map((bars, i) => {
                return (
                  <li
                    className={selectedOption === bars.id ? 'active' : ''}
                    onClick={() => {
                      props?.updateSortFilter('');
                      setSelectedOption(bars.id);
                      setFolderOptions(false);
                      props.onClick(bars.id);
                      props?.updateIsActiveModule3Column(bars.sidabarName);
                    }}
                    id={bars.id}
                    key={`tabsList${i}`}
                  >
                    <OverlayTrigger
                      placement="right"
                      overlay={
                        <Tooltip className="tooltip-right">
                          {bars.sidabarName}
                        </Tooltip>
                      }
                    >
                      <span className="d-inline-block">
                        <div className="nk-ibx-menu-item">
                          <em className={`icon ni ni-${bars.icon}`}></em>
                          {bars.id === 'unread' ? (
                            <span className="nk-ibx-menu-text">
                              {bars.count}
                            </span>
                          ) : (
                            ''
                          )}
                        </div>
                      </span>
                    </OverlayTrigger>
                  </li>
                );
              })}
            </ul>

            <hr className="mb-0" />

            {/* <div className="nk-ibx-nav-head">
              <OverlayTrigger
                placement="right"
                overlay={<Tooltip className="tooltip-right">Folder</Tooltip>}
              >
                <span className="d-inline-block sidebarFolder">
                  <h6 className="title ">
                    <em className="icon ni ni-folder-fill font-26 mr-3 text-primary"></em>{" "}
                  </h6>
                </span>
              </OverlayTrigger>
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip className="tooltip-right">Add Folder</Tooltip>
                }
              >
                <span className="d-inline-block sidebarFolder">
                  <h6 className="title">
                    <em
                      className="ni ni-plus-circle sidebarFolderAdd"
                      onClick={() => setAddFolder(true)}
                    ></em>
                  </h6>
                </span>
              </OverlayTrigger>
            </div> */}

            <ul
              className="nk-ibx-menu"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: '20%',
              }}
            >
              <li>
                <OverlayTrigger
                  placement="right"
                  overlay={
                    <Tooltip className="tooltip-right">Add Folder</Tooltip>
                  }
                >
                  <span className="d-inline-block sidebarFolder">
                    <h6 className="title">
                      <em
                        className="ni ni-plus-circle sidebarFolderAdd"
                        onClick={() => setAddFolder(true)}
                      ></em>
                    </h6>
                  </span>
                </OverlayTrigger>
              </li>
              {folder.map((fold, i) => {
                return (
                  <li
                    key={`folderList${i}`}
                    id={fold.id}
                    className={selectedOption === fold.id ? 'active' : ''}
                    onClick={() => {
                      setFolderOptions(false);
                      setSelectedOption(fold.id);
                      props.onClick(fold.id);
                    }}
                  >
                    <OverlayTrigger
                      placement="right"
                      overlay={
                        <Tooltip className="tooltip-right">
                          {fold.folderName}
                        </Tooltip>
                      }
                    >
                      <span className="d-inline-block">
                        <div style={{ color: fold.folderColor }}>
                          <em className="icon ni ni-folder-fill font-22"></em>
                        </div>
                      </span>
                    </OverlayTrigger>
                    <div
                      className={
                        selectedOption === fold.id
                          ? 'moreVertIconShow'
                          : 'moreVertIcon'
                      }
                    >
                      <em
                        className="ni ni-more-v"
                        style={{ fontSize: 16 }}
                        onClick={handlefolderOptions}
                      ></em>
                      {folderOptions && (
                        <div
                          className={`dropdown-menu dropdown-menu-sm dropdown-menu-right folder-dropdown show `}
                          // style={{ left: 26, zIndex: 999 }}
                        >
                          <ul className="link-list-opt no-bdr">
                            <li onClick={() => handleEditFolder(i)}>
                              <a>
                                <span>Edit Folder</span>
                              </a>
                            </li>
                            <li onClick={() => handleRemoveFolder(i, fold.id)}>
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
      </div>
      {/* <div className="nk-ibx-body body-width bg-white">
        <Inbox />
      </div> */}

      <Modal
        className="modal fade"
        visible={addFolder}
        id="add-folder"
        width="400"
        effect="fadeInUp"
        onClickAway={closeModal}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h6 className="modal-title">Add Folder</h6>
            <span onClick={closeModal} className="close">
              <em className="icon ni ni-cross-sm"></em>
            </span>
          </div>
          <div className="modal-body p-0">
            <div className="nk-reply-form-header">
              <div className="nk-reply-form-group">
                <div className="nk-reply-form-input-group">
                  <div className="nk-reply-form-input nk-reply-form-input-to">
                    <input
                      type="text"
                      className="input-mail tagify"
                      placeholder="Folder name ..."
                      value={folderName}
                      onChange={(e) => setFolderName(e.target.value)}
                    />
                    {/* <Button type="submit"> */}
                    <Button
                      type="submit"
                      onClick={
                        isEdit ? handleEditFolderResponse : handleAddFolder
                      }
                    >
                      Submit
                    </Button>
                    {/* <em
                      className="ni ni-check-fill-c addFolderCheckIcon"
                     
                    ></em> */}
                    {/* </Button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      {/* <Modal
        className="modal fade"
        visible={visiable}
        id="compose-mail"
        width="720"
        effect="fadeInUp"
        onClickAway={closeModal}
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title">Compose Message</h6>
              <span onClick={closeModal} className="close">
                <em className="icon ni ni-cross-sm"></em>
              </span>
            </div>
            <div className="modal-body p-0">
              <div className="nk-reply-form-header">
                <div className="nk-reply-form-group">
                  <div className="nk-reply-form-input-group">
                    <div className="nk-reply-form-input nk-reply-form-input-to">
                      <label className="label">To</label>
                      <input
                        type="text"
                        className="input-mail tagify"
                        placeholder="Recipient"
                        data-whitelist="team@softnio.com, help@softnio.com, contact@softnio.com"
                      />
                    </div>
                    <div
                      className="nk-reply-form-input nk-reply-form-input-cc"
                      data-content="mail-cc"
                    >
                      <label className="label">Cc</label>
                      <input type="text" className="input-mail tagify" />
                      <div  className="toggle-opt" data-target="mail-cc">
                        <em className="icon ni ni-cross"></em>
                      </div>
                    </div>
                    <div
                      className="nk-reply-form-input nk-reply-form-input-bcc"
                      data-content="mail-bcc"
                    >
                      <label className="label">Bcc</label>
                      <input type="text" className="input-mail tagify" />
                      <div  className="toggle-opt" data-target="mail-bcc">
                        <em className="icon ni ni-cross"></em>
                      </div>
                    </div>
                  </div>
                  <ul className="nk-reply-form-nav">
                    <li>
                      <div
                        tabindex="-1"
                        className="toggle-opt"
                        data-target="mail-cc"
                        
                      >
                        CC
                      </div>
                    </li>
                    <li>
                      <div
                        tabindex="-1"
                        className="toggle-opt"
                        data-target="mail-bcc"
                        
                      >
                        BCC
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="nk-reply-form-editor">
                <div className="nk-reply-form-field">
                  <input
                    type="text"
                    className="form-control form-control-simple"
                    placeholder="Subject"
                  />
                </div>
                <div className="nk-reply-form-field">
                  <textarea
                    className="form-control form-control-simple no-resize ex-large"
                    placeholder="Hello"
                  ></textarea>
                </div>
              </div>
              <div className="nk-reply-form-tools">
                <ul className="nk-reply-form-actions g-1">
                  <li className="mr-2">
                    <button className="btn btn-primary" type="submit">
                      Send
                    </button>
                  </li>
                  <li>
                    <div className="dropdown">
                      <div
                        className="btn btn-icon btn-sm btn-tooltip"
                        data-toggle="dropdown"
                        title="Templates"
                        
                      >
                        <em className="icon ni ni-hash"></em>
                      </div>
                      <div className="dropdown-menu">
                        <ul className="link-list-opt no-bdr link-list-template">
                          <li className="opt-head">
                            <span>Quick Insert</span>
                          </li>
                          <li>
                            <div >
                              <span>Thank you message</span>
                            </div>
                          </li>
                          <li>
                            <div >
                              <span>Your issues solved</span>
                            </div>
                          </li>
                          <li>
                            <div >
                              <span>Thank you message</span>
                            </div>
                          </li>
                          <li className="divider">
                            <li>
                              <div >
                                <em className="icon ni ni-file-plus"></em>
                                <span>Save as Template</span>
                              </div>
                            </li>
                            <li>
                              <div >
                                <em className="icon ni ni-notes-alt"></em>
                                <span>Manage Template</span>
                              </div>
                            </li>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div
                      className="btn btn-icon btn-sm"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Upload Attachment"
                      
                    >
                      <em className="icon ni ni-clip-v"></em>
                    </div>
                  </li>
                  <li className="d-none d-sm-block">
                    <div
                      className="btn btn-icon btn-sm"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Insert Emoji"
                      
                    >
                      <em className="icon ni ni-happy"></em>
                    </div>
                  </li>
                  <li className="d-none d-sm-block">
                    <div
                      className="btn btn-icon btn-sm"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Upload Images"
                      
                    >
                      <em className="icon ni ni-img"></em>
                    </div>
                  </li>
                </ul>
                <ul className="nk-reply-form-actions g-1">
                  <li>
                    <div className="dropdown">
                      <div
                        
                        className="dropdown-toggle btn-trigger btn btn-icon"
                        data-toggle="dropdown"
                      >
                        <em className="icon ni ni-more-v"></em>
                      </div>
                      <div className="dropdown-menu dropdown-menu-right">
                        <ul className="link-list-opt no-bdr">
                          <li>
                            <div >
                              <span>Another Option</span>
                            </div>
                          </li>
                          <li>
                            <div >
                              <span>More Option</span>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div  className="btn-trigger btn btn-icon mr-n2">
                      <em className="icon ni ni-trash"></em>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Modal> */}
    </>
  );
};
const mapActionToProps = {
  updateFolderList,
  updateIsActiveModule3Column,
  updateSortFilter,
};
const mapStateToProps = (state) => ({
  folderList: state.folderList,
  userData: state.userData,
});

export default connect(mapStateToProps, mapActionToProps)(Sidebar);
