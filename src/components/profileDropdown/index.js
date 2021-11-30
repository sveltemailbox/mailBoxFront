import React, { useState } from "react";

import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import * as Api from "../../util/api/ApicallModule";
import { LOGOUT, SWITCH_USER } from "../../config/constants";
import {
  updateActiveModule,
  updateSeachText,
} from "../../redux/action/InboxAction";
import MarkLeave from "../navbar/MarkLeave";

const ProfileDropdown = ({ showData, ...props }) => {
  const history = useHistory();

  const [operateMarkLeave, setOperateMarkLeave] = useState(false);

  const signOut = async () => {
    const resp = await Api.ApiHandle(LOGOUT, {}, "POST");

    if (resp.status === 1) {
      props.updateActiveModule("Unread");
      props.updateSeachText("");
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

    const resp = await Api.ApiHandle(
      SWITCH_USER,
      { designation_id: id, current_desgi_id: currentDesgiId },
      "post"
    );

    if (resp.status === 1) {
      props.setSwitchUser(true);
      props.setSwitchUserData({ name: {}, isLoading: false });
      props.updateActiveModule("Unread");
      localStorage.setItem("auth", resp.data);
      props.getUserData();
    }
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

          <div className="seprator">
            <div
              className="profile-button-usercard"
              onClick={() => history.push("/re_password")}
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
};

const mapStateToProps = (state) => ({
  userData: state.userData,
});

export default connect(mapStateToProps, mapActionToProps)(ProfileDropdown);
