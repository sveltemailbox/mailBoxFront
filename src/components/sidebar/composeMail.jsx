import { useState, useEffect, useRef, useCallback } from "react";
import Select from "react-select";
import Toaster from "../../util/toaster/Toaster";
import Axios from "axios";
import fileDownload from "js-file-download";
import {
  GET_LIST_DESIGNATION,
  FREQUENT_ADDRESSES,
  IMAGE_UPLOAD_BODY,
  COMPOSE_MAIL,
  UPLOAD_ATTACHMENT,
  UNLINK_ATTACHMENT,
} from "../../config/constants";
import * as Api from "../../util/api/ApicallModule";
import Editor from "./tinyEditor";
import DragAndDrop from "../common/drag_drop";
import ComposeTo from "../common/compose_to";

const ComposeMail = (props) => {
  const [options, setOptions] = useState([]);
  const [to, setTo] = useState([]);
  const [commonAddresses, setCommonAddresses] = useState([]);
  const [attachment, setattachment] = useState([]);
  const [disableSendButton, setDisableSendButton] = useState(false);
  const [bodyData, setBodyData] = useState("");
  const [subject, setSubject] = useState("");
  const [isFileUploading, setFileUploading] = useState(false);
  const [isFileDragging, setFileDragging] = useState(false);
  const [isFullSize, setFullSize] = useState(true);
  const [actualFrequentAddress, setActualFrequentAddress] = useState([]);
  const [containerValue, setContainerValue] = useState("");
  const [designationList, setDesignationList] = useState([]);

  const unlinkAttachedFiles = () => {
    attachment?.map(async (attach) => {
      await Api.ApiHandle(`${UNLINK_ATTACHMENT}${attach?.id}`, "", "GET");
    });
  };

  const inputAttach = useRef(null);

  useEffect(() => {
    getListDesignation();
    getFrequentAddresses();
  }, []);

  useEffect(() => {}, [attachment]);

  const getListDesignation = async () => {
    const designationId = props?.userData?.designations?.filter((item) => {
      if (item.default_desig) return item;
    })[0]?.id;
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

  const getFrequentAddresses = async () => {
    const resp = await Api.ApiHandle(FREQUENT_ADDRESSES, "", "GET");
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
      setActualFrequentAddress(_commonAddresses);

      setCommonAddresses(_commonAddresses);
    }
  };

  const handleattach = (e) => {
    inputAttach.current.click();
  };

  const onChangeAttachFile = async (e) => {
    setFileUploading(true);
    [...e.target.files].forEach(async (item) => {
      let filename = item?.name.split(".");
      filename.pop();
      let fileNameSeparation = filename.join(".");

      const data = new FormData();

      data.append("images", item);
      data.append("imagename", `${fileNameSeparation}`);
      data.append("mailId", 0);

      const resp = await Api.ApiHandle(`${UPLOAD_ATTACHMENT}`, data, "post");
      if (resp.status === 1) {
        setattachment((prev) => [...prev, resp.data]);
        setFileUploading(false);
        e.target.value = "";
      } else {
        Toaster("error", "Something went wrong!!");
        setFileUploading(false);
      }
    });
  };

  const handleFrequentAddresses = (common, id) => {
    setTo((prev) => [...prev, common]);
    setCommonAddresses(commonAddresses.filter((item) => item?.id !== id));
  };

  const handleSubject = (event) => {
    setSubject(event.target.value);
  };

  const sendMail = async () => {
    setDisableSendButton(true);

    if (to.length < 1) {
      Toaster("error", "Please Select Receiver Address");
      setDisableSendButton(false);
      setDisableSendButton(true);
      setTimeout(() => {
        setDisableSendButton(false);
      }, 3000);
      return;
    }
    if (subject == "") {
      Toaster("error", "Please enter the subject");
      setDisableSendButton(false);
      setDisableSendButton(true);
      setTimeout(() => {
        setDisableSendButton(false);
      }, 3000);
      return;
    }

    if (isFileUploading === true) {
      Toaster("error", "File uploading underway");
      setDisableSendButton(false);
    } else {
      window.tinymce.triggerSave();
      let bodyData1 = document?.getElementById("mytextarea")?.value;
      let doc = new DOMParser().parseFromString(bodyData1, "text/html");
      for (let i = 0; i < doc.getElementsByTagName("img").length; i++) {
        let base64 = doc.getElementsByTagName("img")[i].getAttribute("src");
        const imageExtention = base64MimeType(base64).split("/");

        let payload = {
          image_base64: base64,
          image_extention: imageExtention[1],
        };

        const resp = await Api.ApiHandle(
          `${IMAGE_UPLOAD_BODY}`,
          payload,
          "post"
        );
        if (resp.status === 1) {
          doc.getElementsByTagName("img")[i].setAttribute("src", resp.data.url);
        }
      }
      let final_body =
        "<html>" +
        doc.children[0].innerHTML +
        "<style>p{margin:0px}</style></html>";
      let attachIds = [];
      attachment.map((reskl) => {
        attachIds.push(reskl.id);
      });

      let toastCount = 0;
      const recipients = to.map((item) => item.id);

      const designationId = props?.userData?.designations.filter((item) => {
        if (item.default_desig) return item;
      })[0].id;
      let compose = {
        to: recipients,
        from: designationId,
        subject: subject,
        bodyData: final_body,
      };
      if (attachIds.length > 0) {
        compose.attachement_ids = attachIds.join();
      }
      const resp = await Api.ApiHandle(`${COMPOSE_MAIL}`, compose, "post");
      if (resp.status === 1) {
        toastCount += 1;
        props.closeModel();
        if (toastCount === 1) Toaster("success", "Mail sent Successfully");
        setDisableSendButton(false);
      } else {
        Toaster("error", "Mail sent error");
        setDisableSendButton(false);
      }

      // to.map(async (res) => {
      //   const designationId = props?.userData?.designations.filter((item) => {
      //     if (item.default_desig) return item;
      //   })[0].id;
      //   let compose = {
      //     to: res.id,
      //     from: designationId,
      //     subject: subject,
      //     bodyData: final_body,
      //   };
      //   if (attachIds.length > 0) {
      //     compose.attachement_ids = attachIds.join();
      //   }
      //   const resp = await Api.ApiHandle(`${COMPOSE_MAIL}`, compose, "post");
      //   if (resp.status === 1) {
      //     toastCount += 1;
      //     props.closeModel();
      //     if (toastCount === 1) Toaster("success", "Mail sent Successfully");
      //     setDisableSendButton(false);
      //   } else {
      //     Toaster("error", "Mail sent error");
      //     setDisableSendButton(false);
      //   }
      // });
    }
  };

  function base64MimeType(encoded) {
    var result = null;

    if (typeof encoded !== "string") {
      return result;
    }

    var mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

    if (mime && mime.length) {
      result = mime[1];
    }

    return result;
  }

  const downlaodAttachment = (dis, attachements) => {
    dis.target.parentElement.querySelector(".spinner-border").style.display =
      "inline-block";
    dis.target.style.display = "none";
    let apiurl = `${process.env.REACT_APP_BASE_API_URL}/api/attachment/downloadfile/${attachements.id}`;
    let headers = {};

    if (localStorage.getItem("auth")) {
      headers.Authorization = `Bearer ${localStorage.getItem("auth")}`;
    }

    Axios.get(apiurl, { responseType: "blob", headers: headers })
      .then(async (res) => {
        fileDownload(res.data, attachements?.name);
        dis.target.parentElement.querySelector(
          ".spinner-border"
        ).style.display = "none";
        dis.target.style.display = "inline-block";
      })
      .catch(function (error) {
        Toaster("error", error.message);
        dis.target.parentElement.querySelector(
          ".spinner-border"
        ).style.display = "none";
        dis.target.style.display = "inline-block";
      });
  };
  const handleRemoveAttach = async (e, id) => {
    setattachment(
      attachment.filter((res) => {
        if (res.id != id) {
          return res;
        }
      })
    );
    await Api.ApiHandle(`${UNLINK_ATTACHMENT}${id}`, "", "GET");
  };

  // check whether file is dragging
  window.ondragenter = (e) => {
    if (!isFileDragging) {
      setFileDragging(true);
    }
  };

  const maxMinHandle = () => {
    setFullSize(!isFullSize);
  };

  const updateContainerValue = (value) => {
    setContainerValue(value);
  };

  const handleDrop = (files) => {
    let fileList = [];
    for (let i = 0; i < files.length; i++) {
      if (!files[i]) return;
      fileList.push(files[i]);
    }
    fileList.forEach(async (item) => {
      let fileNameSeparation = item?.name?.split(".");
      setFileUploading(true);
      const data = new FormData();
      data.append("images", item);
      data.append("imagename", `${fileNameSeparation[0]}`);

      const resp = await Api.ApiHandle(`${UPLOAD_ATTACHMENT}`, data, "post");
      if (resp.status === 1) {
        setattachment((prev) => [...prev, resp.data]);
        setFileDragging(false);
        setFileUploading(false);
      } else {
        Toaster("error", `${resp?.message}`);
      }
      setFileUploading(false);
      setFileDragging(false);
    });
  };

  const updateFileDragging = (isTrue) => {
    setFileDragging(isTrue);
  };

  return (
    <div className="modal-dialog modal-lg" role="document">
      <div
        className="modal-content"
        id="loading"
        style={{
          position: "fixed",
          width: isFullSize ? "80%" : "500px",
          height: "fit-content",
          right: isFullSize ? 0 : "30px",
          left: isFullSize && 0,
          top: isFullSize && 0,
          bottom: isFullSize ? "6px" : 0,
          margin: "auto",
          marginTop: isFullSize && "7%",
          maxHeight: isFullSize && "70%",
          overflow: isFullSize && "auto",
          // right: 30,
        }}
      >
        <div className="modal-header" style={{ padding: "12px 20px" }}>
          <h6 className="modal-title">Compose Message </h6>
          <div className="icon" style={{ display: "flex" }}>
            <span style={{ padding: "0 10px" }} onClick={maxMinHandle}>
              <em
                className={`icon ni ni-m${isFullSize ? "in" : "ax"}imize-alt`}
              ></em>
            </span>

            <span
              onClick={() => {
                unlinkAttachedFiles();
                props.closeModel();
              }}
            >
              <em className="icon ni ni-cross-sm"></em>
            </span>
          </div>
        </div>
        <div className="modal-body p-0">
          <ComposeTo
            to={to}
            designationList={designationList}
            setTo={setTo}
            commonAddresses={commonAddresses}
            handleFrequentAddresses={handleFrequentAddresses}
            isFullSize={isFullSize}
          />
          <div className="nk-reply-form-editor">
            <div
              className="nk-reply-form-field"
              // style={{ marginTop: isFullSize ? "4%" : "7%" }}
            >
              <input
                type="text"
                className="form-control form-control-simple"
                placeholder="Subject"
                name="subject"
                onChange={handleSubject}
              />
            </div>
            <div
              className="nk-reply-form-field"
              style={{ padding: "0px", position: "relative" }}
            >
              <Editor
                isFileDragging={false}
                setBodyData={setBodyData}
                updateContainerValue={updateContainerValue}
                containerValue={containerValue}
              />
              {isFileDragging && (
                <DragAndDrop
                  handleDrop={handleDrop}
                  isFileDragging={isFileDragging}
                  updateFileDragging={updateFileDragging}
                >
                  <div style={{ height: "300px", width: "500px" }}></div>
                </DragAndDrop>
              )}

              <div
                className="col-md-12"
                style={{
                  maxHeight: "100px",
                  overflowY: "scroll",
                }}
              >
                <div>
                  {attachment?.map((attachment, id) => {
                    let extent = attachment.url.split("/");
                    let attactype = extent[extent.length - 1].split(".");
                    return (
                      <ul
                        className="attach-list"
                        style={{ width: "100%" }}
                        key={`attachmentList${id}`}
                      >
                        <li
                          className="attach-item"
                          key={id}
                          style={{ width: "100%" }}
                        >
                          <span>
                            <em
                              className="ni ni-download"
                              style={{ paddingRight: 4, fontSize: "14px" }}
                              onClick={(e) => downlaodAttachment(e, attachment)}
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

                            <span style={{ paddingLeft: 10, fontSize: "13px" }}>
                              {attachment?.body_flag === 0
                                ? attachment?.name
                                : "Original Document"}
                            </span>

                            <em
                              className="icon ni ni-cross-sm"
                              style={{
                                display: "inline-block",
                                float: "right",
                                fontSize: "18px",
                              }}
                              onClick={(e) =>
                                handleRemoveAttach(e, attachment.id)
                              }
                            ></em>
                          </span>
                        </li>
                      </ul>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="nk-reply-form-tools" style={{ padding: "10px 20px" }}>
            <ul className="nk-reply-form-actions g-1">
              <li className="mr-2">
                <button
                  className="btn btn-primary"
                  type="submit"
                  onClick={sendMail}
                  disabled={disableSendButton}
                >
                  Send
                </button>
              </li>

              <li>
                {!isFileUploading && (
                  <>
                    <a
                      className="btn btn-icon btn-sm"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Upload Attachment"
                      onClick={handleattach}
                    >
                      <em className="icon ni ni-clip-v"></em>
                    </a>
                    <input
                      type="file"
                      tabIndex="0"
                      id="file"
                      multiple
                      ref={inputAttach}
                      multiple
                      style={{ display: "none" }}
                      onChange={onChangeAttachFile}
                    />
                  </>
                )}

                {isFileUploading && (
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

            <ul className="nk-reply-form-actions g-1">
              <li
                onClick={() => {
                  unlinkAttachedFiles();
                  props.closeModel();
                }}
              >
                <div className="btn-trigger btn btn-icon mr-n2">
                  <em className="icon ni ni-trash"></em>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposeMail;
