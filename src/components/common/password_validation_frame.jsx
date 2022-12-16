import React from "react";
// import { MdDone } from "react-icons/md";
// import { MdClose } from "react-icons/md";

export default function PasswordValidationFrame(props) {
  return (
    <ul className="d-inline-block text-grey text-left pl-18">
      <li className="pb-8">Password must contain atleast:</li>
      <li>
        {props.password.hasUpper && <Valid />}
        {!props.password.hasUpper && <Invalid />}
        One capital letter
      </li>
      <li>
        {props.password.hasLower && <Valid />}
        {!props.password.hasLower && <Invalid />}
        One lowercase letter
      </li>
      <li>
        {props.password.hasNumber && <Valid />}
        {!props.password.hasNumber && <Invalid />}
        One number
      </li>
      <li>
        {props.password.hasSpecial && <Valid />}
        {!props.password.hasSpecial && <Invalid />}
        One special character (!@#$%^&*)
      </li>
      <li>
        {props.password.lengthValid && <Valid />}
        {!props.password.lengthValid && <Invalid />}8 character length
      </li>
    </ul>
  );
}

function Valid() {
  return (
    <div className="d-inline mr-1 display-9 text-success">
      <em class="icon ni ni-check" />
    </div>
  );
}

function Invalid() {
  return (
    <div className="d-inline mr-1 display-9 text-danger">
      <em class="icon ni ni-cross-sm"></em>
    </div>
  );
}
