import React, { useState, useEffect, useRef, useMemo } from "react";
import { connect } from "react-redux";
import { Spinner, ProgressBar } from "react-bootstrap";
import Commentbox from "../Commentbox";
import * as Api from "../../util/api/ApicallModule";
import {
  GET_MAIL_BY_ID,
  UPDATE_MAIL_BY_ID,
  COMMENT_ON_MAIL,
  GET_PRE_DEFINED_COMMENTS,
  FREQUENT_ADDRESSES,
  GET_COMMENTS,
  ANNOTATION_ADD,
  GET_ATTACHMENT_DETAILS,
  UNLINK_ATTACHMENT,
  GET_MAIL_FOLDERS,
  DOWNLOAD_ALL,
} from "../../config/constants";
import Axios from "axios";
import fileDownload from "js-file-download";
import { formatDateTime } from "../../util/dateFormat/DateFormat";
import MailBody from "./MailBody";
import Loading from "../../util/loader/Loading";
import Toaster from "../../util/toaster/Toaster";
import PrintView from "../../components/print/printView";
import Track from "../../components/common/track";
import { renderImage } from "../../components/common/renderImage";
import MailMarginComments from "../mailview/MailMarginComments";
import { PostHighlight } from "../../components/common/annotation";
import DocView from "./DocView";
import Topreplaybuttons from "../Topreplaybuttons";
import AddAttachment from "./AddAttachment";
import ComposeTo from "../../components/common/compose_to";
import { INGESTED_CONST_VALUES } from "../../util";
import {
  updateSentCall,
  updateUnreadCall,
  updateArchiveCall,
  updateAllCall,
  updateCrashedCall,
  updateStarredCall,
  updateAddToFolderCache,
  updateFolderCachedData,
} from "../../redux/action/InboxAction";
import { LogApi } from "../../util/apiLog/LogApi";
import Loader from "react-loader-spinner";
import ReactToPrint from "react-to-print";
const fileExtensionNames = [
  "png",
  "jpeg",
  "jpg",
  "bmp",
  "html",
  "xml",
  "mht",
  "pdf",
  "txt",
  "ogg",
  "gif",
  "mp3",
];

const docExtension = ["doc", "docx", "DOC", "DOCX", "rtf", "RTF"];

