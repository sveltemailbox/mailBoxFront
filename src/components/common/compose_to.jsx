import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { GET_ALL_BRANCH } from "../../config/constants";
import { ApiHandle } from "../../util/api/ApicallModule";
import Loader from "react-loader-spinner";
import "./compose_to.css";

function ComposeTo(props) {
  const closeWinRef = useRef(null);
  let isFullSize = props?.isFullSize ? 8 : 2;
  let commonAddresses = [...props?.commonAddresses];
  const [ownBranchDesignationList, setOwnBranchDesignationList] = useState([]);
  const [otherBranches, setOtherBranches] = useState({});
  const [operateDesignationList, setOperateDesignationList] = useState(false);
  const [searchInStation, setSearchInStation] = useState("");
  const [dropDownOwnBranch, setDropDownOwnBranch] = useState(true);
  const [selectedDesignation, setSelectedDesignation] = useState([]);
  const [selectedDesignationName, setSelectedDesignationName] = useState([]);
  const [ownBranchCheckBox, setOwnBranchCheckBox] = useState(false);
  const [otherBranchesDesignation, setOtherBranchesDesignation] = useState({});
  const [isLoading, setIsLoading] = useState({});
  let logData = {};
  const logDataFunction = (type, mail_id, attachId) => {
    logData = {
      type: type,
      mail_id: mail_id,
      attach_id: attachId,
    };
  };
  useEffect(() => {
    getAllBranches();
  }, []);

  useEffect(() => {
    setSelectedDesignation([]);
    setSelectedDesignationName([]);
    setSearchInStation("");
    setOwnBranchCheckBox(false);
  }, [props?.mailId]);

  useEffect(() => {
    setSearchInStation("");
  }, [isLoading]);

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
    commonAddresses.forEach((item) => {
      if (selectedDesignation?.includes(item?.id)) {
        props?.handleFrequentAddresses(item, item?.id);
      }
    });

    props?.setTo([...selectedDesignationName]);

    let arr = props?.allCommonAddresses.filter(
      (item) => !selectedDesignation.includes(item.id)
    );

    props?.setCommonAddresses(arr);
  }, [selectedDesignation]);

  const getAllBranches = async () => {
    const designationId = props?.userData?.designations.filter((item) => {
      if (item.default_desig) return item;
    })[0].id;
    logDataFunction("GET ALL BRANCH", 0, 0);
    const resp = await ApiHandle(`${GET_ALL_BRANCH}`, "", "GET", logData);
    if (resp?.status === 1) {
      setOwnBranchDesignationList(
        resp?.data?.ownBranch?.filter((item) => item.id !== designationId)
      );
      let branch = resp?.data;
      delete branch["ownBranch"];
      setOtherBranches(branch);
    }
  };

  const filteredList = (stationList, searchInStation) => {
    return (
      Array.isArray(stationList) &&
      stationList?.filter((station) =>
        bySearch(`${station?.designation}-${station?.branch}`, searchInStation)
      )
    );
  };

  const bySearch = (stationBranch, searchInStation) => {
    if (searchInStation) {
      return stationBranch
        ?.toLowerCase()
        ?.includes(searchInStation?.toLowerCase());
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
    if (props.blankTo === true) {
      setSelectedDesignationName([]);
      setSelectedDesignation([]);
    }
    return (
      <div key={`selectedDesignation${i}`} className="selected-name">
        <span>
          {`${desig?.designation}(${desig?.branch})`}
          {/* {desig?.first_name !== null && desig?.first_name !== undefined ? (
            <i> ({desig?.first_name})</i>
          ) : null} */}
        </span>
        <em
          className="icon ni ni-cross"
          style={{
            opacity: "0.54",
            marginLeft: 3,
            fontSize: 12,
          }}
          onClick={() => {
            setSelectedDesignationName(
              selectedDesignationName.filter((item) => item.id !== +desig.id)
            );
            setSelectedDesignation(
              selectedDesignation.filter((item) => item !== +desig.id)
            );
            handleSelectedCommonAddress(desig);
          }}
        ></em>
      </div>
    );
  };

  const handleBranchDesignationArrow = (item, data) => {
    setOtherBranchesDesignation((prev) => ({
      ...prev,
      [item]: {
        isOpen: !prev[item]?.isOpen,
        data,
      },
    }));
  };

  const handleLoading = (item, isTrue) => {
    setIsLoading((prev) => ({
      ...prev,
      [item]: isTrue,
    }));
  };

  const handleArrow = async (e, item) => {
    handleLoading(item, true);
    if (
      !otherBranchesDesignation[item]?.isOpen &&
      !otherBranchesDesignation[item]?.data?.length > 0
    ) {
      handleBranchDesignationArrow(item, otherBranches[item]);
      handleLoading(item, false);
    } else {
      handleBranchDesignationArrow(item, otherBranches[item]);

      handleLoading(item, false);
    }
  };

  const filteredListing = (data, branch) => {
    const filteredArray =
      Array.isArray(filteredList(data, searchInStation)) &&
      filteredList(data, searchInStation)?.map((item, id) => {
        return (
          <li
            key={
              branch === "own" ? `ownBranchList${id}` : `otherBranchList${id}`
            }
          >
            <div className="custom-control custom-control-sm custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input station_checkbox_1"
                name="ownBranchList"
                id={`branch-${item?.id}`}
                onChange={(e) => {
                  handleCheckedDesignation(e, item);
                }}
                checked={selectedDesignation?.includes(item?.id) ? true : false}
              />
              <label
                className="custom-control-label"
                htmlFor={`branch-${item?.id}`}
              >
                {`${item?.designation}-${item?.branch}  `}
                {/* {item?.first_name !== null && item?.first_name !== undefined ? (
                  <i> ({item.first_name})</i>
                ) : null} */}
              </label>
            </div>
          </li>
        );
      });
    return filteredArray;
  };

  const branchList = (item) => {
    return (
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
        {isLoading[item] ? (
          <Loader type="ThreeDots" color="#6576ff" height={20} width={20} />
        ) : otherBranchesDesignation[item]?.isOpen ? (
          <em className="icon ni ni-chevron-down"></em>
        ) : (
          <em className="icon ni ni-chevron-right"></em>
        )}
      </div>
    );
  };

  const handleSelectedCommonAddress = (common) => {
    if (common?.hasOwnProperty("belongsTo")) {
      props?.setCommonAddresses((prev) => [...prev, common]);
    }
  };

  const frequentCommonAddresses = (commonAddresses) => {
    return (
      <div className="nk-reply-form-tools" style={{ borderTop: "none" }}>
        <ul className="nk-reply-form-actions g-1" style={{ flexWrap: "wrap" }}>
          {commonAddresses?.map((com, i) => {
            return (
              <li
                key={`commonAddresses${i}`}
                className="mr-2"
                onClick={() => {
                  props?.handleFrequentAddresses(com, com?.id);
                }}
              >
                <div className="frequent_addresses_button">
                  {`${com?.designation}-${com?.branch}`}
                  {/* {com?.first_name !== null && com?.first_name !== undefined ? (
                    <i> ({com?.first_name})</i>
                  ) : null} */}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const handleFocus = (event) => {
    if (event.keyCode === 9 && event.target.nodeName === "INPUT") {
      window?.document?.getElementById("subject")?.focus();
      setOperateDesignationList(false);
    }
  };

  const handleSearchInStation = (value) => {
    if (value === "") {
      Object.keys(otherBranches).map((item) => {
        let data = otherBranches[item];

        setOtherBranchesDesignation((prev) => ({
          ...prev,
          [item]: {
            isOpen: false,
            data,
          },
        }));
      });
    } else {
      Object.keys(otherBranches).map((item) => {
        let data = otherBranches[item];
        setOtherBranchesDesignation((prev) => ({
          ...prev,
          [item]: {
            isOpen: true,
            data,
          },
        }));
      });
    }
  };

  const showingOtherBranches = (branches) =>
    Object.keys(branches).map((item, id) => {
      let checker = [];
      let tempItemArray = [];
      return (
        <>
          <div className="other-branch">
            <div key={`otherBranchesNone${id}`} style={{ display: "none" }}>
              {
                (checker = filteredListing(
                  otherBranchesDesignation[item]?.data,
                  "other"
                ))
              }

              {checker?.length == 0 ? tempItemArray.push(item) : ""}
            </div>
            <li key={`otherBranches${id}`} style={{ padding: "0rem 1.1rem" }}>
              {!tempItemArray.includes(item) ? branchList(item) : ""}
              {otherBranchesDesignation[item]?.isOpen && (
                <div>
                  {filteredListing(
                    otherBranchesDesignation[item]?.data,
                    "other"
                  )}
                </div>
              )}
            </li>
          </div>
        </>
      );
    });

  return (
    <div className="composeBox">
      <div className="designation-list" ref={closeWinRef}>
        <div className="designation-list-dropdown">
          <div className="compose-to">
            <div className="listing-selected-name">
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
            </div>
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

            <input
              type="text"
              className="compose-to-textarea"
              placeholder={`To`}
              name="search"
              onFocus={() => {
                setOperateDesignationList(true);
              }}
              value={searchInStation}
              autoComplete="off"
              onChange={(e) => {
                setSearchInStation(e.target.value);
                handleSearchInStation(e.target.value);
              }}
              onKeyDown={handleFocus}
            />
          </div>
          {operateDesignationList && (
            <div>
              <div className="designation-list-dropdown-list">
                <ul className="link-tidy">
                  <div
                    className="own-branch"
                    style={{
                      display:
                        filteredListing(ownBranchDesignationList, "own")
                          ?.length === 0
                          ? "none"
                          : "",
                    }}
                  >
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
                    {dropDownOwnBranch &&
                      filteredListing(ownBranchDesignationList, "own")}
                  </div>

                  {showingOtherBranches(otherBranches)}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="frequentAddresses">
        {commonAddresses.length > 0 && frequentCommonAddresses(commonAddresses)}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  userData: state.userData,
});
export default connect(mapStateToProps)(ComposeTo);
