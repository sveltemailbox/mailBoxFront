import React from "react";
import { NavLink } from "react-router-dom";
import "./HelpModal.css";
const HelpModal = () => {
  const handleClick = () => {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
  };
  return (
    <div id="myModal" className="help-modal">
      <div className="help-modal-content">
        <span onClick={handleClick} className="close">
          &times;
        </span>
        <p className="help-header">Help Section</p>
        <div className="data">
          <span>Contacts:180</span>
          <a target="_blank" href="https://support.local">
            Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
