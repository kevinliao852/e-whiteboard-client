import styled from "styled-components";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { GoogleAuthContext } from "../../contexts/GoogleAuthContext";
import { useAuthStatus } from "../../hooks/useAuth";
import { AuthStatus } from "../../features/auth/authSlice";

const NavBarContainer = styled.nav`
  width: 100vw;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #007bff;
  color: #fff;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const NavLink = styled.a`
  color: black;
  text-decoration: none;
  font-size: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

const GButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.6rem 1rem;
  font-size: 1rem;
  color: #fff;
  background-color: #4285f4;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
`;

const GLayout = styled.div`
  display: flex;
  align-items: center;
  padding: 0.6rem 0.4rem;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

export const Nav = () => {
  const googleAuth = useContext(GoogleAuthContext);
  const authStatus = useAuthStatus();

  if (!googleAuth) {
    return null;
  }

  const { isSignedIn, signOut, signIn } = googleAuth;

  return (
    <NavBarContainer>
      <Logo>
        <Link
          to="/home"
          style={{
            color: "white",
          }}
        >
          Whiteboard
        </Link>
      </Logo>
      <NavLinks>
        <NavLink>
          <Link to="/home" style={{color: "black"}}>
            <GLayout>Home</GLayout>
          </Link>
        </NavLink>
        <NavLink>
          <Link to="/my" style={{color: "black"}}>
            <GLayout>My</GLayout>
          </Link>
        </NavLink>
        <NavLink>
          <Link to="/room-management" style={{color: "black"}}>
            <GLayout>Room</GLayout>
          </Link>
        </NavLink>
        <NavLink>
          <GButton onClick={() => (isSignedIn ? signOut() : signIn())}>
            <i className="google icon red"></i>
            {authStatus === AuthStatus.Login ? "Logout" : "Login"}
          </GButton>
        </NavLink>
      </NavLinks>
    </NavBarContainer>
  );
};
