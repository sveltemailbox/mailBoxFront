import { useState } from "react";
import { connect } from "react-redux";

// import Notifications from "./Notifications";
import ProfileDropdown from "./ProfileDropdown";
import Viewsearchbar from "../components/Viewsearchbar";

const Navbar = (props) => {
  const [showData, setShowData] = useState({
    notifications: false,
    profile: false,
  });

  const showNotificationsAntInfo = (module) => {
    let currentOpen = "notifications";
    if (module === "notifications") {
      currentOpen = "profile";
    }
    setShowData((prev) => {
      return { [module]: !prev[module], [currentOpen]: false };
    });
  };

  return (
    <>
      <div className="nk-header nk-header-fixed is-light">
        <div className="container-fluid">
          <div className="nk-header-wrap">
            <div className="nk-menu-trigger d-xl-none ml-n1">
              <a
                href="/"
                className="nk-nav-toggle nk-quick-nav-icon"
                data-target="sidebarMenu"
              >
                <em className="icon ni ni-menu"></em>
              </a>
            </div>
            <div className="nk-header-app-name">
              <div className="nk-header-app-logo">
                <em className="icon ni ni-inbox bg-purple-dim"></em>
              </div>
              <div className="nk-header-app-info">
                <span className="sub-text">Inbox</span>
                <span className="lead-text">Mail Box</span>
              </div>
            </div>

            <div>
              <Viewsearchbar filterOptions={props.filterOptions} />
            </div>
            <div className="nk-header-tools">
              <ul className="nk-quick-nav">
                <li className="dropdown user-dropdown">
                  <span
                    onClick={() => showNotificationsAntInfo("profile")}
                    className="dropdown-toggle mr-n1"
                  >
                    <div className="user-toggle">
                      <div className="user-avatar sm">
                        <em className="icon ni ni-user-alt"></em>
                      </div>
                    </div>
                  </span>
                  <ProfileDropdown showData={showData.profile} />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
// const mapActionToProps = { updateFilterOptions updateSeachText };

const mapStateToProps = (state) => ({
  filterOptions: state.filterOptions,
  searchText: state.searchText,
});

export default connect(mapStateToProps)(Navbar);
