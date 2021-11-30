import Modal from "react-awesome-modal";
import { NavLink } from "react-bootstrap";
import { connect } from "react-redux";
import { BULK_UPDATE } from "../../config/constants";
import * as Api from "../../util/api/ApicallModule";
import Toaster from "../../util/toaster/Toaster";

const FolderAdd = (props) => {
  const handleAddToFolder = async (folderId) => {
    let mail_ids = [];

    props.selectedMailData.forEach((item) => {
      mail_ids.push(...item.concat_user_mail_ids);
    });

    const payload = {
      mail_ids: mail_ids,
      action: { folder: folderId },
    };
    const resp = await Api.ApiHandle(`${BULK_UPDATE}`, payload, "PUT");
    if (resp.status !== 1) {
      Toaster("error", "Some error occurred");
    } else {
      Toaster("success", `Mail added to folder successfully.`);
      props.setSelectedMail([]);
      props.setAddToFolder(!props.addToFolder);
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
        width="800"
        // height="500"
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
              <div className="nk-reply-form-input nk-reply-form-input-to overflow">
                <ul className="typeNone">{displayFolders}</ul>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({
  folderList: state.folderList,
});

export default connect(mapStateToProps, null)(FolderAdd);
