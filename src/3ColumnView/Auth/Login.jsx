import { NavLink } from "react-router-dom";

const Login = () => {
  return (
    <>
      <div class="nk-block nk-block-middle nk-auth-body center-box">
        <div class="brand-logo pb-5"></div>
        <div class="nk-block-head">
          <div class="nk-block-head-content">
            <h5 class="nk-block-title">Welcome to Mailbox</h5>
          </div>
        </div>
        <form action="/mail">
          <div class="form-group">
            <div class="form-label-group">
              <label class="form-label" for="default-01">
                Email or Username
              </label>
            </div>
            <input
              type="text"
              class="form-control form-control-lg"
              id="default-01"
              placeholder="Enter your email address or username"
            />
          </div>
          <div class="form-group">
            <div class="form-label-group"></div>
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
            <NavLink exact to="/mail" class="btn btn-lg btn-primary btn-block">
              Sign In
            </NavLink>
          </div>
        </form>
        <div class="form-note-s2 pt-4">
          New on our platform?
          <NavLink exact to="/signup">
            Create an account
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Login;
