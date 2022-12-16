import axios from "axios";
import { LogApi } from "../apiLog/LogApi";
import { isLogin } from "../../util";

let logDataValue;
export const ApiHandle = async (
  apiLink,
  apiData,

  method,
  logData,
  cancelToken
) => {
  // logDataValue = logData;

  let headers = {
    "Content-Type": "application/json",
  };
  if (localStorage.getItem("auth")) {
    headers.Authorization = `Bearer ${localStorage.getItem("auth")}`;
  }
  let isAuthenticate = isLogin();
  if (isAuthenticate) LogApi(logData);
  return axios({
    method: method,
    url: `${process.env.REACT_APP_BASE_API_URL}${apiLink}`,
    data: apiData,
    headers: headers,
    cancelToken,
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error.response !== undefined && !error.response.status) {
        localStorage.removeItem("auth");
        window.location.href = process.env.REACT_APP_SERVER_ERROR;
      }

      if (error.response !== undefined && error.response.status === 401) {
        if (error.response.data.status === 3) {
          localStorage.removeItem("auth");
          window.location.href = "/";
        }
      }
      return error?.response?.data;
    });
};
