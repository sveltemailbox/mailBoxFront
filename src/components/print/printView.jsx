import React, { useEffect } from "react";
import { formatDateTime } from "../../util/dateFormat/DateFormat";

const PrintView = (props) => {
  useEffect(() => {
    handlePrint("Print");
  }, [props?.generalComment]);

  const handlePrint = (divName) => {
    var printContents = document.getElementById(divName).innerHTML;
    var popupWin = window.open("Print");
    popupWin.document.open();
    popupWin.document.write(
      `<html><head><title>Print Page</title>
      <style>img{max-width: 100%; page-break-before: always;}</style>
       </head><body onload="window.print();" style="-webkit-print-color-adjust: exact;">
      <div id="printAnnotation">
      ${printContents}
      </div>
      </body>
        </html>`
    );
    popupWin.document.close();
    popupWin.focus();
  };

  const notesData = (data) => {
    return data?.map((anno, i) => {
      return (
        <>
          {anno?.anno_comment === null && (
            <div style={{ margin: "2%" }}>
              Highlighted By: {anno.anno_from.designation}-
              {anno?.anno_from?.branch}
            </div>
          )}
          <div
            style={{ display: "flex", marginLeft: "2%", marginTop: "2%" }}
            key={`marginNotesData${i}`}
          >
            <span
              style={{
                fontSize: 17,
                fontWeight: 800,
                marginBottom: 11,
                color: "#364a63",
                display: "block",
              }}
            >
              {`From :  ${anno.anno_from.designation}-${anno?.anno_from?.branch}`}
            </span>
            <span
              style={{
                marginTop: 3,
                fontFamily: "serif",
                fontWeight: 500,
                fontSize: 15,
                marginLeft: 15,
              }}
            >
              {formatDateTime(anno?.createdAt)}
            </span>
          </div>
          <p style={{ textAlign: "justify", marginLeft: "3%" }}>
            {anno?.anno_comment}{" "}
          </p>
        </>
      );
    });
  };

  const html = document
    ?.getElementById("iframeResult")
    ?.contentWindow?.document?.getElementById("selector")?.innerHTML;

  return (
    <div
      className="nk-ibx-reply nk-reply"
      id="Print"
      style={{
        display: "inline",
        height: "100%",
        maxHeight: "100%",
        fontFamily: "Roboto, sans-serif",
        "-webkit-print-color-adjust": "exact",
        WebkitPrintColorAdjust: "exact",
      }}
    >
      <div
        className="nk-ibx-reply-head"
        style={{
          width: "100%",
          paddingLeft: "1.75rem",
          paddingRight: "1.75rem",

          display: "flex",
          padding: "1.5rem 1.25rem 0",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div className="no-select" style={{ marginLeft: -20 }}>
          <div
            className="subject-section"
            style={{ display: "flex", fontSize: "1.5em", marginBottom: -25 }}
          >
            <h4 className="title" style={{ color: "#707070" }}>
              {props.subject}
            </h4>
          </div>
          <div className="text-ul" style={{ marginBottom: 10, fontSize: 16 }}>
            <ul
              className="list-inline"
              style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}
            >
              {props?.op !== null && props?.op !== "" ? (
                <li
                  style={{
                    marginRight: "1rem",
                    color: "#707070",
                    fontWeight: "bold",
                    display: "inline-block",
                  }}
                >
                  Ops Name: {props.op}
                </li>
              ) : (
                ""
              )}
              <li
                style={{
                  marginRight: "1rem",
                  color: "#707070",
                  fontWeight: "bold",
                  display: "inline-block",
                }}
              >
                Date: {props.time}
              </li>
              <li
                style={{
                  marginRight: "1rem",
                  color: "red",
                  fontWeight: "bold",
                  display: "inline-block",
                }}
              >
                {props.crashed ? "(Crash Message)" : ""}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <hr />
      <div
        style={{ margin: "12px 1px", display: "flex", flexDirection: "column" }}
      >
        <span
          style={{
            fontFamily: "ui-monospace",
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: 5,
          }}
        >
          {"From:" + !props.sourceDesignation && !props?.sourceBranch
            ? `-`
            : !props.sourceDesignation && props?.sourceBranch
            ? `${props?.sourceBranch}`
            : props.sourceDesignation && !props?.sourceBranch
            ? `${props.sourceDesignation}`
            : props.sourceDesignation && props?.sourceBranch
            ? `${props.sourceDesignation}(${props?.sourceBranch})`
            : `-`}
        </span>
        <span
          style={{
            fontFamily: "ui-monospace",
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          To:
          {props.to?.map((item, i) =>
            props?.to?.length !== i + 1
              ? `${item?.designation}(${item?.branch}), `
              : `${item?.designation}(${item?.branch})`
          )}
        </span>
      </div>
      <div className="nk-ibx-reply-group">
        <div className="nk-ibx-reply-item">
          <div className={"nk-reply-body nk-ibx-reply-body is-shown"}>
            <div className="row ">
              {/* <MailBodyPrint
                body={props.body}
                call={props.call}
                mail_id={props?.mailId}
              /> */}
              <div
                dangerouslySetInnerHTML={{
                  __html: html,
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {props?.attachmentList?.length > 0 && (
        <div>
          <div
            style={{
              margin: "12px 1px",
              fontFamily: "ui-monospace",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            List of Attachments:
          </div>
          <div>
            <ul>
              {props?.attachmentList?.map((attach, id) => {
                return (
                  <li key={id} style={{ color: "grey" }}>
                    {attach?.body_flag === 0
                      ? attach?.name
                      : "Original Document"}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      <div id="comment"></div>
      {props?.generalCommentData?.length > 0 ? (
        <div
          className="row"
          style={{
            marginLeft: -3,
            marginRight: -3,
            marginTop: 30,
            borderRadius: 10,
            backgroundColor: "#e9ecef",
            borderRadius: 5,
            flexWrap: "wrap",
          }}
        >
          <div className="col-md-12 pt-4">
            <div
              className="comment-head"
              style={{
                display: "flex",
                marginBottom: 14,
                justifyContent: "space-between",
                paddingLeft: 15,
                paddingTop: 15,
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex" }}>
                <span
                  className="lead-text"
                  style={{
                    display: "block",
                    fontWeight: 700,
                    color: "#707070",
                    fontSize: 21,
                  }}
                >
                  Notes
                </span>
              </div>
            </div>

            <div style={{ paddingLeft: 23 }}>
              {props?.generalCommentData?.map((comment, i) => {
                return (
                  <div
                    className="pt-3"
                    style={{ paddingBottom: 3 }}
                    key={`generalComment${comment.id}`}
                  >
                    {/* <div style={{ display: "flex" }}>
                      <span
                        className="lead-text"
                        style={{
                          color: "#707070",
                          fontSize: "0.875rem",
                          fontWeight: 700,
                          display: "block",
                        }}
                      >
                        {`${comment?.designationName}(${comment?.branchName})`}
                      </span>
                    </div> */}
                    <table>
                      <tbody>
                        <tr>
                          <td
                            style={{
                              width: "37%",
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
                              {formatDateTime(comment?.createdTime)}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <p
                      className="text-justify"
                      style={{
                        paddingRight: 10,
                        marginTop: 3,
                        marginLeft: 7,
                      }}
                    >
                      {comment?.commentData}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        marginTop: "2%",
                      }}
                    >
                      {comment?.attachmentList?.length > 0 && (
                        <div
                          style={{
                            marginRight: "1%",
                            fontWeight: "500",
                            color: "black",
                            width: "6%",
                            fontStyle: "italic",
                            flexWrap: "wrap",
                          }}
                        >
                          Attached Files:
                        </div>
                      )}
                      {comment?.attachmentList?.length > 0 &&
                        comment?.attachmentList?.map((item, i) => {
                          return (
                            <div
                              style={{
                                marginRight: "2%",
                                // width: "10%",
                                display: "flex",
                                justifyContent: "space-between",
                                color: "#55aee2",
                              }}
                              className="attachment-commentBox"
                              key={`attachmentList${i}`}
                            >
                              <div
                                className="attachment-commentbox-header"
                                style={{ width: "100%", marginLeft: "5%" }}
                              >
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
      ) : (
        ""
      )}
      {Object.keys(props?.annotationText).length > 0 && (
        <div
          style={{
            padding: 1,
            background: "#e9ebff",
            marginTop: 40,
            width: "100%",
          }}
        >
          <div style={{ padding: "20px 0px 0px", background: "#e9ebff" }}>
            <span
              style={{
                fontSize: 20,
                fontWeight: "bold",
                fontFamily: "ui-monospace",
                margin: 20,
              }}
            >
              Margin Notes
            </span>
          </div>
          {Object.keys(props?.annotationText).map((ann, i) => {
            return (
              <div
                style={{
                  border: "1px solid grey",
                  margin: "20px 50px",
                  background: "#e2e2e2",
                  borderRadius: 5,
                }}
                key={`marginComments${i}`}
              >
                <div
                  style={{
                    padding: "5px 20px",
                    fontFamily: "Segoe UI-MONOSPACE",
                  }}
                >
                  {`"${ann}"`}
                </div>
                {notesData(props?.annotationText[ann])}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PrintView;
