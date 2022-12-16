import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Login from "./Auth/Login";
import Mailbox from "./views/Mailbox";
import Signup from "./Auth/Signup";
import UpdateProfile from "./Auth/UpdateProfile";
import { isLogin } from "./util";
import ChangePassword from "./Auth/ChangePassword";
import PreferencePage from "../src/components/common/preferences";
import ThreeColumnView from "./3ColumnView/views/ThreeColumnView";
import Layout from "../src/3ColumnView/components/Layout";
import { useEffect, useState } from "react";
import IdleTimer from "./Auth/IdleTime";

function App() {
  const [isTimeout, setIsTimeout] = useState(false);
  const [isPreferencedChanged, setIsPreferenceChanged] = useState(false);
  const [isProfileUpdated, setIsProfileUpdated] = useState(false);

  useEffect(() => {
    const timer = new IdleTimer({
      timeout: 1800, //expire after 10 seconds
      onTimeout: () => {
        setIsTimeout(true);
      },
      onExpired: () => {
        setIsTimeout(true);
      },
    });

    return () => {
      timer.cleanUp();
    };
  }, []);

  const isAuthenticated = isLogin();

  return (
    <BrowserRouter>
      {!isAuthenticated && <Redirect to="/" />}
      {isTimeout && <Redirect to="/" />}
      <Switch>
        <Route exact path="/" component={Login} />
        <Route
          path="/mail"
          render={() => (
            <Mailbox
              isPreferencedChanged={isPreferencedChanged}
              setIsPreferenceChanged={setIsPreferenceChanged}
              setIsProfileUpdated={setIsProfileUpdated}
              isProfileUpdated={isProfileUpdated}
            />
          )}
        />
        <Route path="/signup" component={Signup} />
        <Route path="/re_password" component={ChangePassword} />
        <Route
          path="/update_profile"
          render={() => (
            <UpdateProfile setIsProfileUpdated={setIsProfileUpdated} />
          )}
        />
        {/* <Route path="/test" component={ThreeColumnView} />
        <Route path="/3ColumnView" component={Layout} /> */}
        <Route
          path="/preferences"
          render={() => (
            <PreferencePage setIsPreferenceChanged={setIsPreferenceChanged} />
          )}
        />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
