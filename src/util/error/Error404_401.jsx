import CommonErrorHandler from "./CommonErrorHandler";
import * as Api from "./ApicallModule";

export const Error404_401 = (status, data) => {
  if (status === 400) {
    return <CommonErrorHandler array={data} type="error" />;
  } else if (status === 401) {
    const Error401 = async () => 
    {
      const resp = await Api.ApiHandle(
        "user/refreshToken/",
        { refresh_token: sessionStorage.getItem("refresh_token") },
        "POST"
      );

      if (resp.status === 200) {
        sessionStorage.setItem("ss_tkn", resp.data.access_token);
        sessionStorage.setItem("expires_in", resp.data.expires_in);
        sessionStorage.setItem("refresh_token", resp.data.refresh_token);
      }
    };
    Error401();
  }
};
