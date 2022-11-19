import { Route, BrowserRouter } from "react-router-dom";
import { Header } from "../component/Header";
import { useAuthStatus } from "../hooks/useAuth";
import { Dashboard } from "./Dashboard";
import { Home } from "./Home";
import { ProtectRoute } from "./ProtectRoute";
import { WhiteboardList } from "./WhiteboardList";

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
