const Notifications = ({ showData }) => {
  return (
    <>
      <div
        className={`dropdown-menu dropdown-menu-xl dropdown-menu-right ${
          showData ? "show" : null
        }`}
        style={{
          position: "absolute",
          transform: "translate3d(-308px, 36px, 0px)",
          top: "0px",
          left: "0px",
          willChange: "transform",
        }}
      >
        <div className="dropdown-head">
          <span className="sub-title nk-dropdown-title">Notifications</span>
          <a href="/">Mark All as Read</a>
        </div>
        <div className="dropdown-body">
          <div className="nk-notification">
            <div className="nk-notification-item dropdown-inner">
              <div className="nk-notification-icon">
                <em className="icon icon-circle bg-primary-dim ni ni-share"></em>
              </div>
              <div className="nk-notification-content">
                <div className="nk-notification-text">
                  Iliash shared <span>Dashlite-v2</span> with you.
                </div>
                <div className="nk-notification-time">Just now</div>
              </div>
            </div>
            <div className="nk-notification-item dropdown-inner">
              <div className="nk-notification-icon">
                <em className="icon icon-circle bg-info-dim ni ni-edit"></em>
              </div>
              <div className="nk-notification-content">
                <div className="nk-notification-text">
                  Iliash <span>invited</span> you to edit <span>DashLite</span>{" "}
                  folder
                </div>
                <div className="nk-notification-time">2 hrs ago</div>
              </div>
            </div>
            <div className="nk-notification-item dropdown-inner">
              <div className="nk-notification-icon">
                <em className="icon icon-circle bg-primary-dim ni ni-share"></em>
              </div>
              <div className="nk-notification-content">
                <div className="nk-notification-text">
                  You have shared <span>project v2</span> with Parvez.
                </div>
                <div className="nk-notification-time">7 days ago</div>
              </div>
            </div>
            <div className="nk-notification-item dropdown-inner">
              <div className="nk-notification-icon">
                <em className="icon icon-circle bg-success-dim ni ni-spark"></em>
              </div>
              <div className="nk-notification-content">
                <div className="nk-notification-text">
                  Your <span>Subscription</span> renew successfully.
                </div>
                <div className="nk-notification-time">2 month ago</div>
              </div>
            </div>
          </div>
        </div>
        <div className="dropdown-foot center">
          <a href="/">View All</a>
        </div>
      </div>
    </>
  );
};

export default Notifications;
