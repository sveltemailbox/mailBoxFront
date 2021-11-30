import { useState } from "react";
import { useHistory } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import { CHANGE_PASSWORD, LOGS_ADD } from "../config/constants";
import * as Api from "../util/api/ApicallModule";
import "../Assets/CSS/dashlite.css";
import Toaster from "../util/toaster/Toaster";
import {
  updateActiveModule,
  updateSeachText,
} from "../redux/action/InboxAction";
import { connect } from "react-redux";

const ChangePassword = (props) => {
  const history = useHistory();

  const [oldPassword, setOldPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const [error, setError] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const payload = {
      oldPassword: oldPassword,
      newPassword: newPassword,
      renewPassword: rePassword,
    };
    if (oldPassword === "") {
      setError("* The current password field is required.");
    } else if (newPassword === "") {
      setError("* The new password field is required.");
    } else if (rePassword === "") {
      setError("* The confirm password field is required.");
    } else if (oldPassword === newPassword) {
      setError("* old password and new password cannot be same.");
    } else if (newPassword !== rePassword) {
      setError(`* The new password and confirmation password do not match.`);
    } else {
      const resp = await Api.ApiHandle(`${CHANGE_PASSWORD}`, payload, "PUT");

      if (resp.status === 1) {
        Toaster("success", "Password changed successfully");
        setError("");
        setNewPassword("");
        setOldPassword("");
        setRePassword("");
        signOut();
      } else {
        setError("* Your current password do not match");
      }
    }
  };

  const signOut = () => {
    let logData = {
      type: "PASSWORD CHANGE LOGOUT",
    };
    Api.ApiHandle(LOGS_ADD, logData, "POST");
    props.updateActiveModule("Unread");
    props.updateSeachText("");
    localStorage.removeItem("auth");
    history.push("/");
  };

  return (
    <>
      <div className="nk-block nk-block-middle nk-auth-body">
        <div className="nk-block-head">
          <div className="nk-block-head-content">
            <div style={{ marginBottom: 60 }}>
              <Navbar />
            </div>
            <div style={{ display: "flex" }}>
              <em
                className="icon ni ni-arrow-left"
                style={{ marginRight: "106%", marginLeft: "-112%" }}
                onClick={() => {
                  history.push("/mail");
                  props.updateActiveModule("Unread");
                }}
              ></em>
              <h5 className="nk-block-title">Change Password</h5>
            </div>
          </div>
        </div>
        <div style={{ color: "red" }}>{error !== "" ? error : ""}</div>
        <form>
          <div className="form-group">
            <label className="form-label" htmlFor="current_password">
              Current Password
            </label>
            <input
              type={showCurrentPassword ? "text" : "password"}
              className="form-control form-control-lg"
              id="current_password"
              placeholder="Enter current password..."
              name="current_password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <div
              tabIndex="-1"
              className="form-icon form-icon-right passcode-switch"
              data-target="password"
              style={{ marginTop: "4%" }}
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword && (
                <em className="passcode-icon icon-show icon ni ni-eye"></em>
              )}
              {!showCurrentPassword && (
                <em className="passcode-icon icon-show icon ni ni-eye-off"></em>
              )}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="new_password">
              New Password
            </label>
            <input
              type={showNewPassword ? "text" : "password"}
              className="form-control form-control-lg"
              id="new_password"
              placeholder="Enter new password... "
              name="new_password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div
              tabIndex="-1"
              className="form-icon form-icon-right passcode-switch"
              data-target="password"
              style={{ marginTop: "4%" }}
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword && (
                <em className="passcode-icon icon-show icon ni ni-eye"></em>
              )}
              {!showNewPassword && (
                <em className="passcode-icon icon-show icon ni ni-eye-off"></em>
              )}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="re_password">
              Confirm New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control form-control-lg"
              id="re_password"
              placeholder="Re-enter new password..."
              name="re_password"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
            />
            <div
              tabIndex="-1"
              className="form-icon form-icon-right passcode-switch"
              data-target="password"
              style={{ marginTop: "4%" }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword && (
                <em className="passcode-icon icon-show icon ni ni-eye"></em>
              )}
              {!showPassword && (
                <em className="passcode-icon icon-show icon ni ni-eye-off"></em>
              )}
            </div>
          </div>

          <div
            className="form-group"
            onClick={(e) => {
              handleChangePassword(e);
            }}
          >
            <button className="btn btn-lg btn-primary btn-block">
              Update Password
            </button>
          </div>
        </form>
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

export default connect(mapStateToProps, mapActionToProps)(ChangePassword);
