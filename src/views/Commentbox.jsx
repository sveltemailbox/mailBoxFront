import { useState } from "react";
import fileDownload from "js-file-download";
import { formatDateTime } from "../util/dateFormat/DateFormat";
import { connect } from "react-redux";
import Axios from "axios";
import Toaster from "../util/toaster/Toaster";

const Commentbox = (props) => {
  const [openTextBox, setOpenTextBox] = useState(true);

  const handleOpenTextBox = () => {
    setOpenTextBox((openTextBox) => !openTextBox);
  };

  const downlaodAttachment = (attachements) => {
    // setSpinner({ bool: true, id: attachements.id });

    if (attachements?.url.includes("http://" || "https://")) {
      let url = "";
      if (attachements.host == null) {
        url = attachements.url;
      } else {
        url = attachements.host + attachements.url;
      }
      let apiurl = `${process.env.REACT_APP_BASE_API_URL}/api/attachment/download/${attachements.id}`;
      let name = url.split("/");
      let headers = {};

      if (localStorage.getItem("auth")) {
        headers.Authorization = `Bearer ${localStorage.getItem("auth")}`;
      }
      Axios.get(apiurl, { responseType: "blob", headers: headers })
        .then(async (res) => {
          fileDownload(res.data, name[name.length - 1]);
          // setSpinner(false);
        })
        .catch(function (error) {
          Toaster("error", error.message);
          // setSpinner(false);
        });
    } else {
      let apiurl = `${process.env.REACT_APP_BASE_API_URL}/api/attachment/downloadfile/${attachements.id}`;
      let headers = {};

      if (localStorage.getItem("auth")) {
        headers.Authorization = `Bearer ${localStorage.getItem("auth")}`;
      }

      Axios.get(apiurl, { responseType: "blob", headers: headers })
        .then(async (res) => {
          fileDownload(res.data, attachements?.name);
          // setSpinner(false);
        })
        .catch(function (error) {
          Toaster("error", error.message);
          // setSpinner(false);
        });
    }
  };

  return (
    props?.generalCommentData.length > 0 && (
      <div>
        {!openTextBox ? (
          <div
            className="jumbotron col-md-12 pt-4 "
            style={{
              display: "flex",
              marginRight: 10,
              marginLeft: 10,
              width: "98.7%",
              justifyContent: "space-between",
              cursor: "default",
              marginBottom: 10,
            }}
          >
            <span
              className="lead-text"
              style={{ color: "#707070", fontSize: 18 }}
            >
              Notes
            </span>
            <em
              style={{ alignContent: "center" }}
              className="ni ni-sort-down-fill"
              onClick={handleOpenTextBox}
            ></em>
          </div>
        ) : (
          <div
            className="row"
            style={{
              display: "flex",
              marginRight: 10,
              marginLeft: 10,
              width: "98.7%",
              justifyContent: "space-between",
              cursor: "default",
              marginBottom: 10,
            }}
          >
            <div className="jumbotron col-md-12 pt-4">
              <div
                className="comment-head"
                style={{
                  marginBottom: 10,
                  justifyContent: "space-between",
                  cursor: "default",
                }}
              >
                <div style={{ display: "flex" }}>
                  <span
                    className="lead-text"
                    style={{ color: "#707070", fontSize: 18 }}
                  >
                    Notes
                  </span>
                </div>

                <em
                  className="ni ni-sort-up-fill"
                  onClick={handleOpenTextBox}
                ></em>
              </div>

              <div style={{ overflow: "auto", maxHeight: 250 }}>
                {props?.generalCommentData?.map((comment, i) => {
                  return (
                    <div className="pt-3" key={`generalComment${comment.id}`}>
                      <div>
                        <table>
                          <tbody>
                            <tr>
                              <td
                                style={{
                                  width: "33%",
                                  color: "#526484",
                                  fontWeight: "bold",
                                }}
                              >
                                {`From: ${comment?.fromDesignationName}(${comment?.fromBranchName})`}
                              </td>
                              <td
                                style={{
                                  width: "33%",
                                  color: "#526484",
                                  fontWeight: "bold",
                                }}
                              >
                                {comment?.toDesignationName !== undefined &&
                                comment?.toId !== null
                                  ? `To: ${comment?.toDesignationName}(${comment?.toBranchName})`
                                  : ""}
                              </td>
                              <td style={{ padding: "0px 20px" }}>
                                <div className="comment-time">
                                  {comment?.updatedTime
                                    ? formatDateTime(comment?.updatedTime)
                                    : formatDateTime(comment?.createdTime)}
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <pre className="text-justify comment-text">
                        {comment?.commentData}
                      </pre>

                      <div className="attachment-list-commentBox">
                        {comment?.attachmentList?.length > 0 && (
                          <div className="attachment-name-commentBox">
                            Attached Files:
                          </div>
                        )}
                        {comment?.attachmentList?.length > 0 &&
                          comment?.attachmentList?.map((item, i) => {
                            return (
                              <div
                                className="attachment-commentBox"
                                key={`attachmentList${i}`}
                                onClick={() => downlaodAttachment(item)}
                              >
                                <div className="attachment-commentbox-header">
                                  <abbr title={`${item?.name}`}>
                                    {item?.name}
                                  </abbr>
                                </div>
                                <em
                                  className="icon ni ni-download"
                                  style={{
                                    fontSize: 17,
                                    color: "black",
                                    textDecoration: "none",
                                  }}
                                ></em>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  );
};

const mapStateToProps = (state) => ({
  userData: state.userData,
});
export default connect(mapStateToProps)(Commentbox);
