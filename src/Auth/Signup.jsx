import { NavLink } from "react-router-dom";
import "../Assets/CSS/dashlite.css";

const Signup = () => {
  return (
    <>
      <div class="nk-block nk-block-middle nk-auth-body">
        <div class="nk-block-head">
          <div class="nk-block-head-content">
            <h5 class="nk-block-title">Register</h5>
            <div class="nk-block-des">
              <p>Create New Account</p>
            </div>
          </div>
        </div>
        <form action="/demo3/pages/auths/auth-success.html">
          <div class="form-group">
            <label class="form-label" for="name">
              Name
            </label>
            <input
              type="text"
              class="form-control form-control-lg"
              id="name"
              placeholder="Enter your name"
            />
          </div>
          <div class="form-group">
            <label class="form-label" for="email">
              Email or Username
            </label>
            <input
              type="text"
              class="form-control form-control-lg"
              id="email"
              placeholder="Enter your email address or username"
            />
          </div>
          <div class="form-group">
            <label class="form-label" for="password">
              Passcode
            </label>
            <div class="form-control-wrap">
              <a
                tabindex="-1"
                href="#"
                class="form-icon form-icon-right passcode-switch"
                data-target="password"
              >
                <em class="passcode-icon icon-show icon ni ni-eye"></em>
                <em class="passcode-icon icon-hide icon ni ni-eye-off"></em>
              </a>
              <input
                type="password"
                class="form-control form-control-lg"
                id="password"
                placeholder="Enter your passcode"
              />
            </div>
          </div>
          <div class="form-group">
            <div class="custom-control custom-control-xs custom-checkbox">
              <input
                type="checkbox"
                class="custom-control-input"
                id="checkbox"
              />
              <label class="custom-control-label" for="checkbox">
                I agree to Dashlite
                <a tabindex="-1" href="#">
                  Privacy Policy
                </a>
                &amp;
                <a tabindex="-1" href="#">
                  Terms.
                </a>
              </label>
            </div>
          </div>
          <div class="form-group">
            <button class="btn btn-lg btn-primary btn-block">Register</button>
          </div>
        </form>
        <div class="form-note-s2 pt-4">
          Already have an account ?
          <NavLink exact to="/">
            <strong>Sign in instead</strong>
          </NavLink>
        </div>
      </div>
      <div class="nk-block nk-auth-footer">
        <div class="nk-block-between">
          <ul class="nav nav-sm">
            <li class="nav-item">
              <a class="nav-link" href="#">
                Terms & Condition
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                Privacy Policy
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                Help
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Signup;
