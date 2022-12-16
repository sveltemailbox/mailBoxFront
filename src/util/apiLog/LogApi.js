import axios from "axios";
import { LOGS_ADD } from "../../config/constants";
export const LogApi = (logData) => {
  let headers = {
    "Content-Type": "application/json",
  };
  if (localStorage.getItem("auth")) {
    headers.Authorization = `Bearer ${localStorage.getItem("auth")}`;
  }
  axios({
    method: "POST",
    url: `${process.env.REACT_APP_BASE_API_URL}${LOGS_ADD}`,
    data: logData,
    headers: headers,
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error.response !== undefined && !error.response.status) {
        // localStorage.removeItem("auth");
        window.location.href = process.env.REACT_APP_SERVER_ERROR;
      }
      return error?.response?.data;
    });
};
