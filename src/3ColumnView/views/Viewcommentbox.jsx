import { useState, useEffect, useRef } from "react";
// import { useReactToPrint } from "react-to-print";
import { connect } from "react-redux";
import Select from "react-select";
// import ReactToPrint from "react-to-print";
import Commentbox from "../../views/Commentbox";
import PrintView from "../../components/print/printView";
import Axios from "axios";
import fileDownload from "js-file-download";
import { renderImage } from "../../components/common/renderImage";

import {
  GET_MAIL_BY_ID,
  UPDATE_MAIL,
  GET_LIST_DESIGNATION,
  COMMENT_ON_MAIL,
  LOGS_ADD,
  GET_PRE_DEFINED_COMMENTS,
  FREQUENT_ADDRESSES,
  GET_COMMENTS,
  ANNOTATION_ADD,
} from "../../config/constants";
import * as Api from "../../util/api/ApicallModule";
import { formatDate } from "../../util/dateFormat/DateFormat";
import Toaster from "../../util/toaster/Toaster";
import Loading from "../../util/loader/Loading";
import MailBody from "./../../views/mailview/MailBody";
import Track from "./../../components/common/track";
import MailMarginComments from "../../views/mailview/MailMarginComments";
import { PostHighlight } from "../../components/common/annotation";

// import Topreplaybuttons from "../../views/Topreplaybuttons";

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const pageStyle = `
@media print {
  html, body {
    height: initial !important;
    overflow: initial !important;
    -webkit-print-color-adjust: exact;
    color-adjust: exact !important;
  }
  @page {
    size: auto;
    margin: 10pt 10t 20pt 10pt;
  }
  
  @page {
    @bottom-right {
         content: counter(page) "/" counter(pages);
     }
  } 
}

@media all {
  .page-break {
    display: none;
  }
}
@page {
  counter-increment: page;
  counter-reset: page 1;
  @top-right {
      content: "Page " counter(page) " of " counter(pages);
  }
}
`;
let windowDoc;

