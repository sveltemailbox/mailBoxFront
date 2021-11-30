// import React from 'react'

// import Navbar from './Navbar';
import Navbar from "../../components/navbar/Navbar";
import Container from "./ContainerComponent";
import "../../Assets/CSS/dashlite.css";

const Layout = () => {
  return (
    <>
      <div className="nk-app-root">
        {/* next component */}
        <div className="nk-main ">
          <div className="nk-wrap ">
            <Navbar />

            {/* next component */}

            {/* next component */}
            <div className="nk-content p-0">
              <div className="nk-content-inner">
                <div className="nk-content-body">
                  <div className="nk-ibx">
                    <Container />
                    {/* <div className="nk-ibx-body body-width bg-white">               
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
      {/* <Navbar /> */}
      {/* <Container /> */}
    </>
  );
};

export default Layout;
