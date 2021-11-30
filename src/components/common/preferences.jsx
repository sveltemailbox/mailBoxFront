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
} from "../../config/constants";
import * as Api from "../../util/api/ApicallModule";
import Loading from "../../util/loader/Loading";
import Toaster from "../../util/toaster/Toaster";
import { useHistory } from "react-router-dom";

const PreferenceForm = (props) => {
  const [layoutPreference, setLayoutPreference] = useState("");
  const [station, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hideStationList, setHideStaionList] = useState([]);
  const [importantStationList, setImportantStaionList] = useState([]);
  const [selectedImportantStations, setSelectedImportantStations] = useState(
    []
  );
  const [selectedHideStations, setSelectedHideStations] = useState([]);

  const history = useHistory();
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

  const getAllStations = async () => {
    const resp = await Api.ApiHandle(GET_ALL_STATION, "", "GET");

    if (resp.status === 1) {
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
    const resp = await Api.ApiHandle(GET_PREFERENCES, "", "GET");

    if (resp.status === 1) {
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

  const handleImportantSelect = (selectedStation) =>
    setSelectedImportantStations(selectedStation);

  const handleHideSelect = (selectedStation) =>
    setSelectedHideStations(selectedStation);

  const updatePreference = async () => {
    const payload = preferencePayload();

    const resp = await Api.ApiHandle(ADD_PREFERENCES, payload, "POST");

    if (resp?.status === 1) {
      Toaster("success", "Preferences saved sucessfully");
      // console.log(layoutPreference);
      if (layoutPreference === "2ColView") {
        history.push("/mail");
      }
      if (layoutPreference === "3ColView") {
        history.push("/3ColumnView");
      }
    } else Toaster("error", resp.message || "Some thing went wrong");

    localStorage.setItem("layoutView", layoutPreference);
    // // if (layoutPreference === "2ColView") history.push("/mail");
    // // else history.push("/3ColumnView");
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

  const goBack = () => {
    window.history.go(-1);
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
                  className="btn btn-lg btn-primary"
                  onClick={updatePreference}
                  style={{ height: 37 }}
                >
                  Update Preference
                </button>
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

const mapStateToProps = (state) => ({
  userData: state.userData,
});

export default connect(mapStateToProps)(PreferenceForm);
