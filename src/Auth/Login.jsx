import React, { useState, useEffect } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { isLogin } from "../util";
import * as Api from "../util/api/ApicallModule";
import {
  LOGIN,
  // GET_PREFERENCES,
  // USER_PROFILE,
  LOGS_ADD,
} from "../config/constants";
import Toaster from "../util/toaster/Toaster";
import Loader from "react-loader-spinner";
import { LogApi } from "../util/apiLog/LogApi";
import "./Login.css";
import { useDispatch } from "react-redux";
import queryString from "query-string";
import { updateAppliactionType } from "../redux/action/InboxAction";

const Login = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const { search } = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  let token = queryString.parse(search).token;
   let appType = queryString.parse(search).app_type
  const [authToken, setAuthToken] = useState();

  useEffect(() => {
    if (token) {
      handleSignIn("",token)
      // history.push("/mail");
    }
  }, [token]);

  useEffect(() => {
    const token = localStorage.getItem("auth");
    if (token) {
      setAuthToken(token);
      history.push("/mail");
    }
  }, [authToken]);

  const history = useHistory();
  let isAuthenticate = isLogin();

  const handleSignIn = async (event,isSSo) => {
    let payload;
    if(isSSo){
      payload = {
        "app_type":appType,
        token
      }
    }else {
      payload = formData
    }
    if(!isSSo){
          event.preventDefault();
    if (document.querySelector("input[name=password]").value === "") {
      document.querySelector("input[name=password]").style.border =
        "1px solid red";
      return false;
    }
    if (document.querySelector("input[name=user_name]").value === "") {
      document.querySelector("input[name=user_name]").style.border =
        "1px solid red";
      return false;
    }
  }

    setLoading(true);
    let logData = {};
    const logDataFunction = (type, mail_id, attachId) => {
      logData = {
        type: type,
        mail_id: mail_id,
        attach_id: attachId,
      };
    };

    const resp = await Api.ApiHandle(LOGIN, payload, "post");
    localStorage.setItem("limit", 20);
    if (resp && resp.status === 0) {
      document.getElementById("frm")?.reset();
      setLoading(false);
      Toaster("error", resp.message);
    } else if (resp && resp.status === 1) {
      console.log(resp, "prince");
      JSON.stringify(
        localStorage.setItem("application", resp?.show_app?.app_switch)
      );
      localStorage.setItem("auth", resp.data);
      logDataFunction("LOGIN", 0, 0);

      LogApi(logData);

      // Api.ApiHandle(LOGS_ADD, { type: "LOGIN" }, "POST");
      history.push("/mail");
    } else if (resp && resp.status === 2) {
      localStorage.setItem("auth", resp.data);
      history.push("/re_password");
    } else {
      document.getElementById("frm")?.reset();
      setLoading(false);
      Toaster("error", "Something went wrong, please try again");
    }
  };

  const handleChange = (e) => {
    const _formData = { ...formData };
    _formData[e.target.name] = e.target.value;
    _formData["app_type"] = "MBX";

    setFormData(_formData);
  };

  return (
    <>
      <div className="dummy-image">
        <div className="marque">
          <marquee direction="right">This is basic example of marquee.</marquee>
        </div>
        <div className="nk-block nk-block-middle nk-auth-body center-box">
          <div className="brand-logo pb-5"></div>
          <div className="nk-block-head">
            <div className="nk-block-head-content">
              <h5 className="nk-block-title text-center">Welcome to Mailbox</h5>
            </div>
          </div>
          <form onSubmit={handleSignIn} id="frm">
            <div className="form-group">
              <div className="form-label-group"></div>
              <input
                type="text"
                className="form-control form-control-lg"
                id="default-01"
                placeholder="Enter your username"
                name="user_name"
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <div className="form-label-group"></div>
              <div className="form-control-wrap">
                <div
                  tabIndex="-1"
                  className="form-icon form-icon-right passcode-switch"
                  data-target="password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword && (
                    <em className="passcode-icon icon-show icon ni ni-eye"></em>
                  )}
                  {!showPassword && (
                    <em className="passcode-icon icon-show icon ni ni-eye-off"></em>
                  )}
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control form-control-lg"
                  id="password"
                  placeholder="Enter your password"
                  name="password"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <button
                type="submit"
                className="btn btn-lg btn-primary btn-block"
                disabled={loading}
              >
                {loading ? (
                  <Loader
                    type="ThreeDots"
                    color="#FFF"
                    height={20}
                    width={20}
                  />
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>
          {/* <div className="form-note-s2 pt-4">
          New on our platform?
          <NavLink exact to="/signup">
            Create an account
          </NavLink>
        </div> */}
        </div>
      </div>
    </>
  );
};

export default Login;
