import React from "react";
import Loader from "react-loader-spinner";

function Loading() {
  return (
    <div style={{ margin: "auto", textAlign: "center" }}>
      <Loader type="Oval" color="#6576ff" height={50} width={50} />
    </div>
  );
}

export default Loading;
