import { Route, BrowserRouter } from "react-router-dom";
import { Header } from "./common/Header";
import { useAuthStatus } from "../hooks/useAuth";
import { Dashboard } from "./whiteboard/Dashboard";
import { Home } from "./home/Home";
import { ProtectRoute } from "./common//ProtectRoute";
import { WhiteboardList } from "./whiteboardlist/WhiteboardList";

export const Routes = () => {
  const authStatus = useAuthStatus();

  return (
    <BrowserRouter>
      <Header />
      <Route path="/" exact component={Home} />
      <Route path="/home" exact component={Home} />
      <ProtectRoute
        path="/whiteboardlist"
        exact
        component={WhiteboardList}
        authStatus={authStatus}
      />
      <ProtectRoute
        path="/dashboard"
        exact
        component={Dashboard}
        authStatus={authStatus}
      />
    </BrowserRouter>
  );
};
