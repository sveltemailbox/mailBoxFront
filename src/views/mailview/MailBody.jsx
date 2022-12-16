import React, { useState, useEffect } from "react";
import { selectAndHighlightRange } from "../../components/common/annotation";
import * as Api from "../../util/api/ApicallModule";
import { GET_COLOR_CODE, ANNOTATION_ADD } from "../../config/constants";

function MailBody({
  body,
  call,
  mail_id,
  onClickAnnotation,
  setusercolorcodeObj,
  closeMarginNotes,
  setLoadingDetails,
  handleHighlightButton,
  setAnnotationDataForPrint,
  inboxMailData,
  mailIds,
}) {
  let styleCode = `body{background-color:#ffff;}#iframeResult{background-color: #ffffff;height: 100%;width: 100%;}`;
  let colorcodeObj = {};
  let logData = {};
  const logDataFunction = (type, mail_id, attachId) => {
    logData = {
      type: type,
      mail_id: mail_id,
      attach_id: attachId,
    };
  };
  const handleTextSelector = (backgr, color_id) => {
    handleHighlightButton(backgr, color_id);
  };

  let col = "8";
  if (call == "3-col") {
    col = "12";
  }
  if (call == "3-col-print") {
    col = "12";
  }
  const [annoatationdata, setannoatationdata] = useState([]);
  const [colorCodeApi, setColorCodeApi] = useState(false);
  const [getAllAnnotationApi, setGetAllAnnotationApi] = useState(false);

  useEffect(() => {
    closeMarginNotes();
    setannoatationdata([]);
  }, [body]);

  useEffect(() => {
    if (colorCodeApi === true && getAllAnnotationApi === true) {
      setLoadingDetails(true);
    }
  }, [colorCodeApi, getAllAnnotationApi]);

  const handleheight = (e) => {
    function myStopFunction() {
      clearInterval(heightInt);
    }
    var heightInt = setInterval(() => {
      if (e?.target?.contentWindow != null) {
        myStopFunction();
        if (e?.target?.contentDocument?.body !== null) {
          e.target.contentDocument.body.innerHTML = `<div id="selector">${e.target.contentDocument?.body?.innerHTML}</div><style>#selector{overflow-x: auto}img{page-break-before: always;max-width:100%;height:100%;}</style>`;
          var innerWindow =
            document?.getElementById("iframeResult")?.contentWindow;
          innerWindow.annoClick = annoClick;
          innerWindow.getannotationcomment = getannotationcomment;
          innerWindow.annoatationdata = annoatationdata;

          let object = innerWindow.document.getElementById("selector");
          object.addEventListener("mouseup", function (event) {
            annoClick(event, colorcodeObj);
          });

          if (e?.target?.contentWindow?.document?.body != null) {
            let height =
              e?.target?.contentWindow?.document?.body?.scrollHeight + 50;

            if (call == "3-col-print") {
              height = height * 0.92;
            }
            e.target.style.height = height + "px";
            getColorCode();
            getAllAnnotation();
          }
        }
      }
    }, 500);
  };

  const getAllAnnotation = async () => {
    let annotationData = [];
    logDataFunction("ALL ANNOTATION MAIL", 0, 0);
    mailIds?.forEach(async (item, index) => {
      const resp = await Api.ApiHandle(
        `${ANNOTATION_ADD}?mailid=${inboxMailData}`,
        "",
        "GET",
        logData
      );
      if (resp && resp?.status === 1) {
        annotationData.push(...resp.data);
      }
      if (mailIds?.length - 1 === index) {
        setGetAllAnnotationApi(true);
        setannoatationdata(annotationData);
        setAnnotation(annotationData);
        setAnnotationDataForPrint(annotationData);
      }
    });
  };

  const getColorCode = async () => {
    logDataFunction("COLOUR CODE", 0, 0);
    const resp = await Api.ApiHandle(
      `${GET_COLOR_CODE}?mailid=${mail_id}`,
      "",
      "GET",
      logData
    );
    if (resp?.status === 1) {
      setColorCodeApi(true);
    }
    colorcodeObj = resp?.data;
    let innerWindow = document.getElementById("iframeResult")?.contentWindow;
    if (innerWindow) innerWindow.colorcodeObj = colorcodeObj;
    setusercolorcodeObj(resp.data);
  };

  const setAnnotation = (data) => {
    data.map((res) => {
      selectAndHighlightRange(
        "selector",
        res.start_char,
        res.end_char,
        res?.Color?.background,
        res.anno_comment
      );
    });
    let sel = document
      .getElementById("iframeResult")
      ?.contentWindow?.window.getSelection();
    let range;
    if (sel?.rangeCount && sel?.getRangeAt) {
      range = sel?.getRangeAt(0);
    }
    if (range) {
      sel?.removeAllRanges();
    }
  };

  const annoClick = (e, asd) => {
    const color_id = colorcodeObj?.id;
    const backgr = colorcodeObj?.background;

    handleTextSelector(backgr, color_id);
  };

  const getannotationcomment = (start, end) => {
    onClickAnnotation(start, end);
  };

  return (
    <>
      <style>{styleCode}</style>
      <div className={`col-md-${col}`}>
        <iframe
          frameBorder="0"
          scrolling="no"
          id="iframeResult"
          name="iframeResult"
          allowFullScreen={true}
          onLoad={(e) => {
            handleheight(e);
          }}
          srcDoc={body}
        ></iframe>
      </div>
    </>
  );
}

export default MailBody;
