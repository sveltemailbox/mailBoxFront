import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { GET_LIST_STATIONS } from "../../config/constants";
import * as Api from "../../util/api/ApicallModule";
import {
  updateData,
  updateSeachText,
  updateFilterOptions,
  updateStationList,
  updateSortFilter,
} from "../../redux/action/InboxAction";
import Toaster from "../../util/toaster/Toaster";

const Viewsearchbar = (props) => {
  const [searchData, setSearchData] = useState({});
  const [sortTimeState, setSortTimeState] = useState(false);
  const [sortOpState, setSortOpState] = useState(false);
  const [sortFromState, setSortFromState] = useState(false);
  const [tagData, setTagData] = useState({});
  const [search, setSearch] = useState({});
  const [tag, setTag] = useState([]);
  const [stationList, setStationList] = useState([]);
  const [stationTag, setStationTag] = useState([]);
  const [test, setTest] = useState(false);

  useEffect(() => {
    if (Object.keys(props.userData).length) {
      if (props?.selected !== "sent") {
        getListOfStations();
      }
    }
  }, [props?.selected]);

  useEffect(() => {
    if (Object.keys(props.userData).length) {
      if (props?.selected !== "sent") {
        getListOfStations();
      }
    }
  }, []);

  useEffect(() => {
    getkeyValue("reset");
    if (props?.searchText?.searchData?.length > 0) {
      props?.updateSeachText({});
    }
    if (props?.station?.length) {
      props?.updateStationList([]);
    }
  }, [props?.isActiveModule3Column]);

  useEffect(() => {
    let arr = props.sortFilter.split("=");
    let order = arr[1] == "ASC" ? true : false;
    switch (arr[0]) {
      case "createdAt":
        setSortTimeState(order);
        break;
      case "op":
        setSortOpState(order);
        break;
      case "branch":
        setSortFromState(order);
        break;
      default:
        break;
    }
  }, [props.sortFilter]);

  // const handleChange = (event) => {
  //   const inputData = { ...searchData };
  //   inputData[event.target.name] = event.target.value;

  //   if (event.target.value.length > 0) {
  //     setSearchData(inputData);
  //     setTagData(inputData);
  //   } else setSearchData({});
  // };

  const handleSearch = (event) => {
    const inputData = { ...search };
    inputData[event.target.name] = event.target.value;
    // console.log(inputData);
    if (event.target.value.length > 0) {
      setSearch(inputData);
    } else setSearch("");
  };

  const searchMail = (event) => {
    event.preventDefault();
    let exists = Object.values(search).includes("");

    if (!exists && Object.keys(search).length !== 0) {
      const _searchText = { ...props.searchText };
      const _searchData = _searchText.hasOwnProperty("searchData")
        ? _searchText.searchData
        : [];

      const _tag = Object.values(search).map((data) => data);
      if (_searchData.includes(..._tag)) {
        Toaster("error", "Same data already exists");

        setSearch({ search: "" });
        return;
      }

      _searchText["searchData"] = [..._searchData, ..._tag];

      props.updateSeachText(_searchText);
      setTag([..._searchData, ..._tag]);
      setSearch({ search: "" });

      if (_searchText.searchData.length > 0) {
        // const searchData = [...tag, ..._tag].join();

        props.updateFilterOptions({
          ...props.filterOptions,
          search_data: _searchText.searchData,
        });
      }
    }
  };

  const deleteSeachKey = (deletedData) => {
    const _searchText = { ...props.searchText };
    if (_searchText?.searchData?.length > 0) {
      const _tag = [..._searchText.searchData];
      const index = _tag.indexOf(deletedData);
      _tag.splice(index, 1);

      _searchText["searchData"] = _tag;
      props.updateSeachText(_searchText);
      setTag(_tag);
      props.updateFilterOptions({
        ...props.filterOptions,
        search_data: [..._tag].join(),
      });
    } else {
      // delete props.filterOptions.search_data;
      props.updateFilterOptions({ ...props.filterOptions });
    }
  };

  const getkeyValue = (reset) => {
    if (reset === "reset") {
      var inputs = document.querySelectorAll(".station_checkbox_1");
      let arr_key = [];
      for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type === "checkbox") {
          inputs[i].checked = false;
        }
      }
      setStationTag([]);
      return arr_key;
    } else if (reset === "select") {
      var inputs = document.querySelectorAll(".station_checkbox_1");
      let arr_key = [];
      for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type === "checkbox") {
          inputs[i].checked = true;
          arr_key.push(inputs[i].id);
        }
      }
      return arr_key;
    } else {
      var inputs = document.querySelectorAll(".station_checkbox_1");
      let arr_key = [];
      for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
          arr_key.push(inputs[i].id);
        }
      }
      return arr_key;
    }
  };

  const handleChecked = (e) => {
    if (e !== undefined) {
      const target = e.target;
      var id = target.id;
    }
    var arr = [];
    if (id === "ResetAll") {
      getkeyValue("reset");
      props?.updateStationList([]);
    } else if (id === "SelectAll") {
      let key_selected = getkeyValue("select");
      stationList?.map((stat, i) => {
        for (let i = 0; i < key_selected.length; i++) {
          if (stat?.id == key_selected[i]) {
            arr.push(stat?.station);
          }
        }
        setStationTag(arr);
      });
      props?.updateStationList(key_selected);
    } else if (e === undefined) {
      let key_selected = getkeyValue();
      stationList?.map((stat, i) => {
        for (let i = 0; i < key_selected.length; i++) {
          if (stat?.id == key_selected[i]) {
            arr.push(stat?.station);
          }
        }
        setStationTag(arr);
      });
      props?.updateStationList(key_selected);
    } else {
      let key_selected = getkeyValue();
      stationList?.map((stat, i) => {
        for (let i = 0; i < key_selected.length; i++) {
          if (stat?.id == key_selected[i]) {
            arr.push(stat?.station);
          }
        }
        setStationTag(arr);
      });
      props?.updateStationList(key_selected);
    }
  };

  const filterCheck = (selectedOption) => {
    let filter = "";
    if (typeof selectedOption === "string") {
      switch (selectedOption) {
        case "unread":
          filter = "&is_read=0";
          break;
        case "archive":
          filter = "";
          break;
        case "sent":
          filter = "&is_sent=1";
          break;
        case "crashed":
          filter = "&is_crashed=0&is_crashed=1";
          break;
        case "starred":
          filter = "&is_starred=1";
          break;

        default:
          filter = "";
      }
    } else {
      filter = `&folder=${selectedOption}`;
    }
    return filter;
  };

  const getListOfStations = async () => {
    let filter = filterCheck(props?.selected);
    const resp = await Api.ApiHandle(
      `${GET_LIST_STATIONS}${props?.userData?.designations[0]?.id}${filter}`,
      "",
      "GET"
    );

    if (resp?.status === 1) {
      const station = [];
      resp?.data?.map((stat) => {
        let obj = {
          id: stat?.id,
          station: stat?.station,
          checked: false,
        };
        for (let i = 0; i < props?.station.length; i++) {
          if (obj.id == props?.station[i]) {
            obj.checked = true;
          }
        }
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
  //       props?.updateSortFilter(`${sort}=DESC`);
  //       setSortTimeState(false);
  //       setSortFromState(false);
  //       setSortOpState(false);
  //     } else {
  //       props?.updateSortFilter(`${sort}=ASC`);
  //       setSortFromState(false);
  //       setSortTimeState(true);
  //       setSortOpState(false);
  //     }
  //   } else if (sort === "op") {
  //     if (sortOpState) {
  //       props?.updateSortFilter(`${sort}=DESC`);
  //       setSortFromState(false);
  //       setSortOpState(false);
  //       setSortTimeState(false);
  //     } else {
  //       props?.updateSortFilter(`${sort}=ASC`);
  //       setSortFromState(false);
  //       setSortOpState(true);
  //       setSortTimeState(false);
  //     }
  //   } else {
  //     if (sortFromState) {
  //       props?.updateSortFilter(`${sort}=DESC`);
  //       setSortFromState(false);
  //       setSortTimeState(false);
  //       setSortOpState(false);
  //     } else {
  //       props?.updateSortFilter(`${sort}=ASC`);
  //       setSortFromState(true);
  //       setSortTimeState(false);
  //       setSortOpState(false);
  //     }
  //   }
  // };

  const handleRefreshClick = () => {
    props?.getAllMails(props?.selected);
  };

  const defaultSelect = () => {
    var inputs = document.querySelectorAll(".station_checkbox_1");
    // setStationListLength(inputs.length);
    let prev = 0;
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].type === "checkbox") {
        inputs[i].checked = true;
      }
    }
  };

  const deleteStationTag = (index) => {
    var inputs = document.querySelectorAll(".station_checkbox_1");
    let statId;
    stationList.map((stat) => {
      if (stat?.station == index) {
        statId = stat?.id;
      }
    });
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].checked) {
        if (inputs[i]?.id == statId) {
          inputs[i].checked = false;
        }
      }
    }
    setStationTag(stationTag.filter((item) => item != index));
    handleChecked();
  };

  const clearAllStationTag = () => {
    getkeyValue("reset");
    props?.updateStationList([]);
    // setTag([]);
    props?.updateSeachText({});
  };

  return (
    <div>
      <div
        className="nk-ibx-head"
        style={{
          borderRight: "0px",
          borderBottom: "0px",
        }}
      >
        <div className="nk-ibx-head-actions" style={{ width: "100%" }}>
          <ul
            className="nk-ibx-head-tools g-1 ul-list-header"
            style={{ width: "inherit" }}
          >
            {props?.component !== "inbox" ? (
              <li className="d-none d-md-block li-list-header-left">
                <form
                  className="navbar-form search-navbar-head"
                  role="search"
                  onSubmit={searchMail}
                >
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control border-right-0 rounded-0 search-input"
                      style={{ height: "auto" }}
                      placeholder={`Search in ${props?.isActiveModule3Column}`}
                      name="search"
                      value={search?.search}
                      onChange={handleSearch}
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
            ) : (
              <>
                {props?.selected !== "sent" && (
                  <>
                    <li className="li-list-header-left">
                      <div
                        className="btn btn-icon btn-trigger"
                        onClick={handleRefreshClick}
                      >
                        <em className="icon ni ni-undo"></em>
                      </div>
                    </li>
                    {/* <li className="mr-n1 li-list-header-left">
                      <div className="my-dropdown">
                        <div className="btn btn-trigger btn-icon btn-tooltip">
                          <em className="icon ni ni-sort-line"></em>
                        </div>
                        <div
                          className="dropdown-content"
                          style={{ overflow: "auto", zIndex: 4 }}
                        >
                          <ul
                            className="nk-ibx-label"
                            style={{ cursor: "pointer" }}
                          >
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

                    <li className="btn btn-trigger btn-icon btn-tooltip li-list-header-left">
                      <div className="station-filter">
                        <div
                          style={{
                            fontSize: "14px",
                            padding: "5px 5px",
                            margin: "-5px 0px",
                          }}
                        >
                          Station
                          <em
                            style={{ fontSize: 12 }}
                            className="ni ni-downward-alt-fill"
                          ></em>
                        </div>

                        <div
                          className="station-filter-dropdown"
                          style={{ marginTop: 6, left: -13 }}
                        >
                          <ul className="link-tidy">
                            <div
                              style={{ borderBottom: "1px solid lightgray" }}
                            >
                              <li
                                style={{ display: "flex", minWidth: "170px" }}
                              >
                                <div
                                  id="ResetAll"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                  onClick={handleChecked}
                                >
                                  Clear All
                                </div>
                                <hr
                                  style={{
                                    height: 20,
                                    margin: "0px 10px",
                                    border: "1px solid lightgray",
                                  }}
                                />
                                <div
                                  id="SelectAll"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                  onClick={handleChecked}
                                >
                                  Select All
                                </div>
                              </li>
                            </div>

                            {stationList.map((stat, i) => {
                              return (
                                <li key={`stationList${i}`}>
                                  <div className="custom-control custom-control-sm custom-checkbox">
                                    <input
                                      type="checkbox"
                                      className="custom-control-input station_checkbox_1"
                                      id={`${stat?.id}`}
                                      onChange={handleChecked}
                                      // checked={stat.checked}
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
                            })}
                          </ul>
                        </div>
                      </div>
                    </li>
                  </>
                )}
                <li
                  className="li-list-header-right"
                  style={{ marginLeft: "auto" }}
                >
                  <ul className="nk-ibx-head-tools g-1 ul-list-header">
                    {
                      <li className="d-none d-sm-block">
                        <div
                          className={`btn btn-icon btn-trigger btn-tooltip ${
                            props.total > props.mailDataLength
                              ? ""
                              : "disabled-action"
                          }`}
                          title="Prev"
                        >
                          <em
                            className="icon ni ni-chevron-left"
                            onClick={() => {
                              props.getPrevClick();
                            }}
                          ></em>
                        </div>
                      </li>
                    }
                    <li style={{ marginRight: 5 }}>
                      {props?.total}/{props?.totalMails}
                    </li>

                    <li className="d-none d-sm-block">
                      <div
                        className={`btn btn-icon btn-trigger btn-tooltip ${
                          props.total < props.totalMails
                            ? ""
                            : "disabled-action"
                        }`}
                        title="Next"
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
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      <div style={{ display: "flex", width: "97%", overflowX: "auto" }}>
        {props?.component === "inbox" && props?.selected !== "sent" && (
          <div className="search-station-tags">
            {stationTag?.length > 0 &&
              stationTag?.map((stat, i) => {
                return (
                  <div className="search-tag" key={`stationTag${i}`}>
                    <ul className="nk-ibx-tags g-1">
                      <li className="btn-group is-tags">
                        <a className="btn btn-xs btn btn-dim">{stat}</a>
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
            {/* {stationTag?.length > 0 && (
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
          )} */}
          </div>
        )}

        {props?.component === "inbox" &&
          props.searchText.hasOwnProperty("searchData") &&
          Object.keys(props.searchText.searchData).length > 0 && (
            <div>
              <div
                className="nk-ibx-head"
                style={{ padding: "0.5px 0px", borderRight: 0 }}
              >
                {Object.values(props.searchText.searchData).map((data, i) => {
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
              </div>
            </div>
          )}
        {props?.component === "inbox" && stationTag?.length > 0 && (
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
    </div>
  );
};

const mapActionToProps = {
  updateData,
  updateSeachText,
  updateFilterOptions,
  updateStationList,
  updateSortFilter,
};
const mapStateToProps = (state) => ({
  data: state.data,
  userData: state.userData,
  searchText: state.searchText,
  station: state.station,
  sortFilter: state.sortFilter,
  isActiveModule3Column: state.isActiveModule3Column,
});

export default connect(mapStateToProps, mapActionToProps)(Viewsearchbar);
