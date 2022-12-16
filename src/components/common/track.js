import React, { useEffect, useState } from "react";

import * as Api from "../../util/api/ApicallModule";
import Modal from "react-modal";
import DataTable from "react-data-table-component";
import { TRACK_MAIL } from "../../config/constants";
import Loading from "../../util/loader/Loading";

const Track = React.forwardRef((props, ref) => {
  const [data, setdata] = useState([]);
  const [loading, setloading] = useState(true);
  let logData = {};
  const logDataFunction = (type, mail_id, attachId) => {
    logData = {
      type: type,
      mail_id: mail_id,
      attach_id: attachId,
    };
  };
  useEffect(() => {
    getMailshistory();
  }, []);

  const customStyles = {
    overlay: {
      // backgroundColor: "rgba(0, 0, 0, 0)",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      zIndex: "10001",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      width: "70%",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  let columns = [
    {
      name: "Sender",
      selector: "fromUser",
      sortable: false,
    },
    {
      name: "Receiver",
      selector: "toUser",
      sortable: false,
    },
    {
      name: "Created",
      selector: "createdAt",
      sortable: false,
    },
    {
      name: "Read",
      selector: "updatedAt",
      sortable: false,
    },
    {
      name: "Forward To",
      selector: "forwardTo",
      sortable: false,
    },
    { name: "Origin", selector: "origin", sortable: false },
  ];

  const getMailshistory = async () => {
    logDataFunction("TRACK MAIL", 0, 0);
    setloading(true);
    const resp = await Api.ApiHandle(
      `${TRACK_MAIL}?mail_id=${props.mail_id}`,
      "",
      "GET",
      logData
    );

    if (resp.status == 1) {
      setloading(false);
      let track_data = resp.data.map((item) => {
        let res_t = {
          fromUser: `${item.From.designation}(${item.From.branch})`,
          toUser: `${item.To.designation}(${item.To.branch})`,
          createdAt: item.createdAt,
          updatedAt: item.mail_read_time,
          forwardTo: item.forward ?? "",
          origin: item.origin_mail ? "Originator" : "-",
        };
        return res_t;
      });

      setdata(track_data);
    } else setloading(false);
  };

  return (
    <Modal
      classNameName="modal fade"
      isOpen={props.visible}
      id="track_history"
      width="720"
      style={customStyles}
      effect="fadeInUp"
      shouldCloseOnOverlayClick={false}
      onRequestClose={props.closeModal}
    >
      {loading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <div className="modal-content">
          <div className="modal-header">
            <h6 className="modal-title">Track Message</h6>
            <span onClick={props.closeModal} className="close">
              <em className="icon ni ni-cross-sm"></em>
            </span>
          </div>
          <div className="modal-body p-0 trackScroller">
            {/* <DataTableExtensions {...tableData} print={false} export={false}> */}
            <DataTable
              columns={columns}
              data={data}
              // allowOverflow
              noHeader
              defaultSortField="id"
              defaultSortAsc={true}
              pagination
              highlightOnHover
            />
            {/* </DataTableExtensions> */}
          </div>
        </div>
      )}
    </Modal>
    // </div>
  );
});

export default Track;
