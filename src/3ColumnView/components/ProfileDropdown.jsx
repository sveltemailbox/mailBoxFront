import { NavLink } from "react-router-dom";

const ProfileDropdown = ({ showData }) => {
  return (
    <>
      <div
        className={`dropdown-menu dropdown-menu-md dropdown-menu-right ${
          showData ? "show" : null
        }`}
        style={{
          position: "absolute",
          transform: "translate3d(-226px, 36px, 0px)",
          top: "0px",
          left: "-30px",
          willChange: "transform",
        }}
      >
        <div className="dropdown-inner user-card-wrap bg-lighter d-none d-md-block">
          <div className="user-card">
            {/* <div className="user-avatar">
              <span>AB</span>
            </div> */}
            <div className="user-info">
              <span className="lead-text text-uppercase">DIR (CYBER OPS-II)</span>
              <span className="sub-text">(C Branch)</span>
              <span className="lead-text mt-1">Switch Account</span>
            </div>
          </div>
        </div>
        <div className="dropdown-inner">
          <div className="py-2">
            <span className="lead-text">DIR (SA) <span className="ml-2"><small>(C Branch)</small></span></span>
          </div>
        </div>
        <div className="dropdown-inner">
          <div className="py-2">
            <span className="lead-text">JS (SA) <span className="ml-2"><small>(A Branch)</small></span></span>
          </div>
        </div>
        <div className="dropdown-inner py-3">
          <ul className="link- list-inline">
            <li className="">
              <NavLink exact to="/" className="btn btn-primary btn-sm radius-15">
              <em className="icon ni ni-calendar"></em>
                <span>Mark a leave</span>
              </NavLink>
            </li>
            <li>
              <NavLink exact to="/" className="btn btn-primary btn-sm radius-15">
              <em className="icon ni ni-signout"></em>
                <span>Sign out</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default ProfileDropdown;
