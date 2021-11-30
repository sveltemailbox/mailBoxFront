import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import * as Api from "../util/api/ApicallModule";
import {
  LOGIN,
  GET_PREFERENCES,
  USER_PROFILE,
  LOGS_ADD,
} from "../config/constants";
import Toaster from "../util/toaster/Toaster";
import Loader from "react-loader-spinner";

const Login = () => {
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const handleSignIn = async (event) => {
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

    setLoading(true);

    const resp = await Api.ApiHandle(LOGIN, formData, "post");
    if (resp.status === 0) {
      document.getElementById("frm")?.reset();
      setLoading(false);
      Toaster("error", resp.message);
    } else if (resp.status === 1) {
      localStorage.setItem("auth", resp.data);
      Api.ApiHandle(LOGS_ADD, { type: "LOGIN" }, "POST");
      history.push("/mail");
    }
  };

  const handleChange = (e) => {
    const _formData = { ...formData };
    _formData[e.target.name] = e.target.value;

    setFormData(_formData);
  };

  return (
    <>
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
            <button type="submit" className="btn btn-lg btn-primary btn-block">
              {loading ? (
                <Loader type="ThreeDots" color="#FFF" height={20} width={20} />
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
    </>
  );
};

export default Login;
