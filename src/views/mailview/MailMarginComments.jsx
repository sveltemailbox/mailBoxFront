import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import * as Api from "../../util/api/ApicallModule";
import { ANNOTATION_ADD, ANNOTATION } from "../../config/constants";
import { PostHighlight } from "../../components/common/annotation";
import Toaster from "../../util/toaster/Toaster";

function MailMarginComments(props) {
  const marginNotesRef = useRef();
  const [heading, setheading] = useState("");
  const [marginCommentData, setMarginCommentData] = useState("");
  const [marginNotes, setMarginNotes] = useState([]);
  const [previousSelected, setpreviousSelected] = useState({});
  const [updateMode, setUpdateMode] = useState(false);
  const [editCommentId, setEditCommentId] = useState(0);
  const [enableSent, setEnableSent] = useState(0);
  const [startChar, setStartChar] = useState("");
  const [endChar, setEndChar] = useState("");
  const [beforeSelectedHandle, setBeforeSelectedHandle] = useState(0);
  const [designation, setDesignation] = useState(0);
  let logData = {};
  const logDataFunction = (type, mail_id, attachId) => {
    logData = {
      type: type,
      mail_id: mail_id,
      attach_id: attachId,
    };
  };
  useEffect(() => {
    const designation = props?.userData?.designations.filter((item) => {
      if (item.default_desig) return item;
    });
    setDesignation(designation[0]);
  }, [props?.userData]);

  useEffect(() => {
    setMarginNotesDynami();
    if (props?.selectedAnnotation?.length > 0) {
      setheading(props?.selectedAnnotation[0]?.anno_text);
    }
    setBeforeSelectedHandle(0);
  }, [props?.selectedAnnotation]);

  useEffect(() => {
    if (props?.beforeSelectedAnnotation !== "") {
      setheading(props?.beforeSelectedAnnotation);
      setBeforeSelectedHandle(1);
    }
  }, [props?.beforeSelectedAnnotation]);

  useEffect(() => {
    if (marginNotes.length > 0 && props.selectedAnnotation.length > 0) {
      handleDefaultNotes();
    }
    marginNotes?.map((notes) => {
      setEnableSent(notes?.enb_sent);
    });
  }, [marginNotes]);

  const handleDefaultNotes = () => {
    const data = {
      anno_text: props.selectedAnnotation[0].anno_text,
      start_char: props.selectedAnnotation[0].start_char,
      end_char: props.selectedAnnotation[0].end_char,
      color_code_id: props.selectedAnnotation[0].color_code_id,
      mailid: props.selectedAnnotation[0].mailid,
    };
    setpreviousSelected(data);
  };

  const handleMarginComments = (e) => {
    setMarginCommentData(e.target.value);
  };

  const setMarginNotesDynami = () => {
    const comment = [];
    props?.selectedAnnotation.forEach((res) => {
      if (res.anno_comment) {
        let data = {
          id: res.id,
          mailid: res.mailid,
          degn_id: res.degn_id,
          enb_sent: res.enb_sent,
          designationName: res.anno_from.designation,
          branchName: res.anno_from.branch,
          commentData: res.anno_comment,
          color: res?.Color?.background,
          time: new Date(res.createdAt).toLocaleTimeString("en-GB"),
          // updatedAt: new Date(res.updatedAt).toLocaleTimeString(),
          date: new Date(res.createdAt).toLocaleDateString("en-GB"),
        };
        comment.push(data);
      }
    });
    setMarginNotes(comment);
    setBeforeSelectedHandle(0);
  };

  const handleSubmitMarginComments = async (e) => {
    e.preventDefault();
    var selectedtext = PostHighlight("selector", props.color, 1);

    if (props?.selectedAnnotation.length > 0 || selectedtext.text.length > 0) {
      selectedtext.color_id = props?.colorID;

      const time = new Date().toLocaleTimeString("en-GB");
      const date = new Date().toLocaleDateString("en-GB");
      setMarginCommentData("");
      let commentData = {};

      commentData = {
        anno_text:
          props?.selectedAnnotation.length > 0
            ? props?.selectedAnnotation[0].anno_text
            : selectedtext.text,
        start_char:
          props?.selectedAnnotation.length > 0
            ? props?.selectedAnnotation[0].start_char
            : selectedtext.start,
        end_char:
          props?.selectedAnnotation.length > 0
            ? props?.selectedAnnotation[0].end_char
            : selectedtext.end,
        color_code_id: selectedtext.color_id,
        mailid: props?.mailId,
        anno_comment: marginCommentData,
        mainMailId: props.uniqueMailId,
      };

      setStartChar(commentData?.start_char);
      setEndChar(commentData?.end_char);

      logDataFunction("SUBMIT COMMENT ON ANNOTATION MAIL", 0, 0);
      const resp = await Api.ApiHandle(
        ANNOTATION_ADD,
        commentData,
        "POST",
        logData
      );
      if (resp.status === 1) {
        const comment = {
          id: resp.data.id,
          mailid: props?.mailId,
          designationName: designation.designation,
          branchName: designation.branch,
          commentData: marginCommentData,
          time: time,
          date: date,
        };
        const _commentData = [];
        _commentData.push(comment);
        setMarginNotes([..._commentData, ...marginNotes]);
        setBeforeSelectedHandle(0);
      } else Toaster("error", "Something went wrong");
    }
  };

  const updateComment = async (e) => {
    e.preventDefault();
    const params = {
      mailid: props.mailId,
      anno_comment: marginCommentData,
      id: editCommentId,
    };
    logDataFunction("UPDATE COMMENT ON ANNNOTATION MAIL", 0, 0);
    const resp = await Api.ApiHandle(
      `${ANNOTATION}/${editCommentId}`,
      params,
      "PUT",
      logData
    );

    if (resp.status === 1) {
      const _marginNotes = [...marginNotes];
      _marginNotes.forEach((data) => {
        if (data.id === editCommentId) data.commentData = marginCommentData;
      });
      setMarginNotes(_marginNotes);
      setMarginCommentData("");
      setUpdateMode(false);
    } else Toaster("error", "Something went wrong");
  };

  const handleEditComment = (i, id) => {
    setEditCommentId(id);
    setUpdateMode(true);
    let comment = marginNotes[i];
    setMarginCommentData(comment.commentData);
    marginNotesRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeleteComment = async (data, i) => {
    const params = {
      mailid: data.mailid,
      id: data.id,
    };
    logDataFunction("DELETE COMMENT ON ANNOTATION MAIL", 0, 0);
    const resp = await Api.ApiHandle(
      `${ANNOTATION}/${data.id}`,
      params,
      "delete",
      logData
    );

    if (resp.status === 1) {
      marginNotes.splice(i, 1);
      setMarginNotes([...marginNotes]);
    } else Toaster("error", "Something went wrong");
  };

  const handleAnnotationDelete = async () => {
    const params = {
      mailid: props?.mailId,
      mainMailId: props?.uniqueMailId,
      start_char: startChar === "" ? props?.startChar : startChar,
      end_char: endChar === "" ? props?.endChar : endChar,
    };
    logDataFunction("DELETE ANNOTATION MAIL", 0, 0);

    const resp = await Api.ApiHandle(
      `${ANNOTATION_ADD}`,
      params,
      "delete",
      logData
    );
    if (resp.status === 1) {
      props?.setOpen("delete");
    } else {
      Toaster("error", "Something went wrong");
    }
  };

  return (
    <div>
      <div className="right-jumbotron">
        <div className="jumbotron no-select">
          <span className="lead-text border-bottom p-2 pl-3 margin-heading">
            Margin Notes
            <div className="margin-heading">
              {!beforeSelectedHandle && !enableSent && (
                <div>
                  <em
                    className="icon ni ni-trash-fill"
                    style={{ marginRight: 27, marginTop: 8 }}
                    onClick={handleAnnotationDelete}
                  ></em>
                </div>
              )}
              <div style={{ float: "right" }} onClick={props.closeMarginNotes}>
                <em className="icon ni ni-cross-sm"></em>
              </div>
            </div>
          </span>
          <div
            className="jumbotron-overflow"
            style={{ height: marginNotes?.length > 0 ? "370px" : "" }}
          >
            <div className="margin-heading-highlighted">
              <div className="heading-margin">"{heading}"</div>
              {
                <div className="highlight-by-heading">
                  <span className="highlight-by">Highlighted by :</span>
                  <ul>
                    {props?.selectedAnnotation?.map((ann, i) => {
                      return (
                        ann?.anno_comment === null && (
                          <li key={i}>
                            {ann?.anno_from?.designation}-
                            {ann?.anno_from?.branch}
                          </li>
                        )
                      );
                    })}
                  </ul>
                </div>
              }
            </div>

            <div className="form-chat" ref={marginNotesRef}>
              <div className="form-group">
                <form>
                  <textarea
                    className="form-control"
                    placeholder="Enter Comments..."
                    rows="3"
                    value={marginCommentData}
                    onChange={handleMarginComments}
                  ></textarea>
                  <button
                    className="btn chat-btn"
                    disabled={marginCommentData.length < 1}
                    onClick={
                      updateMode ? updateComment : handleSubmitMarginComments
                    }
                  >
                    Save
                  </button>
                </form>
              </div>
            </div>
            {marginNotes.map((notes, i) => {
              return (
                <>
                  <div key={`marginNotes${i}`}>
                    {notes.commentData != "" && (
                      <div
                        className="chatbox-1 chat-bg-color-1"
                        style={{ backgroundColor: notes?.color }}
                      >
                        <div
                          style={{
                            display: "flex",
                            cursor: "pointer",
                          }}
                          className="d-flex justify-content-between"
                        >
                          <span className="lead-text">{`${notes?.designationName}(${notes.branchName})`}</span>
                          {!notes?.enb_sent && (
                            <div>
                              <em
                                className="ni ni-edit-fill"
                                onClick={() => {
                                  handleEditComment(i, notes.id);
                                }}
                              />
                              <em
                                className="ni ni-trash-fill"
                                onClick={() => {
                                  handleDeleteComment(notes, i);
                                }}
                              />
                            </div>
                          )}
                        </div>

                        <p className="text-justify">{notes.commentData}</p>
                        <hr></hr>
                        <div>
                          <ul className="list-inline d-flex justify-content-end">
                            <li>{notes.date}</li>
                            <li>{notes.updatedAt || notes.time}</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  userData: state.userData,
});

export default connect(mapStateToProps)(MailMarginComments);
