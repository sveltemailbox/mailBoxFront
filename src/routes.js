import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Login from "./Auth/Login";
import Mailbox from "./views/Mailbox";
import Signup from "./Auth/Signup";
import { isLogin } from "./util";
import ChangePassword from "./Auth/ChangePassword";
import ThreeColumnView from "./3ColumnView/views/ThreeColumnView";
import Layout from "../src/3ColumnView/components/Layout";
import PreferencePage from "../src/components/common/preferences";
// import PrintView from "./components/print/printView";

function App() {
  const isAuthenticated = isLogin();

  return (
    <BrowserRouter>
      {!isAuthenticated && <Redirect to="/" />}
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/mail" component={Mailbox} />
        <Route path="/signup" component={Signup} />
        <Route path="/re_password" component={ChangePassword} />
        {/* <Route path="/test" component={ThreeColumnView} />
        <Route path="/3ColumnView" component={Layout} /> */}
        <Route path="/preferences" component={PreferencePage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
