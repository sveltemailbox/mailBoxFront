import Modal from "react-awesome-modal";
import { NavLink } from "react-bootstrap";
import { connect } from "react-redux";
import { BULK_UPDATE } from "../../config/constants";
import * as Api from "../../util/api/ApicallModule";
import Toaster from "../../util/toaster/Toaster";
import {
  updateAddToFolderCache,
  updateFolderCachedData,
} from "../../redux/action/InboxAction";
import profileDropdown from "../profileDropdown";
import Loading from "../../util/loader/Loading";

const FolderAdd = (props) => {
  let logData = {};
  const logDataFunction = (type, mail_id, attachId) => {
    logData = {
      type: type,
      mail_id: mail_id,
      attach_id: attachId,
    };
  };
  const handleAddToFolder = async (folderId) => {
    let mail_ids = [];
    let userMailIds = [];
    props.setLoader(true);
    // props.setIsFolderLoaderId((prev) => [...prev, folderId]);
    props.setIsFolderLoaderId(folderId);
    // if (props?.folderCachedData[folderId] !== undefined) {
    //   props?.updateAddToFolderCache(props?.folderCachedData[folderId]);
    //   props?.updateFolderCachedData("delete");
    // }
    props.selectedMailData.forEach((item) => {
      mail_ids.push(item.userMailId);
      userMailIds.push(item.id);
    });

    const payload = {
      mail_ids: mail_ids,
      action: { folder: folderId },
      userMailIds,
    };
    logDataFunction("ADD MAIL TO ANOTHER FOLDER", 0, 0);
    const resp = await Api.ApiHandle(`${BULK_UPDATE}`, payload, "PUT", logData);
    if (resp.status !== 1) {
      Toaster("error", "Some error occurred");
      props.setLoader(false);
      props.setIsFolderLoaderId("");
    } else {
      props.setLoader(false);
      Toaster("success", `Mail added to folder successfully.`);
      props.setSelectedMail([]);
      props.setAddToFolder(!props.addToFolder);
      props.setSelectedMailData([]);
      props.setIsFolderLoaderId("");

      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (typeof props.isActiveModule !== "string") {
        props.setFilterOptions({
          folder: props.isActiveModule,
        });
      }
    }
  };

  const displayFolders = props.folderList.map((item, index) => (
    <li
      style={{ cursor: "pointer" }}
      key={index}
      onClick={() => handleAddToFolder(item.apiFolderId)}
    >
      <NavLink>
        <em
          className="ni ni-folder-fill"
          style={{ color: item.apiColorCode }}
        ></em>
        <span className="nk-ibx-label-text" style={{ paddingTop: "2px" }}>
          {item.apiFolderName}
        </span>
      </NavLink>
    </li>
  ));
  return (
    <>
      <Modal
        // className="modal fade"
        visible={props.addToFolder}
        id="add-folder"
        width="600"
        height="385"
        effect="fadeInUp"
        onClickAway={() => {
          props.setAddToFolder(!props.addToFolder);
        }}
      >
        <div className="nk-reply-form-header">
          <div className="nk-reply-form-group">
            <div className="nk-reply-form-input-group">
              <div className="mark-leave-tag-container">
                <h2 style={{ fontSize: "161%" }}>Add to folder</h2>
                <em
                  className="icon ni ni-cross"
                  onClick={() => {
                    props.setAddToFolder(!props.addToFolder);
                  }}
                />
              </div>
              <hr />
              <div className="nk-reply-form-input nk-reply-form-input-to myoverflow">
                {props.loader ? (
                  <Loading />
                ) : (
                  <ul className="typeNone">{displayFolders}</ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

const mapActionToProps = {
  updateAddToFolderCache: updateAddToFolderCache,
  updateFolderCachedData: updateFolderCachedData,
};

const mapStateToProps = (state) => ({
  folderList: state.folderList,
  isActiveModule: state.isActiveModule,
  folderCachedData: state.folderCachedData,
});

export default connect(mapStateToProps, mapActionToProps)(FolderAdd);
