import { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { GET_LIST_STATIONS, UPDATE_MAIL } from "../../config/constants";
import { updateData, updateSeachText } from "../../redux/action/InboxAction";
import * as Api from "../../util/api/ApicallModule";
import Toaster from "../../util/toaster/Toaster";
import "../../Assets/CSS/pretty-checkbox.min.css";
import Agree from "../../Assets/images/Tick.png";
import { Button } from "react-bootstrap";
import ForwardTo from "./ForwardTo";
import FolderAdd from "./FolderAdd";
import { MAIL_ACTIONS, UNREAD_CONSTANTS_VALUES } from "../../util";

const InboxNavbar = (props) => {
  // const [sortTimeState, setSortTimeState] = useState(false);
  // const [sortOpState, setSortOpState] = useState(false);
  // const [sortFromState, setSortFromState] = useState(false);
  // const [searchData, setSearchData] = useState({});
  // const [tagData, setTagData] = useState({});
  const closeWinRef = useRef(null);

  const [search, setSearch] = useState({});
  const [tag, setTag] = useState([]);
  const [stationList, setStationList] = useState([]);
  const [sectionName, setSectionName] = useState("");
  const [apiCalledCount, setApiCalledCount] = useState({ value: 0 });
  const [operateStationList, setOperateStationList] = useState(false);
  const [operateMarkReadUnread, setOperateMarkReadUnread] = useState(false);
  const [disableStationSubmit, setDisableStationSubmit] = useState(true);
  const [searchInStation, setSearchInStation] = useState("");
  const [operateForwardTo, setOperateForwardTo] = useState(false);
  const [addToFolder, setAddToFolder] = useState(false);

  useEffect(() => {
    if (props.searchText.hasOwnProperty("station")) {
      var inputs = document.querySelectorAll(".station_checkbox_1");

      for (var i = 0; i < inputs.length; i++) {
        if (props.searchText.station.includes(inputs[i]?.name)) {
          inputs[i].checked = true;
        }
      }
    }
  }, [props.searchText, stationList]);

  useEffect(() => {
    if (props?.userData?.designations) {
      getListOfStations();
    }
  }, [props?.userData]);

  useEffect(() => {
    if (props?.userData?.designations) {
      getListOfStations();
      getSectionName();
      setOperateMarkReadUnread(false);
      setOperateStationList(false);
    }
  }, [props?.filterOptions]);

  useEffect(() => {
    setTag([]);
  }, [sectionName]);

  useEffect(() => {
    if (props?.filterOptions?.by_stations === undefined) {
      props?.setSelectedstation([]);
      setDisableStationSubmit(true);
      props?.setStationTag([]);
    }
  }, [props?.filterOptions?.by_stations]);

  useEffect(() => {
    if (props?.selectedStation.length > 0) setDisableStationSubmit(false);
    if (props?.selectedStation.length === 0) setDisableStationSubmit(true);
    if (props?.stationTag.length > 0 && props?.selectedStation.length === 0)
      setDisableStationSubmit(false);
  }, [props?.selectedStation, props?.stationTag]);

  useEffect(() => {
    if (apiCalledCount.value > 0) {
      handleRefreshClick();
      setApiCalledCount(() => ({ value: 0 }));
    }
  }, [apiCalledCount]);

  const getSectionName = () => {
    let name = "";
    Object.keys(props?.filterOptions).map((filter) => {
      if (filter === "is_read") name = "unread";
      else if (filter === "is_sent") name = "sent";
      else if (filter === "is_starred") name = "starred";
      else if (filter === "is_crashed") name = "crash";
    });
    if (name.length === 0) name = "archive";

    setSectionName(name);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (closeWinRef.current && !closeWinRef.current.contains(event.target)) {
        setOperateMarkReadUnread(false);
        setOperateStationList(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeWinRef]);

  const handleRefreshClick = async () => {
    props?.getAllMails();
  };

  const getListOfStations = async () => {
    let filter = "";
    if (props?.filterOptions.hasOwnProperty("mail_action")) {
      filter = `mail_action=${props?.filterOptions.mail_action}`;
    } else if (props?.filterOptions.hasOwnProperty("folder")) {
      filter = `folder=${props?.filterOptions?.folder}`;
    }

    const resp = await Api.ApiHandle(
      `${GET_LIST_STATIONS}${filter}`,
      "",
      "GET"
    );

    if (resp?.status === 1) {
      const station = [];
      resp?.data?.map((stat) => {
        const obj = {
          id: stat?.id,
          station: stat?.station,
        };
        station.push(obj);
      });
      setStationList(station);
    } else {
      Toaster("error", "Couldn't get list of stations");
    }
  };

  // const handleSortClick = async (sort) => {
  //   if (sort === "createdAt") {
  //     if (sortTimeState) {
  //       Object.keys(props.filterOptions).forEach((item) => {
  //         if (item === "op") delete props.filterOptions.op;
  //         if (item === "branch") delete props.filterOptions.branch;
  //       });
  //       props.setFilterOptions({ ...props.filterOptions, createdAt: "DESC" });
  //       setSortOpState(false);
  //       setSortFromState(false);
  //       setSortTimeState(false);
  //     } else {
  //       Object.keys(props.filterOptions).forEach((item) => {
  //         if (item === "op") delete props.filterOptions.op;
  //         if (item === "branch") delete props.filterOptions.branch;
  //       });
  //       props.setFilterOptions({ ...props.filterOptions, createdAt: "ASC" });
  //       setSortFromState(false);
  //       setSortOpState(false);
  //       setSortTimeState(true);
  //     }
  //   } else if (sort === "op") {
  //     if (sortOpState) {
  //       Object.keys(props.filterOptions).forEach((item) => {
  //         if (item === "createdAt") delete props.filterOptions.createdAt;
  //         if (item === "branch") delete props.filterOptions.branch;
  //       });
  //       props.setFilterOptions({ ...props.filterOptions, op: "DESC" });
  //       setSortTimeState(false);
  //       setSortFromState(false);
  //       setSortOpState(false);
  //     } else {
  //       Object.keys(props.filterOptions).forEach((item) => {
  //         if (item === "createdAt") delete props.filterOptions.createdAt;
  //         if (item === "branch") delete props.filterOptions.branch;
  //       });
  //       props.setFilterOptions({ ...props.filterOptions, op: "ASC" });
  //       setSortTimeState(false);
  //       setSortFromState(false);
  //       setSortOpState(true);
  //     }
  //   } else {
  //     if (sortFromState) {
  //       Object.keys(props.filterOptions).forEach((item) => {
  //         if (item === "createdAt") delete props.filterOptions.createdAt;
  //         if (item === "op") delete props.filterOptions.op;
  //       });
  //       props.setFilterOptions({ ...props.filterOptions, branch: "DESC" });
  //       setSortOpState(false);
  //       setSortTimeState(false);
  //       setSortFromState(false);
  //     } else {
  //       Object.keys(props.filterOptions).forEach((item) => {
  //         if (item === "createdAt") delete props.filterOptions.createdAt;
  //         if (item === "op") delete props.filterOptions.op;
  //       });
  //       props.setFilterOptions({ ...props.filterOptions, branch: "ASC" });
  //       setSortOpState(false);
  //       setSortTimeState(false);
  //       setSortFromState(true);
  //     }
  //   }
  // };

  const handleSearch = (event) => {
    const inputData = { ...search };
    inputData[event.target.name] = event.target.value;

    if (event.target.value.length > 0) {
      setSearch(inputData);
    } else setSearch("");
  };

  const searchMail = (event) => {
    event.preventDefault();
    if (search.hasOwnProperty("search") && search.search.length > 0) {
      const _searchText = { ...props.searchText };
      const _tag = Object.values(search).map((data) => data);

      const prevSearchData = _searchText.hasOwnProperty("searchData")
        ? _searchText.searchData
        : [];

      if (prevSearchData.length > 0) {
        if (prevSearchData.includes(..._tag)) {
          Toaster("error", "Same data already exists");

          setSearch({ search: "" });
          return;
        }
        _searchText["searchData"] = [...prevSearchData, ..._tag];
      } else _searchText["searchData"] = [..._tag];

      props.updateSeachText(_searchText);
      setTag([...tag, ..._tag]);
      setSearch({ search: "" });

      if (_tag.length > 0) {
        let searchData = "";

        if (prevSearchData.length > 0)
          searchData = [...prevSearchData, ..._tag].join();
        else searchData = [..._tag].join();

        props.setFilterOptions({
          ...props.filterOptions,
          search_data: searchData.replace(/#/g, "%23"),
        });
      }
    }
  };

  const deleteSeachKey = (deletedData) => {
    const _searchText = { ...props.searchText };
    const prevSearchData = _searchText.hasOwnProperty("searchData")
      ? _searchText.searchData
      : [];
    const _tag = [...prevSearchData];
    const index = _tag.indexOf(deletedData);
    _tag.splice(index, 1);

    _searchText["searchData"] = _tag;
    props.updateSeachText(_searchText);
    setTag(_tag);

    if (_tag.length > 0) {
      props.setFilterOptions({
        ...props.filterOptions,
        search_data: [..._tag].join(),
      });
    } else {
      delete props.filterOptions.search_data;
      props.setFilterOptions({ ...props.filterOptions });
    }
  };

  const handleCheckedStation = (e) => {
    const { id, checked } = e.target;
    if (id === "ResetAll") {
      props?.setSelectedstation([]);
      props?.setStationTag([]);
      setOperateStationList(false);
      delete props?.filterOptions?.by_stations;
      delete props.filterOptions.search_data;
      props.updateSeachText({});
      setSearch({ search: "" });
      setTag([]);
      props.setFilterOptions({ ...props.filterOptions });
    } else if (id === "SelectAll") {
      stationList.map((stat) => {
        props?.setSelectedstation((prev) => [...prev, stat?.id]);
      });
    } else if (checked) {
      props?.setSelectedstation((prev) => [...prev, +id]);
    } else {
      props?.setSelectedstation(
        props?.selectedStation.filter((item) => item !== +id)
      );
    }
  };

  const handleStationSubmit = () => {
    var arr = [];
    stationList.map((stat) => {
      if (props?.selectedStation.includes(stat.id)) {
        arr.push(stat.station);
      }
    });

    props?.setStationTag(arr);
    setOperateStationList(false);
    setSearchInStation("");
    if (props?.selectedStation.length === 0) {
      delete props?.filterOptions?.by_stations;
      props.setFilterOptions({ ...props.filterOptions });
    } else {
      props.setFilterOptions({
        ...props.filterOptions,
        by_stations: `[${props?.selectedStation}]`,
      });
    }
  };

  const handleCancel = () => {
    setOperateStationList(false);
    let arr = [];
    stationList.forEach((stat) => {
      if (props?.stationTag.includes(stat?.station)) {
        arr.push(stat?.id);
      }
    });
    props?.setSelectedstation(arr);
  };

  const deleteStationTag = (station) => {
    let arr = [];
    props?.setStationTag(props?.stationTag.filter((item) => item !== station));
    stationList.map((stat) => {
      if (stat.station === station) {
        arr.push(props?.selectedStation.filter((item) => item !== stat.id));
        props?.setSelectedstation(
          props?.selectedStation.filter((item) => item !== stat.id)
        );
      }
    });
    if (arr[0].length < 1) {
      delete props?.filterOptions?.by_stations;
      props.setFilterOptions({ ...props.filterOptions });
    } else {
      if (props?.selectedStation.length > 0) {
        props.setFilterOptions({
          ...props.filterOptions,
          by_stations: `[${arr}]`,
        });
      } else {
        delete props?.filterOptions?.by_stations;
        props.setFilterOptions({ ...props.filterOptions });
      }
    }
  };

  const filteredList = (stationList, searchInStation) => {
    return stationList.filter((station) => bySearch(station, searchInStation));
  };

  const bySearch = (station, searchInStation) => {
    if (searchInStation) {
      return station.station
        .toLowerCase()
        .includes(searchInStation.toLowerCase());
    } else return station;
  };

  const clearAllStationTag = () => {
    props?.setSelectedstation([]);
    props?.setStationTag([]);
    delete props?.filterOptions?.by_stations;
    delete props.filterOptions.search_data;
    props.updateSeachText({});
    setSearch({ search: "" });
    setTag([]);
    props.setFilterOptions({ ...props.filterOptions });
  };

  const selectAllHandler = (e) => {
    if (props.selectedMail.length !== 0) {
      props.setSelectedMail([]);
      props.setSelectedMailData([]);
    } else {
      props.setSelectedMail(props.filterMailData);
      props.setSelectedMailData(props.mailData);
    }
  };

  const callApiForUpdata = async (data) => {
    const resp = await Api.ApiHandle(UPDATE_MAIL, data, "PUT");
    if (resp.status === 1) {
      setApiCalledCount((prev) => ({ value: prev.value + 1 }));
      setOperateMarkReadUnread(false);
    }
  };

  const readUnread = async (isRead, removeFromUnread) => {
    const arr = [];

    props.selectedMailData.forEach(async (item, i) => {
      let _createParams = {};
      if (props.meMailData.includes(item.id)) {
        _createParams = await createParams(
          isRead,
          removeFromUnread,
          "from_action",
          "from_read_mail",
          item.concat_from_action,
          item.concat_user_mail_ids
        );
      } else {
        _createParams = await createParams(
          isRead,
          removeFromUnread,
          "mail_action",
          "is_read_mail",
          item.concat_mail_action,
          item.concat_user_mail_ids
        );
      }

      arr.push(..._createParams);
      if (i === props.selectedMailData.length - 1) callApiForUpdata(arr);
    });
  };

  const createParams = (
    isRead,
    removeFromUnread,
    actionKey,
    readKey,
    mailActionValue,
    concat_user_mail_ids
  ) => {
    const data = [];

    mailActionValue.forEach((item, index) => {
      let params = {};

      if (isRead && !removeFromUnread) {
        params[actionKey] = checkReadMailAction(item);
        params[readKey] = 1;
      } else if (!isRead && !removeFromUnread) {
        params[actionKey] = checkMailAction(item);
        params[readKey] = 0;
      } else {
        params[actionKey] = checkReadMailAction(item);
        params[readKey] = 0;
      }

      params.id = concat_user_mail_ids[index];

      data.push(params);
    });

    return data;
  };

  const checkMailAction = (action) => {
    let mailAction = "";
    switch (action) {
      case "98":
        mailAction = "99";
        break;
      case "96":
        mailAction = "97";
        break;
      case "88":
        mailAction = "89";
        break;
      case "86":
        mailAction = "87";
        break;
      case "78":
        mailAction = "79";
        break;
      case "68":
        mailAction = "69";
        break;
      case "99":
        mailAction = "99";
        break;
      case "97":
        mailAction = "97";
        break;
      case "89":
        mailAction = "89";
      case "87":
        mailAction = "87";
        break;
      case "79":
        mailAction = "79";
        break;
      case "69":
        mailAction = "69";
        break;
    }

    return mailAction;
  };

  const checkReadMailAction = (action) => {
    let mailAction = "";
    switch (action) {
      case "99":
        mailAction = "98";
        break;
      case "97":
        mailAction = "96";
        break;
      case "89":
        mailAction = "88";
        break;
      case "87":
        mailAction = "86";
        break;
      case "79":
        mailAction = "78";
        break;
      case "69":
        mailAction = "68";
        break;
      case "98":
        mailAction = "98";
        break;
      case "96":
        mailAction = "96";
        break;
      case "88":
        mailAction = "88";
        break;
      case "86":
        mailAction = "86";
        break;
      case "78":
        mailAction = "78";
        break;
      case "68":
        mailAction = "68";
        break;
    }

    return mailAction;
  };

  return (
    <>
      <div className="nk-ibx-head" style={{ padding: "11.5px 15px" }}>
        {operateForwardTo && props.selectedMail.length > 0 && (
          <ForwardTo
            operateForwardTo={operateForwardTo}
            setOperateForwardTo={setOperateForwardTo}
            selectedMail={props.selectedMail}
            setSelectedMail={props.setSelectedMail}
          />
        )}
        {addToFolder && props.selectedMail.length > 0 && (
          <div className="folderAdd">
            <FolderAdd
              addToFolder={addToFolder}
              setAddToFolder={setAddToFolder}
              selectedMail={props.selectedMail}
              setSelectedMail={props.setSelectedMail}
              selectedMailData={props.selectedMailData}
            />
          </div>
        )}
        <div className="nk-ibx-head-actions fullWidth">
          <div className="nk-ibx-head-check"></div>
          <ul className="nk-ibx-head-tools g-1 fullWidth">
            {props?.filterOptions?.is_sent !== 1 &&
              props?.filterOptions?.is_crashed !== 1 &&
              props?.filterOptions?.is_starred !== 1 && (
                <li style={{ marginLeft: "0.7%" }}>
                  <div
                    className={`pretty ${
                      props.isMailAllSelect.fullSelect
                        ? "p-image p-plain"
                        : "p-default p-curve"
                    }`}
                  >
                    <input
                      type="checkbox"
                      id="allSelect"
                      onChange={selectAllHandler}
                      checked={
                        props.isMailAllSelect.fullSelect ||
                        props.isMailAllSelect.partialSelect
                          ? true
                          : false
                      }
                    />
                    <div
                      className={`state ${
                        props.isMailAllSelect.partialSelect && "p-primary"
                      }`}
                    >
                      {props.isMailAllSelect.fullSelect && (
                        <img className="image" src={Agree} />
                      )}
                      <label id="allSelect"></label>
                    </div>
                  </div>

                  <div className="station-filter">
                    <div
                      ref={closeWinRef}
                      style={{
                        fontSize: "medium",
                        marginTop: "3px",
                      }}
                      onClick={() => {
                        setOperateMarkReadUnread(
                          (operateMarkReadUnread) => !operateMarkReadUnread
                        );
                        operateStationList
                          ? setOperateStationList(false)
                          : setOperateStationList(false);
                      }}
                    >
                      <em
                        style={{ fontSize: 15 }}
                        className="ni ni-downward-alt-fill"
                      ></em>
                    </div>

                    {operateMarkReadUnread && (
                      <div
                        ref={closeWinRef}
                        className="station-filter-dropdown"
                        style={{ left: "-12px", zIndex: "9" }}
                      >
                        <ul className="link-tidy">
                          {props?.filterOptions?.mail_action !==
                            MAIL_ACTIONS.READ && (
                            <li onClick={() => readUnread(1)}>Mark as Read</li>
                          )}

                          <li onClick={() => readUnread(0)}>Mark as Unread</li>
                          {props?.filterOptions?.mail_action ===
                            MAIL_ACTIONS.UNREAD && (
                            <li onClick={() => readUnread(1, true)}>
                              Move to Archive
                            </li>
                          )}

                          <li
                            className="add-to-folder"
                            onClick={() => {
                              props?.selectedMail?.length > 0 &&
                                setAddToFolder((addToFolder) => !addToFolder);
                            }}
                          >
                            Add to Folder
                            <em
                              className="icon ni ni-forward-alt-fill"
                              style={{ fontSize: 17 }}
                            ></em>
                          </li>
                          <li
                            onClick={() => {
                              props?.selectedMail?.length > 0 &&
                                setOperateForwardTo(
                                  (operateForwardTo) => !operateForwardTo
                                );
                            }}
                          >
                            Forward to
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </li>
              )}
            <li>
              <div
                className="btn btn-icon btn-trigger"
                onClick={handleRefreshClick}
              >
                <em className="icon ni ni-undo"></em>
              </div>
            </li>
            {/* <li className="mr-n1">
              <div className="my-dropdown">
                <div className="btn btn-trigger btn-icon btn-tooltip">
                  <em className="icon ni ni-sort-line"></em>
                </div>
                <div
                  className="dropdown-content"
                  style={{ overflow: "auto", zIndex: 4 }}
                >
                  <ul className="nk-ibx-label" style={{ cursor: "pointer" }}>
                    <li
                      onClick={() => {
                        handleSortClick("createdAt");
                      }}
                    >
                      <a>
                        {sortTimeState ? (
                          <em className="ni ni-downward-ios icon-size-reduced"></em>
                        ) : (
                          <em className="ni ni-upword-ios icon-size-reduced"></em>
                        )}
                        <span className="nk-ibx-label-text nk-ibx-label-text-width">
                          Sort By Time
                        </span>
                      </a>
                    </li>
                    <li
                      onClick={() => {
                        handleSortClick("op");
                      }}
                    >
                      <a>
                        {sortOpState ? (
                          <em className="ni ni-downward-ios icon-size-reduced"></em>
                        ) : (
                          <em className="ni ni-upword-ios icon-size-reduced"></em>
                        )}
                        <span className="nk-ibx-label-text nk-ibx-label-text-width">
                          Sort By OP
                        </span>
                      </a>
                    </li>
                    <li
                      onClick={() => {
                        handleSortClick("branch");
                      }}
                    >
                      <a>
                        {sortFromState ? (
                          <em className="ni ni-downward-ios icon-size-reduced"></em>
                        ) : (
                          <em className="ni ni-upword-ios icon-size-reduced"></em>
                        )}
                        <span className="nk-ibx-label-text nk-ibx-label-text-width ">
                          Sort By Branch
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </li> */}

            {props.filterOptions.is_sent !== 1 && props.noOfMails > 0 && (
              <li className="btn btn-trigger btn-icon btn-tooltip">
                <div className="station-filter">
                  <div
                    ref={closeWinRef}
                    style={{
                      fontSize: "medium",
                      paddingLeft: "8px",
                      marginTop: "3px",
                    }}
                    onClick={() => {
                      setOperateStationList(
                        (operateStationList) => !operateStationList
                      );
                      operateMarkReadUnread
                        ? setOperateMarkReadUnread(false)
                        : setOperateMarkReadUnread(false);
                    }}
                  >
                    <abbr title="Station List">
                      Station
                      <em
                        style={{ fontSize: 15 }}
                        className="ni ni-downward-alt-fill"
                      ></em>
                    </abbr>
                  </div>

                  {operateStationList && (
                    <div className="station-filter-dropdown" ref={closeWinRef}>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control border-right-0 rounded-0 search-input"
                          placeholder="Search stations..."
                          name="search"
                          autoComplete="off"
                          onChange={(e) => {
                            setSearchInStation(e.target.value);
                          }}
                          style={{ height: "auto" }}
                        />
                        <div className="input-group-btn search-button-div">
                          <button
                            className="btn btn-default border border-left-0 rounded-0 search-button"
                            type="submit"
                          >
                            <em className="icon ni ni-search search-button-em"></em>
                          </button>
                        </div>
                      </div>
                      <div className="station-filter-dropdown-list">
                        <ul className="link-tidy">
                          <div style={{ borderBottom: "1px solid lightgray" }}>
                            <li style={{ display: "flex", minWidth: 180 }}>
                              <div
                                id="ResetAll"
                                style={{
                                  padding: "0px 5px",
                                }}
                                onClick={handleCheckedStation}
                              >
                                Clear All
                              </div>
                              <hr
                                style={{
                                  height: 20,
                                  margin: "0px 5px",
                                  border: "1px solid lightgray",
                                }}
                              />
                              <div
                                id="SelectAll"
                                style={{
                                  padding: "0px 5px",
                                }}
                                onClick={handleCheckedStation}
                              >
                                Select All
                              </div>
                            </li>
                          </div>

                          {filteredList(stationList, searchInStation).map(
                            (stat, i) => {
                              return (
                                <li key={`stationList${i}`}>
                                  <div className="custom-control custom-control-sm custom-checkbox">
                                    <input
                                      type="checkbox"
                                      className="custom-control-input station_checkbox_1"
                                      id={`${stat?.id}`}
                                      name={stat.station}
                                      onChange={handleCheckedStation}
                                      checked={
                                        props?.selectedStation.includes(
                                          stat?.id
                                        )
                                          ? true
                                          : false
                                      }
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor={`${stat?.id}`}
                                    >
                                      {stat?.station}
                                    </label>
                                  </div>
                                </li>
                              );
                            }
                          )}
                        </ul>
                      </div>
                      <div className="station-filter-bottom">
                        <Button
                          onClick={handleStationSubmit}
                          className="station-filter-submit"
                          disabled={disableStationSubmit}
                        >
                          Submit
                        </Button>
                        <Button
                          onClick={handleCancel}
                          style={{ backgroundColor: "#d02121" }}
                          className="station-filter-submit"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            )}
          </ul>
        </div>
        <div>
          <ul className="nk-ibx-head-tools g-1">
            <li>
              <form
                className="navbar-form search-navbar-head"
                onSubmit={searchMail}
              >
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control border-right-0 rounded-0 search-input"
                    placeholder={`Search in ${sectionName} mails`}
                    name="search"
                    value={search?.search}
                    onChange={handleSearch}
                    style={{
                      height: "auto",
                    }}
                  />
                  <div className="input-group-btn search-button-div">
                    <button
                      className="btn btn-default border border-left-0 rounded-0 search-button"
                      type="submit"
                    >
                      <em className="icon ni ni-search search-button-em"></em>
                    </button>
                  </div>
                </div>
              </form>
            </li>

            <li className="d-none d-sm-block ml-n5">
              <div
                className={`btn btn-icon btn-trigger btn-tooltip ${
                  props.total > props.mailDataLength ? "" : "disabled-action"
                }`}
              >
                <em
                  className="icon ni ni-chevron-left"
                  onClick={(e) => {
                    props.getPrevClick(e);
                  }}
                ></em>
              </div>
            </li>

            <li>
              {props?.total}/{props?.noOfMails}
            </li>

            <li className="d-none d-sm-block">
              <div
                className={`btn btn-icon btn-trigger btn-tooltip ${
                  props.total < props.noOfMails ? "" : "disabled-action"
                }`}
              >
                <em
                  className="icon ni ni-chevron-right"
                  onClick={() => {
                    props.getNextClick(props.mailDataLength);
                  }}
                ></em>
              </div>
            </li>
          </ul>
        </div>
        <div className="search-wrap" data-search="search">
          <div className="search-content">
            <a
              className="search-back btn btn-icon toggle-search"
              data-target="search"
            >
              <em className="icon ni ni-arrow-left"></em>
            </a>
            <input
              type="text"
              className="form-control border-transparent form-focus-none"
              placeholder="Search by user or message"
            />
            <button className="search-submit btn btn-icon">
              <em className="icon ni ni-search"></em>
            </button>
          </div>
        </div>
      </div>

      <div
        className="search-station-tags"
        style={{
          paddingBottom:
            props?.stationTag?.length > 0 || tag?.length > 0 ? "1.5%" : "",
        }}
      >
        {props?.stationTag?.length > 0 &&
          props?.stationTag?.map((stat, i) => {
            return (
              <div className="search-tag" key={`props?.stationTag${i}`}>
                <ul className="nk-ibx-tags g-1">
                  <li className="btn-group is-tags">
                    <a className="btn btn-xs btn btn-dim">{`From: ${stat}`}</a>
                    <a className="btn btn-xs btn-icon btn btn-dim">
                      <em
                        className="icon ni ni-cross"
                        onClick={() => deleteStationTag(stat)}
                      ></em>
                    </a>
                  </li>
                </ul>
              </div>
            );
          })}

        {props.searchText.hasOwnProperty("searchData") &&
          Object.values(props.searchText.searchData).map((data, i) => {
            return (
              <div className="search-tag" key={`${data}-${i}`}>
                <ul className="nk-ibx-tags g-1">
                  <li className="btn-group is-tags">
                    <a className="btn btn-xs btn btn-dim">{data}</a>
                    <a
                      className="btn btn-xs btn-icon btn btn-dim"
                      onClick={() => deleteSeachKey(data)}
                    >
                      <em className="icon ni ni-cross"></em>
                    </a>
                  </li>
                </ul>
              </div>
            );
          })}
        {props?.stationTag?.length > 0 && (
          <div className="search-tag">
            <ul className="nk-ibx-tags g-1">
              <li className="btn-group is-tags">
                <a className="btn btn-xs btn btn-dim">Clear All</a>
                <a className="btn btn-xs btn-icon btn btn-dim">
                  <em
                    className="icon ni ni-cross"
                    onClick={clearAllStationTag}
                  ></em>
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

const mapActionToProps = { updateData, updateSeachText };
const mapStateToProps = (state) => ({
  data: state.data,
  userData: state.userData,
  searchText: state.searchText,
  isActiveModule: state.isActiveModule,
});
export default connect(mapStateToProps, mapActionToProps)(InboxNavbar);
