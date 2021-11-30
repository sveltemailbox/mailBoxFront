import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Spinner, ProgressBar } from "react-bootstrap";
import Commentbox from "../Commentbox";
import * as Api from "../../util/api/ApicallModule";
import {
  GET_MAIL_BY_ID,
  UPDATE_MAIL_BY_ID,
  GET_LIST_DESIGNATION,
  COMMENT_ON_MAIL,
  GET_PRE_DEFINED_COMMENTS,
  FREQUENT_ADDRESSES,
  GET_COMMENTS,
  ANNOTATION_ADD,
  GET_ATTACHMENT_DETAILS,
  UNLINK_ATTACHMENT,
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
    // add when mounted
    document.addEventListener("mousedown", handleOpenFolderList);
    // return function to be called when unmounted
    return () => {
      document.removeEventListener("mousedown", handleOpenFolderList);
    };
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
    if (maildIdForComment) getCommentData();
  }, [maildIdForComment]);

  useEffect(() => {
    loadIframe();
    getListDesignation();
    getPreDefinedComments();
    getFrequentAddresses();

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

  const toggleStarred = async () => {
    let params = "";
    setToggleStar((toggleStar) => !toggleStar);
    switch (mailData.mailAction) {
      case "99":
        mailData.mailAction = "97";
        params = "97";
        break;
      case "98":
        mailData.mailAction = "96";
        params = "96";
        break;
      case "97":
        mailData.mailAction = "99";
        params = "99";
        break;
      case "96":
        mailData.mailAction = "98";
        params = "98";
        break;
      case "89":
        mailData.mailAction = "86";
        params = "86";
        break;
      case "88":
        mailData.mailAction = "87";
        params = "87";
        break;
      case "87":
        mailData.mailAction = "88";
        params = "88";
        break;
      case "86":
        mailData.mailAction = "89";
        params = "89";
        break;
      case "79":
        mailData.mailAction = "69";
        params = "69";
        break;
      case "78":
        mailData.mailAction = "68";
        params = "68";
        break;
      case "69":
        mailData.mailAction = "79";
        params = "79";
        break;
      case "68":
        mailData.mailAction = "78";
        params = "78";
        break;

      default:
        break;
    }
    await updateMail({ mail_action: params });
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
    const resp = await Api.ApiHandle(`${GET_MAIL_BY_ID}/${mailId}`, "", "GET");

    if (resp.status === 1) {
      let flags = checkFlags(resp?.data?.mail_action);
      let data = {
        id: resp.data?.id,
        userMailId: resp.data?.user_mail_id,
        mailAction: resp?.data?.mail_action,
        toId: resp.data?.To?.id,
        to: resp.data?.To?.designation,
        toBranch: resp.data?.To?.branch,
        from: resp.data?.From?.designation,
        fromId: resp?.data?.From?.id,
        branch: resp.data?.From?.branch,
        sourceId: resp?.data?.Mail?.Source?.id,
        sourceBranch: resp?.data?.Mail?.Source?.branch,
        sourceDesignation: resp?.data?.Mail?.Source?.designation,
        op: resp?.data?.Mail?.op,
        subject: resp.data?.Mail?.subject,
        createdAt: formatDateTime(resp.data?.Mail?.createdAt),
        folders: resp.data?.Folder,
        body: resp.bodyData?.body,
        // isStarred: resp.data?.is_starred,
        // isCrashed: resp.data?.is_crashed,
        attachmentList: resp?.attachmentData,
        documentId: resp?.data?.Mail?.document_id,
        actualFormId: resp?.data?.From?.id,
        ToFolder: resp?.data?.ToFolder,
        FromFolder: resp?.data?.FromFolder,
      };
      data = { ...data, ...flags };
      data.isStarred ? setToggleStar(true) : setToggleStar(false);
      setMaildIdForComment(data?.userMailId);
      setMailData(data);
      renderImage(data.body).then((res) => {
        data.body = res;
        setMailData(data);
        setopenPrintcall(false);
      });
    }
  };

  const getCommentData = async () => {
    let _commentData = [];

    const resp = await Api.ApiHandle(
      `${GET_COMMENTS}/${maildIdForComment}`,
      "",
      "GET"
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

  const handleSelectFolder = async (folderId) => {
    await updateMail({ folder: folderId });
    await getMail(props?.mailId);
  };

  const updateMail = async (payload) => {
    await Api.ApiHandle(`${UPDATE_MAIL_BY_ID}/${mailIds}`, payload, "put");
  };

  const handleDeleteSelectedFolder = async () => {
    await updateMail({ folder: null });
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
    setopenPrintcall(true);
    getMail(props?.mailId);
  };

  const backButton = () => {
    props.getAllMails("back");
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
      const designationId = props?.userData?.designations.filter((item) => {
        if (item.default_desig) return item;
      })[0].id;
      let attachmentIds = [];
      to?.forEach(async (toID) => {
        let payload = {
          to: toID.id,
          user_mail_id: props?.mailId,
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
      setattachment([]);

      if (
        props.inboxMailData.length > 1 &&
        props.filterOptions?.mail_action === "69"
      )
        if (props?.filterOptions?.is_sent !== 1) {
          openNextMail();
        }
    }
  };

  const sendCommentApi = async (toID, payload) => {
    const resp = await Api.ApiHandle(`${COMMENT_ON_MAIL}`, payload, "POST");

    if (resp.status !== 1) {
      Toaster("error", "Some error occurred");
      setDisableSendButton(false);
    } else {
      setInputCommentData("");
      Toaster(
        "success",
        `Message sent successfully to ${toID.designation}(${toID.branch}) `
      );
      setDisableSendButton(false);

      setTo([]);
      topRef?.current?.scrollIntoView({ behavior: "smooth" });
      setRecentCommentid(inputCommentData);
    }
  };

  const openNextMail = () => {
    let index = 0;
    props.inboxMailData.forEach((mail, i) => {
      if (mail.id === props.mailId) index = i + 1;
    });
    props.getMailId(props.inboxMailData[index]);
    props.getAllMails("back");
  };

  const getListDesignation = async () => {
    const designationId = props?.userData?.designations.filter((item) => {
      if (item.default_desig) return item;
    })[0].id;
    const resp = await Api.ApiHandle(`${GET_LIST_DESIGNATION}`, "", "GET");

    if (resp?.status === 1) {
      setDesignationList(resp?.data);

      const _options = [];
      resp?.data?.map((list) => {
        if (designationId !== list?.id) {
          const options = {
            value: `${list?.designation}-${list?.branch}`,
            label: `${list?.designation}-${list?.branch}`,
            id: list?.id,
          };
          _options.push(options);
        }
      });

      setOptions(_options);
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
    const resp = await Api.ApiHandle(`${GET_PRE_DEFINED_COMMENTS}`, "", "GET");

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
    const resp = await Api.ApiHandle(FREQUENT_ADDRESSES, "", "GET");

    if (resp?.status === 1) {
      const _commonAddresses = [];
      resp?.data?.map((com) => {
        if (designation.designation !== com?.designation) {
          const common = {
            id: com?.id,
            branch: com?.branch,
            designation: com?.designation,
          };
          _commonAddresses.push(common);
        }
      });

      setActualFrequentAddress(_commonAddresses);
      setCommonAddresses(_commonAddresses);
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
      let apiurl = `${process.env.REACT_APP_BASE_API_URL}/api/attachment/download/${attachements.id}`;
      let name = url.split("/");
      let headers = {};

      if (localStorage.getItem("auth")) {
        headers.Authorization = `Bearer ${localStorage.getItem("auth")}`;
      }
      Axios.get(apiurl, { responseType: "blob", headers: headers })
        .then(async (res) => {
          fileDownload(res.data, name[name.length - 1]);
          setSpinner(false);
        })
        .catch(function (error) {
          Toaster("error", error.message);
          setSpinner(false);
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
          setSpinner(false);
        })
        .catch(function (error) {
          Toaster("error", error.message);
          setSpinner(false);
        });
    }
  };

  const viewAttachment = (attachements) => {
    if (attachements?.url.includes("http://" || "https://")) {
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
      let apiurl = `${process.env.REACT_APP_BASE_API_URL}/api/attachment/viewfile/${attachements.id}`;
      let headers = {};
      if (localStorage.getItem("auth")) {
        headers.Authorization = `Bearer ${localStorage.getItem("auth")}`;
      }

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
      const resp = await Api.ApiHandle(ANNOTATION_ADD, commentData, "POST");
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

    const resp = await Api.ApiHandle(
      `${ANNOTATION_ADD}?mailid=${uniqueMailId}&start=${start}&end=${end}`,
      "",
      "GET"
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
    const resp = await Api.ApiHandle(
      `${GET_ATTACHMENT_DETAILS}?attId=${attachement.id}&document_id=${mailData.documentId}`,
      "",
      "GET"
    );
    if (resp.status === 1) {
      setAttachmentName(attachement?.name);
      setBodyData(resp?.data?.att_text);
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

  const replyButton = () => {
    let forReplyTo = setReplyButton(generalCommentData);
    setTo((prev) => [...prev, forReplyTo]);
    setCommonAddresses(
      commonAddresses?.filter((item) => item?.id !== forReplyTo?.id)
    );
  };

  const handleRemoveAttachment = async (attach) => {
    setattachment(attachment?.filter((item) => item?.id !== attach?.id));
    await Api.ApiHandle(`${UNLINK_ATTACHMENT}${attach?.id}`);
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
                    <li className="mr-n1 ml-1" style={{ marginBottom: "7%" }}>
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
              </ul>
            </div>
            <div className="nk-ibx-head-actions">
              <ul className="nk-ibx-head-tools g-1"></ul>
            </div>
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
                      From:{" "}
                      {`${mailData?.sourceDesignation}(${mailData?.sourceBranch})`}
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
                </div>
                {props.filterOptions.is_sent !== 1 && (
                  <ul className="nk-ibx-tags g-1">
                    {mailData?.FromFolder &&
                      mailData.actualFormId === designationId && (
                        <li
                          className="btn-group is-tags"
                          style={{
                            color: mailData.FromFolder?.Color?.text,
                            cursor: "pointer",
                          }}
                        >
                          <div
                            className="btn btn-xs btn btn-dim"
                            style={{ color: mailData?.FromFolder?.Color?.text }}
                          >
                            {mailData?.FromFolder?.name}
                          </div>
                          <div
                            className="btn btn-xs btn-icon btn btn-dim"
                            style={{ color: mailData?.FromFolder?.Color?.text }}
                          >
                            <em
                              className="icon ni ni-cross"
                              onClick={handleDeleteSelectedFolder}
                            ></em>
                          </div>
                        </li>
                      )}

                    {mailData?.ToFolder &&
                      !(mailData.actualFormId === designationId) && (
                        <li
                          className="btn-group is-tags"
                          style={{
                            color: mailData.ToFolder?.Color?.text,
                            cursor: "pointer",
                          }}
                        >
                          <div
                            className="btn btn-xs btn btn-dim"
                            style={{ color: mailData?.ToFolder?.Color?.text }}
                          >
                            {mailData?.ToFolder?.name}
                          </div>
                          <div
                            className="btn btn-xs btn-icon btn btn-dim"
                            style={{ color: mailData?.ToFolder?.Color?.text }}
                          >
                            <em
                              className="icon ni ni-cross"
                              onClick={handleDeleteSelectedFolder}
                            ></em>
                          </div>
                        </li>
                      )}
                  </ul>
                )}
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
                                  ) ? (
                                    <span
                                      onClick={() => viewAttachment(attachment)}
                                      style={{
                                        color: "blue",
                                        cursor: "pointer",
                                      }}
                                    >
                                      View
                                    </span>
                                  ) : (
                                    ""
                                  )}

                                  {attactype[1] &&
                                  docExtension.includes(
                                    attactype[
                                      attactype.length - 1
                                    ].toLowerCase()
                                  ) ? (
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
                                  ) : (
                                    ""
                                  )}

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
            {Object.keys(replyDesignation).length > 0 &&
              replyDesignation?.id !== +designationId && (
                <div className="reply-button">
                  <Topreplaybuttons onClick={replyButton} />
                </div>
              )}

            {/* Comment Box in mailview */}
            <div ref={commentBoxRef} className="col-md-8">
              <div className="nk-ibx-reply-form nk-reply-form">
                <ComposeTo
                  to={to}
                  setTo={setTo}
                  designationList={designationList}
                  commonAddresses={commonAddresses}
                  handleFrequentAddresses={handleFrequentAddresses}
                  isFullSize={true}
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
                  {fileUploading && (
                    <div>
                      <ProgressBar animated now={60} />
                    </div>
                  )}
                  <div className="nk-reply-form-tools">
                    <ul className="nk-reply-form-actions g-1">
                      <li className="mr-2">
                        <button
                          className="btn btn-primary"
                          type="submit"
                          onClick={() => {
                            handleSendComment();
                          }}
                          disabled={disableSendButton}
                        >
                          Send
                        </button>
                      </li>
                      <li className="mr-2">
                        <AddAttachment
                          mailId={props?.mailId}
                          setFileUploading={setFileUploading}
                          setattachment={setattachment}
                        />
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
});

export default connect(mapStateToProps)(MailView);
