import React from "react";
import ReactDOM from "react-dom";
import Routes from "./routes";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.render(
  // <React.StrictMode>
  <Provider store={store}>
    <Routes />
    <ToastContainer />
  </Provider>,
  document.getElementById("root")
);
