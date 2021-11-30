import React, { useState } from "react";

function Search({ onSubmit, onChange, sectionName }) {
  const [search, setSearch] = useState("");
  return (
    <div>
      <li>
        <form className="navbar-form search-navbar-head" onSubmit={onSubmit}>
          <div className="input-group">
            <input
              type="text"
              className="form-control border-right-0 rounded-0 search-input"
              placeholder={`Search in ${sectionName} mails`}
              name="search"
              // value={search?.search}
              value={search}
              onChange={onChange}
            />
            <div className="input-group-btn search-button-div">
              <button
                className="btn btn-default border border-left-0 rounded-0 search-button"
                type="submit"
              >
                <em className="icon ni ni-search search-button-em"></em>
              </button>
            </div>
          </div>
        </form>
      </li>
    </div>
  );
}

export default Search;
