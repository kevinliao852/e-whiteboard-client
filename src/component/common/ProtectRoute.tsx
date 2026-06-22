import { FC } from "react";
import { Redirect, Route, RouteProps, useLocation } from "react-router";
import { AuthStatus } from "../../features/auth/authSlice";
import { useAuthStatus } from "../../hooks/useAuth";

export const ProtectRoute = ({ component: PComponent, ...rest }: any) => {
  const authStatus = useAuthStatus();
  const location = useLocation();

  if (authStatus === AuthStatus.Checking) {
    return null;
  }

  if (authStatus !== AuthStatus.Login && location.pathname !== "/home") {
    console.log("user did not login", authStatus, location);
    return (
      <Route
        {...rest}
        render={({ location }) => (
          <Redirect to={{ pathname: "/not-login", state: { location } }} />
        )}
      />
    );
  }

  return <Route {...rest} render={(props) => <PComponent {...props} />} />;
};
