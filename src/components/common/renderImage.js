import * as Api from "../../util/api/ApicallModule";
import { IMAGE_FETCH } from "../../config/constants";

export const renderImage = async (html) => {
  var doc = new DOMParser().parseFromString(html, "text/html");
  for (let i = 0; i < doc.getElementsByTagName("img").length; i++) {
    let url = doc.getElementsByTagName("img")[i].getAttribute("src");
    let payload = {
      Urls: url,
    };
    const resp = await Api.ApiHandle(`${IMAGE_FETCH}`, payload, "PUT");
    if (resp.status === 1) {
      doc.getElementsByTagName("img")[i].setAttribute("src", resp.data);
    }
  }
  doc.children[0].children[0].remove();
  return "<html>" + doc.children[0].innerHTML + "</html>";
  // doc.getElementsByTagName('img');
};
