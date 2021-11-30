import React from "react";
import Modal from "react-awesome-modal";

const DocView = (props) => {
  return (
    <>
      <Modal
        // className="modal fade"
        visible={props.viewDocument}
        id="add-folder"
        width="90%"
        height="750"
        effect="fadeInUp"
        onClickAway={() => {
          props.setViewDocument(!props.viewDocument);
        }}
      >
        <div className="nk-reply-form-header">
          <div className="nk-reply-form-group">
            <div className="nk-reply-form-input-group">
              <div className="header-view-doc">
                <h2 style={{ fontSize: "161%" }}>
                  Viewing Document - " {props?.attachmentName} "
                </h2>
                <em
                  onClick={() => {
                    props.setViewDocument(!props.viewDocument);
                  }}
                  className="icon ni ni-cross"
                ></em>
              </div>
              <div
                className="body-view-doc"
                dangerouslySetInnerHTML={{ __html: props.bodyData }}
              ></div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DocView;
