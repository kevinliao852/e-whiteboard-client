import React, { useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { AuthStatus } from "../../features/auth/authSlice";
import { useAuthStatus } from "../../hooks/useAuth";

const drift = keyframes`
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(0, -16px, 0);
  }
`;

const rise = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Page = styled.main`
  --ink: #18243d;
  --muted: #60708a;
  --surface: rgba(255, 255, 255, 0.78);
  --line: rgba(24, 36, 61, 0.08);
  --accent: #ff6b3d;
  --accent-deep: #e65327;
  --highlight: #0f9d8a;

  position: relative;
  flex: 1;
  min-height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(circle at 12% 10%, rgba(255, 194, 99, 0.32), transparent 24%),
    radial-gradient(circle at 88% 12%, rgba(63, 124, 255, 0.18), transparent 24%),
    linear-gradient(135deg, #f8efe5 0%, #eef5ff 48%, #f3fbf6 100%);
`;

const Glow = styled.div`
  position: absolute;
  border-radius: 999px;
  opacity: 0.8;
  filter: blur(12px);
  animation: ${drift} 7s ease-in-out infinite alternate;
`;

const GlowOne = styled(Glow)`
  top: 12%;
  left: -4rem;
  width: 18rem;
  height: 18rem;
  background: rgba(255, 107, 61, 0.14);
`;

const GlowTwo = styled(Glow)`
  right: -4rem;
  top: 8%;
  width: 16rem;
  height: 16rem;
  background: rgba(15, 157, 138, 0.13);
  animation-duration: 8.5s;
`;

const Grid = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(24, 36, 61, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(24, 36, 61, 0.03) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.84), transparent 94%);
`;

const Shell = styled.div`
  position: relative;
  z-index: 1;
  width: min(1080px, calc(100% - 2rem));
  margin: 0 auto;
  padding: 2rem 0 1.5rem;
  animation: ${rise} 0.7s ease-out;

  @media (max-width: 640px) {
    width: min(100% - 1rem, 1080px);
    padding: 1.4rem 0 2rem;
  }
`;

const Layout = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(300px, 0.9fr);
  gap: 1.2rem;
  align-items: start;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const Copy = styled.div`
  max-width: 38rem;
`;

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.64);
  border: 1px solid var(--line);
  color: var(--ink);
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  backdrop-filter: blur(8px);
`;

const Dot = styled.span`
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  background: var(--accent);
  box-shadow: 0 0 0 0.35rem rgba(255, 107, 61, 0.14);
`;

const Title = styled.h1`
  margin: 0.85rem 0 0.7rem;
  color: var(--ink);
  font-size: clamp(2.8rem, 5.2vw, 4.6rem);
  line-height: 0.93;
  letter-spacing: -0.05em;
`;

const Accent = styled.span`
  color: var(--accent);
`;

const Description = styled.p`
  margin: 0;
  color: var(--muted);
  font-size: 1rem;
  line-height: 1.7;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
  margin-top: 1.35rem;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const PrimaryAction = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 11rem;
  padding: 0.95rem 1.4rem;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  text-decoration: none;
  font-weight: 700;
  box-shadow: 0 14px 30px rgba(230, 83, 39, 0.24);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    background: var(--accent-deep);
    box-shadow: 0 18px 34px rgba(230, 83, 39, 0.28);
  }
`;

const SecondaryAction = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 11rem;
  padding: 0.95rem 1.4rem;
  border-radius: 999px;
  border: 1px solid rgba(24, 36, 61, 0.12);
  background: rgba(255, 255, 255, 0.68);
  color: var(--ink);
  text-decoration: none;
  font-weight: 700;
  backdrop-filter: blur(10px);
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.88);
    border-color: rgba(24, 36, 61, 0.18);
  }
`;

const StatusCard = styled.section`
  padding: 1.2rem;
  border-radius: 1.7rem;
  background: var(--surface);
  border: 1px solid var(--line);
  backdrop-filter: blur(12px);
  box-shadow: 0 24px 56px rgba(24, 36, 61, 0.1);
`;

const CardLabel = styled.div`
  color: var(--muted);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const CardValue = styled.div`
  margin-top: 0.55rem;
  color: var(--ink);
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.04em;
`;

const CardText = styled.p`
  margin: 0.7rem 0 0;
  color: var(--muted);
  font-size: 0.95rem;
  line-height: 1.6;
`;

const Divider = styled.div`
  height: 1px;
  margin: 1rem 0;
  background: rgba(24, 36, 61, 0.08);
`;

const HintList = styled.div`
  display: grid;
  gap: 0.75rem;
`;

const Hint = styled.div`
  padding: 0.85rem 0.9rem;
  border-radius: 1rem;
  background: rgba(24, 36, 61, 0.04);
  color: var(--ink);
  font-size: 0.92rem;
  line-height: 1.55;
`;

export const NotLoggedIn = () => {
  const authStatus = useAuthStatus();
  const history = useHistory();
  const location = useLocation<{ location?: { pathname?: string } }>();
  const redirectPath = location.state?.location?.pathname || "/home";

  useEffect(() => {
    if (authStatus === AuthStatus.Login && location.pathname === "/not-login") {
      history.push(redirectPath);
    }
  }, [authStatus, history, location.pathname, redirectPath]);

  return (
    <Page>
      <GlowOne />
      <GlowTwo />
      <Grid />
      <Shell>
        <Layout>
          <Copy>
            <Eyebrow>
              <Dot />
              Session required
            </Eyebrow>
            <Title>
              This workspace needs an <Accent>active login</Accent>.
            </Title>
            <Description>
              The page you requested is protected. Sign in to restore your
              session, then return to the board, room, or dashboard you were
              trying to open.
            </Description>
            <Actions>
              <PrimaryAction to="/home">Back to Home</PrimaryAction>
              <SecondaryAction to={redirectPath}>Try Again</SecondaryAction>
            </Actions>
          </Copy>

          <StatusCard>
            <CardLabel>Access status</CardLabel>
            <CardValue>Login Required</CardValue>
            <CardText>
              Protected routes depend on your cookie-backed session. If your
              session expired, sign in again from the main navigation and retry.
            </CardText>
            <Divider />
            <HintList>
              <Hint>
                Return target: <strong>{redirectPath}</strong>
              </Hint>
              <Hint>
                If you are using the mock API server, make sure the login flow
                points to the same API host as the rest of the app.
              </Hint>
            </HintList>
          </StatusCard>
        </Layout>
      </Shell>
    </Page>
  );
};
