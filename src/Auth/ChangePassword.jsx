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
  updateUnreadMailsCount,
} from "../redux/action/InboxAction";
import { connect } from "react-redux";
import { validatePassword } from "../util";
import PasswordValidationFrame from "../components/common/password_validation_frame";
import Loader from "react-loader-spinner";
import HelpModal from "../components/common/HelpModal";

const ChangePassword = (props) => {
  const history = useHistory();

  const [oldPassword, setOldPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  let logData = {};
  const logDataFunction = (type, mail_id, attachId) => {
    logData = {
      type: type,
      mail_id: mail_id,
      attach_id: attachId,
    };
  };
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
      setError("");
      setLoading(true);

      let checkPasswordStrength = true;

      Object.values(validatePassword(newPassword)).forEach((item) => {
        if (!item) checkPasswordStrength = false;
      });

      if (checkPasswordStrength) {
        logDataFunction("CHANGE PASSWORD", 0, 0);
        const resp = await Api.ApiHandle(
          `${CHANGE_PASSWORD}`,
          payload,
          "PUT",
          logData
        );
        if (resp.status === 1) {
          Toaster("success", "Password changed successfully");
          setError("");
          setNewPassword("");
          setOldPassword("");
          setRePassword("");
          signOut();
        } else {
          setLoading(false);
          Toaster("error", resp.message);
        }
      } else {
        setLoading(false);
        Toaster("error", "Enter password that satisfy all requirement");
      }
    }
  };

  const signOut = () => {
    // let logData = {
    //   type: "PASSWORD CHANGE LOGOUT",
    // };
    // Api.ApiHandle(LOGS_ADD, logData, "POST");
    props.updateActiveModule("Unread");
    props.updateSeachText("");
    props?.updateUnreadMailsCount(0);
    localStorage.removeItem("auth");
    localStorage.removeItem("_expiredTime");
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
            <HelpModal />
            <div style={{ display: "flex" }}>
              {props.location.state && (
                <em
                  className="icon ni ni-arrow-left"
                  style={{ marginRight: "106%", marginLeft: "-112%" }}
                  onClick={() => {
                    history.push("/mail");
                    props.updateActiveModule("Unread");
                  }}
                />
              )}
              <h5 className="nk-block-title">
                {props.location.state
                  ? "Change Password"
                  : "Create New Password"}
              </h5>
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
          {newPassword && (
            <PasswordValidationFrame password={validatePassword(newPassword)} />
          )}
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
              {loading ? (
                <Loader type="ThreeDots" color="#FFF" height={20} width={20} />
              ) : props.location.state ? (
                "Update Password"
              ) : (
                "Create Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

const mapActionToProps = {
  updateActiveModule,
  updateUnreadMailsCount,
  updateSeachText,
};

const mapStateToProps = (state) => ({
  userData: state.userData,
});

export default connect(mapStateToProps, mapActionToProps)(ChangePassword);
