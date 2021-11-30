import { useEffect, useState } from "react";
import { connect } from "react-redux";

import {
  updateSeachText,
  updateFilterOptions,
} from "../../redux/action/InboxAction";
import Loading from "../../util/loader/Loading";
import InboxList from "./InboxList";
import Viewsearchbar from "../components/Viewsearchbar";

const Inbox = (props) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (props?.inbox?.length >= 0) setLoading(false);
  }, [props.inbox]);
  return (
    <>
      {props?.inbox?.length === 0 && !loading ? (
        <div>
          <Viewsearchbar
            component={"inbox"}
            selected={props?.selected}
            // noOfMails={props.noOfMails}
            mailDataLength={props.mailDataLength}
            totalMails={props.totalMails}
            getNextClick={props.getNextClick}
            getPrevClick={props.getPrevClick}
            total={props.total}
            getAllMails={props?.getAllMails}
            // onClick={deleteSeachKey}
          />
          <div className="no-mail-found">
            <h4>No Mails Found</h4>
          </div>
        </div>
      ) : //  props?.inbox?.length == 1 && props?.inbox[0]?.loader == 1
      loading ? (
        <Loading />
      ) : (
        <div className="nk-ibx-list">
          <Viewsearchbar
            component={"inbox"}
            selected={props?.selected}
            // noOfMails={props.noOfMails}
            mailDataLength={props.mailDataLength}
            totalMails={props.totalMails}
            getNextClick={props.getNextClick}
            getPrevClick={props.getPrevClick}
            total={props.total}
            getAllMails={props?.getAllMails}
            // onClick={deleteSeachKey}
          />
          <div className="container-fluid">
            <div className="row" style={{ marginLeft: -44 }}>
              <div className="col-md-12">
                <div className="jumbotron-overflow">
                  {/* {Object.keys(props.searchText).length > 0 && (
                    <div>
                      <div
                        className="nk-ibx-head"
                        style={{ padding: "11.5px 10px" }}
                      >
                        {Object.keys(props.searchText).length > 0 && (
                          <div className="search-tag">
                            <ul className="nk-ibx-tags g-1">
                              <li className="btn-group is-tags">
                                <a className="btn btn-xs btn btn-dim">
                                  {props?.searchText?.searchData}
                                </a>
                                <a
                                  className="btn btn-xs btn-icon btn btn-dim"
                                  // onClick={deleteSeachKey}
                                >
                                  <em className="icon ni ni-cross"></em>
                                </a>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )} */}
                  <InboxList
                    inbox={props?.inbox}
                    selected={props?.selected}
                    onClick={props.onClick}
                    selectedMail={props.selectedMail}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const mapActionToProps = { updateFilterOptions, updateSeachText };

const mapStateToProps = (state) => ({
  filterOptions: state.filterOptions,
  searchText: state.searchText,
});

export default connect(mapStateToProps, mapActionToProps)(Inbox);
