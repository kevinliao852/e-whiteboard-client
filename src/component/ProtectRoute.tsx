import { FC, useEffect } from "react";
import { useHistory } from "react-router";
import { AuthStatus } from "../features/auth/auth-slice";
import { useAuthStatus } from "../hooks/useAuth";

export const ProtectRoute: FC = (props) => {
  const authStatus = useAuthStatus();
  const history = useHistory();

  useEffect(() => {
    if (authStatus !== AuthStatus.Login) {
      history.push("/home");
    }
  }, [authStatus, history]);

  if (authStatus !== AuthStatus.Login) {
    return null;
  }

  return <>{props.children}</>;
};
