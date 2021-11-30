import { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";

import "../Assets/CSS/2ColumnStyle.css";
import "../Assets/CSS/dashlite.css";
// import "../Assets/fonts";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import Inbox from "./Inbox";
import * as Api from "../util/api/ApicallModule";
import { formatDateTime } from "../util/dateFormat/DateFormat";
import ComposeMail from "../components/sidebar/composeMail";
import { MAIL_ACTIONS } from "../util";
import { GET_ALL_MAIL, UPDATE_MAIL_BY_ID } from "../config/constants";
import {
  updateUnreadMailsCount,
  updateUserData,
} from "../redux/action/InboxAction";
import MailView from "./mailview/MailView";
import { UNREAD_CONSTANTS_VALUES } from "../util";

let page = 1;
let limit = 15;
let total = 0;

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0)",
    height: "0px",
    width: "0px",
    zIndex: 2,
  },
  content: {
    position: "fixed",
    top: "10px",
    left: "0px",
    width: "0px",
    height: "0px",
    backgroundColor: "rgba(0, 0, 0, 0)",
    zIndex: "10001",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

const Mailbox = (props) => {
  const [activeModule, setActiveModule] = useState("inbox");
  const [inboxMailData, setInboxMailData] = useState([]);
  const [noOfMails, setNoOfMails] = useState(0);
  const [selectedMailId, setSelectedMailId] = useState(0);
  const [filterOptions, setFilterOptions] = useState({
    mail_action: MAIL_ACTIONS.UNREAD,
    group_by: 1,
  });
  const prevFilter = usePrevious(filterOptions);
  const [selectedStation, setSelectedstation] = useState([]);
  const [visiable, setVisiable] = useState(false);
  const [stationTag, setStationTag] = useState([]);
  const [switchUser, setSwitchUser] = useState(false);
  const [popupMail, setPopupMail] = useState(false);
  const [loader, setLoader] = useState(false);
  const [selectedMailTo, setSelectedMailTo] = useState([]);
  const [mailIds, setMailIds] = useState([]);
  const [uniqueMailId, setUniqueMailId] = useState("");
  const inboxConatinerRef = useRef(null);

  useEffect(() => {
    if (typeof prevFilter !== "undefined" && prevFilter !== filterOptions) {
      getAllMails();
    }
  }, [filterOptions]);

  useEffect(() => {
    if (props?.userData?.designations) {
      getAllMails();
    }
  }, [props?.userData]);

  useEffect(() => {
    if (switchUser) {
      setActiveModule("inbox");
      setInboxMailData([{ loader: 1 }]);
      setFilterOptions({ mail_action: MAIL_ACTIONS.UNREAD, group_by: 1 });
      setSwitchUser(false);
    }
  }, [props.isActiveModule]);

  useEffect(() => {
    if (props?.isActiveModule === "Unread") {
      setActiveModule("inbox");
      setFilterOptions({ mail_action: MAIL_ACTIONS.UNREAD, group_by: 1 });
    }
  }, [props?.isActiveModule]);

  const getAllMails = async (type) => {
    total = 0;
    setLoader(true);
    if (type === "back") {
      page = page;
    } else {
      page = 1;
    }

    if (inboxConatinerRef?.current?.clientHeight) {
      limit = Math.floor(inboxConatinerRef.current.clientHeight / 67);
    }

    let url = `${GET_ALL_MAIL}?limit=${limit}&pageNo=${page}`;

    for (const [key, value] of Object.entries(filterOptions)) {
      url += `&${key}=${value}`;
    }
    let mailData = [];

    const resp = await Api.ApiHandle(url, "", "GET");
    if (resp.status === 1) {
      props.updateUnreadMailsCount(resp.data?.unreadCount);

      setNoOfMails(resp.data?.count);
      resp.data.data.map((inbox) => {
        const flags = checkFlags(inbox.mail_action);
        const obj = {
          id: inbox?.id,
          userMailId: inbox?.user_mail_id,
          mailAction: inbox.mail_action,
          from: inbox?.Mail?.Source?.designation,
          isComposed: inbox?.Mail?.is_composed,
          actualFormId: inbox?.From?.id,
          toId: inbox?.To?.id,
          toBranch: inbox?.To?.branch,
          toDesignation: inbox?.To?.designation,
          branch: inbox?.Mail?.Source?.branch,
          subject: inbox?.Mail?.subject,
          op: inbox?.Mail?.op,
          timeStamp: formatDateTime(inbox?.updatedAt),
          isReadEnabled: inbox?.is_read_enabled,
          from_id: inbox?.From?.id,
          fromIsReadEnabled: inbox?.from_read_enabled,
          fromIsRead: inbox?.from_is_read,
          fromAction: inbox?.from_action,
          comments_data: inbox.comments_data,
          To: inbox.To,
          fromMailAction: inbox.from_action,
          updatedAt: inbox?.updatedAt,
          user_mail_ids: [inbox?.id],
          concat_from_action: inbox.concat_from_action.split(","),

          concat_mail_action: inbox.concat_mail_action.split(","),
          concat_user_mail_ids: inbox.concat_user_mail_ids.split(","),
          attachment_ids: [inbox?.attachement_ids],
          umail_id: inbox.comments_data[0]?.umail_id,
        };
        if (inbox.Mail) {
          mailData.push({ ...obj, ...flags });
        }
      });
      if (type === "back") {
        total = limit * page;
      } else {
        total = limit;
      }
      if (total > resp.data?.count) {
        total = resp.data?.count;
      } else {
        total =
          total > resp.data?.data?.length ? total : resp.data?.data?.length;
      }
      setInboxMailData(mailData);
      setLoader(false);
    } else {
    }
  };

  const updateFlagsState = (isRead, isCrashed, isStarred) => {
    const flags = {};
    flags.isRead = isRead;
    flags.isCrashed = isCrashed;
    flags.isStarred = isStarred;
    return flags;
  };

  const checkFlags = (mailAction) => {
    let flags = {};
    switch (mailAction) {
      case "99":
        flags = updateFlagsState(false, true, false);
        break;
      case "98":
        flags = updateFlagsState(true, true, false);
        break;
      case "97":
        flags = updateFlagsState(false, true, true);
        break;
      case "96":
        flags = updateFlagsState(true, true, true);
        break;
      case "79":
        flags = updateFlagsState(false, false, true);
        break;
      case "78":
        flags = updateFlagsState(true, false, true);
        break;
      case "69":
        flags = updateFlagsState(false, false, false);
        break;
      case "68":
        flags = updateFlagsState(true, false, false);
        break;
      default:
        flags = updateFlagsState(false, false, false);
    }
    return flags;
  };

  const getMailId = async (inbox) => {
    if (inbox) {
      let inboxTo = inbox?.To;
      setSelectedMailId(inbox?.id);
      updateMail(inbox);
      if (!Array.isArray(inbox?.To)) {
        inboxTo = [inbox?.To];
      }
      setSelectedMailTo(inboxTo);
    } else {
      setPopupMail(true);
      await getNextClick();
    }
  };

  useEffect(async () => {
    if (popupMail) {
      if (inboxMailData[0]) {
        setSelectedMailId(inboxMailData[0]?.id);
        updateMail(inboxMailData[0]);
        setPopupMail(false);
      } else {
        setPopupMail(false);
        await getPrevClick();
      }
    }
  }, [inboxMailData]);

  const updateMail = async (inbox) => {
    if (
      filterOptions?.mail_action === "69" &&
      UNREAD_CONSTANTS_VALUES.includes(inbox.mailAction)
    ) {
      props.unreadMailsCount === 0
        ? props.updateUnreadMailsCount(0)
        : props.updateUnreadMailsCount(props.unreadMailsCount - 1);
    }

    let params = {};
    const designationId = props?.userData?.designations.filter((item) => {
      if (item.default_desig) return item;
    })[0].id;

    if (filterOptions.is_sent !== 1) {
      inbox.concat_from_action.forEach((item, index) => {
        if (
          UNREAD_CONSTANTS_VALUES.includes(item) &&
          designationId === inbox.actualFormId
        ) {
          params = createParams(item, "from_action");

          callUpdateApi(
            params,
            inbox.concat_user_mail_ids[index],
            designationId,
            inbox.actualFormId
          );
        }
      });

      inbox.concat_mail_action.forEach((item, index) => {
        if (
          UNREAD_CONSTANTS_VALUES.includes(item) &&
          designationId !== inbox.actualFormId
        ) {
          params = createParams(item, "mail_action");

          callUpdateApi(
            params,
            inbox.concat_user_mail_ids[index],
            designationId,
            inbox.actualFormId
          );
        }
      });
    }
  };

  const callUpdateApi = (params, id, designationId, actualFormId) => {
    if (Object.keys(params).length > 0) {
      actualFormId === designationId
        ? (params.from_read_mail = 1)
        : (params.is_read_mail = 1);

      Api.ApiHandle(`${UPDATE_MAIL_BY_ID}/${id}`, params, "put");

      // if (resp.status === 1) {
      //   if (props?.unreadMailsCount !== 0)
      //     props.updateUnreadMailsCount(props?.unreadMailsCount - 1);
      // }
    }
  };

  const createParams = (action, key) => {
    let params = {};
    switch (action) {
      case "99":
        params[key] = "98";
        break;
      case "97":
        params[key] = "96";
        break;
      case "89":
        params[key] = "88";
        break;
      case "87":
        params[key] = "86";
        break;
      case "79":
        params[key] = "78";
        break;
      case "69":
        params[key] = "68";
        break;
    }

    return params;
  };

  const getNextClick = async () => {
    setLoader(true);
    const mailData = [];

    page = page + 1;

    if (inboxConatinerRef?.current?.clientHeight) {
      limit = Math.round(inboxConatinerRef.current.clientHeight / 67);
    }

    let url = `${GET_ALL_MAIL}?limit=${limit}&pageNo=${page}`;

    if (filterOptions.is_crashed) url += "&is_crashed=0";

    for (const [key, value] of Object.entries(filterOptions)) {
      url += `&${key}=${value}`;
    }
    const resp = await Api.ApiHandle(url, "", "GET");

    if (resp.status === 1) {
      props.updateUnreadMailsCount(resp.data?.unreadCount);
      setNoOfMails(resp.data?.count);
      resp.data.data.map((inbox, i) => {
        const obj = {
          id: inbox?.id,
          userMailId: inbox?.user_mail_id,
          mailAction: inbox.mail_action,
          from: inbox?.Mail.Source?.designation,
          isComposed: inbox?.Mail?.is_composed,
          actualFormId: inbox?.From?.id,
          toBranch: inbox?.To?.branch,
          toDesignation: inbox?.To?.designation,
          branch: inbox?.Mail.Source?.branch,
          subject: inbox?.Mail.subject,
          op: inbox?.Mail.op,
          timeStamp: formatDateTime(inbox?.updatedAt),
          isReadEnabled: inbox?.is_read_enabled,
          from_id: inbox?.From?.id,
          fromIsReadEnabled: inbox?.from_read_enabled,
          fromIsRead: inbox?.from_is_read,
          comments_data: inbox.comments_data,
          To: inbox.To,

          concat_from_action: inbox.concat_from_action.split(","),
          concat_mail_action: inbox.concat_mail_action.split(","),
          concat_user_mail_ids: inbox.concat_user_mail_ids.split(","),
          attachment_ids: [inbox?.attachment_ids],
          umail_id: inbox.comments_data[0]?.umail_id,
        };
        if (inbox.Mail) {
          mailData.push(obj);
        }
      });
      total = limit * page;
      total = total > resp.data?.count ? resp.data?.count : total;

      setInboxMailData(mailData);
      setLoader(false);
    } else {
    }
  };

  const getPrevClick = async (e) => {
    if (e) {
      e.preventDefault();
    }
    setLoader(true);
    // setInboxMailData(defaultInboxMailData);
    const mailData = [];
    page = page - 1;

    if (inboxConatinerRef?.current?.clientHeight) {
      limit = Math.round(inboxConatinerRef.current.clientHeight / 67);
    }

    let url = `${GET_ALL_MAIL}?limit=${limit}&pageNo=${page}`;

    if (filterOptions.is_crashed) url += "&is_crashed=0";

    for (const [key, value] of Object.entries(filterOptions)) {
      url += `&${key}=${value}`;
    }
    const resp = await Api.ApiHandle(url, "", "GET");

    if (resp.status === 1) {
      props.updateUnreadMailsCount(resp.data?.unreadCount);
      setNoOfMails(resp.data?.count);
      resp.data.data.map((inbox, i) => {
        const obj = {
          id: inbox?.id,
          userMailId: inbox?.user_mail_id,
          mailAction: inbox.mail_action,
          from: inbox?.Mail.Source?.designation,
          isComposed: inbox?.Mail?.is_composed,
          actualFormId: inbox?.From?.id,
          toBranch: inbox?.To?.branch,
          toDesignation: inbox?.To?.designation,
          branch: inbox?.Mail.Source?.branch,
          subject: inbox?.Mail.subject,
          op: inbox?.Mail.op,
          timeStamp: formatDateTime(inbox?.updatedAt),
          isReadEnabled: inbox?.is_read_enabled,
          from_id: inbox?.From?.id,
          fromIsReadEnabled: inbox?.from_read_enabled,
          fromIsRead: inbox?.from_is_read,
          comments_data: inbox.comments_data,
          To: inbox.To,
          concat_from_action: inbox.concat_from_action.split(","),
          concat_mail_action: inbox.concat_mail_action.split(","),
          concat_user_mail_ids: inbox.concat_user_mail_ids.split(","),

          attachment_ids: [inbox?.attachment_ids],
          umail_id: inbox.comments_data[0]?.umail_id,
        };
        if (inbox.Mail) {
          mailData.push(obj);
        }
      });
      total = limit * page;
      total = total > resp.data?.count ? resp.data?.count : total;

      setInboxMailData(mailData);
      setLoader(false);
    } else {
    }
  };

  const openComposeModel = () => setVisiable(true);

  const closeComposeModel = () => setVisiable(false);
  return (
    <>
      <div className="nk-app-root">
        {/* next component */}
        <div className="nk-main ">
          <div className="nk-wrap ">
            <Navbar setSwitchUser={setSwitchUser} />
            {/* next component */}
            <div className="nk-content p-0">
              <div className="nk-content-inner">
                <div className="nk-content-body">
                  <div className="nk-ibx">
                    <Sidebar
                      setActiveModule={setActiveModule}
                      getAllMails={getAllMails}
                      setFilterOptions={setFilterOptions}
                      filterOptions={filterOptions}
                      setInboxMailData={setInboxMailData}
                      openComposeModel={openComposeModel}
                    />
                    <div className="nk-ibx-body bg-white">
                      {activeModule === "inbox" ? (
                        <Inbox
                          setActiveModule={setActiveModule}
                          getMailId={getMailId}
                          inboxMailData={inboxMailData}
                          noOfMails={noOfMails}
                          activeModule={activeModule}
                          getAllMails={getAllMails}
                          getNextClick={getNextClick}
                          getPrevClick={getPrevClick}
                          total={total}
                          setFilterOptions={setFilterOptions}
                          filterOptions={filterOptions}
                          userData={props.userData}
                          selectedStation={selectedStation}
                          setSelectedstation={setSelectedstation}
                          stationTag={stationTag}
                          setStationTag={setStationTag}
                          loader={loader}
                          setMailIds={setMailIds}
                          setUniqueMailId={setUniqueMailId}
                          inboxConatinerRef={inboxConatinerRef}
                        />
                      ) : (
                        <MailView
                          setActiveModule={setActiveModule}
                          mailId={selectedMailId}
                          getAllMails={getAllMails}
                          filterOptions={filterOptions}
                          inboxMailData={inboxMailData}
                          setSelectedMailId={setSelectedMailId}
                          updateMail={updateMail}
                          getMailId={getMailId}
                          checkFlags={checkFlags}
                          selectedMailTo={selectedMailTo}
                          mailIds={mailIds}
                          setUniqueMailId={setUniqueMailId}
                          uniqueMailId={uniqueMailId}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {visiable && (
          <Modal
            // className="modal fade"
            isOpen={visiable}
            style={customStyles}
            shouldCloseOnEsc={false}
            id="compose-mail"
            width="720"
            effect="fadeInUp"
            shouldCloseOnOverlayClick={false}
            onRequestClose={closeComposeModel}
          >
            <ComposeMail
              closeModel={closeComposeModel}
              userData={props.userData}
            />
          </Modal>
        )}
      </div>
    </>
  );
};

const mapActionToProps = { updateUnreadMailsCount, updateUserData };

const mapStateToProps = (state) => ({
  unreadMailsCount: state.unreadMailsCount,
  userData: state.userData,
  stationList: state.stationList,
  isActiveModule: state.isActiveModule,
});

export default connect(mapStateToProps, mapActionToProps)(Mailbox);