let windowDoc;
const MailView = ({
  setActiveModule,
  mailIds,
  uniqueMailId,
  setUniqueMailId,
  checkFlags,
  total,
  disablePreviousNext,
  getPrevClick,
  page,
  noOfMails,
  ...props
}) => {
  const commentBoxRef = useRef();
  const topRef = useRef();
  const folderNode = useRef();

  const [open, setOpen] = useState("close");
  const [isTrack, setisTrack] = useState(false);
  const [inputCommentData, setInputCommentData] = useState("");
  const [mailData, setMailData] = useState({});
  const [preDefinedComments, setPreDefinedComments] = useState([]);
  const [annotationText, setAnnotationText] = useState();
  const [openPrintcall, setopenPrintcall] = useState(false);
  const [generalCommentData, setGeneralCommentData] = useState([]);
  const [openFolderList, setOpenFolderList] = useState(false);
  const [recentCommentid, setRecentCommentid] = useState("");
  const [to, setTo] = useState([]);
  const [commonAddresses, setCommonAddresses] = useState([]);
  const [showAnnotationButtons, setshowAnnotationButtons] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedAnnotation, setselectedAnnotation] = useState([]);
  const [marginNotesStatic, setmarginNotesStatic] = useState("");
  const [marginButtonStatic, setmarginButtonStatic] = useState("");
  const [usercolorcodeObj, setusercolorcodeObj] = useState({});
  const [color, setColor] = useState("");
  const [colorID, setColorID] = useState("");
  const [beforeSelectedAnnotation, setBeforeSelectedAnnotation] = useState("");
  const [annotationDataForPrint, setAnnotationDataForPrint] = useState();
  const [startChar, setStartChar] = useState("");
  const [endChar, setEndChar] = useState("");
  const [disableSendButton, setDisableSendButton] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [spinner, setSpinner] = useState({ bool: false, id: 0 });
  const [toggleStar, setToggleStar] = useState(null);
  const [replyDesignation, setReplyDesignation] = useState({});
  const [fileUploading, setFileUploading] = useState(false);
  const [actualFrequentAddress, setActualFrequentAddress] = useState([]);
  const [designationId, setDesignationId] = useState(0);
  const [attachmentName, setAttachmentName] = useState("");
  const [attachment, setattachment] = useState([]);

  const [designationList, setDesignationList] = useState([]);
  const [bodyData, setBodyData] = useState("");
  const [viewDocument, setViewDocument] = useState(false);
  const [maildIdForComment, setMaildIdForComment] = useState("");
  const [folderData, setFolderData] = useState([]);
  const [allCommonAddresses, setAllCommonAddresses] = useState([]);
  const [blankTo, setBlankTo] = useState(false);
  const [apiFolderId, setApiFolderId] = useState();
  const [nextDisabled, setNextDisabled] = useState(false);
  const [prevDisabled, setPrevDisabled] = useState(false);
  const limit = parseInt(localStorage.getItem("limit"));
  const [callApi, setCallApi] = useState(false);

  const [logAttachId, setLogAttacheId] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [folderClicked, setFolderClicked] = useState(false);
  const [id, setId] = useState();
  let attachId = [];
  let logData = {};
  const logDataFunction = (type, mail_id, attachId) => {
    logData = {
      type: type,
      mail_id: mail_id,
      attach_id: attachId,
    };
  };
  const loadIframe = () => {
    setTimeout(() => {
      windowDoc =
        document?.getElementById("iframeResult")?.contentWindow?.window;
    }, 1000);
  };

  useEffect(() => {
    setReplyDesignation(setReplyButton(generalCommentData));
  }, [generalCommentData]);

  useEffect(() => {
    props.setBackButton(false);
    props.setIsAction(false);
    // add when mounted
    document.addEventListener("mousedown", handleOpenFolderList);
    // return function to be called when unmounted
    return () => {
      document.removeEventListener("mousedown", handleOpenFolderList);
    };
  }, []);

  useEffect(() => {
    const index = parseInt(localStorage.getItem("indexing"));
    const pageLimit = parseInt(localStorage.getItem("limit"));
    // const pageLimit = 20;
    if (page === 1) {
      props.setCountMail(index);
      return;
    }
    if (index + 1 === pageLimit) {
      props.setCountMail(page * (index + 1) - 1);
      return;
    } else {
      props.setCountMail(limit * (page - 1) + index);
      return;
    }
  }, []);

  const handleOpenFolderList = (event, value) => {
    if (
      folderNode &&
      folderNode.current &&
      !folderNode.current.contains(event.target)
    ) {
      setOpenFolderList(false);
    } else {
      if (value === 1) {
        if (openFolderList) setOpenFolderList(false);
        else setOpenFolderList(true);
      }
    }
  };

  useEffect(() => {
    if (props?.mailId) {
      getMail(props?.mailId);
      getFrequentAddresses();
    }
  }, [props.mailId]);

  useEffect(() => {
    if (props.selectedUserMailId) getForlderByMailId(props.selectedUserMailId);
  }, [props.selectedUserMailId]);

  useEffect(() => {
    if (maildIdForComment) getCommentData();
  }, [maildIdForComment]);

  useEffect(() => {
    loadIframe();
    getPreDefinedComments();

    window.addEventListener("scroll", handleScroll, true);
  }, []);

  useEffect(async () => {
    setBeforeSelectedAnnotation("");
    if (open === "delete") {
      setMailData({});
      await getMail(props?.mailId);
      loadIframe();
    }
  }, [open]);

  // useEffect(() => {}, [props.clicked, props.currentMailData]);

  useEffect(() => {
    annotationData();
  }, [annotationDataForPrint]);

  useEffect(() => {
    let designationId;
    if (props && props.userData && props.userData.designations)
      designationId = props?.userData?.designations.filter((item) => {
        if (item.default_desig) return item;
      })[0].id;

    setDesignationId(designationId);
  }, [props?.userData]);

  const typeCheck = (type, params, inbox) => {
    type === "from" ? (inbox.fromAction = params) : (inbox.mailAction = params);
  };

  const toggleStarred = async () => {
    props.setIsAction(true);
    const designationId = props?.userData?.designations.filter((item) => {
      if (item.default_desig) return item;
    })[0].id;
    let params = "";
    let action = "";
    let type = "";
    if (designationId === mailData?.fromId) {
      action = mailData?.fromAction;
      type = "from";
    } else {
      action = mailData?.mailAction;
      type = "to";
    }

    setToggleStar((toggleStar) => !toggleStar);
    logDataFunction(toggleStar ? "UNSTARRED" : "STARRED", mailData.id, 0);
    switch (action) {
      case "99":
        params = "96";

        break;
      case "98":
        params = "96";
        break;
      case "97":
        params = "98";
        break;
      case "96":
        params = "98";
        break;
      case "89":
        params = "87";
        break;
      case "88":
        params = "87";
        break;
      case "87":
        params = "88";
        break;
      case "86":
        params = "88";
        break;
      case "79":
        params = "68";
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

      case "99":
        params = "98";

        break;
      case "97":
        params = "96";

        break;

      case "89":
        params = "88";

        break;

      case "86":
        params = "87";

        break;

      case "79":
        params = "78";

        break;
    }
    typeCheck(type, params, mailData);

    switch (props.isActiveModule) {
      case "Unread":
        props.updateAllCall(0);
        props.updateCrashedCall(0);
        props.updateStarredCall(0);
        props.updateUnreadCall(0);

        break;
      case "Archive":
        props.updateAllCall(0);
        props.updateCrashedCall(0);
        props.updateStarredCall(0);
        props.updateArchiveCall(0);
        break;
      case "All":
        props.updateAllCall(0);
        props.updateCrashedCall(0);
        props.updateStarredCall(0);
        props.updateUnreadCall(0);
        props.updateArchiveCall(0);

        break;
      case "Crashed":
        props.updateAllCall(0);
        props.updateStarredCall(0);
        props.updateUnreadCall(0);
        props.updateCrashedCall(0);
        break;
      case "Starred":
        props.updateAllCall(0);
        props.updateCrashedCall(0);
        props.updateStarredCall(0);
        props.updateUnreadCall(0);
        props.updateArchiveCall(0);
        break;
      default:
        break;
    }

    await updateMail({ mail_action: params, action_type: 1 });
  };

  useEffect(() => {
    annotationData();
  }, [annotationDataForPrint]);

  const annotationData = () => {
    var obj = {};
    annotationDataForPrint?.map((ann, i) => {
      if (!obj.hasOwnProperty(ann?.anno_text)) {
        obj[`${ann?.anno_text}`] = [ann];
      } else {
        let ann_array = obj[`${ann?.anno_text}`];
        ann_array.push(ann);
        obj[`${ann?.anno_text}`] = ann_array;
      }
    });
    setAnnotationText(obj);
  };

  const handleScroll = function (event) {
    if (document.getElementsByTagName("iframe").length > 0) {
      let iframeheight =
        document.getElementsByTagName("iframe")[0].offsetHeight;
      if (event.target.classList.length > 1) {
        if (
          event.target.scrollTop > 320 &&
          event.target.scrollTop < iframeheight + 320
        ) {
          setmarginNotesStatic("marginNotesStatic");
          setmarginButtonStatic("marginButtonStatic");
        } else {
          setmarginNotesStatic("");
          setmarginButtonStatic("");
        }
      }
    }
  };

  const getMail = async (mailId) => {
    const designationId = props?.userData?.designations.filter((item) => {
      if (item.default_desig) return item;
    })[0].id;
    logDataFunction("GET MAIL", mailId, 0);

    const resp = await Api.ApiHandle(
      `${GET_MAIL_BY_ID}/${mailId}`,
      "",

      "GET",
      logData
    );
    if (resp?.status === 1) {
      let flags =
        designationId === resp?.data?.From?.id
          ? checkFlags(resp?.data?.from_action)
          : checkFlags(resp?.data?.mail_action);
      let data = {
        id: resp?.data?.id,
        userMailId: resp?.data?.user_mail_id,
        mailAction: resp?.data?.mail_action,
        fromAction: resp?.data?.from_action,
        toId: resp?.data?.To?.id,
        to: resp?.data?.To?.designation,
        toBranch: resp?.data?.To?.branch,
        from: resp?.data?.From?.designation,
        fromId: resp?.data?.From?.id,
        branch: resp?.data?.From?.branch,
        sourceId: resp?.data?.Mail?.Source?.id,
        sourceBranch: resp?.data?.Mail?.Source?.branch,
        sourceDesignation: resp?.data?.Mail?.Source?.designation,
        op: resp?.data?.Mail?.op,
        subject: resp?.data?.Mail?.subject,
        createdAt: formatDateTime(resp?.data?.Mail?.createdAt),
        folders: resp?.data?.Folder,
        body: resp?.bodyData?.body,
        // isStarred: resp.data?.is_starred,
        // isCrashed: resp.data?.is_crashed,
        attachmentList: resp?.attachmentData,
        documentId: resp?.data?.Mail?.document_id,
        actualFormId: resp?.data?.From?.id,
        ToFolder: resp?.data?.ToFolder,
        FromFolder: resp?.data?.FromFolder,
        // FirstName: resp?.data?.Mail.Source.designations?.first_name,
      };

      setLogAttacheId(data.attachmentList);

      data = { ...data, ...flags };
      data.isStarred ? setToggleStar(true) : setToggleStar(false);
      setMaildIdForComment(data?.userMailId);
      setMailData(data);

      setNextDisabled(false);
      setPrevDisabled(false);
      renderImage(data.body).then((res) => {
        data.body = res;
        setMailData(data);
        setopenPrintcall(false);
      });
    }
  };

  const getCommentData = async () => {
    let _commentData = [];
    logDataFunction("GET COMMENT ON MAIL", 0, 0);
    const resp = await Api.ApiHandle(
      `${GET_COMMENTS}/${maildIdForComment}`,
      "",
      "GET",
      logData
    );
    if (resp?.status === 1) {
      resp?.data?.map((comment) => {
        const comments = {
          id: comment?.id,
          fromDesignationName: comment?.From?.designation,
          fromBranchName: comment?.From?.branch,
          toId: comment?.To?.id,
          fromId: comment?.From?.id,
          toDesignationName: comment?.To?.designation,
          toBranchName: comment?.To?.branch,
          commentData: comment?.comment,
          updatedTime: comment?.updatedAt,
          createdTime: comment?.createdAt,
          attachmentList: comment?.Attachments,
        };
        _commentData.push(comments);
      });

      setGeneralCommentData(_commentData);
    } else {
      Toaster("error", "Some Error Occured while getting comments");
    }
  };

  const handleSelectFolder = async (folder) => {
    setFolderClicked(true);
    props?.setIsMailAddedToFolder(true);
    setIsLoading(true);
    if (props?.folderCachedData) {
      if (props?.folderCachedData[`'${folder.apiFolderId}'`] !== undefined) {
        props?.updateAddToFolderCache(
          props?.folderCachedData[`'${folder.apiFolderId}'`]
        );
      }
    }

    setFolderData((prev) => [
      ...prev,
      {
        id: folder.apiFolderId,
        name: folder.apiFolderName,
        text: folder.apiColorCode,
      },
    ]);

    let str;
    let folderIds = [];
    folderData.forEach((element) => {
      folderIds.push(element.id);
    });
    folderIds.push(folder.apiFolderId);
    str = folderIds.join(",");
    logDataFunction("SELECT FOLDER", 0, 0);

    await updateMail({ folder: str, action_type: 0 });

    await getMail(props?.mailId);
  };

  const updateMail = async (payload) => {
    setIsLoading(true);
    props?.setLoader(true);
    payload.userMailId = mailData.userMailId;
    // await Api.ApiHandle(
    //   `${UPDATE_MAIL_BY_ID}/${mailIds}`,
    //   payload,
    //   "put",
    //   logData
    // );
    const resp = await Api.ApiHandle(
      `/api/mails/updateById/${mailIds}`,
      payload,
      "put",
      logData
    );

    if (resp && resp.status === 1) {
      props?.setLoader(false);
      setFolderData(resp.data);
      setIsLoading(false);
      setFolderClicked(false);
    }
    // if (resp?.status === 1) {
    //   setIsLoading(true);
    //   setFolderClicked(false);
    //   setCallApi(true);
    // }
  };

  const handleDeleteSelectedFolder = async (id) => {
    setFolderClicked(false);
    props?.setIsAction(true);
    setId(id);
    let str;
    let folderIds = [];
    folderData.forEach((element) => {
      if (element.id !== id) {
        folderIds.push(element.id);
      }
    });
    folderIds.length > 0 ? (str = folderIds.join(",")) : (str = null);

    logDataFunction("DELETE SELECTED FOLDER", 0, 0);
    await updateMail({ folder: str, action_type: 0 });
    await getMail(props?.mailId);
  };

  const handleHistory = () => {
    setisTrack(true);
  };

  const handleTrackCloseModal = () => {
    setisTrack(false);
  };

  const handleTrackOpenModal = () => {
    setisTrack(true);
  };

  const logprint = () => {
    let attachment = [];

    setopenPrintcall(true);
    getMail(props?.mailId);

    attachment = logAttachId.map((attachment) => {
      return attachment.id;
    });

    logDataFunction("PRINT", props?.mailId, attachment);
    LogApi(logData);
  };

  const backButton = () => {
    props.getAllMails("back");
    props.setBackButton(true);
    setActiveModule("inbox");
  };

  const handleInputCommentData = (e) => {
    setInputCommentData(e.target.value);
  };

  const handleToData = (selected, unselected) => {
    setTo(selected);

    if (selected.length > 0) {
      if (unselected.hasOwnProperty("removedValue")) {
        const deselectedFrequentAddress = actualFrequentAddress.filter(
          (item) => {
            if (item.id === unselected.removedValue.id) return item;
          }
        );

        setCommonAddresses((prev) => [...prev, ...deselectedFrequentAddress]);
      } else {
        setCommonAddresses(
          commonAddresses.filter(
            (item) => item?.id !== selected[selected.length - 1].id
          )
        );
      }
    } else setCommonAddresses(actualFrequentAddress);
  };

  const handleSendComment = async () => {
    let immediateReply = setReplyButton(generalCommentData);
    if (to.length <= 0) {
      Toaster("error", "To Recipient is required ");
      setDisableSendButton(true);
      setTimeout(() => {
        setDisableSendButton(false);
      }, 3000);
    } else {
      setDisableSendButton(true);

      let attachmentIds = [];
      to?.forEach(async (toID) => {
        let payload = {
          to: toID.id,
          user_mail_id: props?.mailId,
          from_action: mailData.fromAction,
          mail_action: mailData.mailAction,
          mail_id: mailData.userMailId,
        };

        if (toID?.id === immediateReply.id) {
          payload.action = "Reply";
        } else {
          payload.action = "Forward";
        }

        inputCommentData !== "" && (payload.comment = inputCommentData);
        if (attachment?.length > 0) {
          attachment?.forEach((item) => {
            attachmentIds.push(item?.id);
          });

          payload.attachmentIds = attachmentIds;
          sendCommentApi(toID, payload);
        } else {
          sendCommentApi(toID, payload);
        }
      });
      setTo([]);
      setBlankTo(true);
      setattachment([]);

      if (
        props?.currentMailData?.length > 1 &&
        props.filterOptions?.mail_action === "69"
      )
        if (
          props?.filterOptions?.is_sent !== 1 &&
          !props?.filterOptions?.by_stations &&
          !props?.filterOptions.search_data
        ) {
          openNextMail();
        }
    }
  };

  const sendCommentApi = async (toID, payload) => {
    logDataFunction("COMMENT", 0, 0);
    const resp = await Api.ApiHandle(
      `${COMMENT_ON_MAIL}`,
      payload,
      "POST",
      logData
    );

    if (resp.status !== 1) {
      Toaster("error", "Some error occurred");
      setDisableSendButton(false);
    } else {
      setInputCommentData("");
      Toaster(
        "success",
        `Message sent successfully to ${toID?.designation}(${toID?.branch}) `
      );
      setDisableSendButton(false);
      setTo([]);
      setBlankTo(false);
      topRef?.current?.scrollIntoView({ behavior: "smooth" });
      props.updateSentCall(0);
      setRecentCommentid(inputCommentData);
      if (props.isActiveModule === "Unread") {
        if (
          props.countmail + 1 === noOfMails ||
          props.countmail + 1 === page * limit
        ) {
          return;
        }
        return props.countmail + 1 < noOfMails
          ? props.setCountMail((prev) => prev + 1)
          : props.setCountMail(noOfMails);
      }
    }
  };

  const openNextMail = () => {
    let index = 0;
    props?.currentMailData?.every((mail, i) => {
      if (mail.id === props.mailId) {
        index = i + 1;
        return false;
      }

      return true;
    });
    if (index !== props?.currentMailData?.length) {
      setUniqueMailId(props?.currentMailData[index]?.userMailId);
      props?.getMailId(props?.currentMailData[index]);
      localStorage.setItem("indexing", index);
    }
  };
  const openPrevMail = () => {
    const indexing = parseInt(localStorage.getItem("indexing"));
    if (indexing === 0) {
      setUniqueMailId(props?.currentMailData[limit - 1]?.userMailId);
      props.getMailId(props?.currentMailData[limit - 1]);
      localStorage.setItem("indexing", 14);
      return;
    } else {
      let newIndex = indexing - 1;
      setUniqueMailId(props?.currentMailData[newIndex]?.userMailId);
      props.getMailId(props?.currentMailData[newIndex]);
      localStorage.setItem("indexing", newIndex);
    }
  };

  useMemo(() => {
    if (props.countmail === (page - 1) * limit && props.clicked) {
      props.setClicked(false);
      openNextMail();
      return;
    }
  }, [props.clicked]);

  useMemo(() => {
    if (props.countmail + 1 === page * limit && props.prevCacheClicked) {
      props.setPrevCacheClicked(false);
      openPrevMail();
      return;
    }
  }, [props.prevCacheClicked]);

  useMemo(() => {
    if (props?.countmail - 1 === page * limit && props?.prevCacheClicked) {
      openPrevMail();
      props?.setPrevCacheClicked(false);
      return;
    }
  }, [props.prevCacheClicked]);

  const getPrevOnClick = async () => {
    if (props?.countmail + 1 <= 1 || prevDisabled) {
      return;
    }
    props?.setCountMail((prev) => prev - 1);

    if (props?.countmail === (page - 1) * limit) {
      props?.setPrevCacheClicked(true);
      getPrevClick();
      return;
    } else {
      openPrevMail();
      return;
    }
  };
  const getNextOnClick = async () => {
    if (props.countmail + 1 === noOfMails || nextDisabled) {
      return;
    }
    props?.setCountMail((prev) => prev + 1);
    if (props?.countmail + 1 === page * limit) {
      props?.setClicked(true);
      await props?.getNextClick();
      return;
    } else {
      openNextMail();
      return;
    }
  };

  const handlePreDefinedComment = (com) => {
    if (inputCommentData === "") {
      setInputCommentData(`${com}`);
    } else if (inputCommentData.charAt(inputCommentData.length - 1) === "\n") {
      setInputCommentData(`${inputCommentData}${com} `);
    } else {
      setInputCommentData(`${inputCommentData}, ${com} `);
    }
  };

  const getPreDefinedComments = async () => {
    logDataFunction("GET PRE-DEFINED COMMENT", 0, 0);
    const resp = await Api.ApiHandle(
      `${GET_PRE_DEFINED_COMMENTS}`,
      "",
      "GET",
      logData
    );

    if (resp?.status === 1) {
      const _preDefinedComments = [];
      resp?.data?.map((com) => {
        const comments = {
          comments: com.content,
        };
        _preDefinedComments.push(comments);
      });

      setPreDefinedComments(_preDefinedComments);
    }
  };

  const getFrequentAddresses = async () => {
    const designation = props?.userData?.designations.filter((item) => {
      if (item.default_desig) return item;
    });

    logDataFunction("LIST OF FREQUENT ADDRESSES", 0, 0);
    const resp = await Api.ApiHandle(
      `${FREQUENT_ADDRESSES}?type=${props?.isMostFrequent}`,
      "",
      "GET",
      logData
    );

    if (resp?.status === 1) {
      const _commonAddresses = [];
      resp?.data?.map((com) => {
        if (designation.designation !== com?.designation) {
          const common = {
            id: com?.id,
            branch: com?.branch,
            designation: com?.designation,
            belongsTo: "commonAddresses",
            // first_name: com?.first_name,
          };
          _commonAddresses.push(common);
        }
      });

      setActualFrequentAddress(_commonAddresses);
      setCommonAddresses(_commonAddresses);
      setAllCommonAddresses(_commonAddresses);
    }
  };

  const handleFrequentAddresses = (common, id) => {
    setTo((prev) => [...prev, common]);
    setCommonAddresses(commonAddresses.filter((item) => item?.id !== id));
  };

  const downlaodAttachment = (attachements) => {
    setSpinner({ bool: true, id: attachements.id });
    if (attachements?.url.includes("http://" || "https://")) {
      let url = "";
      if (attachements.host == null) {
        url = attachements.url;
      } else {
        url = attachements.host + attachements.url;
      }

      logDataFunction("DOWNLOAD ATTACHMENT", props.mailId, [attachements.id]);
      let apiurl = `${process.env.REACT_APP_BASE_API_URL}/api/attachment/download/${attachements.id}`;
      let name = url.split("/");
      let headers = {};

      if (localStorage.getItem("auth")) {
        headers.Authorization = `Bearer ${localStorage.getItem("auth")}`;
      }
      LogApi(logData);
      Axios.get(apiurl, { responseType: "blob", headers: headers }, "")
        .then(async (res) => {
          fileDownload(res.data, name[name.length - 1]);
          setSpinner(false);
        })
        .catch(function (error) {
          Toaster("error", error.message);
          setSpinner(false);
        });
    } else {
      logDataFunction("DOWNLOAD ATTACHMENT", props.mailId, [attachements.id]);
      let apiurl = `${process.env.REACT_APP_BASE_API_URL}/api/attachment/downloadfile/${attachements.id}`;
      let headers = {};

      if (localStorage.getItem("auth")) {
        headers.Authorization = `Bearer ${localStorage.getItem("auth")}`;
      }

      LogApi(logData);
      Axios.get(apiurl, { responseType: "blob", headers: headers }, "")
        .then(async (res) => {
          fileDownload(res.data, attachements?.name);
          setSpinner(false);
        })
        .catch(function (error) {
          Toaster("error", error.message);
          setSpinner(false);
        });
    }
  };

  const handleDownloadAll = async (attachementId) => {
    let attachId = [];
    attachementId.forEach(async function (attachements, i) {
      attachId = [...attachId, attachements.id.toString()];
    });
    logDataFunction("DOWNLOAD ALL ATTACHMENT", props?.mailId, attachId);
    LogApi(logData);
    let id = attachId.toString();

    const win = window.open(
      `${process.env.REACT_APP_BASE_API_URL}/api/zipFile/downloadzip?attach_id=${id}&user_id=${props.userData.id}`,
      "_blank"
    );
    win?.focus();
    attachId = [];
  };

  const viewAttachment = (attachements) => {
    if (attachements?.url.includes("http://" || "https://")) {
      logDataFunction("VIEW ATTACHMENT", props.mailId, [attachements.id]);
      LogApi(logData);
      let headers = {};
      if (localStorage.getItem("auth")) {
        headers.Authorization = `Bearer ${localStorage.getItem("auth")}`;
      }

      let url = "";
      if (attachements.host === null) {
        url = attachements.url;
      } else {
        url = attachements.host + attachements.url;
      }

      const win = window.open(`${url}`, "_blank");
      win?.focus();
    } else {
      logDataFunction("VIEW ATTACHMENT", props.mailId, [attachements.id]);

      let apiurl = `${process.env.REACT_APP_BASE_API_URL}/api/attachment/viewfile/${attachements.id}`;
      let headers = {};
      if (localStorage.getItem("auth")) {
        headers.Authorization = `Bearer ${localStorage.getItem("auth")}`;
      }
      LogApi(logData);
      Axios.get(apiurl, {
        headers: headers,
      }).then(async (resp) => {
        const win = window.open(`${resp?.data?.data?.url}`, "_blank");
        win?.focus();
      });
    }
  };

  const handleHighlightButton = (backgr, color_id) => {
    setColorID(color_id);
    setColor(backgr);

    if (windowDoc?.getSelection()?.toString() !== "") {
      setshowAnnotationButtons(true);
    } else {
      setshowAnnotationButtons(false);
    }

    setOpen("close");
  };

  const handleAnnotCommnet = () => {
    if (windowDoc?.getSelection() === null) {
      Toaster("error", "Select text again !!");
    }
    if (windowDoc?.getSelection()?.toString() !== "") {
      setBeforeSelectedAnnotation(windowDoc?.getSelection()?.toString());
      setselectedAnnotation([]);
      setshowAnnotationButtons(false);
      setOpen("open");
    } else {
      Toaster("error", "Please select some Text !!");
    }
  };

  const handleAnnotMark = async () => {
    let selectedtext = PostHighlight("selector", color, 1);
    const designationId = props?.userData?.designations.filter((item) => {
      if (item.default_desig) return item;
    })[0].id;

    if (selectedtext?.start != selectedtext?.end) {
      if (selectedtext.start != selectedtext.end) {
        selectedtext.color_id = colorID;
        selectedtext.mail_id = props?.mailId;
      }
      const commentData = {
        anno_text: selectedtext.text,
        start_char: selectedtext.start,
        end_char: selectedtext.end,
        color_code_id: selectedtext.color_id,
        mailid: selectedtext.mail_id,
        mainMailId: uniqueMailId,
      };

      logDataFunction("COMMENT ON ANNOTATION MAIL", 0, 0);

      const resp = await Api.ApiHandle(
        ANNOTATION_ADD,
        commentData,
        "POST",
        logData
      );
      if (resp?.status === 1) {
      }
      setshowAnnotationButtons(false);
    } else {
      Toaster("error", "Please select some text !!");
    }
  };

  const onClickAnnotation = async (start, end) => {
    setStartChar(start);
    setEndChar(end);
    let annotationData = [];

    logDataFunction("CLICK ON ANNOTATION MAIL", 0, 0);

    const resp = await Api.ApiHandle(
      `${ANNOTATION_ADD}?mailid=${uniqueMailId}&start=${start}&end=${end}`,
      "",
      "GET",
      logData
    );
    if (resp.status === 1) {
      annotationData.push(...resp.data);
    }
    setselectedAnnotation(annotationData);
    setshowAnnotationButtons(false);
    setOpen("open");
  };

  const closeMarginNotes = () => {
    setOpen("close");
    setselectedAnnotation([]);
    setBeforeSelectedAnnotation("");
  };

  const viewDocAttchment = async (attachement) => {
    logDataFunction("VIEW ATTACHEMENT DETAIL", 0, attachement.id);

    const resp = await Api.ApiHandle(
      `${GET_ATTACHMENT_DETAILS}?attId=${attachement.id}&document_id=${mailData.documentId}`,
      "",
      "GET",
      logData
    );
    if (resp.status === 1) {
      setAttachmentName(attachement?.name);
      setBodyData(resp?.data?.attch_Text);
      setViewDocument(!viewDocument);
    }
  };

  const setReplyButton = (commentData) => {
    let replyObject = {};
    let commentDataReverse = commentData.slice().reverse();

    for (let i = 0; i < commentDataReverse.length; i++) {
      let item = commentDataReverse[i];
      if (!(+item.fromId === +designationId)) {
        replyObject = {
          id: item?.fromId,
          branch: item?.fromBranchName,
          designation: item?.fromDesignationName,
        };
        break;
      }
    }
    if (!(Object.keys(replyObject).length > 0)) {
      replyObject = {
        id: mailData?.sourceId,
        branch: mailData?.sourceBranch,
        designation: mailData?.sourceDesignation,
      };
      // return replyObject;
    }
    return replyObject;
  };

  const uniqueArray = (arr) =>
    [...new Set(arr.map((o) => JSON.stringify(o)))].map((s) => JSON.parse(s));

  const replyButton = () => {
    let forReplyTo = setReplyButton(generalCommentData);
    let arr = [...to, forReplyTo];
    let arr1 = [];
    arr1 = uniqueArray(arr);
    setTo(arr1);
    setCommonAddresses(
      commonAddresses?.filter((item) => item?.id !== forReplyTo?.id)
    );
  };

  const handleRemoveAttachment = async (attach) => {
    setattachment(attachment?.filter((item) => item?.id !== attach?.id));

    logDataFunction("UNLINK ATTACHMENT", props.mailId, [attach.id]);

    await Api.ApiHandle(`${UNLINK_ATTACHMENT}${attach?.id}`, "", "", logData);
  };

  const getForlderByMailId = async (id) => {
    logDataFunction("GET MAIL FOLDER", 0, 0);

    const resp = await Api.ApiHandle(
      `${GET_MAIL_FOLDERS}/${props?.mailId}`,
      {},
      "GET",
      logData
    );

    if (resp && resp.status) {
      setFolderData(resp.data);
      setIsLoading(false);
    }
  };

  const onClickReplyButton = (replyDesignation, designationId, action) => {
    if (
      !INGESTED_CONST_VALUES.includes(action) ||
      (INGESTED_CONST_VALUES.includes(action) && generalCommentData.length > 0)
    ) {
      return (
        Object.keys(replyDesignation).length > 0 &&
        replyDesignation?.id !== +designationId && (
          <div className="reply-button">
            <Topreplaybuttons onClick={replyButton} />
          </div>
        )
      );
    }
  };

  return (
    <>
      {Object.keys(mailData).length < 1 && !loadingDetails ? (
        <Loading />
      ) : (
        <div className="nk-ibx-view show-ibx">
          <div className="nk-ibx-head" style={{ padding: "11px 15px" }}>
            <div className="nk-ibx-head-actions">
              <ul className="nk-ibx-head-tools g-1 flexing">
                <li className="ml-n2" style={{ marginRight: "14%" }}>
                  <abbr title="Go back">
                    <span
                      onClick={backButton}
                      className="btn btn-icon btn-trigger nk-ibx-hide"
                    >
                      <em className="icon ni ni-arrow-left"></em>
                    </span>
                  </abbr>
                </li>

                <li
                  className="mr-n1"
                  style={{ marginTop: 1, cursor: "pointer" }}
                  onClick={() => {
                    handleHistory();
                  }}
                >
                  <abbr title="Track">
                    <div className="btn btn-trigger btn-icon btn-tooltip">
                      <em className="icon ni ni-navigate-fill"></em>
                    </div>
                  </abbr>
                </li>
                <li
                  className="mr-n1 ml-2"
                  style={{ marginTop: 1, cursor: "pointer" }}
                  onClick={() => {
                    logprint();
                  }}
                >
                  <abbr title="Print">
                    <div className="btn btn-trigger btn-icon btn-tooltip">
                      <em className="icon ni ni-printer-fill"></em>
                    </div>
                  </abbr>
                </li>
                {props?.filterOptions?.is_sent !== 1 && (
                  <li
                    className="mr-n1 ml-1"
                    onClick={(e) => handleOpenFolderList(e, 1)}
                    ref={folderNode}
                  >
                    <div className="my-dropdown-folder">
                      <abbr title="Folder">
                        <div className="btn btn-trigger btn-icon btn-tooltip">
                          <em className="icon ni ni-folder-fill"></em>
                        </div>
                      </abbr>

                      <div className="dropdown-content dropdown-folder-mail">
                        <ul className="nk-ibx-label">
                          {openFolderList &&
                            props.folderList.map((folder, id) => {
                              return (
                                <li
                                  key={id}
                                  onClick={() => {
                                    handleSelectFolder(folder);
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  <div>
                                    <em
                                      className="icon ni ni-folder-fill font-22"
                                      style={{ color: folder?.apiColorCode }}
                                    ></em>
                                    <span className="nk-ibx-label-text">
                                      {folder?.apiFolderName}
                                    </span>
                                  </div>
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                    </div>
                  </li>
                )}

                {props.filterOptions.is_sent !== 1 &&
                  designationId !== mailData?.sourceId && (
                    <li className="mr-n1 ml-1" style={{ marginBottom: "5%" }}>
                      <abbr title="Star this message">
                        <div className="asterisk" onClick={toggleStarred}>
                          <a>
                            <em
                              className={`asterisk-${
                                toggleStar ? "on" : "off"
                              } icon ni ni-star${toggleStar ? "-fill" : ""}`}
                              style={{
                                position: "absolute",
                                bottom: -12,
                                cursor: "pointer",
                                marginLeft: 4,
                              }}
                            ></em>
                          </a>
                        </div>
                      </abbr>
                    </li>
                  )}
                {mailData.attachmentList?.length > 0 && (
                  <li
                    className="mr-n1 ml-5"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleDownloadAll(mailData.attachmentList);
                    }}
                  >
                    <abbr title="Download All">
                      <div className="btn btn-trigger btn-icon btn-tooltip">
                        <em className="icon ni ni-download"></em>
                      </div>
                    </abbr>
                  </li>
                )}
              </ul>
            </div>
            <div className="nk-ibx-head-actions">
              <ul className="nk-ibx-head-tools g-1"></ul>
            </div>
            <li
              className="d-none d-sm-block"
              style={{ marginLeft: "54.25rem" }}
            >
              <div className={"btn btn-icon btn-trigger btn-tooltip "}>
                <em
                  className="icon ni ni-chevron-left"
                  style={{
                    opacity: props.countmail + 1 <= 1 || prevDisabled ? 0.4 : 1,
                  }}
                  onClick={() => {
                    setPrevDisabled(true);
                    getPrevOnClick();
                  }}
                ></em>
              </div>
            </li>

            <p style={{ marginBottom: "0px" }}>
              {props.countmail + 1}/{noOfMails}
            </p>

            <li className="d-none d-sm-block">
              <div
                className={`btn btn-icon btn-trigger btn-tooltip 
                
                  `}
              >
                <em
                  className="icon ni ni-chevron-right"
                  style={{
                    opacity:
                      props.countmail + 1 === noOfMails || nextDisabled
                        ? 0.4
                        : 1,
                  }}
                  onClick={() => {
                    setNextDisabled(true);
                    getNextOnClick();
                  }}
                ></em>
              </div>
            </li>
          </div>

          <div
            className="printElement"
            id="printElement"
            style={{ overflow: "auto", height: "0px" }}
          >
            {openPrintcall && (
              <PrintView
                call="2-col-print"
                subject={mailData?.subject}
                op={mailData?.op}
                to={props?.selectedMailTo}
                toBranch={mailData?.toBranch}
                sourceDesignation={mailData?.sourceDesignation}
                sourceBranch={mailData?.sourceBranch}
                time={mailData?.createdAt}
                body={mailData?.body}
                mailId={props?.mailId}
                generalCommentData={generalCommentData}
                crashed={mailData?.isCrashed}
                updateComment={recentCommentid}
                attachmentList={mailData?.attachmentList}
                annotationText={annotationText}
              />
            )}
          </div>

          <div
            id="content"
            className="nk-ibx-reply nk-reply jumbotron-overflow"
          >
            <div className="nk-ibx-reply-head" ref={topRef}>
              <div className="no-select">
                <div className="subject-section">
                  <h4 className="title">{mailData?.subject}</h4>
                </div>
                <div className="text-ul">
                  <ul className="list-inline">
                    {mailData?.op !== null && mailData?.op !== "" ? (
                      <li>OP/NDP/WAN NO. : {mailData?.op}</li>
                    ) : (
                      ""
                    )}
                    <li>Date: {mailData?.createdAt}</li>
                    {mailData?.isCrashed && (
                      <li style={{ color: "red" }}>(Crash Message)</li>
                    )}
                  </ul>
                  <ul className="list-inline" style={{ marginTop: "-5px" }}>
                    <li>
                      {/* {mailData.branch === mailData.sourceBranch &&
                      mailData.from === mailData.sourceDesignation
                        ? "Source: "
                        :  */}
                      From:{" "}
                      {mailData?.sourceDesignation !== null &&
                      mailData?.sourceBranch !== null
                        ? `${mailData?.sourceDesignation}(${mailData?.sourceBranch})`
                        : mailData?.sourceDesignation !== null &&
                          mailData?.sourceBranch === null
                        ? `${mailData?.sourceDesignation}`
                        : mailData?.sourceDesignation === null &&
                          mailData?.sourceBranch !== null
                        ? `${mailData?.sourceBranch}`
                        : mailData?.sourceDesignation === null &&
                          mailData?.sourceBranch === null
                        ? `-`
                        : `-`}
                    </li>
                    {props?.filterOptions?.is_sent === 1 && (
                      <li>
                        To:{" "}
                        {props.selectedMailTo.map((item, i) =>
                          props.selectedMailTo.length !== i + 1
                            ? `${item?.designation}(${item?.branch}), `
                            : `${item?.designation}(${item?.branch})`
                        )}
                      </li>
                    )}
                  </ul>
                  {/* {mailData?.FirstName !== null &&
                  mailData?.FirstName !== undefined ? (
                    <ul className="list-inline" style={{ marginTop: "-12px" }}>
                      <li>
                        <i style={{ fontSize: "10px" }}>
                          Source: {mailData?.FirstName}{" "}
                        </i>
                      </li>
                    </ul>
                  ) : null} */}
                </div>
                <ul className="nk-ibx-tags g-1">
                  {folderClicked ? (
                    <li>
                      <Loader
                        type="ThreeDots"
                        color="#6576ff"
                        height={30}
                        width={30}
                      />
                    </li>
                  ) : (
                    folderData?.length > 0 &&
                    folderData?.map((data, i) => {
                      return isLoading && id === data.id && !folderClicked ? (
                        <li
                          key={i}
                          className="mr-2"
                          style={{
                            display: "inline-block",
                          }}
                        >
                          <Loader
                            type="ThreeDots"
                            color="#6576ff"
                            height={30}
                            width={30}
                          />
                        </li>
                      ) : (
                        <li
                          key={i}
                          className="btn-group is-tags folder-tags mr-2"
                          style={{
                            background: `${data?.text}`,
                          }}
                        >
                          <div
                            className="btn btn-xs btn btn-dim"
                            style={{ fontSize: 15 }}
                          >
                            {data?.name}
                          </div>
                          <div
                            className="btn btn-xs btn-icon btn btn-dim"
                            style={{ borderLeft: "1px solid white" }}
                          >
                            <em
                              className="icon ni ni-cross"
                              onClick={() => {
                                handleDeleteSelectedFolder(data.id);
                              }}
                            ></em>
                          </div>
                        </li>
                      );
                    })
                  )}
                </ul>
              </div>

              <ul className="d-flex g-1" style={{ paddingRight: 21 }}>
                {/* <li
                    className="mr-n1"
                    style={{ marginTop: 1, cursor: "pointer" }}
                    onClick={() => {
                      handleHistory();
                    }}
                  >
                    <abbr title="Track">
                      <div className="btn btn-trigger btn-icon btn-tooltip">
                        <em className="icon ni ni-navigate-fill"></em>
                      </div>
                    </abbr>
                  </li>

                  <li
                    className="mr-n1 ml-2"
                    style={{ marginTop: 1, cursor: "pointer" }}
                    onClick={() => {
                      logprint();
                    }}
                  >
                    <abbr title="Print">
                      <div className="btn btn-trigger btn-icon btn-tooltip">
                        <em className="icon ni ni-printer-fill"></em>
                      </div>
                    </abbr>
                  </li>
                  {props?.filterOptions?.is_sent !== 1 && (
                    <li
                      className="mr-n1 ml-1"
                      onClick={(e) => handleOpenFolderList(e, 1)}
                      ref={folderNode}
                    >
                      <div className="my-dropdown-folder">
                        <abbr title="Folder">
                          <div className="btn btn-trigger btn-icon btn-tooltip">
                            <em className="icon ni ni-folder-fill"></em>
                          </div>
                        </abbr>

                        <div className="dropdown-content dropdown-folder-mail">
                          <ul className="nk-ibx-label">
                            {openFolderList &&
                              props.folderList.map((folder, id) => {
                                return (
                                  <li
                                    key={id}
                                    onClick={() => {
                                      handleSelectFolder(folder?.apiFolderId);
                                    }}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <div>
                                      <em
                                        className="icon ni ni-folder-fill font-22"
                                        style={{ color: folder?.apiColorCode }}
                                      ></em>
                                      <span className="nk-ibx-label-text">
                                        {folder?.apiFolderName}
                                      </span>
                                    </div>
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      </div>
                    </li>
                  )}

                  {props.filterOptions.is_sent !== 1 &&
                    designationId !== mailData?.fromId && (
                      <li className="mr-n1 ml-1">
                        <abbr title="Star this message">
                          <div className="asterisk" onClick={toggleStarred}>
                            <a>
                              <em
                                className={`asterisk-${
                                  toggleStar ? "on" : "off"
                                } icon ni ni-star${toggleStar ? "-fill" : ""}`}
                                style={{
                                  position: "absolute",
                                  bottom: -12,
                                  cursor: "pointer",
                                  marginLeft: 4,
                                }}
                              ></em>
                            </a>
                          </div>
                        </abbr>
                      </li>
                    )} */}
              </ul>
            </div>

            <hr />
            <div className="comment-box">
              <div className="nk-ibx-reply-head">
                <Commentbox
                  generalCommentData={generalCommentData}
                  inputCommentData={inputCommentData}
                  mailId={props.mailId}
                  updateComment={recentCommentid}
                />
              </div>
            </div>

            <div className="nk-ibx-reply-group">
              <div className="nk-ibx-reply-item nk-reply-item">
                <div
                  className={`nk-reply-body nk-ibx-reply-body ${
                    open.ab ? "is-shown" : ""
                  }`}
                >
                  <div className="row">
                    {mailData.body && (
                      <MailBody
                        body={mailData?.body}
                        call="2-col"
                        mail_id={props?.mailId}
                        onClickAnnotation={onClickAnnotation}
                        setusercolorcodeObj={setusercolorcodeObj}
                        setLoadingDetails={setLoadingDetails}
                        handleHighlightButton={handleHighlightButton}
                        mailIds={mailIds}
                        inboxMailData={uniqueMailId}
                        // scrollToTopnextMail={scrollToTopnextMail}
                        closeMarginNotes={closeMarginNotes}
                        setAnnotationDataForPrint={setAnnotationDataForPrint}
                      />
                    )}
                    {showAnnotationButtons && (
                      <div
                        id="annotation_button"
                        className={`right-icon ${marginButtonStatic}`}
                      >
                        <ul className="float-right ml-5">
                          <li
                            className="border-br-radius-0"
                            onClick={handleAnnotMark}
                          >
                            <abbr title="Highlight">
                              <a className="btn btn-icon">
                                <span
                                  className="d-flex align-items-center"
                                  style={{ paddingTop: "20%" }}
                                >
                                  <em className="icon ni ni-chat"></em>
                                </span>
                              </a>
                            </abbr>
                          </li>
                          <li
                            className="border-tr-radius-0"
                            onClick={handleAnnotCommnet}
                          >
                            <abbr title="Annotate">
                              <a className="btn btn-icon">
                                <span
                                  className="d-flex align-items-center"
                                  style={{ paddingTop: "20%" }}
                                >
                                  <em className="icon ni ni-edit"></em>
                                </span>
                              </a>
                            </abbr>
                          </li>
                        </ul>
                      </div>
                    )}

                    <div className={`col-md-4 ${marginNotesStatic}`}>
                      {open === "open" && (
                        <MailMarginComments
                          color={color}
                          mailId={props?.mailId}
                          colorID={colorID}
                          beforeSelectedAnnotation={beforeSelectedAnnotation}
                          usercolorcodeObj={usercolorcodeObj}
                          selectedAnnotation={selectedAnnotation}
                          closeMarginNotes={closeMarginNotes}
                          onClickAnnotation={onClickAnnotation}
                          setOpen={setOpen}
                          startChar={startChar}
                          endChar={endChar}
                          filterOptions={props?.filterOptions}
                          type="2"
                          uniqueMailId={uniqueMailId}
                        />
                      )}
                    </div>
                  </div>

                  <DocView
                    bodyData={bodyData}
                    setViewDocument={setViewDocument}
                    viewDocument={viewDocument}
                    attachmentName={attachmentName}
                  />
                  {mailData.attachmentList?.length > 0 && (
                    <div className="col-md-8">
                      <div className="attach-files">
                        <ul className="attach-list">
                          {mailData.attachmentList?.map((attachment, id) => {
                            let attactype = attachment.name.split(".");
                            return (
                              <li
                                className="attach-item"
                                key={`attachmentList${id}`}
                                style={{
                                  overflow: "hidden",
                                  whiteSpace: "nowrap",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                <span>
                                  {spinner.bool &&
                                  attachment.id === spinner.id ? (
                                    <Spinner animation="border" size="sm" />
                                  ) : (
                                    <em
                                      className="ni ni-download"
                                      style={{ paddingRight: 4 }}
                                      onClick={() =>
                                        downlaodAttachment(attachment)
                                      }
                                    />
                                  )}
                                  <abbr
                                    title={
                                      attachment?.body_flag === 0 &&
                                      `${attachment?.name}`
                                    }
                                  >
                                    <span
                                      style={{
                                        paddingLeft: 10,
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        downlaodAttachment(attachment)
                                      }
                                    >
                                      {attachment?.body_flag === 0
                                        ? attachment?.name
                                        : "Original Document"}
                                    </span>
                                  </abbr>
                                </span>
                                <br></br>
                                <span>
                                  {attactype[1] &&
                                  fileExtensionNames.includes(
                                    attactype[
                                      attactype.length - 1
                                    ].toLowerCase()
                                  )
                                    ? attachment?.body_flag === 0 && (
                                        <span
                                          onClick={() =>
                                            viewAttachment(attachment)
                                          }
                                          style={{
                                            color: "blue",
                                            cursor: "pointer",
                                          }}
                                        >
                                          View
                                        </span>
                                      )
                                    : ""}

                                  {attactype[1] &&
                                  docExtension.includes(
                                    attactype[
                                      attactype.length - 1
                                    ].toLowerCase()
                                  )
                                    ? attachment?.body_flag === 0 && (
                                        <span
                                          onClick={() =>
                                            viewDocAttchment(attachment)
                                          }
                                          style={{
                                            color: "blue",
                                            cursor: "pointer",
                                          }}
                                        >
                                          View
                                        </span>
                                      )
                                    : ""}

                                  {attactype[1] &&
                                  (attactype[1] == "png" ||
                                    attactype[1] == "jpeg" ||
                                    attactype[1] == "jpg" ||
                                    attactype[1] == "pdf") ? (
                                    <span style={{ paddingLeft: 10 }}>
                                      {attachment?.size}
                                    </span>
                                  ) : (
                                    <span style={{ paddingLeft: 7 }}>
                                      {attachment?.size}
                                    </span>
                                  )}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {props?.userData?.designations?.[0]?.id === mailData?.fromId
              ? onClickReplyButton(
                  replyDesignation,
                  designationId,
                  mailData.fromAction
                )
              : onClickReplyButton(
                  replyDesignation,
                  designationId,
                  mailData.mailAction
                )}

            {/* Comment Box in mailview */}
            <div ref={commentBoxRef} className="col-md-8">
              <div className="nk-ibx-reply-form nk-reply-form">
                <ComposeTo
                  options={options}
                  to={to}
                  setTo={setTo}
                  placeholder="Enter the use Designation-Branch or Select from below..."
                  setCommonAddresses={setCommonAddresses}
                  mailId={props?.mailId}
                  isClearable={true}
                  commonAddresses={commonAddresses}
                  allCommonAddresses={allCommonAddresses}
                  handleFrequentAddresses={handleFrequentAddresses}
                  blankTo={blankTo}
                />
                <div className="no-select">
                  <div className="nk-reply-form-editor">
                    <div className="nk-reply-form-field">
                      <textarea
                        className="form-control form-control-simple no-resize"
                        placeholder="Enter Comments..."
                        autoFocus
                        value={inputCommentData}
                        onChange={handleInputCommentData}
                      ></textarea>
                    </div>
                  </div>
                  <div className="nk-reply-form-tools">
                    <ul
                      className="nk-reply-form-actions g-1"
                      style={{ flexWrap: "wrap" }}
                    >
                      {preDefinedComments?.map((com, i) => {
                        return (
                          <li
                            key={`preDefinedComments${i}`}
                            className="mr-2"
                            onClick={() =>
                              handlePreDefinedComment(com.comments)
                            }
                          >
                            <div className="myButton">{com.comments}</div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  {attachment?.length > 0 &&
                    attachment?.map((attach, i) => {
                      return (
                        <div
                          className="attachment-list-mailview-main"
                          key={`attachmentList${i}`}
                        >
                          <div className="attachment-list-mailview">
                            <div className="attachment-list-name">
                              {attach?.name}
                            </div>
                            <div className="attachment-list-size">
                              ({attach?.size})
                            </div>
                          </div>
                          <div
                            onClick={() => {
                              handleRemoveAttachment(attach);
                            }}
                          >
                            <abbr title="Remove Attachment">
                              <em className="icon ni ni-cross-sm"></em>
                            </abbr>
                          </div>
                        </div>
                      );
                    })}
                  {/* {fileUploading && (
                    <div>
                      <ProgressBar animated now={60} />
                    </div>
                  )} */}
                  <div className="nk-reply-form-tools">
                    <ul className="nk-reply-form-actions g-1">
                      <li className="mr-2">
                        <button
                          className="btn btn-primary"
                          type="submit"
                          onClick={() => {
                            handleSendComment();
                          }}
                          disabled={disableSendButton || fileUploading}
                        >
                          Send
                        </button>
                      </li>
                      <li className="mr-2">
                        {!fileUploading && (
                          <AddAttachment
                            mailId={props?.mailId}
                            setFileUploading={setFileUploading}
                            setattachment={setattachment}
                            attachment={attachment}
                            isFileUploading={fileUploading}
                          />
                        )}
                        {fileUploading && (
                          <div
                            className="spinner-border"
                            role="status"
                            style={{
                              display: "inline-flex",
                              justifyContent: "space-between",
                              height: "1.5rem",
                              width: "1.5rem",
                            }}
                          >
                            <span className="sr-only">Loading...</span>
                          </div>
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {isTrack && (
            <div>
              <Track
                closeModal={handleTrackCloseModal}
                openModal={handleTrackOpenModal}
                visible={isTrack}
                mail_id={mailData.userMailId}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};
const mapStateToProps = (state) => ({
  folderList: state.folderList,
  userData: state.userData,
  isActiveModule: state.isActiveModule,
  isMostFrequent: state.isMostFrequent,
});

const mapActionToProps = {
  updateSentCall,
  updateUnreadCall,
  updateArchiveCall,
  updateAllCall,
  updateCrashedCall,
  updateStarredCall,
  updateAddToFolderCache,
  updateFolderCachedData,
};

export default connect(mapStateToProps, mapActionToProps)(MailView);
