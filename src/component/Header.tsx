import { Menu } from "semantic-ui-react";
import { Link, useParams } from "react-router-dom";
import { useContext } from "react";
import { GoogleAuthContext } from "../contexts/GoogleAuthContext";

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
      <Menu.Item active={path === "dashboard"}>
        <Link to="/dashboard">Dashboard</Link>
      </Menu.Item>
      <Menu.Item active={path === "whiteboardlist"}>
        <Link to="/whiteboardlist">WhiteboardList</Link>
      </Menu.Item>
      <Menu.Item position="right">
        <button
          className="ui button"
          onClick={() => (isSignedIn ? signOut() : signIn())}
        >
          <i className="google icon red"></i>
          {`Sign ${isSignedIn ? "out" : "in"}`}
        </button>
      </Menu.Item>
    </Menu>
  );
};
