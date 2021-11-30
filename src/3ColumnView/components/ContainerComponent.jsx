import React, { useEffect, useState } from "react";
import * as Api from "../../util/api/ApicallModule";
// import Toaster from "../../util/toaster/Toaster";
import Sidebar from "../views/Sidebar";
import Inbox from "../views/Inbox";
// import CommentBox from "../views/Commentbox";
import Viewcommentbox from "../views/Viewcommentbox";
import { connect } from "react-redux";
import { GET_ALL_MAIL, UPDATE_MAIL } from "../../config/constants";
import { formatDate } from "../../util/dateFormat/DateFormat";
import ComposeMail from "../../components/sidebar/composeMail";
import Modal from "react-modal";

let page = 1;
let limit = 15;
let total = limit;
const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0)",
    height: "0px",
    width: "0px",
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
const Container = (props) => {
  const [inboxData, setInboxData] = useState([]);
  const [selected, setSelected] = useState("unread");
  const [unreadMails, setUnreadMails] = useState(0);
  const [totalMails, setTotalMails] = useState(0);
  const [mailId, setMailId] = useState("");
  const [visiable, setVisiable] = useState(false);

  const openComposeModel = () => {
    setVisiable(true);
  };

  const closeComposeModel = () => setVisiable(false);

  useEffect(() => {
    if (Object.keys(props.userData).length) {
      getAllMails(selected);
    }
  }, [props?.userData?.designations]);

  useEffect(() => {
    if (Object.keys(props.userData).length) getAllMails(selected);
    setMailId("");
  }, [props.searchText]);

  useEffect(() => {
    if (Object.keys(props.userData).length) getAllMails(selected);
    setMailId("");
  }, [props?.station]);

  useEffect(() => {
    if (Object.keys(props.userData).length) getAllMails(selected);
  }, [props?.sortFilter]);

  useEffect(() => {
    setMailId("");
  }, [selected]);

  const filterCheck = (selectedOption) => {
    setSelected(selectedOption);
    let filter = "";
    if (typeof selectedOption === "string") {
      switch (selectedOption) {
        case "unread":
          filter = "&is_read=0";
          break;
        case "archive":
          filter = "";
          break;
        case "sent":
          filter = "&is_sent=1";
          break;
        case "crashed":
          filter = "&is_crashed=0&is_crashed=1";
          break;
        case "starred":
          filter = "&is_starred=1";
          break;

        default:
          filter = "";
      }
    } else {
      filter = `&folder=${selectedOption}`;
    }
    return filter;
  };

  const getAllMails = async (selectedOption) => {
    // setInboxData([]);
    page = 1;
    let filter = filterCheck(selectedOption);
    let url = `${GET_ALL_MAIL}${props?.userData?.designations[0]?.id}&limit=${limit}&pageNo=${page}${filter}`;

    if (props?.sortFilter !== "") {
      url += `&${props?.sortFilter}`;
    }

    if (Object.keys(props.searchText).length > 0) {
      url += `&search_data=${props?.searchText?.searchData.join()}`;
    }

    if (props?.station?.length > 0) {
      url += `&by_stations=[${props?.station}]`;
    }
    const resp = await Api.ApiHandle(url, "", "GET");

    const mailData = [];
    if (resp.status === 1) {
      // props.updateUnreadMailsCount(resp.data?.unreadCount);
      // setNoOfMails(resp.data?.count);
      setUnreadMails(resp?.data?.unreadCount);
      setTotalMails(resp?.data?.count);
      resp.data.data.map((inbox) => {
        const obj = {
          id: inbox?.id,
          from: inbox?.Source?.designation,
          actualFormId: inbox?.From?.id,
          branch: inbox?.Source?.branch,
          from_id: inbox?.From?.id,
          subject: inbox?.subject,
          toBranch: inbox?.To?.branch,
          toDesignation: inbox?.To?.designation,
          op: inbox?.op,
          timeStamp: formatDate(inbox?.updatedAt),
          isRead: inbox?.is_read,
          isStarred: inbox?.is_starred,
          isCrashed: inbox?.is_crashed,
          fromIsRead: inbox?.from_is_read,
        };

        mailData.push(obj);
      });
      total = resp.data?.data?.length;

      setInboxData(mailData);
    }
  };

  const updateMail = async (id, index) => {
    setMailId(id);
    if (selected === "sent") {
      if (
        inboxData[index].fromIsRead === 0 &&
        props.userData.designations[0].id === inboxData[index].actualFormId
      ) {
        inboxData[index].fromIsRead = 1;
        const payload = { from_is_read: 1 };

        await Api.ApiHandle(`${UPDATE_MAIL}/${id}`, payload, "PUT");
      }
    } else {
      let payload = {};
      if (props?.userData?.designations[0]?.id == inboxData[index].from_id) {
        if (inboxData[index].fromIsRead === 0) {
          inboxData[index].fromIsRead = 1;
          payload = { from_is_read: 1 };
        }
      } else {
        if (inboxData[index].isRead === 0) {
          inboxData[index].isRead = 1;
          payload = { is_read: 1 };
        }
      }
      if (inboxData[index].isRead === 0) {
        inboxData[index].isRead = 1;
        if (inboxData[index].isCrashed === 1) {
          inboxData[index].isCrashed = 1;
          payload.is_crashed = 0;
        }
      }
      if (
        payload.hasOwnProperty("is_read") ||
        payload.hasOwnProperty("from_is_read")
      ) {
        const resp = await Api.ApiHandle(
          `${UPDATE_MAIL}/${id}`,
          payload,
          "PUT"
        );

        if (resp?.status) setUnreadMails(unreadMails - 1);
      }
    }
  };

  const getNextClick = async (data) => {
    const mailData = [];
    setMailId("");

    page = page + 1;
    let filter = filterCheck(selected);
    let url = `${GET_ALL_MAIL}${props?.userData?.designations[0]?.id}&limit=${limit}&pageNo=${page}${filter}`;

    if (props?.sortFilter !== "") {
      url += `&${props?.sortFilter}`;
    }

    if (Object.keys(props.searchText).length > 0) {
      url += `&search_data=${props?.searchText?.searchData.join()}`;
    }

    if (props?.station?.length > 0) {
      url += `&by_stations=[${props?.station}]`;
    }

    const resp = await Api.ApiHandle(url, "", "GET");

    if (resp.status === 1) {
      setUnreadMails(resp?.data?.unreadCount);
      setTotalMails(resp?.data?.count);
      resp.data.data.map((inbox, i) => {
        const obj = {
          id: inbox?.id,
          from: inbox?.Source?.designation,
          actualFormId: inbox?.From?.id,
          subject: inbox?.subject,
          from_id: inbox?.From?.id,
          op: inbox?.op,
          toBranch: inbox?.To?.branch,
          toDesignation: inbox?.To?.designation,
          timeStamp: formatDate(inbox?.updatedAt),
          isRead: inbox?.is_read,
          isStarred: inbox?.is_starred,
          isCrashed: inbox?.is_crashed,
          branch: inbox?.Source?.branch,
          fromIsRead: inbox?.from_is_read,
        };
        mailData.push(obj);
      });
      total = limit * page;
      total = total > resp.data?.count ? resp.data?.count : total;
      setInboxData(mailData);
    } else {
    }
  };

  const getPrevClick = async () => {
    const mailData = [];
    setMailId("");

    page = page - 1;
    let filter = filterCheck(selected);
    let url = `${GET_ALL_MAIL}${props?.userData?.designations[0]?.id}&limit=${limit}&pageNo=${page}${filter}`;

    if (props?.sortFilter !== "") {
      url += `&${props?.sortFilter}`;
    }

    if (Object.keys(props.searchText).length > 0) {
      url += `&search_data=${props?.searchText?.searchData.join()}`;
    }

    if (props?.station?.length > 0) {
      url += `&by_stations=[${props?.station}]`;
    }

    if (props?.station?.length > 0) {
      url += `&by_stations=[${props?.station}]`;
    }
    const resp = await Api.ApiHandle(url, "", "GET");

    if (resp.status === 1) {
      setUnreadMails(resp?.data?.unreadCount);
      setTotalMails(resp?.data?.count);
      resp.data.data.map((inbox, i) => {
        const obj = {
          id: inbox?.id,
          from: inbox?.Source?.designation,
          actualFormId: inbox?.From?.id,
          subject: inbox?.subject,
          from_id: inbox?.From?.id,
          op: inbox?.op,
          toBranch: inbox?.To?.branch,
          toDesignation: inbox?.To?.designation,
          timeStamp: formatDate(inbox?.updatedAt),
          isRead: inbox?.is_read,
          isStarred: inbox?.is_starred,
          isCrashed: inbox?.is_crashed,
          branch: inbox?.Source?.branch,
          fromIsRead: inbox?.from_is_read,
        };
        mailData.push(obj);
      });
      total = limit * page;
      total = total > resp.data?.count ? resp.data?.count : total;
      setInboxData(mailData);
    } else {
    }
  };

  const setMailIdState = (id) => {
    setMailId(id);
  };

  return (
    <>
      <div className="nk-content p-0">
        <div className="nk-content-inner">
          <div className="nk-content-body">
            <div className="nk-ibx">
              <Sidebar
                onClick={getAllMails}
                unreadCount={unreadMails}
                openComposeModel={openComposeModel}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="nk-ibx-body body-width bg-white">
        <Inbox
          inbox={inboxData}
          selected={selected}
          onClick={updateMail}
          mailDataLength={inboxData.length}
          totalMails={totalMails}
          getNextClick={getNextClick}
          getPrevClick={getPrevClick}
          total={total}
          getAllMails={getAllMails}
          selectedMail={mailId}
        />
      </div>

      <div
        className="col-md-7 px-0"
        style={{ borderLeft: "1px solid lightgray", marginLeft: -14 }}
      >
        <div className="my-overflow main-body jumbotron-overflow">
          <Viewcommentbox
            mailId={mailId}
            selected={selected}
            getAllMails={getAllMails}
            inboxData={inboxData}
            setMailId={setMailIdState}
          />
        </div>
      </div>
      {visiable && (
        <Modal
          // className="modal fade"
          isOpen={visiable}
          style={customStyles}
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
      {/* <CommentBox /> */}
    </>
  );
};

const mapStateToProps = (state) => ({
  userData: state.userData,
  isActiveModule3Column: state.isActiveModule3Column,
  searchText: state.searchText,
  station: state.station,
  sortFilter: state.sortFilter,
});

export default connect(mapStateToProps)(Container);
