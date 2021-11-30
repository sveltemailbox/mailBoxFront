import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import "./compose_to.css";

function ComposeTo(props) {
  const closeWinRef = useRef(null);
  let isFullSize = props?.isFullSize ? 5 : 2;
  const [ownBranchDesignationList, setOwnBranchDesignationList] = useState([]);
  const [otherBranches, setOtherBranches] = useState([]);
  const [operateDesignationList, setOperateDesignationList] = useState(false);
  const [searchInStation, setSearchInStation] = useState("");
  const [dropDownOwnBranch, setDropDownOwnBranch] = useState(true);
  const [selectedDesignation, setSelectedDesignation] = useState([]);
  const [selectedDesignationName, setSelectedDesignationName] = useState([]);
  const [ownBranchCheckBox, setOwnBranchCheckBox] = useState(false);

  useEffect(() => {
    filterDesignation();
  }, [props?.designationList]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (closeWinRef.current && !closeWinRef.current.contains(event.target)) {
        setOperateDesignationList(false);
        setSearchInStation("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeWinRef]);

  useEffect(() => {
    [...props?.to]?.forEach((item) => {
      let prevSelectedId = [...selectedDesignation];
      if (!prevSelectedId.includes(item?.id)) {
        setSelectedDesignation((prev) => [...prev, item?.id]);
        setSelectedDesignationName((prev) => [...prev, item]);
      }
    });
  }, [props?.to]);

  useEffect(() => {
    props?.commonAddresses.forEach((item) => {
      if (selectedDesignation?.includes(item?.id)) {
        props?.handleFrequentAddresses(item, item?.id);
      }
    });
    props?.setTo([...selectedDesignationName]);
  }, [selectedDesignation]);

  const filterDesignation = () => {
    let finalData = [];
    let finalOtherBranches = {};
    let otherBranchesData = [];
    let userBranch = props?.userData?.designations[0]?.branch;
    props?.designationList?.forEach((item) => {
      if (item.branch === userBranch) {
        setOwnBranchDesignationList((prev) => [...prev, item]);
      } else {
        otherBranchesData.push(item);
      }
    });
    otherBranchesData.forEach((item) => {
      if (finalOtherBranches.hasOwnProperty(item.branch)) {
        finalData.push(item);
        finalOtherBranches[item.branch] = finalData;
      } else {
        finalOtherBranches[item.branch] = [item];
      }
    });

    finalOtherBranches = Object.keys(finalOtherBranches)
      .sort()
      .reduce(
        (acc, key) => ({
          ...acc,
          [key]: finalOtherBranches[key],
        }),
        {}
      );

    Object.keys(finalOtherBranches).map((item) => {
      finalOtherBranches[item][0]["isOpen"] = false;
    });

    setOtherBranches(finalOtherBranches);
  };

  const filteredList = (stationList, searchInStation) => {
    return stationList?.filter((station) =>
      bySearch(station?.branch, station?.designation, searchInStation)
    );
  };

  const bySearch = (stationBranch, stationDesignation, searchInStation) => {
    if (searchInStation) {
      return (
        stationBranch
          ?.toLowerCase()
          ?.includes(searchInStation?.toLowerCase()) ||
        stationDesignation
          ?.toLowerCase()
          ?.includes(searchInStation?.toLowerCase())
      );
    } else return stationBranch;
  };

  const handleCheckedDesignation = (e, item) => {
    const { id, checked } = e.target;

    let ID = id.split("-");
    if (checked) {
      setSelectedDesignation((prev) => [...prev, +ID[1]]);
      setSelectedDesignationName((prev) => [...prev, item]);
    } else {
      setSelectedDesignation(
        selectedDesignation.filter((item) => item !== +ID[1])
      );
      setSelectedDesignationName(
        selectedDesignationName?.filter((item) => item.id !== +ID[1])
      );
    }
    setSearchInStation("");
  };

  const handleOwnBranch = (e) => {
    setOwnBranchCheckBox((ownBranchCheckBox) => !ownBranchCheckBox);
    let prevSelectedId = [...selectedDesignation];

    !ownBranchCheckBox
      ? ownBranchDesignationList.forEach((item) => {
          if (!prevSelectedId.includes(item?.id)) {
            setSelectedDesignation((prev) => [...prev, +item.id]);
            setSelectedDesignationName((prev) => [...prev, item]);
          }
        })
      : ownBranchDesignationList.forEach(() => {
          setSelectedDesignation([]);
          setSelectedDesignationName([]);
        });
    setSearchInStation("");
  };

  const listingDesignation = (desig, i) => {
    return (
      <div key={`selectedDesignation${i}`} className="selected-name">
        <span>{`${desig?.designation}(${desig?.branch})`}</span>
        <em
          className="icon ni ni-cross"
          style={{
            opacity: "0.54",
            marginLeft: 3,
          }}
          onClick={() => {
            setSelectedDesignationName(
              selectedDesignationName.filter((item) => item.id !== +desig.id)
            );
            setSelectedDesignation(
              selectedDesignation.filter((item) => item !== +desig.id)
            );
          }}
        ></em>
      </div>
    );
  };

  const handleArrow = (e, item) => {
    const reference = { ...otherBranches };
    reference[item][0].isOpen = !reference[item][0].isOpen;
    setOtherBranches(reference);
  };

  return (
    <div className="composeBox">
      <div className="designation-list" ref={closeWinRef}>
        <div className="designation-list-dropdown">
          <div
            className="input-group"
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {!operateDesignationList &&
            selectedDesignationName?.length > isFullSize
              ? selectedDesignationName
                  ?.slice(0, isFullSize)
                  .map((desig, i) => {
                    return listingDesignation(desig, i);
                  })
              : selectedDesignationName?.length > 0 &&
                selectedDesignationName?.map((desig, i) => {
                  return listingDesignation(desig, i);
                })}
            {!operateDesignationList &&
              selectedDesignationName?.length > isFullSize && (
                <h3
                  className="more-recipients"
                  onClick={() => {
                    setOperateDesignationList(true);
                  }}
                >
                  {selectedDesignationName?.length - isFullSize} more
                </h3>
              )}
            <textarea
              type="text"
              className="form-control border-right-0 rounded-0 search-input text-area-input"
              placeholder={!selectedDesignationName?.length > 0 && `To`}
              style={{
                marginTop: selectedDesignationName?.length > 0 && "1%",
                marginBottom: selectedDesignationName?.length > 0 && "1%",
              }}
              name="search"
              onFocus={() => {
                setOperateDesignationList(true);
              }}
              autoComplete="off"
              onChange={(e) => {
                setSearchInStation(e.target.value);
              }}
            />
          </div>
          {operateDesignationList && (
            <div>
              <div className="designation-list-dropdown-list">
                <ul className="link-tidy">
                  <div className="own-branch">
                    <div className="custom-control custom-control-sm custom-checkbox other-branch-name ">
                      <input
                        type="checkbox"
                        className="custom-control-input station_checkbox_1"
                        id="ownBranch"
                        name="ownBranch"
                        checked={ownBranchCheckBox}
                        onChange={handleOwnBranch}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="ownBranch"
                        style={{
                          fontSize: 17,
                          fontWeight: "500",
                          opacity: "0.7",
                        }}
                      >
                        Own Branch
                      </label>
                      <div
                        onClick={() => {
                          setDropDownOwnBranch(
                            (dropDownOwnBranch) => !dropDownOwnBranch
                          );
                        }}
                      >
                        {dropDownOwnBranch ? (
                          <em className="icon ni ni-chevron-down"></em>
                        ) : (
                          <em className="icon ni ni-chevron-right"></em>
                        )}
                      </div>
                    </div>
                    {filteredList(
                      ownBranchDesignationList,
                      searchInStation
                    )?.map((item, id) => {
                      return (
                        dropDownOwnBranch && (
                          <li key={`ownBranchList${id}`}>
                            <div className="custom-control custom-control-sm custom-checkbox">
                              <input
                                type="checkbox"
                                className="custom-control-input station_checkbox_1"
                                name="ownBranchList"
                                id={`branch-${item?.id}`}
                                onChange={(e) => {
                                  handleCheckedDesignation(e, item);
                                }}
                                checked={
                                  selectedDesignation?.includes(item?.id)
                                    ? true
                                    : false
                                }
                              />
                              <label
                                className="custom-control-label"
                                htmlFor={`branch-${item?.id}`}
                              >
                                {`${item?.designation}(${item?.branch})`}
                              </label>
                            </div>
                          </li>
                        )
                      );
                    })}
                  </div>
                  <div className="other-branch">
                    {Object.keys(otherBranches).map((item, id) => {
                      return (
                        <li
                          key={`otherBranches${id}`}
                          style={{ padding: "0.1rem 1.1rem" }}
                        >
                          <div
                            className="other-branch-name"
                            onClick={(e) => {
                              handleArrow(e, item);
                            }}
                          >
                            <div
                              style={{
                                fontSize: 17,
                                fontWeight: "500",
                                opacity: "0.7",
                              }}
                            >
                              {item}
                            </div>
                            {otherBranches[item][0].isOpen ? (
                              <em className="icon ni ni-chevron-down"></em>
                            ) : (
                              <em className="icon ni ni-chevron-right"></em>
                            )}
                          </div>
                          {otherBranches[item][0].isOpen && (
                            <div>
                              {filteredList(
                                otherBranches[item],
                                searchInStation
                              )?.map((desig, id) => {
                                return (
                                  <div key={`designList${id}`}>
                                    <div className="custom-control custom-control-sm custom-checkbox">
                                      <input
                                        type="checkbox"
                                        className="custom-control-input station_checkbox_1"
                                        name="otherBranches"
                                        id={`branch-${desig?.id}`}
                                        onChange={(e) => {
                                          handleCheckedDesignation(e, desig);
                                        }}
                                        checked={
                                          selectedDesignation.includes(
                                            desig?.id
                                          )
                                            ? true
                                            : false
                                        }
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor={`branch-${desig?.id}`}
                                      >
                                        {`${desig?.designation}(${desig?.branch})`}
                                      </label>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </div>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="frequentAddresses">
        {props?.commonAddresses.length > 0 && (
          <div className="nk-reply-form-tools" style={{ borderTop: "none" }}>
            <ul
              className="nk-reply-form-actions g-1"
              style={{ flexWrap: "wrap" }}
            >
              {props?.commonAddresses?.map((com, i) => {
                return (
                  <li
                    key={`commonAddresses${i}`}
                    className="mr-2"
                    onClick={() => props?.handleFrequentAddresses(com, com?.id)}
                  >
                    <div className="frequent_addresses_button">{`${com?.designation}-${com?.branch}`}</div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  userData: state.userData,
});
export default connect(mapStateToProps)(ComposeTo);
