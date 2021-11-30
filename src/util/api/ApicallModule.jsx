import axios from "axios";

export const ApiHandle = async (apiLink, apiData, method) => {
  let headers = {
    "Content-Type": "application/json",
  };
  if (localStorage.getItem("auth")) {
    headers.Authorization = `Bearer ${localStorage.getItem("auth")}`;
  }
  return axios({
    method: method,
    url: `${process.env.REACT_APP_BASE_API_URL}${apiLink}`,
    data: apiData,
    headers: headers,
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error.response === undefined) {
        localStorage.removeItem("auth");
        window.location.href = process.env.REACT_APP_SERVER_ERROR;
      }
      if (error.response.status === 401) {
        if (error.response.data.status === 3) {
          localStorage.removeItem("auth");
          window.location.href = "/";
        }
      }
      return error.response.data;
    });
};