const Viewcommentbox = (props) => {
  const [isStar, setIsStar] = useState(false);
  const [inputCommentData, setInputCommentData] = useState("");
  const [mailData, setMailData] = useState({});
  const [isTrack, setisTrack] = useState(false);
  const [openPrintcall, setopenPrintcall] = useState(false);
  const [preDefinedComments, setPreDefinedComments] = useState([]);
  const [recentCommentid, setRecentCommentid] = useState("");
  const [generalCommentData, setGeneralCommentData] = useState([]);
  const [commonAddresses, setCommonAddresses] = useState([]);
  const [openFolderList, setOpenFolderList] = useState(false);
  const [options, setOptions] = useState([]);
  const [to, setTo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allAnnotation, setallAnnotation] = useState([]);
  const [color, setColor] = useState("");
  const [colorID, setColorID] = useState("");
  const [startChar, setStartChar] = useState("");
  const [endChar, setEndChar] = useState("");
  const [selectedAnnotation, setselectedAnnotation] = useState([]);
  const [marginNotesStatic, setmarginNotesStatic] = useState("");
  const [marginButtonStatic, setmarginButtonStatic] = useState("");
  const [usercolorcodeObj, setusercolorcodeObj] = useState({});
  const [selectedData, setselectedData] = useState({});
  const [showAnnotationButtons, setshowAnnotationButtons] = useState(false);
  const [open, setOpen] = useState("close");
  const [annotationText, setAnnotationText] = useState();
  const [annotationDataForPrint, setAnnotationDataForPrint] = useState();
  const [beforeSelectedAnnotation, setBeforeSelectedAnnotation] = useState("");

  const printRef = useRef();
  const commentBoxRef = useRef();
  const topRef = useRef();
  const commentBoxCommentData = useRef();
  const prevStar = usePrevious(isStar);
  const userData = props?.userData?.designations;

  const loadIframe = () => {
    setTimeout(() => {
      windowDoc = document.getElementById("iframeResult").contentWindow.window;
    }, 1000);
  };

  useEffect(() => {
    if (props?.mailId) {
      loadIframe();
      setTo([]);
      setLoading(true);
      getMail(props?.mailId);

      getPreDefinedComments();
      getCommentData();
      getFrequentAddresses();
      setshowAnnotationButtons(false);
    }
  }, [props.mailId]);

  useEffect(async () => {
    setBeforeSelectedAnnotation("");
    // setselectedAnnotation([]);
    if (open === "delete") {
      setMailData({});
      await getMail(props?.mailId);
      loadIframe();
    }
  }, [open]);

  useEffect(() => {
    setTo([]);
    // setMailData([]);
  }, [props?.mailId]);

  useEffect(() => {
    setLoading(false);
    setMailData({});
  }, [props?.selected]);

  useEffect(() => {
    setMailData({});
  }, [props?.searchText]);

  useEffect(() => {
    setMailData({});
  }, [props?.station]);

  useEffect(async () => {
    if (typeof prevStar !== "undefined" && prevStar !== isStar) {
      await updateMail({ is_starred: isStar ? 1 : 0 });
      await getMail(props.mailId);
    }
  }, [isStar]);

  useEffect(() => {
    annotationData();
  }, [annotationDataForPrint]);

  const annotationData = () => {
    var anno_text_array = [];
    var obj = {};
    var ary = [];
    var previous = "";
    annotationDataForPrint?.map((ann, i) => {
      if (!obj.hasOwnProperty(ann?.anno_text)) {
        obj[`${ann?.anno_text}`] = [ann];
      } else {
        let ann_array = obj[`${ann?.anno_text}`];
        ann_array.push(ann);
        obj[`${ann?.anno_text}`] = ann_array;
      }
      // if (!anno_text_array.includes(ann?.anno_text)) {
      //   anno_text_array.push(ann?.anno_text);
      // }
    });
    setAnnotationText(obj);
  };

  const Openfolderlist = () => {
    setOpenFolderList(true);
  };

  const getMail = async (mailId) => {
    const resp = await Api.ApiHandle(`${GET_MAIL_BY_ID}/${mailId}`, "", "GET");

    if (resp.status === 1) {
      const data = {
        id: resp.data?.id,
        to: resp.data?.To?.designation,
        toBranch: resp.data?.To?.branch,
        from: resp.data?.From?.designation,
        branch: resp.data?.From?.branch,
        fromId: resp?.data?.From?.id,
        op: resp?.data?.op,
        subject: resp.data?.subject,
        createdAt: formatDate(resp.data?.createdAt),
        folders: resp.data?.Folder,
        body: resp.bodyData?.body,
        is_starred: resp.data?.is_starred,
        isCrashed: resp.data?.is_crashed,
        attachmentList: resp.data?.attachements,
      };

      data.is_starred === 1 ? setIsStar(true) : setIsStar(false);
      renderImage(data.body).then((res) => {
        data.body = res;
        setMailData(data);
        setopenPrintcall(false);
        if (!loading) {
          setLoading(false);
        }
      });
    }
  };

  const handlePrint = () => {
    setopenPrintcall(true);
    getMail(props?.mailId);
  };

  const getListDesignation = async () => {
    const resp = await Api.ApiHandle(`${GET_LIST_DESIGNATION}`, "", "GET");

    if (resp?.status === 1) {
      const _options = [];
      resp?.data.forEach((list, i) => {
        if (userData[0]?.id !== list?.id) {
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

  const getFrequentAddresses = async () => {
    const resp = await Api.ApiHandle(
      `${FREQUENT_ADDRESSES}${userData[0]?.id}?type=${props?.isMostFrequent}`,
      "",
      "GET"
    );

    if (resp?.status === 1) {
      const _commonAddresses = [];
      resp?.data?.map((com) => {
        const common = {
          id: com?.id,
          branch: com?.branch,
          designation: com?.designation,
        };
        _commonAddresses.push(common);
      });

      setCommonAddresses(_commonAddresses);
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

  const logprint = () => {
    let logData = {
      type: "PRINT",
      mail_id: mailData.id,
    };
    Api.ApiHandle(LOGS_ADD, logData, "POST");
  };

  const handleToData = (to) => {
    setTo(to);
  };

  const handleSendComment = async () => {
    if (to.length <= 0) {
      Toaster("error", "To field cannot be empty");
    } else {
      to.map(async (toID) => {
        let payload = {
          to: toID.id,
          mail_id: props?.mailId,
          from: userData[0]?.id,
        };
        if (inputCommentData !== "") {
          payload.comment = inputCommentData;
        }
        const resp = await Api.ApiHandle(`${COMMENT_ON_MAIL}`, payload, "POST");

        if (resp.status !== 1) {
          Toaster("error", resp.message);
        } else {
          setInputCommentData("");
          Toaster("success", `Message sent successfully to ${toID.label} `);
          setTo("");
          setRecentCommentid(inputCommentData);

          if (props.inboxData.length > 1 && props.selected === "unread") {
            updateMailOnComment(props.mailId);
            openNextMail();
          }
        }
      });
      // setEdit(false);
      if (props?.mailId) await getMail(props?.mailId);
    }
  };

  const updateMailOnComment = async (id) => {
    let index = 0;
    props.inboxData.forEach((mail, i) => {
      if (mail.id === props.mailId) index = i;
    });

    if (props.selected === "sent") {
      if (props.inboxData[index].fromIsRead === 0) {
        props.inboxData[index].fromIsRead = 1;
        const payload = { from_is_read: 1 };

        await Api.ApiHandle(`${UPDATE_MAIL}/${id}`, payload, "PUT");
      }
    } else {
      let payload = {};
      if (
        props?.userData?.designations[0]?.id == props.inboxData[index].from_id
      ) {
        if (props.inboxData[index].fromIsRead === 0) {
          props.inboxData[index].fromIsRead = 1;
          payload = { from_is_read: 1 };
        }
      } else {
        if (props.inboxData[index].isRead === 0) {
          props.inboxData[index].isRead = 1;
          payload = { is_read: 1 };
        }
      }
      if (props.inboxData[index].isRead === 0) {
        props.inboxData[index].isRead = 1;
        if (props.inboxData[index].isCrashed === 1) {
          props.inboxData[index].isCrashed = 1;
          payload.is_crashed = 0;
        }
      }
      if (
        payload.hasOwnProperty("is_read") ||
        payload.hasOwnProperty("from_is_read")
      ) {
        await Api.ApiHandle(`${UPDATE_MAIL}/${id}`, payload, "PUT");

        // if (resp?.status) setUnreadMails(unreadMails - 1);
      }
    }
  };

  const openNextMail = () => {
    let index = 0;
    props.inboxData.forEach((mail, i) => {
      if (mail.id === props.mailId) index = i + 1;
    });

    if (props.inboxData.length > index) {
      scrollToTop();
      props.setMailId(props.inboxData[index].id);
      props.getAllMails("unread");
    }
  };

  //downaload the attachment files
  const downlaodAttachment = (dis, attachements) => {
    let logData = {
      type: "DOWNLOAD",
      mail_id: mailData.id,
      attach_id: attachements.id,
    };

    Api.ApiHandle(LOGS_ADD, logData, "POST");

    let url = "";
    if (attachements.host == null) {
      url = attachements.url;
    } else {
      url = attachements.host + attachements.url;
    }
    let headers = {};
    if (localStorage.getItem("auth")) {
      headers.Authorization = `Bearer ${localStorage.getItem("auth")}`;
    }
    let apiurl = `${process.env.REACT_APP_BASE_API_URL}/api/attachment/download/${attachements.id}`;
    let name = url.split("/");
    dis.target.style.display = "none";
    dis.target.parentElement.querySelector(".spinner-border").style.display =
      "inline-block";
    Axios.get(apiurl, { responseType: "arraybuffer", headers: headers })
      .then((res) => {
        fileDownload(res.data, name[name.length - 1]);
        dis.target.parentElement.querySelector(
          ".spinner-border"
        ).style.display = "none";
        dis.target.style.display = "inline-block";
        // Toaster("success", "Download File Successfully");
      })
      .catch(function (error) {
        Toaster("error", error.message);
      });
    // url.split("/");
    // const a = document.createElement("a");
    // a.href = url;
    // a.download = url.split("/").pop();
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
  };

  const viewAttachment = (attachements) => {
    let url = "";
    if (attachements.host == null) {
      url = attachements.url;
    } else {
      url = attachements.host + attachements.url;
    }

    url.split("/");

    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleScrollingClick = () => {
    commentBoxRef?.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputCommentData = (e) => {
    setInputCommentData(e.target.value);
  };

  const handlePreDefinedComment = (com) => {
    setInputCommentData(com);
  };

  const handleSelectFolder = async (folderId) => {
    await updateMail({ folder: folderId });
    await getMail(props?.mailId);
  };

  const handleDeleteSelectedFolder = async () => {
    await updateMail({ folder: null });
    await getMail(props?.mailId);
  };

  const updateMail = async (payload) => {
    const resp = await Api.ApiHandle(
      `${UPDATE_MAIL}/${props?.mailId}`,
      payload,
      "put"
    );
  };

  const handleIsStar = () => setIsStar((isStar) => !isStar);

  const scrollToTop = () =>
    topRef.current.scrollIntoView({ behavior: "smooth" });

  const handleHistory = () => {
    setisTrack(true);
  };

  const handleTrackCloseModal = () => {
    setisTrack(false);
  };

  const handleTrackOpenModal = () => {
    setisTrack(true);
  };
  const handleFrequentAddresses = (common, id) => {
    let selectedOption = {
      value: common,
      label: common,
      id: id,
    };
    setTo((prev) => [...prev, selectedOption]);
    setCommonAddresses(commonAddresses.filter((item) => item?.id !== id));
  };

  // const replyButton = () => {
  //   let selectedOption = {
  //     value: `${mailData?.from}-${mailData?.branch}`,
  //     label: `${mailData?.from}-${mailData?.branch}`,
  //     id: `${mailData?.fromId}`,
  //   };
  //   setTo((prev) => [...prev, selectedOption]);
  //   // handleScrollingClick();
  // };

  const onClickAnnotation = async (start, end) => {
    setStartChar(start);
    setEndChar(end);
    const resp = await Api.ApiHandle(
      `${ANNOTATION_ADD}?mailid=${props?.mailId}&start=${start}&end=${end}&designationId=${userData[0]?.id}`,
      "",
      "GET"
    );
    if (resp.status == 1) {
      setselectedAnnotation(resp.data);
      setshowAnnotationButtons(false);
      setOpen("open");
    }
  };

  const getCommentData = async () => {
    const resp = await Api.ApiHandle(
      `${GET_COMMENTS}/${props?.mailId}`,
      "",
      "GET"
    );
    if (resp?.status === 1) {
      const _commentData = [];
      resp?.data?.map((comment) => {
        const comments = {
          id: comment?.id,
          fromDesignationName: comment?.From?.designation,
          fromBranchName: comment?.From?.branch,
          toId: comment?.To?.id,
          toDesignationName: comment?.To?.designation,
          toBranchName: comment?.To?.branch,
          commentData: comment?.comment,
          updatedTime: comment?.updatedAt,
        };
        _commentData.push(comments);
      });
      setGeneralCommentData(_commentData);
      // if (_commentData.length > 0) setOpenTextBox(false);
    } else {
      Toaster("error", "Some Error Occured while getting comments");
    }
  };

  // const handleBeforeAnnot = (selectedDetails) => {
  //   setselectedData(selectedDetails);
  //   setshowAnnotationButtons(true);
  //   setOpen(false);
  // };

  const handleHighlightButton = (backgr, color_id) => {
    setColorID(color_id);
    setColor(backgr);
    setshowAnnotationButtons(true);
    setOpen("close");
  };

  const handleAnnotCommnet = () => {
    if (windowDoc?.getSelection() === null) {
      Toaster("error", "Select text again !!");
    }
    if (windowDoc?.getSelection()?.toString() === "") {
      Toaster("error", "Please select some Text !!");
    } else {
      setBeforeSelectedAnnotation(windowDoc.getSelection().toString());
      setselectedAnnotation([]);
      setshowAnnotationButtons(false);
      setOpen("open");
    }
  };
  const handleAnnotMark = async () => {
    let selectedtext = PostHighlight("selector", color, 1);
    // console.log(selectedtext);
    if (selectedtext.start != selectedtext.end) {
      selectedtext.color_id = colorID;
      selectedtext.mail_id = props?.mailId;
    }
    const commentData = {
      anno_text: selectedtext.text,
      start_char: selectedtext.start,
      end_char: selectedtext.end,
      color_code_id: selectedtext.color_id,
      degn_id: userData[0]?.id,
      mailid: selectedtext.mail_id,
    };

    const resp = await Api.ApiHandle(ANNOTATION_ADD, commentData, "POST");
    if (resp?.status === 1) {
      Toaster("success", "Highlighted successfully");
    }
    setshowAnnotationButtons(false);
  };
  const getAllAnnotation = async () => {
    const resp = await Api.ApiHandle(
      `${ANNOTATION_ADD}?mailid=${props?.mailId}`,
      "",
      "GET"
    );
    if (resp.status == 1) {
      setallAnnotation(resp.data);
    }
  };

  // const handleAnnotCommnet = () => {
  //   setshowAnnotationButtons(false);
  //   setOpen(true);
  // };
  // const handleAnnotMark = async () => {
  //   let selectedtext = PostHighlight("selector", color,1);
  //   // console.log(selectedtext);
  //   if (selectedtext.start != selectedtext.end) {
  //     selectedtext.color_id = colorID;
  //     selectedtext.mail_id = props?.mailId;
  //   }
  //   const commentData = {
  //     anno_text: selectedtext.text,
  //     start_char: selectedtext.start,
  //     end_char: selectedtext.end,
  //     color_code_id: selectedtext.color_id,
  //     degn_id: userData[0]?.id,
  //     mailid: selectedtext.mail_id,
  //   };

  //   const resp = await Api.ApiHandle(ANNOTATION_ADD, commentData, "POST");
  //   setshowAnnotationButtons(false);
  // };
  // const getAllAnnotation = async () => {
  //   const resp = await Api.ApiHandle(
  //     `${ANNOTATION_ADD}?mailid=${props?.mailId}`,
  //     "",
  //     "GET"
  //   );
  //   if (resp.status == 1) {
  //     setallAnnotation(resp.data);
  //   }
  // };

  const closeMarginNotes = () => {
    setselectedAnnotation([]);
    setBeforeSelectedAnnotation("");
    setOpen("close");
  };

  return (
    <>
      {props?.mailId && !loading ? (
        <div className="mt-4" ref={topRef}>
          <div
            className="row px-4"
            style={{ borderBottom: "0.5px solid black" }}
          >
            <div className="col-9">
              <h4 className="title font-18 text-color-1">{mailData.subject}</h4>
              <div className="text-ul">
                <ul className="list-inline">
                  {mailData?.op !== null && mailData?.op !== "" ? (
                    <li>Ops Name: {mailData.op}</li>
                  ) : (
                    ""
                  )}
                  <li>Date: {mailData?.createdAt}</li>
                  {mailData?.isCrashed !== null && (
                    <li style={{ color: "red" }}>(Crash Message)</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="col-3">
              <ul className="d-flex g-1">
                <li
                  className="mr-n1"
                  onClick={() => {
                    handleHistory();
                  }}
                >
                  <div className="btn btn-trigger btn-icon btn-tooltip">
                    <em className="icon ni ni-navigate-fill"></em>
                  </div>
                </li>

                {props?.selected !== "sent" && (
                  <li className="mr-n1">
                    <div className="my-dropdown">
                      <div className="btn btn-trigger btn-icon btn-tooltip">
                        <em
                          className="icon ni ni-folder-fill"
                          onClick={() => Openfolderlist()}
                        ></em>
                      </div>
                      <div className="dropdown-content">
                        <ul className="nk-ibx-label">
                          {openFolderList &&
                            props.folderList.map((folder, id) => {
                              return (
                                <li
                                  onClick={() => handleSelectFolder(folder?.id)}
                                >
                                  <div>
                                    <em
                                      className="icon ni ni-folder-fill font-22"
                                      style={{ color: folder?.folderColor }}
                                    ></em>
                                    <span className="nk-ibx-label-text">
                                      {folder?.folderName}
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

                {/* <li className="mr-n1">
                <div className="asterisk">
                  <div className="btn btn-trigger btn-icon btn-tooltip">
                    <em className="asterisk-off icon ni ni-star"></em>
                    <em className="asterisk-on icon ni ni-star-fill"></em>
                  </div>
                </div>
              </li> */}

                {props?.selected !== "sent" && (
                  <li className="mr-n1">
                    <div className="asterisk">
                      <div
                        className="btn btn-trigger btn-icon btn-tooltip"
                        onClick={handleIsStar}
                      >
                        <a>
                          <em
                            className={`asterisk-${
                              mailData?.is_starred === 1 ? "on" : "off"
                            } icon ni ni-star${
                              mailData?.is_starred === 1 ? "-fill" : ""
                            }`}
                            style={{
                              position: "absolute",
                              bottom: -15,
                              cursor: "pointer",
                            }}
                          ></em>
                        </a>
                      </div>
                    </div>
                  </li>
                )}

                <li
                  className="mr-n1"
                  style={{
                    marginLeft: `${props?.selected !== "sent" ? "35px" : ""}`,
                  }}
                  onClick={() => {
                    // handlePrint();
                    logprint();
                  }}
                >
                  <div className="btn btn-trigger btn-icon btn-tooltip">
                    <em
                      onClick={handlePrint}
                      className="icon ni ni-printer-fill"
                    ></em>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          {props?.selected !== "sent" && (
            <div style={{ marginLeft: "22px", marginBottom: "10px" }}>
              <ul className="nk-ibx-tags g-1">
                {mailData?.folders && (
                  <li
                    className="btn-group is-tags"
                    style={{
                      color: mailData.folders?.Color?.text,
                      cursor: "pointer",
                    }}
                  >
                    <div
                      className="btn btn-xs btn btn-dim"
                      style={{ color: mailData?.folders?.Color?.text }}
                    >
                      {mailData?.folders?.name}
                    </div>
                    <div
                      className="btn btn-xs btn-icon btn btn-dim"
                      style={{ color: mailData?.folders?.Color.text }}
                    >
                      <em
                        className="icon ni ni-cross"
                        onClick={handleDeleteSelectedFolder}
                      ></em>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          )}

          {isTrack && (
            <div style={{ top: "-150px" }}>
              <Track
                closeModal={handleTrackCloseModal}
                openModal={handleTrackOpenModal}
                visible={isTrack}
                mail_id={mailData.id}
              />
            </div>
          )}

          <div className="col-md-11">
            <Commentbox
              // commentDataRef={commentBoxCommentData}
              // onScrollingClick={handleScrollingClick}
              generalCommentData={generalCommentData}
              inputCommentData={inputCommentData}
              mailId={props.mailId}
              updateComment={recentCommentid}
            />
            {props?.selected === "sent" && (
              <div className="toBlock">
                <h4 className="styleTO">To:</h4>
                <h6 className="styleToName">{`${mailData?.to}(${mailData?.toBranch})`}</h6>
              </div>
            )}
          </div>

          <div className="col-md-1"></div>

          <div className="col-md-12 pb-100">
            <div className="px-2">
              <MailBody
                body={mailData?.body}
                call="3-col"
                setAnnotationDataForPrint={setAnnotationDataForPrint}
                mail_id={props?.mailId}
                userData={userData[0]}
                // allAnnotation={allAnnotation}
                onClickAnnotation={onClickAnnotation}
                setusercolorcodeObj={setusercolorcodeObj}
                // handleMarginNotes={handleMarginNotes}
                // handleBeforeAnnot={handleBeforeAnnot}
                handleHighlightButton={handleHighlightButton}
                closeMarginNotes={closeMarginNotes}
                // setshowAnnotationButtons={setshowAnnotationButtons}
              />
              {showAnnotationButtons && (
                <div className={`right-icon col3-marginButtonStatic`}>
                  <ul className="float-right ml-5">
                    <li
                      className="border-br-radius-0"
                      onClick={handleAnnotMark}
                    >
                      <a className="btn btn-icon">
                        <span className="d-flex align-items-center">
                          <em className="icon ni ni-chat"></em>
                        </span>
                      </a>
                    </li>
                    <li
                      className="border-tr-radius-0"
                      onClick={handleAnnotCommnet}
                    >
                      <a className="btn btn-icon">
                        <span className="d-flex align-items-center">
                          <em className="icon ni ni-edit"></em>
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>
              )}
              <div className={`col-md-4 col3-marginNotesStatic`}>
                {open === "open" && (
                  <MailMarginComments
                    mailId={props?.mailId}
                    color={color}
                    colorID={colorID}
                    selectedData={selectedData}
                    usercolorcodeObj={usercolorcodeObj}
                    beforeSelectedAnnotation={beforeSelectedAnnotation}
                    selectedAnnotation={selectedAnnotation}
                    closeMarginNotes={closeMarginNotes}
                    startChar={startChar}
                    endChar={endChar}
                    selected={props?.selected}
                    setOpen={setOpen}
                    type="3"
                  />
                )}
              </div>
            </div>
            <div className="mt-3 px-2">
              {mailData.attachmentList?.length > 0 && (
                <div className="col-md-12">
                  <p>
                    <strong>Attachments</strong>
                  </p>
                  <div className="attach-files">
                    <ul className="attach-list">
                      {mailData.attachmentList?.map((attachment, id) => {
                        let extent = attachment.url.split("/");
                        let attactype = extent[extent.length - 1].split(".");

                        return (
                          <li
                            className="attach-item"
                            key={id}
                            style={{
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                            }}
                          >
                            <span>
                              <em
                                className="ni ni-download"
                                style={{ paddingRight: 4 }}
                                onClick={(e) =>
                                  downlaodAttachment(e, attachment)
                                }
                              ></em>
                              <div
                                className="spinner-border"
                                role="status"
                                style={{
                                  display: "none",
                                  height: "1.5rem",
                                  width: "1.5rem",
                                }}
                              >
                                {" "}
                                <span className="sr-only">Loading...</span>
                              </div>
                              <span style={{ paddingLeft: 10 }}>
                                {attachment?.body_flag === 0
                                  ? attachment?.name
                                  : "Original Document"}
                              </span>
                            </span>
                            <br></br>
                            <span>
                              {attactype[1] &&
                              (attactype[1] == "png" ||
                                attactype[1] == "jpeg" ||
                                attactype[1] == "jpg" ||
                                attactype[1] == "pdf") ? (
                                <span
                                  onClick={() => viewAttachment(attachment)}
                                  style={{ color: "blue", cursor: "pointer" }}
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
                                <span style={{ paddingLeft: 35 }}>
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
            </div>{" "}
            {/* {props?.mailId && <Topreplaybuttons onClick={replyButton} />} */}
            <div ref={commentBoxRef} style={{ marginLeft: "-10%" }}>
              <div className="nk-ibx-reply-form nk-reply-form">
                <div className="nk-reply-form-header">
                  <div className="nk-reply-form-group">
                    <div className="nk-reply-form-input-group">
                      {/* to for the comment */}
                      <div className="nk-reply-form-input nk-reply-form-input-to">
                        <label className="label" style={{ paddingTop: 2 }}>
                          To
                        </label>
                        <Select
                          isMulti
                          name="colors"
                          options={options}
                          placeholder="
                        Enter the user Designation-Branch or Select from below..."
                          value={to}
                          onChange={handleToData}
                          isClearable={true}
                        />
                      </div>
                      <div className="nk-reply-form-tools">
                        <ul
                          className="nk-reply-form-actions g-1"
                          style={{ flexWrap: "wrap" }}
                        >
                          {commonAddresses?.map((com, i) => {
                            return (
                              <li
                                key={`commonAddresses${i}`}
                                className="mr-2"
                                onClick={() =>
                                  handleFrequentAddresses(
                                    `${com?.designation}-${com?.branch}`,
                                    com?.id
                                  )
                                }
                              >
                                <div className="frequent_addresses_button">{`${com?.designation}-${com?.branch}`}</div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="no-select">
                  <div className="nk-reply-form-editor">
                    <div className="nk-reply-form-field">
                      <textarea
                        className="form-control form-control-simple no-resize"
                        placeholder="Enter Comments..."
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

                  <div className="nk-reply-form-tools">
                    <ul className="nk-reply-form-actions g-1">
                      <li className="mr-2">
                        <button
                          className="btn btn-primary"
                          type="submit"
                          onClick={() => handleSendComment()}
                        >
                          Send
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : loading ? (
        <div style={{ marginLeft: "36%", marginTop: "38%" }}>
          <Loading />
        </div>
      ) : (
        Object.keys(mailData).length <= 0 && (
          <div style={{ marginLeft: "36%", marginTop: "calc(100vh - 450px)" }}>
            <h4>No Mails Selected</h4>
          </div>
        )
      )}
      {openPrintcall && (
        <div
          className="printElement"
          id="printElement"
          style={{ overflow: "auto", height: "0px" }}
          // style={{ display: "block", overflow: "auto" }}
        >
          <PrintView
            // ref={printRef}
            call="3-col-print"
            // annotationDataForPrint={annotationDataForPrint}
            annotationText={annotationText}
            subject={mailData?.subject}
            generalCommentData={generalCommentData}
            op={mailData?.op}
            toBranch={mailData?.toBranch}
            to={mailData?.to}
            time={mailData?.createdAt}
            body={mailData?.body}
            mailId={props?.mailId}
            crashed={mailData?.isCrashed}
            updateComment={recentCommentid}
          />
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  folderList: state.folderList,
  searchText: state.searchText,
  station: state.station,
  isActiveModule3Column: state.isActiveModule3Column,
  userData: state.userData,
});

export default connect(mapStateToProps)(Viewcommentbox);
