
const CommentBox = (props) => {
  return (
    <div ref={props.commentBoxRef} className="col-md-8">
      <div className="nk-ibx-reply-form nk-reply-form">
        <div className="nk-reply-form-header">
          <div className="nk-reply-form-group">
            {/* <div className="nk-reply-form-dropdown">
              <div className="dropdown">
                <a
                  className="btn btn-sm btn-trigger btn-icon"
                  data-toggle="dropdown"
                  href="/"
                >
                  <em className="icon ni ni-curve-up-left"></em>
                </a>
                <div className="dropdown-menu dropdown-menu-md">
                  <ul className="link-list-opt no-bdr">
                    <li>
                      <a className="dropdown-item" href="/">
                        <em className="icon ni ni-reply-fill"></em>{" "}
                        <span>Reply to Akshay Kumar</span>
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="/">
                        <em className="icon ni ni-forward-arrow-fill"></em>{" "}
                        <span>Forword</span>
                      </a>
                    </li>
                    <li className="divider"></li>
                    <li>
                      <a href="/">
                        <em className="icon ni ni-edit-fill"></em>{" "}
                        <span>Edit Subject</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div> */}

            {/* <div className="nk-reply-form-title d-sm-none">Reply</div> */}

            <div className="nk-reply-form-input-group">
              {/* to for the comment */}
              <div className="nk-reply-form-input nk-reply-form-input-to">
                <label className="label" style={{ paddingTop: 2 }}>
                  To
                </label>
                <Select
                  isMulti
                  name="colors"
                  options={props.options}
                  placeholder="
                  Enter the user Designation-Branch or Select from below..."
                  value={props.to}
                  onChange={props.handleToData}
                  isClearable={true}
                />
              </div>

              {/* <div
              className="nk-reply-form-input nk-reply-form-input-cc"
              data-content="mail-cc"
            >
              <label className="label">Cc</label>
              <input type="text" className="input-mail tagify" />
              <a href="/" className="toggle-opt" data-target="mail-cc">
                <em className="icon ni ni-cross"></em>
              </a>
            </div>
            <div
              className="nk-reply-form-input nk-reply-form-input-bcc"
              data-content="mail-bcc"
            >
              <label className="label">Bcc</label>
              <input type="text" className="input-mail tagify" />
              <a href="/" className="toggle-opt" data-target="mail-bcc">
                <em className="icon ni ni-cross"></em>
              </a>
            </div> */}
            </div>

            {/* <ul className="nk-reply-form-nav">
            <li>
              <a
                tabindex="-1"
                className="toggle-opt"
                data-target="mail-cc"
                href="/"
              >
                CC
              </a>
            </li>
            <li>
              <a
                tabindex="-1"
                className="toggle-opt"
                data-target="mail-bcc"
                href="/"
              >
                BCC
              </a>
            </li>
          </ul> */}

          </div>
        </div>

        <div className="no-select">
          <div className="nk-reply-form-editor">
            <div className="nk-reply-form-field">
              <textarea
                className="form-control form-control-simple no-resize"
                placeholder="Enter Comments..."
                value={props.inputCommentData}
                onChange={props.handleInputCommentData}
              ></textarea>
            </div>
          </div>

          <div className="nk-reply-form-tools">
            <ul
              className="nk-reply-form-actions g-1"
              style={{ flexWrap: "wrap" }}
            >
              {props.preDefinedComments?.map((com, i) => {
                return (
                  <li
                    key={`preDefinedComments${i}`}
                    className="mr-2"
                    onClick={() =>
                      props.handlePreDefinedComment(com.comments)
                    }
                  >
                    <div className="myButton">{com.comments}</div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="nk-reply-form-tools">
            <ul className="nk-reply-form-actions g-1">
              <li className="mr-2">
                <button
                  className="btn btn-primary"
                  type="submit"
                  onClick={() => props.handleSendComment()}
                >
                  Send
                </button>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  )
};