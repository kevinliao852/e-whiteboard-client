import React from "react";
import { useHistory } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useAppSelecter } from "../../app/hooks";
import { API_SERVER_HOST } from "../../config/config";
import { selectUserId } from "../../features/user/userSlice";
import { parseJsonResponse } from "../../utils/api";

type CreatedWhiteboard = {
  id: string;
  name: string;
  "user-id": number;
};

const drift = keyframes`
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(0, -14px, 0);
  }
`;

const rise = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
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

  position: relative;
  flex: 1;
  overflow-x: hidden;
  overflow-y: visible;
  background:
    radial-gradient(circle at 12% 10%, rgba(255, 194, 99, 0.28), transparent 24%),
    radial-gradient(circle at 88% 14%, rgba(63, 124, 255, 0.18), transparent 24%),
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
  top: 10%;
  left: -4rem;
  width: 18rem;
  height: 18rem;
  background: rgba(255, 107, 61, 0.13);
`;

const GlowTwo = styled(Glow)`
  right: -4rem;
  top: 8%;
  width: 16rem;
  height: 16rem;
  background: rgba(15, 157, 138, 0.12);
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
  width: min(960px, calc(100% - 2rem));
  margin: 0 auto;
  padding: 2rem 0 1.5rem;
  animation: ${rise} 0.7s ease-out;
`;

const Card = styled.section`
  width: min(100%, 34rem);
  margin-top: 1rem;
  padding: 1.2rem;
  border-radius: 1.6rem;
  background: var(--surface);
  border: 1px solid var(--line);
  backdrop-filter: blur(12px);
  box-shadow: 0 24px 56px rgba(24, 36, 61, 0.1);
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
  margin: 0.8rem 0 0.45rem;
  color: var(--ink);
  font-size: clamp(2.2rem, 4vw, 3.6rem);
  line-height: 0.95;
  letter-spacing: -0.05em;
`;

const Description = styled.p`
  margin: 0;
  color: var(--muted);
  font-size: 0.98rem;
  line-height: 1.65;
`;

const ErrorText = styled.p`
  margin: 1rem 0 0;
  color: #b9381b;
  font-size: 0.95rem;
  line-height: 1.6;
`;

const RetryButton = styled.button`
  margin-top: 1rem;
  padding: 0.9rem 1.2rem;
  border: none;
  border-radius: 999px;
  background: #18243d;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
`;

function createWhiteboard(userId: number) {
  return fetch(`${API_SERVER_HOST}/v1/whiteboards`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "user-id": userId,
      name: "Untitled Whiteboard",
    }),
  }).then((response) => parseJsonResponse<CreatedWhiteboard>(response));
}

export const NewRoom = () => {
  const history = useHistory();
  const userId = useAppSelecter(selectUserId);
  const [error, setError] = React.useState<string | null>(null);
  const [attempt, setAttempt] = React.useState(0);

  React.useEffect(() => {
    if (!userId) {
      return;
    }

    let isActive = true;

    createWhiteboard(userId)
      .then((whiteboard) => {
        if (!isActive) {
          return;
        }

        history.replace(`/rooms/${whiteboard.id}`);
      })
      .catch((nextError: Error) => {
        if (!isActive) {
          return;
        }

        setError(nextError.message);
      });

    return () => {
      isActive = false;
    };
  }, [attempt, history, userId]);

  return (
    <Page>
      <GlowOne />
      <GlowTwo />
      <Grid />
      <Shell>
        <Eyebrow>
          <Dot />
          New room
        </Eyebrow>
        <Card>
          <Title>Creating your whiteboard room</Title>
          <Description>
            We are creating the whiteboard first, then connecting the drawing
            session and loading any saved history for that board.
          </Description>
          {!error && <Description>Preparing workspace...</Description>}
          {error && (
            <>
              <ErrorText>{error}</ErrorText>
              <RetryButton onClick={() => setAttempt((value) => value + 1)}>
                Try again
              </RetryButton>
            </>
          )}
        </Card>
      </Shell>
    </Page>
  );
};
