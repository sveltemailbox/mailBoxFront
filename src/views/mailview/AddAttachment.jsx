import React, { useRef, useState } from "react";
import { UPLOAD_ATTACHMENT } from "../../config/constants";
import * as Api from "../../util/api/ApicallModule";
import { LogApi } from "../../util/apiLog/LogApi";
import Toaster from "../../util/toaster/Toaster";

function AddAttachment({
  setFileUploading,
  mailId,
  setattachment,
  attachment,
  isFileUploading,
}) {
  const inputFile = useRef(null);
  let logData = {};

  const logDataFunction = (type, mail_id, attachId) => {
    logData = {
      type: type,
      mail_id: mail_id,
      attach_id: attachId,
    };
  };
  const handleInputFile = () => {
    inputFile.current.click();
  };

  const handleAttachFile = (e) => {
    setFileUploading(true);

    let val = attachment.map((item) => {
      return item.name;
    });

    [...e.target.files].forEach(async (item) => {
      let str = item?.name;
      let lastIndex = str.lastIndexOf(".");
      let filename = str.slice(0, lastIndex);
      let extname = str.slice(lastIndex + 1);
      if (extname === "exe") {
        Toaster("error", "Incorrect File Format(.exe)");
        setFileUploading(false);
      } else if (extname === "json") {
        Toaster("error", "Incorrect File Format(.json)");
        setFileUploading(false);
      } else if (val.includes(item?.name)) {
        Toaster("error", "File already exist with same name !!");
        setFileUploading(false);
      } else {
        let fileNameSeparation = filename;

        const data = new FormData();

        data.append("images", item);
        data.append("imagename", `${fileNameSeparation}`);
        data.append("mailId", mailId);
        logDataFunction("CLICK ON UPLOAD ATTACHMENT", mailId, 0);
        const resp = await Api.ApiHandle(
          `${UPLOAD_ATTACHMENT}`,
          data,
          "post",
          logData
        );
        if (resp?.status === 1) {
          setattachment((prev) => [...prev, resp.data]);
          setFileUploading(false);
          logDataFunction("UPLOAD ATTACHMENT", mailId, [resp?.data?.id]);
          await LogApi(logData);
        } else {
          Toaster("error", "Something went wrong!!");
          setFileUploading(false);
        }
      }
    });
  };

  return (
    <div>
      <abbr title="Add attachment">
        <input
          multiple
          type="file"
          id="file"
          ref={inputFile}
          style={{ display: "none" }}
          onChange={handleAttachFile}
          disabled={isFileUploading}
        />
        <em className="icon ni ni-clip-v" onClick={handleInputFile}></em>
      </abbr>
    </div>
  );
}

export default AddAttachment;
