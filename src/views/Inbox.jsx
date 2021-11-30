import { useEffect, useState } from "react";
import { connect } from "react-redux";

import InboxNavbar from "../components/navbar/InboxNavbar";
import * as Api from "../util/api/ApicallModule";
import { UPDATE_MAIL_BY_ID, UPDATE_STAR } from "../config/constants";
import Loading from "../util/loader/Loading";
import { UNREAD_CONSTANTS_VALUES, MAIL_ACTIONS } from "../util";

const Inbox = (props) => {
  const mailData = props.inboxMailData;

  const filterMailData = mailData.map((item) => item.id);
  const [star, setStar] = useState(null);
  const [isMailAllSelect, setMailAllSelect] = useState({
    partialSelect: false,
    fullSelect: false,
  });
  const [selectedMail, setSelectedMail] = useState([]);
  const [selectedMailData, setSelectedMailData] = useState([]);
  const [meMailData, setMeMailData] = useState([]);
  const [designationId, setDesignationId] = useState(0);
  const [listingHover, setListingHover] = useState({});
  const [isReplyForward, setIsReplyForward] = useState({});

  useEffect(() => {
    let designationId;
    if (props && props?.userData && props?.userData?.designations)
      designationId = props?.userData?.designations.filter((item) => {
        if (item.default_desig) return item;
      })[0]?.id;

    setDesignationId(designationId);
  }, [props?.userData]);

  useEffect(() => {
    if (
      selectedMail.length === filterMailData.length &&
      filterMailData.length !== 0
    ) {
      changeMailSelect(true, false);
    } else if (selectedMail.length !== 0) {
      changeMailSelect(false, true);
    } else {
      changeMailSelect(false, false);
    }
  }, [selectedMail]);

  useEffect(() => {
    setSelectedMail([]);

    const meMailId = [];
    if (designationId) {
      mailData.forEach((item) => {
        if (item.from_id === designationId) meMailId.push(item.id);
      });

      setMeMailData(meMailId);
    }
  }, [mailData]);

  useEffect(() => {
    if (
      selectedMail.length === filterMailData.length &&
      filterMailData.length !== 0
    ) {
      changeMailSelect(true, false);
    } else if (selectedMail.length !== 0) {
      changeMailSelect(false, true);
    } else {
      changeMailSelect(false, false);
    }
  }, [selectedMail]);

  useEffect(() => {
    setSelectedMail([]);
    setSelectedMailData([]);
    const meMailId = [];
    if (designationId) {
      mailData.forEach((item) => {
        if (item.from_id === designationId) meMailId.push(item.id);
      });

      setMeMailData(meMailId);
    }
  }, [mailData, designationId]);

  const setMailView = () => {
    props.setActiveModule("mailView");
  };

  const toggleStarredComponent = () => {
    setStar((star) => !star);
  };

  const handleStarredResponse = async (inbox) => {
    let params = createParams(inbox);

    inbox.isStarred = !inbox.isStarred;

    await Api.ApiHandle(
      `${UPDATE_STAR}${inbox?.concat_user_mail_ids}`,
      { mail_action: params },
      "PUT"
    );
  };

  const createParams = (inbox) => {
    let params = "";

    switch (inbox.mailAction) {
      case "99":
        params = "97";
        break;
      case "98":
        params = "96";
        break;
      case "97":
        params = "99";
        break;
      case "96":
        params = "98";
        break;
      case "89":
        params = "86";
        break;
      case "88":
        params = "87";
        break;
      case "87":
        params = "88";
        break;
      case "86":
        params = "89";
        break;
      case "79":
        params = "69";
        break;
      case "78":
        params = "68";
        break;
      case "69":
        params = "79";
        break;
      case "68":
        params = "78";
        break;
    }
    inbox.mailAction = params;

    return params;
  };

  const updateFromIsRead = async (inbox) => {
    if (designationId === inbox.actualFormId) {
      if (inbox?.fromIsReadEnabled === 0) {
        const payload = { from_read_enabled: 1 };
        await Api.ApiHandle(
          `${UPDATE_MAIL_BY_ID}/${inbox.concat_user_mail_ids}`,
          payload,
          "PUT"
        );
      }
    }
  };

  const updateMailSelect = (e, data) => {
    const { id, checked } = e.target;

    if (checked) {
      setSelectedMail((prev) => [...prev, parseInt(id)]);
      setSelectedMailData((prev) => [...prev, data]);
    } else {
      let tmpSelectedMails = [...selectedMail];
      tmpSelectedMails.splice(tmpSelectedMails.indexOf(parseInt(id)), 1);
      setSelectedMail(tmpSelectedMails);

      setSelectedMailData(
        selectedMailData.filter((item) => item.id !== parseInt(id))
      );
    }
  };

  const changeMailSelect = (fullSelect, partialSelect) => {
    setMailAllSelect(() => ({
      fullSelect: fullSelect,
      partialSelect: partialSelect,
    }));
  };

  const updateMailIds = (mailIds, uniqueMailId) => {
    props.setMailIds(mailIds);
    props.setUniqueMailId(uniqueMailId);
  };

  const listingMouseOverEvent = (index, outIn) => {
    if (outIn === "in") {
      setListingHover((prev) => ({
        ...prev,
        [index]: true,
      }));
    } else {
      setListingHover((prev) => ({
        ...prev,
        [index]: false,
      }));
    }
  };
  const returnBackgroundColorOfMail = (inbox) => {
    if (props?.filterOptions?.is_sent === 1) return "";

    if (inbox.actualFormId === designationId) {
      return inbox?.fromMailAction === MAIL_ACTIONS.CRASHED_UNREAD
        ? "#FF4F4F"
        : inbox?.fromMailAction === MAIL_ACTIONS.COMPOSED_UNREAD ||
          (inbox?.isComposed &&
            UNREAD_CONSTANTS_VALUES.includes(inbox?.fromMailAction))
        ? "#f0c31f"
        : "";
    }

    return inbox?.mailAction === MAIL_ACTIONS.CRASHED_UNREAD
      ? "#FF4F4F"
      : inbox?.mailAction === MAIL_ACTIONS.COMPOSED_UNREAD ||
        (inbox?.isComposed &&
          UNREAD_CONSTANTS_VALUES.includes(inbox?.mailAction))
      ? "#f0c31f"
      : "";
  };

  return (
    <>
      <InboxNavbar
        noOfMails={props.noOfMails}
        mailData={mailData}
        mailDataLength={mailData.length}
        getAllMails={props.getAllMails}
        getNextClick={props.getNextClick}
        getPrevClick={props.getPrevClick}
        total={props.total}
        setFilterOptions={props.setFilterOptions}
        filterOptions={props.filterOptions}
        setMailAllSelect={setMailAllSelect}
        isMailAllSelect={isMailAllSelect}
        selectedMail={selectedMail}
        selectedMailData={selectedMailData}
        setSelectedMailData={setSelectedMailData}
        setSelectedMail={setSelectedMail}
        filterMailData={filterMailData}
        meMailData={meMailData}
        activeModule={props?.activeModule}
        selectedStation={props?.selectedStation}
        setSelectedstation={props?.setSelectedstation}
        stationTag={props?.stationTag}
        setStationTag={props?.setStationTag}
      />
      <div
        className="nk-ibx-list jumbotron-overflow"
        style={{ overflow: "auto" }}
        ref={props.inboxConatinerRef}
      >
        {props.loader ? (
          <Loading />
        ) : mailData.length === 0 ? (
          <div style={{ margin: "auto" }}>
            <h2>No Mails Found</h2>
          </div>
        ) : (
          mailData.map((inbox, i) => {
            let indexOfMail = 0;
            if (inbox.umail_id) {
              indexOfMail = inbox.concat_user_mail_ids.indexOf(
                `${inbox.umail_id}`
              );
            }

            return (
              <div
                key={i}
                className="mails-main"
                id="mails-main"
                style={{
                  marginBottom: "-2px",
                }}
                onClick={() =>
                  updateMailIds(inbox.concat_user_mail_ids, inbox.userMailId)
                }
                onMouseOver={() => {
                  listingMouseOverEvent(i, "in");
                }}
                onMouseOut={() => {
                  listingMouseOverEvent(i, "out");
                }}
              >
                {props?.filterOptions?.is_sent !== 1 && (
                  <div
                    id="inside-mails-main"
                    className={`nk-ibx-item ${
                      props?.filterOptions?.is_sent === 1
                        ? "active"
                        : inbox.actualFormId !== designationId &&
                          UNREAD_CONSTANTS_VALUES.includes(
                            inbox.concat_mail_action[indexOfMail]
                          )
                        ? ""
                        : inbox.actualFormId === designationId &&
                          UNREAD_CONSTANTS_VALUES.includes(
                            inbox.concat_from_action[indexOfMail]
                          )
                        ? ""
                        : "active"
                    }`}
                    style={{
                      float: "left",
                      width: 87,
                      backgroundColor: returnBackgroundColorOfMail(inbox),
                      color:
                        inbox?.mailAction === MAIL_ACTIONS.CRASHED_UNREAD
                          ? "#fff"
                          : inbox?.isComposed &&
                            inbox?.mailAction === MAIL_ACTIONS.COMPOSED_UNREAD
                          ? "#fff"
                          : "#707070",
                    }}
                  >
                    {props?.filterOptions?.is_crashed !== 1 &&
                      props?.filterOptions?.is_starred !== 1 && (
                        <div className="nk-ibx-item-elem nk-ibx-item-check checkbox">
                          <div className="custom-control custom-control-sm custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input nk-dt-item-check"
                              id={inbox.id}
                              onChange={(e) => updateMailSelect(e, inbox)}
                              checked={
                                selectedMail.includes(inbox.id) ? true : false
                              }
                            />
                            <label
                              className="custom-control-label"
                              htmlFor={inbox.id}
                            ></label>
                          </div>
                        </div>
                      )}
                    <div
                      className="nk-ibx-item-elem nk-ibx-item-star star-align"
                      style={
                        inbox?.actualFormId !== designationId
                          ? { float: "right", marginTop: 0 }
                          : { float: "right", marginTop: "80%" }
                      }
                    >
                      {inbox?.actualFormId !== designationId && (
                        <div className="asterisk">
                          {inbox?.isStarred ? (
                            <em
                              className={`asterisk-on icon ni ni-star-fill`}
                              onClick={() => {
                                handleStarredResponse(inbox);
                                toggleStarredComponent();
                              }}
                            />
                          ) : (
                            <em
                              className={`asterisk-off icon ni ni-star`}
                              onClick={() => {
                                handleStarredResponse(inbox);
                                toggleStarredComponent();
                              }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div
                  style={{
                    backgroundColor: returnBackgroundColorOfMail(inbox),
                    color:
                      props?.filterOptions?.is_sent === 1
                        ? "#707070"
                        : inbox?.mailAction === MAIL_ACTIONS.CRASHED_UNREAD
                        ? "#fff"
                        : inbox?.isComposed &&
                          inbox?.mailAction === MAIL_ACTIONS.COMPOSED_UNREAD
                        ? "#fff"
                        : "#707070",
                  }}
                  id="inside-mails-main"
                  className={`nk-ibx-item ${
                    props?.filterOptions?.is_sent === 1
                      ? "active"
                      : inbox.actualFormId !== designationId &&
                        UNREAD_CONSTANTS_VALUES.includes(
                          inbox.concat_mail_action[indexOfMail]
                        )
                      ? ""
                      : inbox.actualFormId === designationId &&
                        UNREAD_CONSTANTS_VALUES.includes(
                          inbox.concat_from_action[indexOfMail]
                        )
                      ? ""
                      : "active"
                  }`}
                  key={`mail-list${i}`}
                  onClick={() => {
                    props.getMailId(inbox);
                    setMailView();
                    updateFromIsRead(inbox);
                  }}
                >
                  <div className="elem-alignment">
                    <div className="nk-ibx-item-elem nk-ibx-item-user">
                      <div className="user-card">
                        <div className="user-name">
                          <div
                            className="lead-text"
                            // style={{fontWeight:"bolder"}}
                            style={
                              inbox?.mailAction === MAIL_ACTIONS.CRASHED_UNREAD
                                ? { color: "white", fontWeight: "bolder" }
                                : { fontWeight: "bolder" }
                            }
                          >
                            {props?.filterOptions?.is_sent === 1
                              ? "Me"
                              : designationId == inbox.from_id
                              ? "Me"
                              : inbox?.from !== "" && inbox?.branch !== ""
                              ? `${inbox?.from}(${inbox?.branch})`
                              : inbox?.from !== "" && inbox?.branch === ""
                              ? `${inbox?.from}`
                              : inbox?.from === "" && inbox?.branch !== ""
                              ? `${inbox?.branch}`
                              : inbox?.from === "" && inbox?.branch === ""
                              ? `-`
                              : `-`}
                            {props?.filterOptions?.is_sent === 1 && (
                              <div
                                className="lead-text"
                                style={{ fontWeight: 500 }}
                              >
                                To :{" "}
                                {Array.from(inbox.To).map((item, i) =>
                                  Array.from(inbox.To).length !== i + 1
                                    ? `${item?.designation}(${item?.branch}), `
                                    : `${item?.designation}(${item?.branch})`
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="nk-ibx-item-elem nk-ibx-item-fluid">
                      <div className="nk-ibx-context-group">
                        <div className="nk-ibx-context">
                          <span className="nk-ibx-context-text">
                            <span
                              className="heading"
                              style={
                                inbox?.mailAction ===
                                MAIL_ACTIONS.CRASHED_UNREAD
                                  ? { color: "white" }
                                  : { color: "#707070" }
                              }
                            >
                              {inbox?.subject}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="nk-ibx-item-elem nk-ibx-item-user ml-5">
                      <div className="user-name">
                        <div
                          className="lead-text"
                          style={
                            inbox?.mailAction === MAIL_ACTIONS.CRASHED_UNREAD
                              ? { fontWeight: "bold", color: "white" }
                              : { fontWeight: "bold", color: "#707070" }
                          }
                        >
                          {inbox.op ? inbox.op.toUpperCase() : ""}
                        </div>
                      </div>
                    </div>

                    <div className="nk-ibx-item-elem nk-ibx-item-user">
                      <div className="user-name">
                        {inbox?.comments_data?.length > 0 ? (
                          <div
                            className="lead-text comment-tag"
                            style={
                              (inbox?.mailAction === MAIL_ACTIONS.CRASHED_UNREAD
                                ? { fontWeight: "bold", color: "white" }
                                : { fontWeight: "bold", color: "#707070" },
                              inbox?.comments_data.length <= 0
                                ? { background: "#f2f5f5cc" }
                                : {})
                            }
                          >
                            {inbox.comments_data.length > 0
                              ? inbox.comments_data[0].comment
                              : ""}
                          </div>
                        ) : (
                          <div
                            className="lead-text"
                            style={{
                              padding: "12px 10px",
                            }}
                          />
                        )}
                      </div>
                    </div>
                    {!listingHover[i] ? (
                      <div
                        className="nk-ibx-item-elem nk-ibx-item-time"
                        style={{ marginTop: "-3%", marginBottom: "-4%" }}
                      >
                        <div
                          className={
                            inbox?.mailAction === MAIL_ACTIONS.CRASHED_UNREAD
                              ? `sub-text-isCrashed`
                              : `sub-text`
                          }
                          style={{ fontSize: 13 }}
                        >
                          {inbox?.timeStamp}
                        </div>
                      </div>
                    ) : (
                      <div className="other-icons">
                        {inbox?.attachment_ids[0] && (
                          <em className="icon ni ni-clip"></em>
                        )}

                        {inbox?.comments_data?.length > 0 &&
                          inbox?.comments_data[0]?.from === designationId &&
                          inbox?.comments_data[0]?.action !== null && (
                            <>
                              {inbox?.comments_data[0]?.action ===
                                "Forward" && (
                                <em className="icon ni ni-reply-all-fill"></em>
                              )}
                              {inbox?.comments_data[0]?.action === "Reply" && (
                                <em className="icon ni ni-reply"></em>
                              )}
                            </>
                          )}
                      </div>
                    )}
                  </div>
                </div>

                <hr style={{ marginTop: 0.5, marginBottom: 0.5 }} />
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps)(Inbox);
