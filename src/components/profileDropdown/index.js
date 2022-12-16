import React, { useState } from "react";

import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import * as Api from "../../util/api/ApicallModule";
import { LOGOUT, SWITCH_USER } from "../../config/constants";
import {
  updateActiveModule,
  updateSeachText,
  updateUnreadMailsCount,
  updateUserData,
  updateUnreadCall,
  updateSwitching,
  updateArchiveCall,
  updateAllCall,
  updateSentCall,
  updateCrashedCall,
  updateStarredCall,
  clearUnreadCache,
} from "../../redux/action/InboxAction";
import MarkLeave from "../navbar/MarkLeave";

const ProfileDropdown = ({ showData, ...props }) => {
  const history = useHistory();
  const role = useSelector((state) => state?.userData?.role);

  const [operateMarkLeave, setOperateMarkLeave] = useState(false);
  let logData = {};
  const logDataFunction = (type, mail_id, attachId) => {
    logData = {
      type: type,
      mail_id: mail_id,
      attach_id: attachId,
    };
  };
  const signOut = async () => {
    logDataFunction("LOGOUT", 0, 0);
    const resp = await Api.ApiHandle(LOGOUT, {}, "POST", logData);
    if (resp && resp.status === 1) {
      props.updateActiveModule("Unread");
      props?.updateUnreadMailsCount(0);
      props.updateUnreadCall(0);
      props.updateAllCall(0);
      props.updateArchiveCall(0);
      props.updateAllCall(0);
      props.updateSentCall(0);
      props.updateCrashedCall(0);
      props.updateStarredCall(0);
      props.updateSeachText("");
      props.clearUnreadCache();
      props.updateUserData({});
      clearInterval(props.autoRefreshIntervalUnread);
      clearInterval(props.autoRefreshIntervalAll);
      clearInterval(props.autoRefreshIntervalCrashed);
      localStorage.removeItem("_expiredTime");
      localStorage.removeItem("auth");
      history.push("/");
    }
  };

  const switchUser = async (id) => {
    let usersInfo = {};
    let currentDesgiId = 0;
    props?.userData?.designations.forEach((item) => {
      if (item.default_desig) {
        currentDesgiId = item.id;
        usersInfo.currentDesgi = item.designation;
      }
      if (id === item.id) usersInfo.prevDesgi = item.designation;
    });

    props.setSwitchUserData({ name: usersInfo, isLoading: true });
    logDataFunction("SWITCH USER", 0, 0);
    const resp = await Api.ApiHandle(
      SWITCH_USER,
      { designation_id: id, current_desgi_id: currentDesgiId },
      "post",
      logData
    );

    if (resp.status === 1) {
      props.setSwitchUser(true);
      props.setSwitchUserData({ name: {}, isLoading: false });
      props.updateSwitching(true);

      props.updateActiveModule("Unread");
      localStorage.setItem("auth", resp.data);
      props.getUserData();
    }
  };

  const handleClick = () => {
    const modal = document.getElementById("myModal");
    const menu = document.querySelector(".dropdown-menu");
    menu.style.display = "none";
    console.log(menu);
    modal.style.display = "block";
  };

  return (
    <>
      {operateMarkLeave && (
        <MarkLeave
          operateMarkLeave={operateMarkLeave}
          setOperateMarkLeave={setOperateMarkLeave}
        />
      )}
      <div
        className={`dropdown-menu dropdown-menu-md dropdown-menu-right ${
          showData ? "show" : ""
        }`}
        style={{
          position: "absolute",
          transform: "translate3d(-226px, 36px, 0px)",
          top: "0px",
          left: "-30px",
          willChange: "transform",
        }}
      >
        {Object.keys(props.userData).length > 0 &&
          props?.userData?.designations.map((item, i) => (
            <div
              className={`dropdown-inner user-card-wrap d-none d-md-block ${
                item.default_desig && "bg-lighter"
              } ${!item.default_desig && "cursor-pointer"}`}
              key={`userProfile${i}`}
              onClick={() => !item.default_desig && switchUser(item.id)}
            >
              <div className="user-card">
                <div className="user-info">
                  <span className="lead-text text-uppercase">
                    {item?.designation !== "" && item?.branch !== ""
                      ? `${item?.designation}(${item?.branch})`
                      : item?.designation !== "" && item?.branch === ""
                      ? `${item?.designation}`
                      : item?.designation === "" && item?.branch !== ""
                      ? `${item?.branch}`
                      : item?.designation === "" && item?.branch === ""
                      ? `-`
                      : `-`}
                  </span>
                </div>
              </div>
            </div>
          ))}

        <div className="list-inline">
          <div className="seprator">
            <div
              className="profile-button-usercard"
              onClick={() => history.push("/preferences")}
            >
              <em
                style={{ marginRight: 5 }}
                className="icon ni ni-notes-alt"
              ></em>
              <span>Preferences</span>
            </div>
          </div>

          {role ? (
            <div className="seprator">
              <div className="profile-button-usercard" onClick={""}>
                <em
                  style={{ marginRight: 5 }}
                  className="icon ni ni-notes-alt"
                ></em>
                <span>Go To IMS</span>
              </div>
            </div>
          ) : (
            ""
          )}

          <div className="seprator">
            <div
              className="profile-button-usercard"
              onClick={() =>
                history.push({
                  pathname: "/re_password",
                  state: {
                    showBackButton: true,
                  },
                })
              }
            >
              <em
                style={{ marginRight: 5 }}
                className="icon ni ni-shuffle"
              ></em>
              Change Password
            </div>
          </div>

          {/* <div className="seprator">
            <div
              className="profile-button-usercard"
              onClick={() =>
                history.push({
                  pathname: "/update_profile",
                  state: {
                    showBackButton: true,
                  },
                })
              }
            >
              <em
                style={{ marginRight: 5 }}
                className="icon ni ni-user-alt"
              ></em>
              Update Profile
            </div>
          </div> */}
          <div
            className="seprator"
            style={{ marginLeft: "10px" }}
            onClick={handleClick}
          >
            <div className="help-section">
              <span className="help-section-icon">?</span>
              <span style={{ marginTop: 10 }}>Help</span>
            </div>
          </div>

          {/* <div className="seprator">
            <div
              className="profile-button-usercard"
              onClick={() =>
                setOperateMarkLeave((operateMarkLeave) => !operateMarkLeave)
              }
            >
              <em
                style={{ marginRight: 5 }}
                className="icon ni ni-calendar-check-fill"
              ></em>
              Mark Leave
            </div>
          </div> */}

          <div className="seprator">
            <button type="button" className="sign-out-button" onClick={signOut}>
              <div className="signout-button-icon">
                <em className="icon ni ni-signout mr-1"></em>
                <span>Sign out</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const mapActionToProps = {
  updateActiveModule,
  updateSeachText,
  updateUnreadMailsCount,
  updateUserData,
  updateUnreadCall,
  updateSwitching,
  updateArchiveCall,
  updateAllCall,
  updateSentCall,
  updateCrashedCall,
  updateStarredCall,
  clearUnreadCache,
};

const mapStateToProps = (state) => ({
  userData: state.userData,
});

export default connect(mapStateToProps, mapActionToProps)(ProfileDropdown);
