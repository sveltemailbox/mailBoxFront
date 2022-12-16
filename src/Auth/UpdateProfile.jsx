import { useState } from "react";
import { useHistory } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import { UPDATE_PROFILE, LOGS_ADD } from "../config/constants";
import * as Api from "../util/api/ApicallModule";
import "../Assets/CSS/dashlite.css";
import Toaster from "../util/toaster/Toaster";
import {
  updateActiveModule,
  updateSeachText,
  updateUnreadMailsCount,
  updateUnreadCall,
  updateAllCall,
  updateArchiveCall,
  updateSentCall,
  updateCrashedCall,
  updateStarredCall,
  clearUnreadCache,
} from "../redux/action/InboxAction";
import { connect } from "react-redux";
import Loader from "react-loader-spinner";
import "./UpdateProfile.css";
import HelpModal from "../components/common/HelpModal";

const UpdateProfile = (props) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  let formData = {
    full_name: "",
    room_number: "",
    ext_number: "",
    emp_id: "",
  };
  const [user, setUser] = useState(formData);
  const [error, setError] = useState("");

  const { full_name, room_number, ext_number, emp_id } = user;

  const updatingKeyApi = () => {
    props.updateUnreadCall(0);

    props.updateAllCall(0);

    props.updateArchiveCall(0);

    props.updateSentCall(0);

    props.updateCrashedCall(0);

    props.updateStarredCall(0);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (full_name === "") {
      setError("* The Full Name field is required.");
    } else if (format.test(full_name)) {
      setError("* Don't use Special character in your name.");
    } else if (ext_number === "") {
      setError("* The Tel Extension field is required.");
    } else if (room_number === "") {
      setError("* The Room Number field is required.");
    } else if (emp_id === "") {
      setError("* The Employee Id field is required.");
    } else {
      setError("");
      setLoading(true);
      const resp = await Api.ApiHandle(`${UPDATE_PROFILE}`, user, "PUT");
      if (resp.status === 1) {
        setLoading(false);
        // updatingKeyApi();
        props?.clearUnreadCache(0);
        props?.setIsProfileUpdated(true);
        Toaster("success", "Profile updated successfully");
        setError("");
        history.push("/mail");
      } else {
        setLoading(false);
        Toaster("error", resp.message);
      }
    }
  };

  const handleInputFields = (id, inputValue) => {
    // Use numbers only pattern, from 0 to 9 with \-
    // var regex = /[^0-9\-]/gi;
    // Replace other characters that are not in regex pattern
    // let value = inputValue.replace(regex, "")
    if (id === "room_number") {
      setUser({
        ...user,
        room_number: inputValue,
      });
    }
    if (id === "tel_extn") {
      setUser({
        ...user,
        ext_number: inputValue,
      });
    }
    if (id === "full_name") {
      setUser({
        ...user,
        full_name: inputValue,
      });
    }
    if (id === "emp_id") {
      setUser({
        ...user,
        emp_id: inputValue,
      });
    }
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
            <div style={{ display: "flex", justifyContent: "center" }}>
              {
                <em
                  className="icon ni ni-arrow-left"
                  style={{ marginRight: "106%", marginLeft: "-112%" }}
                  onClick={() => {
                    history.push("/mail");
                    props.updateActiveModule("Unread");
                  }}
                />
              }
              <h5 className="nk-block-title">Update Profile</h5>
            </div>
          </div>
        </div>
        <div style={{ color: "red" }}>{error !== "" ? error : ""}</div>
        <form>
          <div className="form-group">
            <label className="form-label" htmlFor="First Name">
              Full Name
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              id="full_name"
              placeholder="Enter Full Name..."
              name="full_name"
              value={full_name}
              maxLength={40}
              minLength={6}
              onChange={(e) => handleInputFields(e.target.id, e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="last_name">
              Tel. Extn
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              id="tel_extn"
              placeholder="Enter Tel. Extn... "
              name="tel_extn"
              value={ext_number}
              onChange={(e) => handleInputFields(e.target.id, e.target.value)}
              maxLength="4"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="phone_number">
              Room Number
            </label>
            <input
              type="text"
              pattern="[0-9]{10}"
              className="input form-control form-control-lg"
              id="room_number"
              placeholder="Enter Room Number..."
              name="room_number"
              value={room_number}
              onChange={(e) => handleInputFields(e.target.id, e.target.value)}
              maxLength="5"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="phone_number">
              Employee Id
            </label>
            <input
              type="text"
              pattern="[0-9]{10}"
              className="input form-control form-control-lg"
              id="emp_id"
              placeholder="Enter Employee id..."
              name="emp_id"
              value={emp_id}
              onChange={(e) => handleInputFields(e.target.id, e.target.value)}
              maxLength="10"
            />
          </div>
          <div
            className="form-group"
            onClick={(e) => {
              handleUpdateProfile(e);
            }}
          >
            <button
              className="btn btn-lg btn-primary btn-block"
              disabled={loading}
            >
              {loading ? (
                <Loader type="ThreeDots" color="#FFF" height={20} width={20} />
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

// export default UpdateProfile

const mapActionToProps = {
  updateActiveModule,
  updateUnreadMailsCount,
  updateSeachText,
  updateUnreadCall,
  updateAllCall,
  updateArchiveCall,
  updateSentCall,
  updateCrashedCall,
  updateStarredCall,
  clearUnreadCache,
};

const mapStateToProps = (state) => ({
  userData: state.userData,
});

export default connect(mapStateToProps, mapActionToProps)(UpdateProfile);
