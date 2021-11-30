import { useState } from "react";

const InboxNavbar = () => {
    const [showMore, setShowMore] = useState(false);
  return (
    <>
      <div class="nk-ibx-head">
        <div class="nk-ibx-head-actions">
          <div class="nk-ibx-head-check">
            <div class="custom-control custom-control-sm custom-checkbox">
              <input
                type="checkbox"
                class="custom-control-input nk-dt-item-check"
                id="conversionAll"
              />
              <label class="custom-control-label" for="conversionAll"></label>
            </div>
          </div>
          {/* <ul class="nk-ibx-head-tools g-1">
            <li>
              <a href="/" class="btn btn-icon btn-trigger">
                <em class="icon ni ni-undo"></em>
              </a>
            </li>
            <li class="d-none d-sm-block">
              <a href="/" class="btn btn-icon btn-trigger">
                <em class="icon ni ni-archived"></em>
              </a>
            </li>
            <li class="d-none d-sm-block">
              <a href="/" class="btn btn-icon btn-trigger">
                <em class="icon ni ni-trash"></em>
              </a>
            </li>
            <li>
              <div class="dropdown">
                <span
                onClick={()=>setShowMore(!showMore)}
                  class="dropdown-toggle btn btn-icon btn-trigger"
                  data-toggle="dropdown"
                >
                  <em class="icon ni ni-more-v"></em>
                </span>
                <div class="dropdown-menu" style={{display: showMore?'block':'none'}}>
                  <ul class="link-list-opt no-bdr">
                    <li>
                      <a class="dropdown-item" href="/">
                        <em class="icon ni ni-eye"></em>
                        <span>Move to</span>
                      </a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="/">
                        <em class="icon ni ni-trash"></em>
                        <span>Delete</span>
                      </a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="/">
                        <em class="icon ni ni-archived"></em>
                        <span>Archive</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ul> */}
        </div>
        <div>
          <ul class="nk-ibx-head-tools g-1">          
          <li>
            <form className="navbar-form" role="search">
              <div className="input-group">
                  <input type="text" className="form-control border-right-0 rounded-0" placeholder="Search" name="a" /> 
                  <div class="input-group-btn">
                      <button className="btn btn-default border border-left-0 rounded-0" type="submit" style={{background:"#fbf9f9"}}>
                      <em className="icon ni ni-search"></em>
                      </button>
                  </div>
              </div>
            </form>
          </li>
          {/* <li>
              <a
                href="/"
                class="btn btn-trigger btn-icon search-toggle toggle-search"
                data-target="search"
              >
                <em class="icon ni ni-search"></em>
              </a>
            </li> */}
            <li>
              <a
                href="/"
                class="btn btn-trigger btn-icon btn-tooltip"
                title="Prev Page"
              >
                <em class="icon ni ni-arrow-left"></em>
              </a>
            </li>
            <li>
              <a
                href="/"
                class="btn btn-trigger btn-icon btn-tooltip"
                title="Next Page"
              >
                <em class="icon ni ni-arrow-right"></em>
              </a>
            </li>
            <li class="mr-n1 d-lg-none">
              <a
                href="/"
                class="btn btn-trigger btn-icon toggle"
                data-target="inbox-aside"
              >
                <em class="icon ni ni-menu-alt-r"></em>
              </a>
            </li>
          </ul>
        </div>
        <div class="search-wrap" data-search="search">
          <div class="search-content">
            <a
              href="/"
              class="search-back btn btn-icon toggle-search"
              data-target="search"
            >
              <em class="icon ni ni-arrow-left"></em>
            </a>
            <input
              type="text"
              class="form-control border-transparent form-focus-none"
              placeholder="Search by user or message"
            />
            <button class="search-submit btn btn-icon">
              <em class="icon ni ni-search"></em>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InboxNavbar;
