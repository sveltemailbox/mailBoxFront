import { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import Select from "react-select";
import { connect } from "react-redux";

// import { CHANGE_PASSWORD } from "../config/constants";
// import * as Api from "../util/api/ApicallModule";
// import Toaster from "../util/toaster/Toaster";
import "../../Assets/CSS/dashlite.css";
import ColViewImage1 from "../../Assets/images/2ColView.JPG";
import ColViewImage2 from "../../Assets/images/3ColView.JPG";
import {
  GET_ALL_STATION,
  ADD_PREFERENCES,
  GET_PREFERENCES,
  ADD_PREFERENCES_MAIL_PER_PAGE,
  MOST_FREQUENT_STATUS,
} from "../../config/constants";
import * as Api from "../../util/api/ApicallModule";
import Loading from "../../util/loader/Loading";
import Toaster from "../../util/toaster/Toaster";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Switch from "./Switch";

import {
  updateUserData,
  updateUnreadCall,
  updateUnreadMailsCount,
  updateArchiveCall,
  updateSentCall,
  updateCrashedCall,
  updateStarredCall,
  updateAllCall,
  updateMostFrequent,
  clearUnreadCache,
  updateFolderCachedData,
} from "../../redux/action/InboxAction";
import HelpModal from "./HelpModal";

const PreferenceForm = (props) => {
  let limitOfMail = localStorage.getItem("limit");
  const [layoutPreference, setLayoutPreference] = useState("");
  const [station, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hideStationList, setHideStaionList] = useState([]);
  const [importantStationList, setImportantStaionList] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [selectedImportantStations, setSelectedImportantStations] = useState(
    []
  );
  const [disableboth, setDisableBoth] = useState({
    mailPerPage: true,
    UpdatePreference: true,
  });

  const [selectedHideStations, setSelectedHideStations] = useState([]);
  const [inputValue, setInputValue] = useState();
  const [preferencefilter, setPreferenceFilter] = useState({
    isMostFrequent: false,
    isMostRecent: true,
  });
  const [id, setId] = useState("");
  let logData = {};
  const logDataFunction = (type, mail_id, attachId) => {
    logData = {
      type: type,
      mail_id: mail_id,
      attach_id: attachId,
    };
  };
  const history = useHistory();

  useEffect(() => {
    updatingKeyApi();
    setInputValue(limitOfMail);
  }, []);

  useEffect(() => {
    getAllStations();
    getPreferences();
  }, [props?.userData]);

  useEffect(() => {
    if (selectedHideStations.length > 0) {
      const selectedImportantStationsIds = selectedHideStations.map(
        (data) => data.id
      );

      const newArray = station.filter(
        (value) => !selectedImportantStationsIds.includes(value.id)
      );

      setImportantStaionList(newArray);
    } else setImportantStaionList(station);
  }, [selectedHideStations]);

  useEffect(() => {
    if (selectedImportantStations.length > 0) {
      const selectedImportantStationsIds = selectedImportantStations.map(
        (data) => data.id
      );

      const newArray = station.filter(
        (value) => !selectedImportantStationsIds.includes(value.id)
      );
      setHideStaionList(newArray);
    } else setHideStaionList(station);
  }, [selectedImportantStations]);

  useEffect(() => {
    fetchMostFrequentStatus();
  }, []);

  const fetchMostFrequentStatus = async () => {
    setLoading(true);
    logDataFunction("SELECT MOST FREQUENT / MOST RECENT", 0, 0);
    const resp = await Api.ApiHandle(MOST_FREQUENT_STATUS, "", "GET", logData);
    if (resp && resp?.status === 1) {
      setLoading(false);
      props?.updateMostFrequent(Number(resp?.data?.recent_frequent_type));
      if (Number(resp?.data?.recent_frequent_type) === 1) {
        setPreferenceFilter({
          ...preferencefilter,
          isMostFrequent: 1,
          isMostRecent: 0,
        });
      } else {
        setPreferenceFilter({
          ...preferencefilter,
          isMostRecent: 1,
          isMostFrequent: 0,
        });
      }
    }
  };

  const getAllStations = async () => {
    logDataFunction("ALL STATION", 0, 0);
    const resp = await Api.ApiHandle(GET_ALL_STATION, "", "GET", logData);

    if (resp?.status === 1) {
      const options = [];

      resp.data.forEach((station) => {
        let _option = {};
        _option["value"] = station.branch;
        _option["label"] = station.branch;
        _option["id"] = station.id;

        options.push(_option);
      });
      setStations(options);
      setHideStaionList(options);
      setImportantStaionList(options);
      setLoading(false);
    }
  };

  const getPreferences = async () => {
    let desginationId = 0;
    logDataFunction("GET PREFERENCE", 0, 0);
    const resp = await Api.ApiHandle(GET_PREFERENCES, "", "GET", logData);

    if (resp && resp?.status === 1) {
      if (resp.data.length > 0) {
        setDataToFields(resp.data);
      }
    }
  };

  const setDataToFields = (preferences) => {
    preferences.forEach((preference) => {
      if (preference.category === "view")
        setLayoutPreference(preference.p_value);
      else if (
        preference.category === "station" &&
        preference.sub_category === "hide"
      ) {
        const selectedSationIds = preference.p_value.split(",");
        const selectedStation = station.filter((value) =>
          selectedSationIds.includes(value.id.toString())
        );
        setSelectedHideStations(selectedStation);
      } else if (
        preference.category === "station" &&
        preference.sub_category === "important"
      ) {
        const selectedSationIds = preference.p_value.split(",");
        const selectedStation = station.filter((value) =>
          selectedSationIds.includes(value.id.toString())
        );
        setSelectedImportantStations(selectedStation);
      }
    });
  };

  const handleImportantSelect = (selectedStation) => {
    setDisableBoth((prev) => {
      return { ...prev, UpdatePreference: false };
    });
    setSelectedImportantStations(selectedStation);
  };

  const handleHideSelect = (selectedStation) => {
    setDisableBoth((prev) => {
      return { ...prev, UpdatePreference: false };
    });
    setSelectedHideStations(selectedStation);
  };

  const updatePreference = async () => {
    const payload = preferencePayload();
    logDataFunction("CLICK ON  UPDATE PREFERENCE", 0, 0);
    const resp = await Api.ApiHandle(ADD_PREFERENCES, payload, "POST", logData);

    if (resp?.status === 1) {
      Toaster("success", "Preferences saved sucessfully");
      setDisableBoth((prev) => {
        return { ...prev, UpdatePreference: true };
      });
      if (layoutPreference === "2ColView") {
        history.push("/mail");
      }
      if (layoutPreference === "3ColView") {
        history.push("/3ColumnView");
      }
    } else {
      Toaster("error", resp.message || "Some thing went wrong");
      setDisableBoth((prev) => {
        return { ...prev, UpdatePreference: true };
      });
    }
    localStorage.setItem("layoutView", layoutPreference);
    // // if (layoutPreference === "2ColView") history.push("/mail");
    // // else history.push("/3ColumnView");
  };
  const updatingKeyApi = () => {
    props.updateUnreadCall(0);

    props.updateAllCall(0);

    props.updateArchiveCall(0);

    props.updateSentCall(0);

    props.updateCrashedCall(0);

    props.updateStarredCall(0);
  };

  const updatePreferenceMailPerPage = async () => {
    if (inputValue < 15) {
      Toaster("error", "Mails/Page Cannot Be Less Than 15");
      setDisableBoth((prev) => {
        return { ...prev, mailPerPage: true };
      });
      return;
    } else {
      localStorage.setItem("limit", inputValue);
      props.setIsPreferenceChanged(true);
      const payload = preferencePayloadMailPerPage();
      logDataFunction("CLICK ON  UPDATE PREFERENCE MAIL/PAGE", 0, 0);
      setIsDisabled(true);
      props?.updateFolderCachedData("delete");
      const resp = await Api.ApiHandle(
        ADD_PREFERENCES_MAIL_PER_PAGE,
        payload,
        "PUT",
        logData
      );
      if (resp?.status === 1) {
        // updatingKeyApi();
        props?.clearUnreadCache(0);
        setIsDisabled(false);
        Toaster("success", "Preferences saved sucessfully");
        setDisableBoth((prev) => {
          return { ...prev, mailPerPage: true };
        });
      } else {
        Toaster("error", resp.message || "Some thing went wrong");
        setDisableBoth((prev) => {
          return { ...prev, mailPerPage: true };
        });
      }
    }
  };

  const preferencePayload = () => {
    let desginationId = 0;
    const payload = [];

    props?.userData?.designations.forEach((designation) => {
      if (designation.default_desig) desginationId = designation.id;
    });

    payload.push(paramsImportantStation(desginationId));

    payload.push(paramsHideStation(desginationId));

    if (layoutPreference.length > 0) {
      const layoutPreferencePayload = {
        designation: desginationId,
        category: "view",
        sub_category: "",
        p_value: layoutPreference,
      };

      payload.push(layoutPreferencePayload);
    }

    return payload;
  };
  const preferencePayloadMailPerPage = () => {
    const PreferencePayload = {
      category: "mail_per_page",
      sub_category: "",
      mails_per_page: inputValue,
    };

    return PreferencePayload;
  };

  const paramsHideStation = (desginationId) => {
    const data = {};
    let ids = "";
    data["designation"] = desginationId;
    data["category"] = "station";
    data["sub_category"] = "hide";

    selectedHideStations.map((station) => {
      ids += `${station.id},`;
    });
    data["p_value"] = ids.substring(0, ids.length - 1);

    return data;
  };

  const paramsImportantStation = (desginationId) => {
    const data = {};
    let ids = "";
    data["designation"] = desginationId;
    data["category"] = "station";
    data["sub_category"] = "important";

    selectedImportantStations.map((station) => {
      ids += `${station.id},`;
    });
    data["p_value"] = ids.substring(0, ids.length - 1);

    return data;
  };

  const goBack = () => {
    window.history.go(-1);
  };

  function limit(element) {
    // var max_chars = 2;
    // if (element.value.length > max_chars) {
    //   element.value = element.value.substr(0, max_chars);
    // }
  }

  const handleChange = (e) => {
    setDisableBoth((prev) => {
      return { ...prev, mailPerPage: false };
    });
    const { value } = e.target;
    if (value <= 100) {
      setInputValue(value);
      return;
    }
  };

  const handleClick = async () => {
    setId("");
    if (
      (preferencefilter.isMostFrequent && Boolean(props?.isMostFrequent)) ||
      (preferencefilter.isMostRecent && !Boolean(props?.isMostFrequent))
    ) {
      Toaster(
        "error",
        "Please Select Different option,you have already chosen this"
      );
      return;
    } else {
      let payload = {
        category: "most_freq_type",
        sub_category: "",
        recent_frequent_type: preferencefilter.isMostFrequent ? "1" : "0",
      };
      const resp = await Api.ApiHandle(
        ADD_PREFERENCES_MAIL_PER_PAGE,
        payload,
        "PUT",
        logData
      );
      if (resp && resp?.status === 1) {
        Toaster("success", "Updated Successfully");
        props?.updateMostFrequent(Number(payload["recent_frequent_type"]));
        history.push("/mail");
      }
    }
  };
  return (
    <>
      {!loading && (
        <div className="preference-container">
          <div className="nk-block-head">
            <div className="nk-block-head-content">
              <div style={{ marginBottom: 60 }}>
                <Navbar />
              </div>
              <HelpModal />
              <div className="row">
                <em
                  className="icon ni ni-chevron-left back-icon"
                  onClick={goBack}
                ></em>
                <h3 className="nk-block-title preference-text">
                  Change Preferences
                </h3>
              </div>
            </div>
          </div>

          <h6 className="sub-heading sub-heading-preference">
            <em
              style={{ marginRight: 5, fontSize: 15 }}
              className="icon ni ni-bullet-fill"
            ></em>
            Change layout preference
          </h6>

          <form className="form-data">
            <div className="form-content">
              <input
                type="radio"
                name="inlineRadioOptions"
                id="radio1"
                value="2ColView"
                checked={layoutPreference === "2ColView"}
                onChange={() => setLayoutPreference("2ColView")}
              />
              <label className="ml-2" htmlFor="radio1">
                2 Column View
              </label>
              <img className="layout-img" src={ColViewImage1} />

              <input
                type="radio"
                name="inlineRadioOptions"
                className="ml-3"
                id="radio2"
                value="3ColView"
                checked={layoutPreference === "3ColView"}
                onChange={() =>
                  Toaster("error", "Still under developing phase")
                }
              />
              <label className="ml-2" htmlFor="radio2">
                3 Column View
              </label>
              <img className="layout-img" src={ColViewImage2} />
            </div>

            <h6 className="sub-heading preference-bottom-heading">
              <em
                style={{ marginRight: 5, fontSize: 15 }}
                className="icon ni ni-bullet-fill"
              ></em>
              Change station preference
            </h6>
            <div className="row ml-3 preference-bottom">
              <div className="station-preference">
                <p className="label" style={{ fontWeight: "bold" }}>
                  Hide station
                </p>
                <Select
                  isMulti
                  name="hide-Stations"
                  value={selectedHideStations}
                  options={hideStationList}
                  placeholder="Select branch name"
                  onChange={handleHideSelect}
                  isClearable={true}
                />
                {selectedHideStations?.map((hid, i) => {
                  return (
                    <div
                      className="preference-hide-station-list"
                      key={`hideStationList${i}`}
                    >
                      <em
                        style={{ marginRight: 8, fontSize: 15 }}
                        class="icon ni ni-scissor"
                      ></em>
                      <span className="preference-hide-station-text">
                        {hid.value}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="station-preference ml-5">
                <p style={{ fontWeight: "bold" }}>Important station</p>
                <Select
                  isMulti
                  name="important-Stations"
                  value={selectedImportantStations}
                  options={importantStationList}
                  placeholder="Select branch name"
                  onChange={handleImportantSelect}
                  isClearable={true}
                />
                {selectedImportantStations?.map((imp, i) => {
                  return (
                    <div
                      key={`importantStationList${i}`}
                      className="preference-hide-station-list"
                    >
                      <em
                        class="icon ni ni-clipboad-check-fill"
                        style={{ marginRight: 8, fontSize: 15 }}
                      ></em>
                      <span className="preference-hide-station-text">
                        {imp.value}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="form-group mt-4 preference-update-button">
                <button
                  type="button"
                  id="myButton"
                  disabled={disableboth.UpdatePreference}
                  className="btn btn-lg btn-primary"
                  onClick={updatePreference}
                  style={{ height: 37 }}
                >
                  Update Preference
                </button>
              </div>
            </div>
            <div>
              {/* <h6 className="sub-heading preference-bottom-heading">
                <em
                  style={{ marginRight: 5, fontSize: 15 }}
                  className="icon ni ni-bullet-fill"
                ></em>
                Mails/Page
              </h6>

              <div className="mail-per-page-preference ml-3 row ml-3">
                <input
                  className="inputMailsPerPage"
                  type="number"
                  id="number"
                  value={inputValue}
                  min={15}
                  max={100}
                  onChange={(e) => handleChange(e)}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                />
                <div className="form-group ml-5">
                  <button
                    type="button"
                    disabled={disableboth.mailPerPage || isDisabled}
                    className="btn btn-lg btn-primary"
                    onClick={updatePreferenceMailPerPage}
                    style={{ height: 37 }}
                  >
                    Update Mails/Page
                  </button>
                </div>
              </div> */}
              <div style={{ marginTop: "20px" }}>
                <div>
                  <h6 className="sub-heading preference-bottom-heading">
                    <em
                      style={{ marginRight: 5, fontSize: 15 }}
                      className="icon ni ni-bullet-fill"
                    ></em>
                    Select Most Frequent / Most recent
                  </h6>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    maxWidth: "600px",
                    padding: "10px",
                  }}
                >
                  <div>
                    <input
                      type="radio"
                      placeholder="Most Recent"
                      id="recent"
                      checked={preferencefilter.isMostRecent}
                      onChange={(e) => {
                        setPreferenceFilter({
                          ...preferencefilter,
                          isMostFrequent: false,
                          isMostRecent: true,
                        });
                        setId(e.target?.id);
                      }}
                    />
                    <label>&nbsp;Most Recent</label>
                  </div>
                  <div style={{ padding: "10px" }}>
                    <input
                      type="radio"
                      placeholder="Most Frequent"
                      id="frequent"
                      checked={preferencefilter.isMostFrequent}
                      onChange={(e) => {
                        setPreferenceFilter({
                          ...preferencefilter,
                          isMostFrequent: true,
                          isMostRecent: false,
                        });
                        setId(e.target?.id);
                      }}
                    />
                    <label>&nbsp;Most Frequent</label>
                  </div>
                  <button
                    onClick={handleClick}
                    disabled={id === ""}
                    type="button"
                    style={{ height: 30 }}
                    className="btn btn-lg btn-primary"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {loading && (
        <div className="preference-loader">
          <Loading />
        </div>
      )}
    </>
  );
};

const mapActionToProps = {
  updateUserData,
  updateUnreadCall,
  updateUnreadMailsCount,
  updateArchiveCall,
  updateAllCall,
  updateSentCall,
  updateCrashedCall,
  updateStarredCall,
  updateMostFrequent,
  clearUnreadCache,
  updateFolderCachedData,
};

const mapStateToProps = (state) => ({
  userData: state?.userData,
  isMostFrequent: state.isMostFrequent,
});

export default connect(mapStateToProps, mapActionToProps)(PreferenceForm);
