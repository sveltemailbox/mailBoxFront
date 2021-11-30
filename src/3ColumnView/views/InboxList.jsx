import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

function InboxList({ inbox, selected, onClick, selectedMail, ...props }) {
  const [activeMail, setActiveMail] = useState(0);

  useEffect(() => {
    setActiveMail(selectedMail);
  }, [selectedMail]);
  // console.log(inbox);
  // console.log(selected);
  useEffect(() => {
    addRead();
  }, [selected]);

  const addRead = () => {
    if (selected === "unread") {
      inbox?.map((inb) => {
        inb.read = false;
      });
    }
  };

  const markRead = (id) => {
    if (selected === "unread") {
      inbox?.map((inb) => {
        if (inb?.id === id) {
          inb.read = true;
        }
      });
    }
  };

  return (
    <div
      className="nk-ibx-list jumbotron-overflow"
      style={{
        // borderBottom: "1px solid lightgray",
        borderTop: "1px solid lightgray",
        maxHeight: "calc(83vh - 6px)",
        overflowY: "auto",
        paddingBottom: "5px",
      }}
    >
      {inbox?.map((inb, i) => (
        <div
          className={`nk-ibx-item ${
            selected !== "sent"
              ? selected === "unread"
                ? "addBottomBorder"
                : inb?.isRead
                ? "active "
                : "addBottomBorder"
              : inb?.fromIsRead
              ? "active"
              : props.userData.designations[0].id === inb.actualFormId
              ? "addBottomBorder"
              : "active"
          }`}
          key={`inboxList${i}`}
          style={
            inb?.isCrashed === 1 && inb?.isRead === 0
              ? { backgroundColor: "#FF4F4F" }
              : inb?.read === true
              ? { backgroundColor: "#e8e8e8" }
              : null
          }
          onClick={() => {
            // console.log(inb.id, i);
            onClick(inb?.id, i);
            setActiveMail(inb.id);
            markRead(inb?.id);
          }}
        >
          <div className="nk-ibx-item-elem nk-ibx-item-user">
            <div className="user-card">
              <div className="user-name">
                <div
                  className="lead-text"
                  style={
                    inb?.isCrashed === 1 && inb?.isRead === 0
                      ? { color: "white", fontWeight: "bolder" }
                      : { fontWeight: "bolder", color: "gray" }
                  }
                >
                  {selected === "sent"
                    ? "Me"
                    : props.userData.designations[0].id == inb.from_id
                    ? "Me"
                    : inb?.from !== "" && inb?.branch !== ""
                    ? `${inb?.from}(${inb?.branch})`
                    : inb?.from !== "" && inb?.branch === ""
                    ? `${inb?.from}`
                    : inb?.from === "" && inb?.branch !== ""
                    ? `${inb?.branch}`
                    : inb?.from === "" && inb?.branch === ""
                    ? `-`
                    : `-`}

                  {selected === "sent" && (
                    <div className="lead-text" style={{ fontWeight: 500 }}>
                      To :{" "}
                      {inb?.toDesignation !== "" && inb?.toBranch !== ""
                        ? `${inb?.toDesignation}(${inb?.toBranch})`
                        : inb?.toDesignation !== "" && inb?.toBranch === ""
                        ? `${inb?.toDesignation}`
                        : inb?.toDesignation === "" && inb?.toBranch !== ""
                        ? `${inb?.toBranch}`
                        : inb?.toDesignation === "" && inb?.toBranch === ""
                        ? `-`
                        : `-`}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div
            className="nk-ibx-item-elem nk-ibx-item-fluid"
            style={{ marginRight: -37 }}
          >
            <div className="nk-ibx-context-group">
              <div className="nk-ibx-context">
                <span className="nk-ibx-context-text">
                  <span
                    className="heading"
                    style={
                      inb?.isCrashed === 1 && inb?.isRead === 0
                        ? { color: "white" }
                        : { color: "#707070" }
                    }
                  >
                    {inb?.subject}
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div className="nk-ibx-item-elem nk-ibx-item-attach"></div>
          <div
            className="nk-ibx-item-elem nk-ibx-item-time"
            // onClick={setMailView}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              className="sub-text"
              style={
                inb?.isCrashed === 1 && inb?.isRead === 0
                  ? {
                      fontWeight: "bold",
                      color: "white",
                      marginLeft: 126,
                      paddingRight: 14,
                    }
                  : {
                      fontWeight: "bold",
                      color: "#707070",
                      marginLeft: 126,
                      paddingRight: 14,
                    }
              }
            >
              {inb.op ? inb.op.toUpperCase() : ""}
            </div>
            {activeMail === inb.id ? (
              <div style={{ color: "#6576ff" }}>
                <em className="ni ni-caret-right-fill"></em>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
const mapStateToProps = (state) => ({
  userData: state.userData,
});

export default connect(mapStateToProps)(InboxList);
