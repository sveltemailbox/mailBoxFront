import React from "react";

const CommonErrorHandler = ({ array, type }) => {
  const error = Object.keys(array).map(function (key, index) {
    return (
      <li className={ array[key][1] === 'success' || type !== 'error'?'alert alert-success':'alert alert-danger'} style={{ color: array[key][1] === 'success' || type !== 'error'?'green':'red' }} key={index}>
        {/* <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> */}
        {key} - {type === "error" ? array[key][0] : array[key][0]}
        
      </li>
    );
  });

  return error;
};

export default CommonErrorHandler;
