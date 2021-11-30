import { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
// import Navbar from "../components/Navbar";
import Navbar from "../../components/navbar/Navbar";
import "../Assets/CSS/3ColumnStyle.css";
import Sidebar from "./Sidebar";




const ThreeColumnView = (props) => {
  const [activeModule, setActiveModule] = useState("inbox");
  
  return (
    <>
      <div className="nk-app-root">
        {/* next component */}
        <div className="nk-main ">
          <div className="nk-wrap ">
            <Navbar />

            {/* next component */}

            {/* next component */}  
            <div class="nk-content p-0">
              <div class="nk-content-inner">
                <div class="nk-content-body">
                  <div class="nk-ibx">
                    <Sidebar/>
                    {/* <div class="nk-ibx-body body-width bg-white">               
                      {activeModule === 'inbox'?
                        <Inbox setActiveModule={setActiveModule} />
                        :
                        <MailView activeModule={activeModule} setActiveModule={setActiveModule} />  
                      }                     
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>

      {/* new component*/}

      {/* new component */}
    </>
  );
};

const mapStateToProps = (state) => ({
  userData: state.userData,
});

export default connect(mapStateToProps)(ThreeColumnView);
