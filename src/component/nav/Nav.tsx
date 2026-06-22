import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";
import { GoogleAuthContext } from "../../contexts/GoogleAuthContext";
import { AuthStatus } from "../../features/auth/authSlice";
import { useAuthStatus } from "../../hooks/useAuth";

const Frame = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  padding: 0.85rem 1rem 0;
`;

const Bar = styled.nav`
  width: min(1180px, 100%);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1rem;
  border: 1px solid rgba(24, 36, 61, 0.08);
  border-radius: 1.4rem;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(14px);
  box-shadow: 0 12px 30px rgba(24, 36, 61, 0.08);

  @media (max-width: 760px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  color: #18243d;
  text-decoration: none;
`;

const BrandMark = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 0.9rem;
  background: linear-gradient(135deg, #ff6b3d 0%, #ffb36b 100%);
  color: #fff;
  font-size: 1rem;
  font-weight: 800;
  box-shadow: 0 10px 22px rgba(255, 107, 61, 0.28);
`;

const BrandText = styled.span`
  display: flex;
  flex-direction: column;
`;

const BrandName = styled.span`
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: -0.02em;
`;

const BrandCaption = styled.span`
  color: #66748a;
  font-size: 0.78rem;
`;

const RightSide = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;

  @media (max-width: 760px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.3rem;
  border-radius: 999px;
  background: rgba(24, 36, 61, 0.05);

  @media (max-width: 760px) {
    justify-content: space-between;
    width: 100%;
  }

  @media (max-width: 520px) {
    flex-wrap: wrap;
    border-radius: 1rem;
  }
`;

const NavItem = styled(NavLink)`
  padding: 0.7rem 1rem;
  border-radius: 999px;
  color: #536277;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 700;
  transition:
    color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;

  &:hover {
    color: #18243d;
    background: rgba(255, 255, 255, 0.75);
    transform: translateY(-1px);
  }

  &.active {
    color: #18243d;
    background: #fff;
    box-shadow: 0 10px 18px rgba(24, 36, 61, 0.08);
  }
`;

const AuthButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  min-width: 8.5rem;
  padding: 0.85rem 1.15rem;
  border: none;
  border-radius: 999px;
  background: #18243d;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background: #0f1729;
    box-shadow: 0 12px 24px rgba(24, 36, 61, 0.2);
  }

  &:disabled {
    cursor: wait;
    opacity: 0.72;
    transform: none;
    box-shadow: none;
  }

  @media (max-width: 760px) {
    width: 100%;
  }
`;

const AuthDot = styled.span<{ $loggedIn: boolean }>`
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  background: ${(props) => (props.$loggedIn ? "#0f9d8a" : "#ff9f7a")};
  box-shadow: ${(props) =>
    props.$loggedIn
      ? "0 0 0 0.28rem rgba(15, 157, 138, 0.16)"
      : "0 0 0 0.28rem rgba(255, 107, 61, 0.14)"};
`;

export const Nav = () => {
  const googleAuth = useContext(GoogleAuthContext);
  const authStatus = useAuthStatus();

  if (!googleAuth) {
    return null;
  }

  const { isSignedIn, signOut, signIn } = googleAuth;
  const isLoggedIn = authStatus === AuthStatus.Login;
  const isChecking = authStatus === AuthStatus.Checking;

  return (
    <Frame>
      <Bar>
        <Brand to="/home">
          <BrandMark>W</BrandMark>
          <BrandText>
            <BrandName>Whiteboard</BrandName>
            <BrandCaption>Realtime collaboration</BrandCaption>
          </BrandText>
        </Brand>

        <RightSide>
          <NavItems>
            <NavItem to="/home" exact>
              Home
            </NavItem>
            <NavItem to="/my" exact>
              Boards
            </NavItem>
            <NavItem to="/room-management" exact>
              Rooms
            </NavItem>
          </NavItems>

          <AuthButton
            onClick={() => (isSignedIn ? signOut() : signIn())}
            disabled={isChecking}
          >
            <AuthDot $loggedIn={isLoggedIn} />
            {isChecking ? "Checking..." : isLoggedIn ? "Logout" : "Login"}
          </AuthButton>
        </RightSide>
      </Bar>
    </Frame>
  );
};
