import { Route, BrowserRouter } from "react-router-dom";
import { Header } from "../component/Header";
import { Dashboard } from "./Dashboard";
import { Home } from "./Home";
import { ProtectRoute } from "./ProtectRoute";
import { WhiteboardList } from "./WhiteboardList";

export const Routes = () => {
  return (
    <BrowserRouter>
      <Header />
      <Route path="/" exact component={Home}></Route>
      <Route path="/home" exact component={Home}></Route>
      <ProtectRoute>
        <Route path="/whiteboardlist" exact component={WhiteboardList}></Route>
        <Route path="/dashboard" exact component={Dashboard}></Route>
      </ProtectRoute>
    </BrowserRouter>
  );
};
