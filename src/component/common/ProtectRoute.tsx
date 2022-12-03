import { FC } from "react";
import { Redirect, Route, RouteProps } from "react-router";
import { AuthStatus } from "../../features/auth/auth-slice";

export const ProtectRoute: FC<RouteProps & { authStatus: AuthStatus }> = (
  props
) => {
  if (props.authStatus !== AuthStatus.Login) {
    return <Redirect to="home" />;
  }

  return <Route {...props} />;
};
