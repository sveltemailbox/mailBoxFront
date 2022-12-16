import React, { useEffect, useState } from "react";
import Modal from "react-awesome-modal";
import Select from "react-select";
import { Form, Button } from "react-bootstrap";
import * as Api from "../../util/api/ApicallModule";
import { GET_LIST_DESIGNATION, LEAVE_ENABLE } from "../../config/constants";
import { connect } from "react-redux";
import { formatDate } from "../../util/dateFormat/DateFormat";
import Loading from "../../util/loader/Loading";

function MarkLeave({ setOperateMarkLeave, operateMarkLeave, ...props }) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [leaveEnabled, setLeaveEnabled] = useState(false);
  const [options, setOptions] = useState([]);
  const [to, setTo] = useState([]);
  const [submitCheck, setSubmitCheck] = useState(false);
  const [error, setError] = useState("false");
  const [leaveID, setLeaveID] = useState(Number);
  const [leaveFrom, setLeaveFrom] = useState("");
  const [leaveTo, setLeaveTo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(false);
  let logData = {};
  const logDataFunction = (type, mail_id, attachId) => {
    logData = {
      type: type,
      mail_id: mail_id,
      attach_id: attachId,
    };
  };
  useEffect(() => {
    getListDesignation();
    getLeave();
  }, []);

  useEffect(() => {
    if (to?.value === undefined) {
      setSubmitCheck(false);
    }
  }, [to]);

  useEffect(() => {
    initialState();
  }, [operateMarkLeave]);

  const initialState = () => {
    setError("false");
    setStartDate(new Date());
    setLeaveID(Number);
    setEndDate(new Date());
    setLeaveFrom("");
    setTo([]);
    setLeaveEnabled(false);
    setLeaveTo("");
    setSubmitCheck(false);
  };

  const getLeave = async () => {
    setIsLoading(true);
    const resp = await Api.ApiHandle(`${LEAVE_ENABLE}`, "", "GET");

    if (resp?.status === 1) {
      setIsLoading(false);
      let today = new Date();
      let leaveTo = new Date(resp?.data?.leave_to);
      if (leaveTo > today) {
        setLeaveEnabled(true);
        setLeaveFrom(formatDate(resp?.data?.leave_from));
        setLeaveTo(formatDate(resp?.data?.leave_to));
        setLeaveID(resp?.data?.id);
      }
    } else {
      setIsLoading(false);
    }
  };

  const handleDateChange = (e, header, setDate) => {
    const { value } = e.target;
    let startDate = new Date();
    let endDate = new Date();
    if (header === "Starting Date" && new Date(value) < startDate) {
      setError("*Previous Start Date cannot be selected");
    } else if (header === "Ending Date" && new Date(value) < endDate) {
      setError("*Previous End Date cannot be selected ");
    } else if (
      header === "Ending Date" &&
      new Date(value) <= new Date(startDate)
    ) {
      setError("*Ending Date must be greater than Starting Date");
    } else {
      setDate(value);
      setError("");
    }
  };

  const datePicker = (header, date, setDate) => {
    return (
      <div>
        <div className="date-picker-head">{header}</div>
        <div>
          <Form.Group>
            <Form.Control
              type="datetime-local"
              name="duedate"
              placeholder="Due date"
              style={{ backgroundColor: "#C7CCFF" }}
              value={date}
              onChange={(e) => {
                handleDateChange(e, header, setDate);
              }}
            />
          </Form.Group>
        </div>
      </div>
    );
  };

  const handleToData = (to) => {
    setTo(to);
  };

  const getListDesignation = async () => {
    logDataFunction("DESIGNATION LIST", 0, 0);

    const resp = await Api.ApiHandle(
      `${GET_LIST_DESIGNATION}`,
      "",
      "GET",
      logData
    );

    if (resp?.status === 1) {
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

  const handleSubmitMarkLeave = async () => {
    setDisableSubmit(true);
    let startingDate = startDate?.split("T");
    let endingDate = endDate?.split("T");
    let params = {
      receiver: to?.id,
      leave_from: `${startingDate[0]} ${startingDate[1]}:00`,
      leave_to: `${endingDate[0]} ${endingDate[1]}:00`,
    };

    const resp = await Api.ApiHandle(`${LEAVE_ENABLE}`, params, "POST");

    if (resp.status !== 1) {
      setDisableSubmit(false);

      setError("*Some error occurred, Leave not marked");
    } else {
      setDisableSubmit(false);
      setError("");
      getLeave();
    }
  };

  const cancelLeave = async () => {
    let params = {
      leave_id: leaveID,
    };
    const resp = await Api.ApiHandle(`${LEAVE_ENABLE}`, params, "PUT");
    if (resp.status === 1) {
      setLeaveEnabled(false);
      getLeave();
      initialState();
    }
  };

  return (
    <Modal
      visible={operateMarkLeave}
      id="mark-leave"
      width="676"
      height="auto"
      effect="fadeInUp"
      onClickAway={() => {
        setSubmitCheck(false);
        setOperateMarkLeave(false);
      }}
    >
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <div className="nk-reply-form-header" style={{ borderBottom: "0px" }}>
            <div
              className="nk-reply-form-group"
              style={{ display: "flex", flexDirection: "column" }}
            >
              {!leaveEnabled && (
                <>
                  <div className="nk-reply-form-input-group">
                    <div className="mark-leave-tag-container">
                      <h2 className="mark-leave-tag">Mark Leave...</h2>
                      <em
                        className="icon ni ni-cross"
                        onClick={() => {
                          setSubmitCheck(false);
                          setOperateMarkLeave(false);
                        }}
                      ></em>
                    </div>
                    <hr style={{ marginTop: "1%" }} />
                  </div>
                  <div style={{ marginBottom: "1.5%" }}>
                    <h3 className="disclaimer-text" style={{ color: "black" }}>
                      * You can indicate your leave period here to have your
                      messages auto-forwarded to another officer, during the
                      leave.
                    </h3>
                  </div>
                  <div style={{ color: "red" }}>
                    {error !== "false" && `${error}`}
                  </div>
                  <div
                    style={{ width: "100%" }}
                    className="row justify-content-between"
                  >
                    <div>
                      {datePicker("Starting Date", startDate, setStartDate)}
                    </div>
                    {datePicker("Ending Date", endDate, setEndDate)}
                  </div>

                  <div className="message-forward-tag">
                    <div style={{ width: "67%" }}>
                      <label className="label" style={{ paddingTop: 2 }}>
                        Messages will be forwarded to
                      </label>
                      <Select
                        name="colors"
                        options={options}
                        placeholder="
                          Enter the user Designation-Branch or Select from below..."
                        value={to}
                        onChange={handleToData}
                        isClearable={true}
                        isDisabled={error === "" ? false : true}
                      />
                    </div>
                  </div>
                  <div className="submit-block">
                    <div
                      className="nk-ibx-item-elem nk-ibx-item-check checkbox"
                      style={{ zIndex: 0 }}
                    >
                      <div className="custom-control custom-control-sm custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input nk-dt-item-check"
                          id="submit-check"
                          onChange={() => {
                            to?.value !== undefined &&
                              setSubmitCheck((submitCheck) => !submitCheck);
                          }}
                          checked={submitCheck}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="submit-check"
                        ></label>
                      </div>
                    </div>
                    <div style={{ marginRight: "42%" }}>
                      I agree to have my messages auto forwarded to
                      <div style={{ fontWeight: "bold", fontStyle: "oblique" }}>
                        {!to?.value ? `______` : `${to?.value}`}
                      </div>
                      during the above LEAVE PERIOD.
                    </div>
                    <div>
                      <Button
                        onClick={handleSubmitMarkLeave}
                        // disabled={!submitCheck}
                        // disabled={disableSubmit}
                        disabled={disableSubmit ? disableSubmit : !submitCheck}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                  <div className="disclaimer">
                    <h3 className="disclaimer-text">
                      *Note: This is not to be considered as submission of leave
                      application. Only approved leave details are to be entered
                      here for the purpose of forwarding messages.
                    </h3>
                  </div>
                </>
              )}
              {leaveEnabled && (
                <div style={{ width: "100%" }}>
                  <div className="nk-reply-form-input-group">
                    <div className="mark-leave-tag-container">
                      <h2 className="mark-leave-tag">Cancel Leave...</h2>
                      <em
                        className="icon ni ni-cross"
                        onClick={() => {
                          setSubmitCheck(false);
                          setOperateMarkLeave(false);
                        }}
                      ></em>
                    </div>
                    <hr></hr>

                    <div className="submit-block">
                      <div style={{ marginRight: "39.3%" }}>
                        You are eligible for the LEAVE PERIOD from
                        <div
                          style={{ fontWeight: "bold", fontStyle: "oblique" }}
                        >
                          {leaveFrom}
                        </div>
                        to
                        <div
                          style={{ fontWeight: "bold", fontStyle: "oblique" }}
                        >
                          {leaveTo}
                        </div>
                      </div>
                      <div>
                        <Button
                          style={{ backgroundColor: "red" }}
                          onClick={cancelLeave}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

const mapStateToProps = (state) => ({
  userData: state.userData,
});

export default connect(mapStateToProps)(MarkLeave);
