import { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  updateCrashedCall,
  updateUnreadCall,
  updateAllCall,
  updateStarredCall,
  updateArchiveCall,
  updateFolderCachedData,
} from "../redux/action/InboxAction";

import InboxNavbar from "../components/navbar/InboxNavbar";
import * as Api from "../util/api/ApicallModule";
import { UPDATE_MAIL_BY_ID } from "../config/constants";
import Loading from "../util/loader/Loading";
import { UNREAD_CONSTANTS_VALUES, MAIL_ACTIONS } from "../util";

const Inbox = (props) => {
  const cachedData = () => {
    switch (props?.isActiveModule) {
      case "Unread":
        return props?.unreadCache?.current;
      case "Archive":
        return props?.archiveCache?.current;
      case "All":
        return props?.allCache?.current;
      case "Sent":
        return props?.sentCache?.current;
      case "Crashed":
        return props?.crashedCache?.current;
      case "Starred":
        return props?.starredCache?.current;

      default:
        return props?.inboxMailData;
    }
  };

  let logData = {};
  const isFolderExist =
    props?.folderCachedData[props?.isActiveModule]?.isFolderCached;
  // const folderData = props?.folderCachedData[props?.isActiveModule]?.current;
  const logDataFunction = (type, mail_id, attachId) => {
    logData = {
      type: type,
      mail_id: mail_id,
      attach_id: attachId,
    };
  };
  let mailData =
    props?.filterOptions.by_stations || props?.filterOptions.search_data
      ? props?.inboxMailData
      : cachedData();

  const keyFilterLoader = () => {
    if (
      props?.filterOptions.by_stations ||
      props?.filterOptions.search_data ||
      props?.filterOptions.folder
    ) {
      if (props.total === 0) {
        return 1;
      }
      return 0;
    } else return props.keyForNextCall();
  };

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
  const [newMailData, setNewMailData] = useState([]);

  useEffect(() => {
    let designationId;
    if (props && props?.userData && props?.userData?.designations)
      designationId = props?.userData?.designations.filter((item) => {
        if (item.default_desig) return item;
      })[0]?.id;

    setDesignationId(designationId);
  }, [props?.userData]);

  useEffect(() => {
    if (props.backButton && props.isAction) {
      props?.updateFolderCachedData("delete");
    }
  }, [props.backButton, props.isAction]);

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
    setNewMailData(mailData);
    const meMailId = [];
    if (designationId) {
      mailData.forEach((item) => {
        if (item.from_id === designationId) meMailId.push(item.id);
      });

      setMeMailData(meMailId);
    }
  }, [mailData]);

  useEffect(() => {
    props?.setLoader(false);
  }, []);

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
    let params = {
      mail_action: createParams(inbox),
      userMailId: inbox.userMailId,
    };

    inbox.isStarred = !inbox.isStarred;
    logDataFunction(
      inbox.isStarred ? "STARRED" : "UNSTARRED",
      inbox.userMailId,
      0
    );
    const active = props.isActiveModule;
    if (props.isActiveModule === "Unread") {
      props.updateAllCall(0);
      props.updateCrashedCall(0);
      props.updateStarredCall(0);
    } else if (props.isActiveModule === "Archive") {
      props.updateAllCall(0);
      props.updateCrashedCall(0);
      props.updateStarredCall(0);
    } else if (props.isActiveModule === "All") {
      props.updateAllCall(0);
      props.updateCrashedCall(0);
      props.updateStarredCall(0);
      props.updateUnreadCall(0);
      props.updateArchiveCall(0);
    } else if (props.isActiveModule === "Crashed") {
      props.updateAllCall(0);
      props.updateStarredCall(0);
      props.updateUnreadCall(0);
    } else if (props.isActiveModule === "Starred") {
      props.updateAllCall(0);
      props.updateCrashedCall(0);
      props.updateUnreadCall(0);
      props.updateArchiveCall(0);
    } else {
      props.updateAllCall(0);
      props.updateCrashedCall(0);
      props.updateStarredCall(0);
      props.updateUnreadCall(0);
      props.updateArchiveCall(0);
    }
    // await Api.ApiHandle(`${UPDATE_STAR}${inbox?.id}`, params, "PUT");
    params.action_type = 1;
    await Api.ApiHandle(
      `/api/mails/updateById/${inbox?.id}`,
      params,
      "put",
      logData
    );
  };

  const typeCheck = (type, params, inbox) => {
    type === "from" ? (inbox.fromAction = params) : (inbox.mailAction = params);
  };

  const createParams = (inbox) => {
    const designationId = props?.userData?.designations.filter((item) => {
      if (item.default_desig) return item;
    })[0].id;
    let params = "";
    let action = "";
    let type = "";
    if (designationId === inbox?.from_id) {
      action = inbox?.fromAction;
      type = "from";
    } else {
      action = inbox?.mailAction;
      type = "to";
    }

    switch (action) {
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

    typeCheck(type, params, inbox);
    return params;
  };

  const updateFromIsRead = async (inbox) => {
    logDataFunction("UPDATE MAIL FROM ISREAD", 0, 0);
    if (designationId === inbox.actualFormId) {
      if (inbox?.fromIsReadEnabled === 0) {
        const payload = { is_read_mail: 1 };
        await Api.ApiHandle(
          `${UPDATE_MAIL_BY_ID}/${inbox.id}`,
          payload,

          "PUT",
          logData
        );
        payload.action_type = 1;
        await Api.ApiHandle(
          `/api/mails/updateById/${inbox.id}`,
          payload,

          "put",
          logData
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

  const updateMailIds = (mailIds, uniqueMailId, index) => {
    localStorage.setItem("indexing", index);
    props.setMailIds([mailIds]);
    props.setUniqueMailId(uniqueMailId);
  };

  const returnBackgroundColorOfMail = (inbox, mailAction, fromMailAction) => {
    if (props?.filterOptions?.is_sent === 1) return "";

    if (inbox.actualFormId === designationId) {
      return [
        MAIL_ACTIONS.CRASHED_STARRED_UNREAD,
        MAIL_ACTIONS.CRASHED_UNREAD,
      ].includes(fromMailAction)
        ? "#FF4F4F"
        : [
            MAIL_ACTIONS.COMPOSED_STARRED_UNREAD,
            MAIL_ACTIONS.COMPOSED_UNREAD,
          ].includes(fromMailAction)
        ? "#F3E779"
        : "";
    }

    return [
      MAIL_ACTIONS.CRASHED_STARRED_UNREAD,
      MAIL_ACTIONS.CRASHED_UNREAD,
    ].includes(mailAction)
      ? "#FF4F4F"
      : [
          MAIL_ACTIONS.COMPOSED_STARRED_UNREAD,
          MAIL_ACTIONS.COMPOSED_UNREAD,
        ].includes(mailAction)
      ? "#F3E779"
      : "";
  };

  const returnTextColorOfMail = (inbox, mailAction) => {
    if (props?.filterOptions?.is_sent === 1) return { color: "#707070" };

    return [
      MAIL_ACTIONS.CRASHED_STARRED_UNREAD,
      MAIL_ACTIONS.CRASHED_UNREAD,
    ].includes(mailAction)
      ? { color: "white" }
      : { color: "#707070" };
  };

  const updateCacheState = (inbox) => {
    const designationId = props?.userData?.designations.filter((item) => {
      if (item.default_desig) return item;
    })[0].id;
    if (designationId == inbox?.actualFormId) {
      inbox.fromAction = updateActions(inbox?.fromAction);
    } else {
      inbox.mailAction = updateActions(inbox?.mailAction);
    }
  };

  const handleFolderCached = () => {
    if (props?.folderCachedData !== undefined) {
      props?.updateFolderCachedData("delete");
    }
  };

  const updateActions = (action) => {
    // const active = props.isActiveModule;
    // if (
    //   active === 'Unread' ||
    //   active === 'Crashed' ||
    //   active === 'Starred' ||
    //   active === 'Read' ||
    //   active === 'Archive'
    // ) {
    //   handleFolderCached();
    // }
    if (props.isActiveModule === "Unread") {
      if (["97", "96"].includes(action)) {
        props.updateAllCall(0);
        props.updateCrashedCall(0);
        props.updateStarredCall(0);
      } else if (["99"].includes(action)) {
        props.updateAllCall(0);
        props.updateCrashedCall(0);
      } else if (["89"].includes(action)) {
        props.updateAllCall(0);
      } else if (["86", "87"]) {
        props.updateAllCall(0);
        props.updateStarredCall(0);
      } else if (["79"].includes(action)) {
        props.updateAllCall(0);
        props.updateStarredCall(0);
      } else if (["68", "69"].includes(action)) {
        props.updateAllCall(0);
      }
    } else if (props.isActiveModule === "All") {
      if (["97", "96"].includes(action)) {
        props.updateUnreadCall(0);
        props.updateCrashedCall(0);
        props.updateStarredCall(0);
      } else if (["99"].includes(action)) {
        props.updateUnreadCall(0);
        props.updateCrashedCall(0);
      } else if (["89"].includes(action)) {
        props.updateUnreadCall(0);
      } else if (["86", "87"]) {
        props.updateUnreadCall(0);
        props.updateStarredCall(0);
      } else if (["79"].includes(action)) {
        props.updateUnreadCall(0);
        props.updateStarredCall(0);
      } else if (["68", "69"].includes(action)) {
        props.updateUnreadCall(0);
      }
    } else if (props.isActiveModule === "Crashed") {
      if (["97", "96"].includes(action)) {
        props.updateUnreadCall(0);
        props.updateAllCall(0);
        props.updateStarredCall(0);
      } else if (["99"].includes(action)) {
        props.updateUnreadCall(0);
        props.updateAllCall(0);
      }
    } else if (props.isActiveModule === "Starred") {
      if (["97", "96"].includes(action)) {
        props.updateUnreadCall(0);
        props.updateAllCall(0);
        props.updateCrashedCall(0);
      } else if (["86", "87"]) {
        props.updateUnreadCall(0);
        props.updateAllCall(0);
      } else if (["79"].includes(action)) {
        props.updateUnreadCall(0);
        props.updateAllCall(0);
      }
    } else {
      if (["99", "97", "89", "86", "79", "69"].includes(action)) {
        props.updateUnreadCall(0);
        props.updateAllCall(0);
        props.updateCrashedCall(0);
        props.updateStarredCall(0);
      }
    }

    switch (action) {
      case "99":
        return "98";
      case "98":
        return "98";

      case "97":
        return "96";
      case "96":
        return "96";

      case "89":
        return "88";
      case "88":
        return "88";

      case "86":
        return "87";

      case "87":
        return "87";

      case "79":
        return "78";
      case "78":
        return "78";

      case "69":
        return "68";
      case "68":
        return "68";
      case "67":
        return "67";
      default:
    }
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
        loader={props?.loader}
        setLoader={props.setLoader}
        setIsFolderLoaderId={props.setIsFolderLoaderId}
        isLoadingForCount={props?.isLoadingForCount}
        disablePreviousNext={props?.disablePreviousNext}
        setIsMailAddedToFolder={props?.setIsMailAddedToFolder}
      />
      <div
        className="nk-ibx-list jumbotron-overflow"
        style={{ overflow: "auto" }}
        ref={props.inboxConatinerRef}
      >
        {mailData.length === 0 && keyFilterLoader() === 0 ? (
          <Loading />
        ) : mailData.length === 0 ? (
          <div style={{ margin: "auto" }}>
            <h2>No Mails Found</h2>
          </div>
        ) : (
          mailData.map((inbox, i) => {
            return (
              <div
                key={i}
                className="mails-main"
                id="mails-main"
                style={{
                  marginBottom: "-2px",
                }}
                onClick={() => updateMailIds(inbox.id, inbox.userMailId, i)}
                // onMouseOver={() => {
                //   listingMouseOverEvent(i, "in");
                // }}
                // onMouseOut={() => {
                //   listingMouseOverEvent(i, "out");
                // }}
              >
                {props?.filterOptions?.is_sent !== 1 && (
                  <div
                    id="inside-mails-main"
                    className={`nk-ibx-item ${
                      props?.filterOptions?.is_sent === 1
                        ? "active"
                        : inbox.actualFormId !== designationId &&
                          UNREAD_CONSTANTS_VALUES.includes(inbox?.mailAction)
                        ? ""
                        : inbox.actualFormId === designationId &&
                          UNREAD_CONSTANTS_VALUES.includes(inbox?.fromAction)
                        ? ""
                        : "active"
                    }`}
                    style={{
                      float: "left",
                      width: 87,
                      backgroundColor: returnBackgroundColorOfMail(
                        inbox,
                        inbox?.mailAction,
                        inbox?.fromAction
                      ),
                      color:
                        props?.filterOptions?.is_sent !== 1 &&
                        inbox.from_id !== designationId
                          ? [
                              MAIL_ACTIONS.CRASHED_STARRED_UNREAD,
                              MAIL_ACTIONS.CRASHED_UNREAD,
                              MAIL_ACTIONS.COMPOSED_STARRED_UNREAD,
                              MAIL_ACTIONS.COMPOSED_UNREAD,
                            ].includes(inbox?.mailAction)
                            ? "#fff"
                            : "#707070"
                          : [
                              MAIL_ACTIONS.CRASHED_STARRED_UNREAD,
                              MAIL_ACTIONS.CRASHED_UNREAD,
                              MAIL_ACTIONS.COMPOSED_STARRED_UNREAD,
                              MAIL_ACTIONS.COMPOSED_UNREAD,
                            ].includes(inbox?.fromAction)
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
                        inbox?.sourceId !== designationId
                          ? { float: "right", marginTop: 0 }
                          : { float: "right", marginTop: "80%" }
                      }
                    >
                      {inbox?.sourceId !== designationId && (
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
                    backgroundColor: returnBackgroundColorOfMail(
                      inbox,
                      inbox?.mailAction,
                      inbox?.fromAction
                    ),
                    color:
                      props?.filterOptions?.is_sent !== 1 &&
                      inbox.from_id !== designationId
                        ? [
                            MAIL_ACTIONS.CRASHED_STARRED_UNREAD,
                            MAIL_ACTIONS.CRASHED_UNREAD,
                            MAIL_ACTIONS.COMPOSED_STARRED_UNREAD,
                            MAIL_ACTIONS.COMPOSED_UNREAD,
                          ].includes(inbox?.mailAction)
                          ? "#fff"
                          : "#707070"
                        : [
                            MAIL_ACTIONS.CRASHED_STARRED_UNREAD,
                            MAIL_ACTIONS.CRASHED_UNREAD,
                            MAIL_ACTIONS.COMPOSED_STARRED_UNREAD,
                            MAIL_ACTIONS.COMPOSED_UNREAD,
                          ].includes(inbox?.fromAction)
                        ? "#fff"
                        : "#707070",
                  }}
                  id="inside-mails-main"
                  className={`nk-ibx-item ${
                    props?.filterOptions?.is_sent === 1
                      ? "active"
                      : inbox.actualFormId !== designationId &&
                        UNREAD_CONSTANTS_VALUES.includes(inbox?.mailAction)
                      ? ""
                      : inbox.actualFormId === designationId &&
                        UNREAD_CONSTANTS_VALUES.includes(inbox?.fromAction)
                      ? ""
                      : "active"
                  }`}
                  key={`mail-list${i}`}
                  onClick={() => {
                    props.getMailId(inbox);
                    setMailView();
                    updateFromIsRead(inbox);
                    updateCacheState(inbox);
                  }}
                >
                  <div className="elem-alignment">
                    <div className="nk-ibx-item-elem nk-ibx-item-user">
                      <div className="user-card">
                        <div className="user-name">
                          <div
                            className="lead-text"
                            style={
                              props?.filterOptions?.is_sent !== 1
                                ? inbox.from_id !== designationId
                                  ? [
                                      MAIL_ACTIONS.CRASHED_STARRED_UNREAD,
                                      MAIL_ACTIONS.CRASHED_UNREAD,
                                    ].includes(inbox.mailAction)
                                    ? { color: "white", fontWeight: "bolder" }
                                    : { fontWeight: "bolder" }
                                  : [
                                      MAIL_ACTIONS.CRASHED_STARRED_UNREAD,
                                      MAIL_ACTIONS.CRASHED_UNREAD,
                                    ].includes(inbox.fromAction)
                                  ? { color: "white", fontWeight: "bolder" }
                                  : { fontWeight: "bolder" }
                                : {
                                    color: "#364a63",
                                    fontWeight: "bolder",
                                  }
                            }
                          >
                            {props?.filterOptions?.is_sent === 1
                              ? "Me"
                              : designationId == inbox.sourceId
                              ? "Me"
                              : !inbox?.from && !inbox?.branch
                              ? `-`
                              : !inbox?.from && inbox?.branch
                              ? `${inbox?.branch}`
                              : inbox?.from && !inbox?.branch
                              ? `${inbox?.from}`
                              : inbox?.from && inbox?.branch
                              ? `${inbox?.from}(${inbox?.branch})`
                              : "-"}

                            {props?.filterOptions?.is_sent === 1 &&
                            props?.filterOptions?.by_stations ? (
                              <div
                                className="lead-text"
                                style={{ fontWeight: 500 }}
                              >
                                To:{" "}
                                {inbox?.sentEnabled === 1 &&
                                designationId !== inbox?.actualFormId
                                  ? `${inbox?.from}(${inbox?.branch})`
                                  : `${inbox?.toDesignation}(${inbox?.toBranch})`}
                              </div>
                            ) : (
                              props?.filterOptions?.is_sent === 1 && (
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
                              )
                            )}
                          </div>
                          {/* {inbox?.FirstName !== null &&
                          inbox?.FirstName !== undefined ? (
                            <i style={{ fontSize: "10px" }}>
                              {inbox.FirstName}
                            </i>
                          ) : null} */}
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
                                inbox.actualFormId !== designationId
                                  ? returnTextColorOfMail(
                                      inbox,
                                      inbox?.mailAction
                                    )
                                  : returnTextColorOfMail(
                                      inbox,
                                      inbox?.fromAction
                                    )
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
                            props?.filterOptions?.is_sent !== 1 &&
                            inbox.actualFormId !== designationId
                              ? [
                                  MAIL_ACTIONS.CRASHED_STARRED_UNREAD,
                                  MAIL_ACTIONS.CRASHED_UNREAD,
                                ].includes(inbox.mailAction)
                                ? { fontWeight: "bold", color: "white" }
                                : { fontWeight: "bold", color: "#707070" }
                              : [
                                  MAIL_ACTIONS.CRASHED_STARRED_UNREAD,
                                  MAIL_ACTIONS.CRASHED_UNREAD,
                                ].includes(inbox.fromAction)
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
                        {inbox?.comments_data?.length > 0 &&
                        inbox.comments_data[0].comment.length > 0 ? (
                          <div
                            className="lead-text comment-tag"
                            style={
                              (props?.filterOptions?.is_sent !== 1 &&
                              inbox.actualFormId !== designationId
                                ? [
                                    MAIL_ACTIONS.CRASHED_STARRED_UNREAD,
                                    MAIL_ACTIONS.CRASHED_UNREAD,
                                  ].includes(inbox.mailAction)
                                  ? { fontWeight: "bold", color: "white" }
                                  : { fontWeight: "bold", color: "#707070" }
                                : [
                                    MAIL_ACTIONS.CRASHED_STARRED_UNREAD,
                                    MAIL_ACTIONS.CRASHED_UNREAD,
                                  ].includes(inbox.fromAction)
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
                    {
                      <>
                        <div
                          className="nk-ibx-item-elem nk-ibx-item-time"
                          style={{ marginTop: "-3%", marginBottom: "-4%" }}
                        >
                          <div
                            className={
                              props?.filterOptions?.is_sent !== 1
                                ? inbox.from_id !== designationId
                                  ? [
                                      MAIL_ACTIONS.CRASHED_STARRED_UNREAD,
                                      MAIL_ACTIONS.CRASHED_UNREAD,
                                    ].includes(inbox.mailAction)
                                    ? `sub-text-isCrashed`
                                    : `sub-text`
                                  : [
                                      MAIL_ACTIONS.CRASHED_STARRED_UNREAD,
                                      MAIL_ACTIONS.CRASHED_UNREAD,
                                    ].includes(inbox.fromAction)
                                  ? `sub-text-isCrashed`
                                  : `sub-text`
                                : "sub-text"
                            }
                            style={{ fontSize: 13 }}
                          >
                            {inbox?.timeStamp}
                          </div>
                        </div>
                        <div className="other-icons">
                          {inbox?.attachment_ids &&
                            inbox?.attachment_ids.length > 0 &&
                            inbox?.attachment_ids[0] && (
                              <abbr title="Attachments">
                                <em className="icon ni ni-clip"></em>
                              </abbr>
                            )}

                          {inbox?.comments_data?.length > 0 &&
                            inbox?.comments_data[0]?.from === designationId &&
                            inbox?.comments_data[0]?.action !== null && (
                              <>
                                {inbox?.comments_data[0]?.action ===
                                  "Forward" && (
                                  <div
                                    style={
                                      inbox?.attachment_ids[0]
                                        ? {
                                            marginLeft: "31%",
                                            transform: "rotateY(180deg)",
                                          }
                                        : {
                                            marginLeft: "50%",
                                            transform: "rotateY(180deg)",
                                          }
                                    }
                                  >
                                    <abbr title="Forwarded">
                                      <em className="icon ni ni-reply-all-fill"></em>
                                    </abbr>
                                  </div>
                                )}
                                {inbox?.comments_data[0]?.action ===
                                  "Reply" && (
                                  <abbr
                                    title="Replied"
                                    style={
                                      inbox?.attachment_ids[0]
                                        ? { marginLeft: "31%" }
                                        : { marginLeft: "50%" }
                                    }
                                  >
                                    <em className="icon ni ni-reply"></em>
                                  </abbr>
                                )}
                              </>
                            )}
                        </div>
                      </>
                    }
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

const mapActionToProps = {
  updateCrashedCall,
  updateUnreadCall,
  updateAllCall,
  updateStarredCall,
  updateArchiveCall,
  updateFolderCachedData,
};

const mapStateToProps = (state) => ({
  data: state.data,
  unreadCache: state.unreadCache,
  archiveCache: state.archiveCache,
  allCache: state.allCache,
  isActiveModule: state.isActiveModule,
  userData: state.userData,
  sentCache: state.sentCache,
  starredCache: state.starredCache,
  crashedCache: state.crashedCache,
  folderCachedData: state.folderCachedData,
});

export default connect(mapStateToProps, mapActionToProps)(Inbox);
