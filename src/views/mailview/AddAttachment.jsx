import React, { useRef, useState } from "react";
import { UPLOAD_ATTACHMENT } from "../../config/constants";
import * as Api from "../../util/api/ApicallModule";
import Toaster from "../../util/toaster/Toaster";

function AddAttachment({ setFileUploading, mailId, setattachment }) {
  const inputFile = useRef(null);

  const handleInputFile = () => {
    inputFile.current.click();
  };

  const handleAttachFile = (e) => {
    setFileUploading(true);
    let count = 0;
    [...e.target.files].forEach(async (item) => {
      let filename = item?.name.split(".");
      filename.pop();
      let fileNameSeparation = filename.join(".");

      const data = new FormData();

      data.append("images", item);
      data.append("imagename", `${fileNameSeparation}`);
      data.append("mailId", mailId);
      const resp = await Api.ApiHandle(`${UPLOAD_ATTACHMENT}`, data, "post");
      if (resp.status === 1) {
        count++;
        setattachment((prev) => [...prev, resp.data]);
        if (e.target.files.length === count) setFileUploading(false);
      } else {
        Toaster("error", "Something went wrong!!");
        setFileUploading(false);
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
        />
        <em className="icon ni ni-clip-v" onClick={handleInputFile}></em>
      </abbr>
    </div>
  );
}

export default AddAttachment;
