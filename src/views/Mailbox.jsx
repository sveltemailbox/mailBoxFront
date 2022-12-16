import { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import Axios from "axios";

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
import {
  GET_ALL_MAIL,
  GET_STATION_FILTER,
  GET_UNREAD_COUNT,
  UPDATE_MAIL_BY_ID,
  GET_TOTAL_MAIL_COUNT,
  GET_FOLDER,
  MOST_FREQUENT_STATUS,
  GET_UNREAD_MAIL,
  // GET_TOTAL_UNREAD_MAIL_COUNT,
} from "../config/constants";
import {
  updateUnreadMailsCount,
  updateUserData,
  updateSwitching,
  updateUnreadCache,
  updateUnreadCall,
  updateArchiveCache,
  updateArchiveCall,
  updateAllCache,
  updateAllCall,
  updateSeachText,
  updateSentCache,
  updateSentCall,
  updateStarredCache,
  updateStarredCall,
  updateCrashedCache,
  updateCrashedCall,
  updateActiveModule,
  updateFolderCachedData,
  updateMostFrequent,
} from "../redux/action/InboxAction";
import MailView from "./mailview/MailView";
import { createGlobalStyle } from "styled-components";
import { UNREAD_CONSTANTS_VALUES } from "../util";
import HelpModal from "../components/common/HelpModal";
let page = 1;

let total = 0;
let autoRefreshIntervalUnread;
let autoRefreshIntervalAll;
let autoRefreshIntervalCrashed;
let currentMailData;

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
  let limit = localStorage.getItem("limit");
  // let limit = 20;

  let logData = {};
  const [nextClick, setNextClick] = useState(false);
  const [dataNextPrevClick, setDataNextPrevClick] = useState();
  const [clicked, setClicked] = useState();
  const [prevCacheClicked, setPrevCacheClicked] = useState();
  const [backButton, setBackButton] = useState(false);
  const [isAction, setIsAction] = useState(false);
  const [isMailAddedToFolder, setIsMailAddedToFolder] = useState(false);
  const logDataFunction = (type, mail_id, attachId) => {
    logData = {
      type: type,
      mail_id: mail_id,
      attach_id: attachId,
    };
  };

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

  const [activeModule, setActiveModule] = useState("inbox");
  const [inboxMailData, setInboxMailData] = useState([]);
  const [noOfMails, setNoOfMails] = useState(0);
  const [selectedMailId, setSelectedMailId] = useState(0);
  const [filterOptions, setFilterOptions] = useState({
    mail_action: MAIL_ACTIONS.UNREAD,
  });
  const prevFilter = usePrevious(filterOptions);
  const [selectedStation, setSelectedstation] = useState([]);
  const [visiable, setVisiable] = useState(false);
  const [stationTag, setStationTag] = useState([]);
  const [switchUser, setSwitchUser] = useState(false);
  const [popupMail, setPopupMail] = useState(false);
  const [loader, setLoader] = useState(true);
  const [selectedMailTo, setSelectedMailTo] = useState([]);
  const [mailIds, setMailIds] = useState([]);
  const [uniqueMailId, setUniqueMailId] = useState("");
  const [selectedUserMailId, setSelectedUserMailId] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);
  const [isLoadingForCount, setIsLoadingForCount] = useState(false);
  const [designationId, setDesignationId] = useState(0);
  const [countmail, setCountMail] = useState(0);
  const [isFolderLoaderId, setIsFolderLoaderId] = useState("");
  const [disablePreviousNext, setDisablePreviousNext] = useState({
    previous: true,
    next: false,
  });
  currentMailData =
    props?.filterOptions?.by_stations ||
    props?.filterOptions?.search_data ||
    typeof props.isActiveModule === "number"
      ? inboxMailData
      : cachedData();
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    // const requestTotalCount = Axios.CancelToken.source();
    if (typeof prevFilter !== "undefined" && prevFilter !== filterOptions) {
      getAllMails("", ourRequest.token);
      // getTotalCount("", requestTotalCount.token);
    }
    getUnreadCount(ourRequest.token);
    if (
      filterOptions.by_stations ||
      filterOptions.search_data ||
      filterOptions.folder
    ) {
      clearInterval(autoRefreshIntervalUnread);
      clearInterval(autoRefreshIntervalAll);
      clearInterval(autoRefreshIntervalCrashed);
    }

    return () => {
      ourRequest.cancel(); // <-- 3rd step
      // requestTotalCount.cancel();
    };
  }, [filterOptions]);

  // useEffect(() => {
  //   props.updateFolderCachedData("delete");
  //   if (props.isPreferencedChanged) {
  //     window.location.reload();
  //   }
  // }, [props.isPreferencedChanged]);

  // useEffect(() => {
  //   fetchFolderData();
  // }, [backButton, isAction]);
  // const fetchFolderData = async () => {
  //   if (backButton && isAction && typeof filterOptions?.folder === "number") {
  //     setLoader(true);
  //     const baseUrl = GET_ALL_MAIL;
  //     let urlCurrent = `?limit=${limit}&pageNo=${page}`;
  //     let urlNext = `?limit=${limit}&pageNo=${page + 1}`;
  //     for (const [key, value] of Object.entries(filterOptions)) {
  //       urlCurrent += `&${key}=${value}`;
  //       urlNext += `&${key}=${value}`;
  //     }
  //     await getAllMailsApiCall(baseUrl, urlCurrent, "", "current");
  //     await getAllMailsApiCall(baseUrl, urlNext, "", "next");
  //   }
  // };

  useEffect(() => {
    let token = localStorage.getItem("auth");
    if (token) {
      window.history.pushState(null, null, window.location.href);
      window.addEventListener("popstate", function (event) {
        window.history.pushState(null, null, window.location.href);
      });
    }
    props.updateActiveModule("Unread");
    delete filterOptions.search_data;
    props.updateSeachText({});
  }, []);

  useEffect(() => {
    if (props.switching) {
      getUnreadCount();
      setActiveModule("inbox");
    }
  }, [props.switching]);

  useEffect(() => {
    if (props?.userData?.designations) {
      setDesignationId(
        () =>
          props?.userData?.designations.filter((item) => {
            if (item.default_desig) return item;
          })[0]?.id
      );
      getAllMails();
    }
  }, [props?.userData]);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    if (switchUser) {
      setActiveModule("inbox");
      setInboxMailData([{ loader: 1 }]);
      setFilterOptions({ mail_action: MAIL_ACTIONS.UNREAD });
      setSwitchUser(false);
    }

    switch (props.isActiveModule) {
      case "Unread":
        clearInterval(autoRefreshIntervalAll);
        clearInterval(autoRefreshIntervalCrashed);
        if (limit) {
          autoRefreshIntervalUnread = setInterval(() => {
            callAutoRefreshUnread(ourRequest.token);
          }, 300000);
        }

        break;
      case "All":
        clearInterval(autoRefreshIntervalUnread);
        clearInterval(autoRefreshIntervalCrashed);

        autoRefreshIntervalAll = setInterval(() => {
          callAutoRefreshAll(ourRequest.token);
        }, 300000);

        break;
      case "Crashed":
        clearInterval(autoRefreshIntervalUnread);
        clearInterval(autoRefreshIntervalAll);

        autoRefreshIntervalCrashed = setInterval(() => {
          callAutoRefreshCrashed(ourRequest.token);
        }, 300000);

        break;

      default:
        clearInterval(autoRefreshIntervalUnread);
        clearInterval(autoRefreshIntervalAll);
        clearInterval(autoRefreshIntervalCrashed);

        break;
    }
  }, [props.isActiveModule]);

  useEffect(() => {
    fetchMostFrequentStatus();
  }, []);
  const fetchMostFrequentStatus = async () => {
    logDataFunction("SELECT MOST FREQUENT / MOST RECENT", 0, 0);
    const resp = await Api.ApiHandle(MOST_FREQUENT_STATUS, "", "GET", logData);
    if (resp && resp.status === 1) {
      const freqStatus = Number(resp?.data?.recent_frequent_type);
      props?.updateMostFrequent(freqStatus);
    }
  };

  const getUnreadCount = async (cancelToken, auto) => {
    logDataFunction("UNREAD COUNT MAIL", 0, 0);
    if (props?.unreadCall === 0 || auto) {
      const resp = await Api.ApiHandle(
        `${GET_UNREAD_COUNT}`,
        "",

        "GET",
        logData,
        cancelToken
      );
      if (resp && resp.status === 1) {
        setLoader(false);
        props?.updateUnreadMailsCount(resp.data);
      }
    }
  };

  const getAllMailsApiCall = async (baseUrl, url, cancelToken, pageType) => {
    let mailData = [];

    const resp = await Api.ApiHandle(
      baseUrl + url,
      "",
      "GET",
      logData,
      cancelToken
    );

    if (resp && resp?.status === 1) {
      resp.data.data.map((inbox) => {
        const flags =
          designationId === inbox?.From?.id
            ? checkFlags(inbox.from_action)
            : checkFlags(inbox.mail_action);
        const obj = {
          id:
            // filterOptions.mail_action === "69"
            //   ? filterOptions?.by_stations
            //     ? inbox.id
            //     : inbox.user_mail_id
            //   :
            inbox.id,
          userMailId:
            // filterOptions.mail_action === "69"
            //   ? filterOptions?.by_stations
            //     ? inbox?.user_mail_id
            //     : inbox?.mail_id
            //   :
            inbox?.user_mail_id,
          mailAction: inbox.mail_action,
          from: inbox?.Mail?.Source?.designation,
          sourceId: inbox?.Mail?.Source?.id,
          actualFormId: inbox?.From?.id,
          toId: inbox?.To?.id,
          toBranch: inbox?.To?.branch,
          toDesignation: inbox?.To?.designation,
          branch: inbox?.Mail?.Source?.branch,
          subject: inbox?.Mail?.subject,
          op: inbox?.Mail?.op,
          sentEnabled: inbox.sent_enabled,
          timeStamp: formatDateTime(inbox?.updatedAt),
          isReadEnabled: inbox?.is_read_enabled,
          from_id: inbox?.From?.id,
          fromIsReadEnabled: inbox?.from_read_enabled,
          fromIsRead: inbox?.from_is_read,
          fromAction: inbox?.from_action,
          comments_data: inbox.comments_data,
          To: inbox.To,
          updatedAt: inbox?.updatedAt,
          user_mail_ids: [inbox?.id],
          attachment_ids: [inbox?.attachement_ids],
          umail_id: inbox.comments_data[0]?.umail_id,
          // FirstName: inbox?.Mail?.Source.designations?.first_name,
        };
        if (inbox.Mail) {
          mailData.push({ ...obj, ...flags });
        }
      });

      props.switching && props.updateSwitching(false);

      if (!pageType) {
        setInboxMailData(mailData);
      } else {
        let data = { key: pageType, data: mailData };
        settingCache(data);
      }
      if (!filterOptions.by_stations) {
        updateKeyForNextCall();
      }
      setLoader(false);
    } else {
      setLoader(false);
    }

    return mailData;
  };

  const updatingKeyForCall = () => {
    switch (props.isActiveModule) {
      case "Unread":
        props.updateUnreadCall(0);
        break;
      case "All":
        props.updateAllCall(0);
        break;
      case "Archive":
        props.updateArchiveCall(0);
        break;
      case "Sent":
        props.updateSentCall(0);
        break;
      case "Crashed":
        props.updateCrashedCall(0);
        break;
      case "Starred":
        props.updateStarredCall(0);
        break;
      default:
        break;
    }
  };

  const getAllMails = async (type, cancelToken) => {
    total = 0;

    if (type === "back") {
      page = page;
    } else {
      page = 1;
    }
    if (page <= 0) {
      page = 1;
    }

    logDataFunction("GET ALL MAIL", 0, 0);
    let baseUrl = GET_ALL_MAIL;
    let urlCurrent = `?limit=${limit}&pageNo=${page}`;
    let urlNext = `?limit=${limit}&pageNo=${page + 1}`;

    let totalCountURL = "?";
    for (const [key, value] of Object.entries(filterOptions)) {
      urlCurrent += `&${key}=${value}`;
      urlNext += `&${key}=${value}`;

      totalCountURL += `&${key}=${value}`;
    }

    // if (filterOptions.mail_action === "69") {
    //   logDataFunction("GET UNREAD MAIL", 0, 0);
    //   baseUrl = GET_UNREAD_MAIL;
    // }

    getTotalCount(totalCountURL, "", type);
    if (filterOptions.by_stations) {
      logDataFunction("STATION FILTER", 0, 0);
      baseUrl = GET_STATION_FILTER;
      updatingKeyForCall();
      setLoader(true);
      getAllMailsApiCall(baseUrl, urlCurrent, cancelToken);
    } else if (filterOptions.search_data) {
      logDataFunction("SEARCH FILTER", 0, 0);
      updatingKeyForCall();
      setLoader(true);
      getAllMailsApiCall(baseUrl, urlCurrent, cancelToken);
    } else if (filterOptions.folder) {
      logDataFunction("FOLDER FILTER", 0, 0);
      setLoader(true);
      getAllMailsApiCall(baseUrl, urlCurrent, cancelToken);
    } else if (keyForNextCall() === 0) {
      setLoader(true);
      setDisablePreviousNext((prev) => {
        return { ...prev, next: false };
      });

      await getAllMailsApiCall(baseUrl, urlCurrent, "", "current");
      await getAllMailsApiCall(baseUrl, urlNext, "", "next");

      setDisablePreviousNext((prev) => {
        return { ...prev, next: true };
      });
    } else if (type === "refresh") {
      setLoader(true);
      setDisablePreviousNext((prev) => {
        return { ...prev, next: false };
      });

      getAllMailsApiCall(baseUrl, urlCurrent, "", "current");
      await getAllMailsApiCall(baseUrl, urlNext, "", "next");
      setDisablePreviousNext((prev) => {
        return { ...prev, next: true };
      });
    }
  };

  const getNextClick = async () => {
    setLoader(true);
    const mailData = [];
    let nextPage = page + 1;

    logDataFunction("ALL MAIL ON NEXT CLICK", 0, 0);
    let baseUrl = GET_ALL_MAIL;
    let url = `?limit=${limit}&pageNo=${nextPage}`;
    let totalCountURL = "?";

    for (const [key, value] of Object.entries(filterOptions)) {
      url += `&${key}=${value}`;
      totalCountURL += `&${key}=${value}`;
    }

    if (filterOptions.is_crashed) url += "&is_crashed=0";
    if (filterOptions.by_stations) {
      logDataFunction("NEXT CLICK ON STATION FILTER", 0, 0);
      baseUrl = GET_STATION_FILTER;
    }

    getTotalCount(totalCountURL);
    const resp = await Api.ApiHandle(baseUrl + url, "", "GET");

    if (resp && resp.status === 1) {
      resp.data.data.map((inbox, i) => {
        const flags =
          designationId === inbox?.From?.id
            ? checkFlags(inbox.from_action)
            : checkFlags(inbox.mail_action);
        const obj = {
          id: inbox?.id,
          userMailId: inbox?.user_mail_id,
          mailAction: inbox.mail_action,
          sourceId: inbox?.Mail?.Source?.id,
          from: inbox?.Mail.Source?.designation,
          actualFormId: inbox?.From?.id,
          toBranch: inbox?.To?.branch,
          toDesignation: inbox?.To?.designation,
          branch: inbox?.Mail.Source?.branch,
          subject: inbox?.Mail.subject,
          op: inbox?.Mail.op,
          sentEnabled: inbox.sent_enabled,
          timeStamp: formatDateTime(inbox?.updatedAt),
          isReadEnabled: inbox?.is_read_enabled,
          from_id: inbox?.From?.id,
          fromAction: inbox?.from_action,
          fromIsReadEnabled: inbox?.from_read_enabled,
          fromIsRead: inbox?.from_is_read,
          comments_data: inbox.comments_data,
          To: inbox.To,

          attachment_ids: [inbox?.attachment_ids],
          umail_id: inbox.comments_data[0]?.umail_id,
        };
        if (inbox.Mail) {
          mailData.push({ ...obj, ...flags });
        }
      });
      // total = limit * page;
      // total = total > totalCount ? totalCount : total;

      setInboxMailData(mailData);
      let data = { key: "next", data: mailData };
      settingCache(data);

      setLoader(false);
    } else {
    }
  };

  const getNextClickCache = async () => {
    const ourRequest = Axios.CancelToken.source();
    page = page + 1;
    let totalCountURL = "?";
    logDataFunction("GET NEXT PAGE CACHE", 0, 0);
    let baseUrl =
      // filterOptions.mail_action === '69' ? GET_UNREAD_MAIL :
      GET_ALL_MAIL;
    let urlCurrent = `?limit=${limit}&pageNo=${page}`;
    let urlNext = `?limit=${limit}&pageNo=${page + 1}`;
    let urlPrevious =
      page === 1
        ? `?limit=${limit}&pageNo=${page}`
        : `?limit=${limit}&pageNo=${page - 1}`;

    for (const [key, value] of Object.entries(filterOptions)) {
      urlCurrent += `&${key}=${value}`;
      urlNext += `&${key}=${value}`;
      urlPrevious += `&${key}=${value}`;

      totalCountURL += `&${key}=${value}`;
    }
    if (filterOptions.by_stations) {
      logDataFunction("GET CACHE MAIL ON NEXT CLICK BY STATION FILTER", 0, 0);
      baseUrl = GET_STATION_FILTER;
    }
    getTotalCount(totalCountURL, "");
    let data1, data2;
    switch (props.isActiveModule) {
      case "Unread":
        data1 = { key: "previous", data: props.unreadCache.current };
        settingCache(data1);
        if (!(props.unreadCache.next.length === 0)) {
          data2 = { key: "current", data: props.unreadCache.next };
          settingCache(data2);
        }
        break;
      case "All":
        data1 = { key: "previous", data: props.allCache.current };
        settingCache(data1);
        if (!(props.allCache.next.length === 0)) {
          data2 = { key: "current", data: props.allCache.next };
          settingCache(data2);
        }
        break;
      case "Archive":
        data1 = { key: "previous", data: props.archiveCache.current };
        settingCache(data1);
        if (!(props.archiveCache.next.length === 0)) {
          data2 = { key: "current", data: props.archiveCache.next };
          settingCache(data2);
        }
        break;
      case "Sent":
        data1 = { key: "previous", data: props.sentCache.current };
        settingCache(data1);

        if (!(props.sentCache.next.length === 0)) {
          data2 = { key: "current", data: props.sentCache.next };
          settingCache(data2);
        }
        break;
      case "Crashed":
        data1 = { key: "previous", data: props.crashedCache.current };
        settingCache(data1);
        if (!(props.crashedCache.next.length === 0)) {
          data2 = { key: "current", data: props.crashedCache.next };
          settingCache(data2);
        }
        break;
      case "Starred":
        data1 = { key: "previous", data: props.starredCache.current };
        settingCache(data1);
        if (!(props.starredCache.next.length === 0)) {
          data2 = { key: "current", data: props.starredCache.next };
          settingCache(data2);
        }
        break;
      default:
        break;
    }

    if (
      typeof props.isActiveModule === "number" ||
      filterOptions.by_stations ||
      filterOptions.search_data
    ) {
      getAllMailsApiCall(baseUrl, urlCurrent, ourRequest.token);
    } else {
      setDisablePreviousNext((prev) => {
        return { ...prev, next: false };
      });

      await getAllMailsApiCall(baseUrl, urlNext, ourRequest.token, "next");
      setDisablePreviousNext((prev) => {
        return { ...prev, next: true };
      });
    }
    return true;
  };

  const getPreviousClickCache = async () => {
    // setCountMail(countmail - 1);
    const ourRequest = Axios.CancelToken.source();

    page = page - 1;
    let totalCountURL = "?";
    logDataFunction("GET PREVIOS PAGE CACHE", 0, 0);
    let baseUrl =
      // filterOptions.mail_action === '69' ? GET_UNREAD_MAIL :
      GET_ALL_MAIL;

    if (page <= 0) {
      page = 1;
    }

    let urlCurrent = `?limit=${limit}&pageNo=${page}`;
    let urlNext = `?limit=${limit}&pageNo=${page + 1}`;
    let urlPrevious =
      page === 1
        ? `?limit=${limit}&pageNo=${page}`
        : `?limit=${limit}&pageNo=${page - 1}`;
    for (const [key, value] of Object.entries(filterOptions)) {
      urlCurrent += `&${key}=${value}`;
      urlNext += `&${key}=${value}`;
      urlPrevious += `&${key}=${value}`;

      totalCountURL += `&${key}=${value}`;
    }
    if (filterOptions.by_stations) {
      logDataFunction(
        "GET CACHE MAIL ON PREVIOUS CLICK BY STATION FILTER",
        0,
        0
      );

      baseUrl = GET_STATION_FILTER;
    }
    getTotalCount(totalCountURL, "");
    let data1, data2;

    switch (props.isActiveModule) {
      case "Unread":
        data1 = { key: "current", data: props.unreadCache.previous };
        settingCache(data1);
        data2 = { key: "next", data: props.unreadCache.current };
        settingCache(data2);
        break;
      case "All":
        data1 = { key: "current", data: props.allCache.previous };
        settingCache(data1);
        data2 = { key: "next", data: props.allCache.current };
        settingCache(data2);
        break;
      case "Archive":
        data1 = { key: "current", data: props.archiveCache.previous };
        settingCache(data1);
        data2 = { key: "next", data: props.archiveCache.current };
        settingCache(data2);
        break;
      case "Sent":
        data1 = { key: "current", data: props.sentCache.previous };
        settingCache(data1);
        data2 = { key: "next", data: props.sentCache.current };
        settingCache(data2);
        break;
      case "Crashed":
        data1 = { key: "current", data: props.crashedCache.previous };
        settingCache(data1);
        data2 = { key: "next", data: props.crashedCache.current };
        settingCache(data2);
        break;
      case "Starred":
        data1 = { key: "current", data: props.starredCache.previous };
        settingCache(data1);
        data2 = { key: "next", data: props.starredCache.current };
        settingCache(data2);
        break;
      default:
        break;
    }

    if (
      typeof props.isActiveModule === "number" ||
      filterOptions.by_stations ||
      filterOptions.search_data
    ) {
      getAllMailsApiCall(baseUrl, urlCurrent, ourRequest.token);
    } else {
      setDisablePreviousNext((prev) => {
        return { ...prev, previous: false };
      });
      await getAllMailsApiCall(
        baseUrl,
        urlPrevious,
        ourRequest.token,
        "previous"
      );
      setDisablePreviousNext((prev) => {
        return { ...prev, previous: true };
      });
    }
  };

  const getPrevClick = async (e) => {
    if (e) {
      e.preventDefault();
    }
    setLoader(true);
    const mailData = [];

    let prevPage = page - 1;
    page = page - 1;

    if (page <= 0) {
      prevPage = 1;
      page = 1;
    }

    logDataFunction("ALL MAIL ON PREVIOUS CLICK", 0, 0);
    let baseUrl = GET_ALL_MAIL;
    let url = `?limit=${limit}&pageNo=${prevPage}`;
    let totalCountURL = "?";

    for (const [key, value] of Object.entries(filterOptions)) {
      url += `&${key}=${value}`;
      totalCountURL += `&${key}=${value}`;
    }

    if (filterOptions.is_crashed) url += "&is_crashed=0";
    if (filterOptions.by_stations) {
      logDataFunction("PREVIOUS CLICK ON STATION FILTER", 0, 0);
      baseUrl = GET_STATION_FILTER;
    }
    getTotalCount(totalCountURL);
    const resp = await Api.ApiHandle(baseUrl + url, "", "GET");

    if (resp && resp.status === 1) {
      resp.data.data.map((inbox, i) => {
        const flags =
          designationId === inbox?.From?.id
            ? checkFlags(inbox.from_action)
            : checkFlags(inbox.mail_action);
        const obj = {
          id: inbox?.id,
          userMailId: inbox?.user_mail_id,
          sourceId: inbox?.Mail?.Source?.id,
          mailAction: inbox.mail_action,
          from: inbox?.Mail.Source?.designation,
          actualFormId: inbox?.From?.id,
          toBranch: inbox?.To?.branch,
          toDesignation: inbox?.To?.designation,
          branch: inbox?.Mail.Source?.branch,
          subject: inbox?.Mail.subject,
          op: inbox?.Mail.op,
          sentEnabled: inbox.sent_enabled,
          timeStamp: formatDateTime(inbox?.updatedAt),
          isReadEnabled: inbox?.is_read_enabled,
          fromAction: inbox?.from_action,
          from_id: inbox?.From?.id,
          fromIsReadEnabled: inbox?.from_read_enabled,
          fromIsRead: inbox?.from_is_read,
          comments_data: inbox.comments_data,
          To: inbox.To,

          attachment_ids: [inbox?.attachment_ids],
          umail_id: inbox.comments_data[0]?.umail_id,
        };
        if (inbox.Mail) {
          mailData.push({ ...obj, ...flags });
        }
      });
      // total = limit * page;
      // total = total > totalCount ? totalCount : total;

      setInboxMailData(mailData);
      let data = { key: "previous", data: mailData };
      settingCache(data);

      setLoader(false);
    } else {
    }
  };

  const callAutoRefreshUnread = async (cancelToken) => {
    logDataFunction("REFRESH UNREAD MAIL", 0, 0);

    let urlCurrent = `${GET_ALL_MAIL}?limit=${limit}&pageNo=${page}`;
    let urlNext = `${GET_ALL_MAIL}?limit=${limit}&pageNo=${page + 1}`;
    setDisablePreviousNext((prev) => {
      return { ...prev, next: false };
    });

    await getAllMailsApiCall(urlCurrent, `&mail_action=69`, "", "current");
    await getAllMailsApiCall(urlNext, `&mail_action=69`, "", "next");
    setDisablePreviousNext((prev) => {
      return { ...prev, next: true };
    });

    getUnreadCount(cancelToken, "autoRefresh");
    getTotalCount(`?&mail_action=69`, cancelToken);
    props.updateAllCall(0);
    props.updateCrashedCall(0);
  };

  const callAutoRefreshAll = async (cancelToken) => {
    logDataFunction("REFRESH ALL", 0, 0);
    let urlCurrent = `${GET_ALL_MAIL}?limit=${limit}&pageNo=${page}`;
    let urlNext = `${GET_ALL_MAIL}?limit=${limit}&pageNo=${page + 1}`;
    setDisablePreviousNext((prev) => {
      return { ...prev, next: false };
    });

    await getAllMailsApiCall(urlCurrent, "", "", "current");
    await getAllMailsApiCall(urlNext, "", "", "next");
    setDisablePreviousNext((prev) => {
      return { ...prev, next: true };
    });

    getUnreadCount(cancelToken, "autoRefresh");
    getTotalCount(`?`, cancelToken);

    props.updateUnreadCall(0);
    props.updateCrashedCall(0);
  };

  const callAutoRefreshCrashed = async (cancelToken) => {
    logDataFunction("REFRESH CRASHED MAIL", 0, 0);
    let urlCurrent = `${GET_ALL_MAIL}?limit=${limit}&pageNo=${page}`;
    let urlNext = `${GET_ALL_MAIL}?limit=${limit}&pageNo=${page + 1}`;
    setDisablePreviousNext((prev) => {
      return { ...prev, next: false };
    });

    await getAllMailsApiCall(urlCurrent, "&mail_action=95", "", "current");
    await getAllMailsApiCall(urlNext, "&mail_action=95", "", "next");
    setDisablePreviousNext((prev) => {
      return { ...prev, next: true };
    });

    getUnreadCount(cancelToken, "autoRefresh");
    getTotalCount(`?&mail_action=95`, cancelToken);

    props.updateUnreadCall(0);
    props.updateAllCall(0);
  };

  const settingCache = (mailData) => {
    switch (props?.isActiveModule) {
      case "Unread":
        props.updateUnreadCache(mailData);
        break;
      case "Archive":
        props.updateArchiveCache(mailData);
        break;
      case "All":
        props?.updateAllCache(mailData);
        break;
      case "Sent":
        props.updateSentCache(mailData);
        break;
      case "Crashed":
        props.updateCrashedCache(mailData);
        break;
      case "Starred":
        props.updateStarredCache(mailData);
        break;

      default:
        break;
    }
  };

  const keyForNextCall = () => {
    switch (props?.isActiveModule) {
      case "Unread":
        logDataFunction("UNREAD", 0, 0);
        return props?.unreadCall;
      case "Archive":
        logDataFunction("ARCHIVE", 0, 0);
        return props?.archiveCall;
      case "All":
        logDataFunction("ALL", 0, 0);
        return props?.allCall;
      case "Sent":
        logDataFunction("SENT", 0, 0);
        return props?.sentCall;
      case "Crashed":
        logDataFunction("CRASHED", 0, 0);
        return props?.crashedCall;
      case "Starred":
        logDataFunction("STARRED", 0, 0);
        return props?.starredCall;

      default:
        return 0;
    }
  };

  const updateKeyForNextCall = () => {
    switch (props?.isActiveModule) {
      case "Unread":
        props.unreadCall === 0
          ? props.updateUnreadCall(1)
          : props?.updateUnreadCall(0);
        break;
      case "Archive":
        props?.archiveCall === 0
          ? props?.updateArchiveCall(1)
          : props?.updateArchiveCall(0);
        break;
      case "All":
        props?.allCall === 0
          ? props?.updateAllCall(1)
          : props?.updateAllCall(0);
        break;
      case "Sent":
        props?.sentCall === 0
          ? props?.updateSentCall(1)
          : props?.updateSentCall(0);
        break;
      case "Crashed":
        props?.crashedCall === 0
          ? props?.updateCrashedCall(1)
          : props?.updateCrashedCall(0);
        break;
      case "Starred":
        props?.starredCall === 0
          ? props?.updateStarredCall(1)
          : props?.updateStarredCall(0);
        break;

      default:
        break;
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
      case "89":
        flags = updateFlagsState(false, false, false);
        break;
      case "88":
        flags = updateFlagsState(true, false, false);
        break;
      case "86":
        flags = updateFlagsState(false, false, true);
      case "87":
        flags = updateFlagsState(true, false, true);
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
      setSelectedUserMailId(inbox.userMailId);
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
    if (filterOptions.is_sent !== 1) {
      if (designationId === inbox?.from_id) {
        if (UNREAD_CONSTANTS_VALUES.includes(inbox.fromAction)) {
          props.unreadMailsCount === 0
            ? props.updateUnreadMailsCount(0)
            : props.updateUnreadMailsCount(props.unreadMailsCount - 1);
        }
      } else {
        if (UNREAD_CONSTANTS_VALUES.includes(inbox.mailAction)) {
          props.unreadMailsCount === 0
            ? props.updateUnreadMailsCount(0)
            : props.updateUnreadMailsCount(props.unreadMailsCount - 1);
        }
      }
    }

    let params = {};

    if (filterOptions.is_sent !== 1) {
      if (
        UNREAD_CONSTANTS_VALUES.includes(inbox.fromAction) &&
        designationId === inbox.actualFormId
      ) {
        params = createParams(inbox.fromAction, "mail_action");

        callUpdateApi(
          params,
          inbox.id,
          designationId,
          inbox.actualFormId,
          inbox
        );
      }

      if (
        UNREAD_CONSTANTS_VALUES.includes(inbox.mailAction) &&
        designationId !== inbox.actualFormId
      ) {
        params = createParams(inbox.mailAction, "mail_action");

        callUpdateApi(
          params,
          inbox.id,
          designationId,
          inbox.actualFormId,
          inbox
        );
      }
    }
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

  const updateActions = (action) => {
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

  const callUpdateApi = (params, id, designationId, actualFormId, mailData) => {
    logDataFunction("UPDATE ON STARRED", id, 0);
    if (Object.keys(params).length > 0) {
      params.is_read_mail = 1;

      params.commentData = {};
      params.userMailId = mailData.userMailId;

      if (mailData && mailData.comments_data.length > 0) {
        params.commentData = {
          umail_id: mailData.comments_data[0].umail_id,
          user_mail_id: mailData.comments_data[0].user_mail_id,
        };
      }

      updateCacheState(mailData);
      Api.ApiHandle(`${UPDATE_MAIL_BY_ID}/${id}`, params, "put", logData);

      params.action_type = 1;
      Api.ApiHandle(`/api/mails/updateById/${id}`, params, "put", logData);
    }
  };

  const createParams = (action, key) => {
    // if (inbox && inbox.id == currentId) action = inbox.mailAction;

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
      case "86":
        params[key] = "87";
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

  const getTotalCount = async (totalCountURL, cancelToken) => {
    logDataFunction("MAIL TOTAL COUNT", 0, 0);
    setIsLoadingForCount(true);
    const resp = await Api.ApiHandle(
      // filterOptions.mail_action === '69'
      //   ? GET_TOTAL_UNREAD_MAIL_COUNT + totalCountURL
      //   :
      GET_TOTAL_MAIL_COUNT + totalCountURL,
      "",
      "GET",
      logData,
      cancelToken
    );
    let total = 0;
    if (resp && resp.status) {
      if (page !== 1) {
        total = limit * page;
      } else {
        total = limit;
      }
      if (total > resp.data) {
        total = resp.data;
      } else {
        total = total > inboxMailData.length ? total : inboxMailData.length;
      }

      setCurrentCount(total);
      setNoOfMails(resp.data);
      setIsLoadingForCount(false);

      return resp.data;
    } else {
      setIsLoadingForCount(false);
    }
  };

  const openComposeModel = () => setVisiable(true);

  const closeComposeModel = () => setVisiable(false);

  return (
    <>
      <div className="nk-app-root">
        {/* next component */}
        <HelpModal />
        <div className="nk-main ">
          <div className="nk-wrap ">
            <Navbar
              autoRefreshIntervalUnread={autoRefreshIntervalUnread}
              autoRefreshIntervalAll={autoRefreshIntervalAll}
              autoRefreshIntervalCrashed={autoRefreshIntervalCrashed}
              setSwitchUser={setSwitchUser}
              setFilterOptions={setFilterOptions}
              setActiveModule={setActiveModule}
            />
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
                      page={page}
                      openComposeModel={openComposeModel}
                      isAction={isAction}
                      setIsAction={setIsAction}
                      loader={loader}
                      isFolderLoaderId={isFolderLoaderId}
                      isMailAddedToFolder={isMailAddedToFolder}
                      setIsMailAddedToFolder={setIsMailAddedToFolder}
                      setLoader={setLoader}
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
                          getNextClick={getNextClickCache}
                          getPrevClick={getPreviousClickCache}
                          total={currentCount}
                          setFilterOptions={setFilterOptions}
                          filterOptions={filterOptions}
                          userData={props.userData}
                          selectedStation={selectedStation}
                          setSelectedstation={setSelectedstation}
                          stationTag={stationTag}
                          setStationTag={setStationTag}
                          loader={loader}
                          setLoader={setLoader}
                          setMailIds={setMailIds}
                          setUniqueMailId={setUniqueMailId}
                          isLoadingForCount={isLoadingForCount}
                          page={page}
                          currentMailData={currentMailData}
                          disablePreviousNext={disablePreviousNext}
                          keyForNextCall={keyForNextCall}
                          setCountMail={setCountMail}
                          setClicked={setClicked}
                          setPrevCacheClicked={setPrevCacheClicked}
                          backButton={backButton}
                          isAction={isAction}
                          setIsFolderLoaderId={setIsFolderLoaderId}
                          setIsMailAddedToFolder={setIsMailAddedToFolder}
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
                          currentMailData={currentMailData}
                          selectedUserMailId={selectedUserMailId}
                          getNextClick={getNextClickCache}
                          getPrevClick={getPreviousClickCache}
                          disablePreviousNext={props?.disablePreviousNext}
                          loader={loader}
                          setLoader={setLoader}
                          total={props.total}
                          page={page}
                          noOfMails={noOfMails}
                          countmail={countmail}
                          setCountMail={setCountMail}
                          dataNextPrevClick={dataNextPrevClick}
                          setNextClick={setNextClick}
                          clicked={clicked}
                          setClicked={setClicked}
                          prevCacheClicked={prevCacheClicked}
                          setPrevCacheClicked={setPrevCacheClicked}
                          setBackButton={setBackButton}
                          setIsAction={setIsAction}
                          setIsMailAddedToFolder={setIsMailAddedToFolder}
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

const mapActionToProps = {
  updateUnreadMailsCount,
  updateUserData,
  updateSwitching,
  updateUnreadCache,
  updateUnreadCall,
  updateArchiveCache,
  updateArchiveCall,
  updateSeachText,
  updateAllCache,
  updateAllCall,
  updateSentCache,
  updateSentCall,
  updateStarredCache,
  updateStarredCall,
  updateCrashedCache,
  updateCrashedCall,
  updateActiveModule,
  updateFolderCachedData,
  updateMostFrequent,
};

const mapStateToProps = (state) => ({
  unreadMailsCount: state.unreadMailsCount,
  userData: state.userData,
  stationList: state.stationList,
  isActiveModule: state.isActiveModule,
  switching: state.switching,
  unreadCall: state.unreadCall,
  archiveCall: state.archiveCall,
  allCall: state.allCall,
  sentCall: state.sentCall,
  starredCall: state.starredCall,
  sentCache: state.sentCache,
  starredCache: state.starredCache,
  crashedCache: state.crashedCache,
  crashedCall: state.crashedCall,
  unreadCache: state.unreadCache,
  archiveCache: state.archiveCache,
  allCache: state.allCache,
  folderCachedData: state.folderCachedData,
});

export default connect(mapStateToProps, mapActionToProps)(Mailbox);
