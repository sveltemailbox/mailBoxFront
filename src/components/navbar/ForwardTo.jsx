import React, { useState, useEffect } from "react";
import Modal from "react-awesome-modal";
import { connect } from "react-redux";
import Select from "react-select";
import {
  COMMENT_ON_MAIL,
  FREQUENT_ADDRESSES,
  GET_LIST_DESIGNATION,
  GET_PRE_DEFINED_COMMENTS,
} from "../../config/constants";
import * as Api from "../../util/api/ApicallModule";
import Toaster from "../../util/toaster/Toaster";
import ComposeTo from "../common/compose_to";

function ForwardTo({ setOperateForwardTo, operateForwardTo, ...props }) {
  const [options, setOptions] = useState([]);
  const [to, setTo] = useState([]);
  const [commonAddresses, setCommonAddresses] = useState([]);
  const [preDefinedComments, setPreDefinedComments] = useState([]);
  const [actualFrequentAddress, setActualFrequentAddress] = useState([]);
  const [disableSendButton, setDisableSendButton] = useState(false);
  const [designationList, setDesignationList] = useState([]);
  const [inputCommentData, setInputCommentData] = useState("");

  useEffect(() => {
    getListDesignation();
    getFrequentAddresses();
    getPreDefinedComments();
  }, []);

  const getListDesignation = async () => {
    const resp = await Api.ApiHandle(`${GET_LIST_DESIGNATION}`, "", "GET");

    if (resp?.status === 1) {
      setDesignationList(resp?.data);

      const _options = [];
      resp?.data?.map((list) => {
        if (props?.userData?.id !== list?.id) {
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

  const handleFrequentAddresses = (common, id) => {
    setTo((prev) => [...prev, common]);
    setCommonAddresses(commonAddresses.filter((item) => item?.id !== id));
  };

  const getFrequentAddresses = async () => {
    const designation = props?.userData?.designations?.filter((item) => {
      if (item.default_desig) return item;
    });
    const resp = await Api.ApiHandle(FREQUENT_ADDRESSES, "", "GET");

    if (resp?.status === 1) {
      const _commonAddresses = [];
      resp?.data?.map((com) => {
        if (designation?.designation !== com?.designation) {
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

  const handleInputCommentData = (e) => {
    setInputCommentData(e.target.value);
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

  const handlePreDefinedComment = (com) => {
    setInputCommentData(
      inputCommentData === "" ? `${com}` : `${inputCommentData}, ${com} `
    );
  };

  const handleSendComment = async () => {
    if (to.length <= 0) {
      Toaster("error", "To Recipient is required ");
      setDisableSendButton(true);
      setTimeout(() => {
        setDisableSendButton(false);
      }, 3000);
    } else {
      setDisableSendButton(true);

      to?.forEach(async (toID, toIndex) => {
        props.selectedMail.map(async (user_mail_id, mailIndex) => {
          if (inputCommentData === "") {
            var payload = {
              to: toID.id,
              user_mail_id: user_mail_id,
            };
          } else {
            var payload = {
              to: toID.id,
              user_mail_id: user_mail_id,
              comment: inputCommentData,
            };
          }
          const resp = await Api.ApiHandle(
            `${COMMENT_ON_MAIL}`,
            payload,
            "POST"
          );

          if (resp.status !== 1) {
            if (mailIndex === props.selectedMail.length - 1) {
              Toaster("error", "Some error occurred");
              setDisableSendButton(false);
              setOperateForwardTo(false);
            }
          } else {
            if (mailIndex === props.selectedMail.length - 1) {
              setInputCommentData("");
              props.setSelectedMail([]);
              Toaster(
                "success",
                `Message sent successfully to ${toID.designation}(${toID.branch}) `
              );
              setDisableSendButton(false);
              setTo([]);
              setOperateForwardTo(false);
            }
          }
        });
      });
    }
  };

  return (
    <Modal
      className="modal fade"
      visible={operateForwardTo}
      id="add-folder"
      width="800"
      height="auto"
      effect="fadeInUp"
    >
      <div className="nk-reply-form-header">
        <div className="nk-reply-form-group">
          {/* <div className="nk-reply-form-title d-sm-none">Reply</div> */}
          <div className="nk-reply-form-input-group">
            <div className="mark-leave-tag-container">
              <h2 style={{ fontSize: "161%" }}>Forward To...</h2>
              <em
                className="icon ni ni-cross"
                onClick={() => {
                  setOperateForwardTo(false);
                }}
              ></em>
            </div>
            <hr></hr>
            {/* to for the comment */}

            <ComposeTo
              to={to}
              designationList={designationList}
              setTo={setTo}
              commonAddresses={commonAddresses}
              handleFrequentAddresses={handleFrequentAddresses}
              isFullSize={true}
            />
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
                  onClick={() => handlePreDefinedComment(com.comments)}
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
                onClick={handleSendComment}
                disabled={disableSendButton}
              >
                Send
              </button>
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}

const mapStateToProps = (state) => ({
  userData: state.userData,
});

export default connect(mapStateToProps)(ForwardTo);
