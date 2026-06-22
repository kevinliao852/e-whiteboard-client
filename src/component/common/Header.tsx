import { Menu } from "semantic-ui-react";
import { Link, useParams } from "react-router-dom";
import { useContext } from "react";
import { GoogleAuthContext } from "../../contexts/GoogleAuthContext";

export const Header = () => {
  const path = useParams();
  const googleAuth = useContext(GoogleAuthContext);

  if (!googleAuth) {
    return null;
  }

  const { isSignedIn, signOut, signIn } = googleAuth;

  return (
    <Menu>
      <Menu.Item active={path === "home"}>
        <Link to="/home">Home</Link>
      </Menu.Item>
      <Menu.Item active={path === "whiteboardlist"}>
        <Link to="/whiteboardlist">WhiteboardList</Link>
      </Menu.Item>
      <Menu.Item position="right">
        {isSignedIn ? (
          <button className="ui button" onClick={signOut}>
            <i className="google icon red"></i>
            Sign out
          </button>
        ) : (
          <>
            <button className="ui button" onClick={googleAuth.guestSignIn}>
              Continue as guest
            </button>
            <button className="ui button" onClick={signIn}>
              <i className="google icon red"></i>
              Sign in
            </button>
          </>
        )}
      </Menu.Item>
    </Menu>
  );
};
