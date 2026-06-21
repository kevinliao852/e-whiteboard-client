import { FormEvent, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { API_SERVER_HOST } from "../../config/config";
import { getApiHostErrorMessage, parseJsonResponse } from "../../utils/api";

const drift = keyframes`
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(0, -18px, 0);
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
  overflow-x: hidden;
  overflow-y: visible;
  background:
    radial-gradient(circle at 10% 12%, rgba(255, 194, 99, 0.35), transparent 24%),
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
  top: 16%;
  left: -5rem;
  width: 18rem;
  height: 18rem;
  background: rgba(255, 107, 61, 0.14);
`;

const GlowTwo = styled(Glow)`
  right: -4rem;
  top: 8%;
  width: 16rem;
  height: 16rem;
  background: rgba(15, 157, 138, 0.14);
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
  width: min(1180px, calc(100% - 2rem));
  margin: 0 auto;
  padding: 2rem 0 1.5rem;
  animation: ${rise} 0.7s ease-out;

  @media (max-width: 768px) {
    padding-top: 2rem;
  }

  @media (max-width: 640px) {
    width: min(100% - 1rem, 1180px);
    padding: 1.4rem 0 2rem;
  }
`;

const Header = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 26rem);
  gap: 1.1rem;
  align-items: end;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
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

  @media (max-width: 640px) {
    font-size: 0.76rem;
    letter-spacing: 0.06em;
  }
`;

const Dot = styled.span`
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  background: var(--accent);
  box-shadow: 0 0 0 0.35rem rgba(255, 107, 61, 0.14);
`;

const Title = styled.h1`
  margin: 0.8rem 0 0.65rem;
  color: var(--ink);
  font-size: clamp(2.6rem, 5.2vw, 4.3rem);
  line-height: 0.94;
  letter-spacing: -0.05em;

  @media (max-width: 640px) {
    font-size: clamp(2.35rem, 11vw, 3.5rem);
  }
`;

const Accent = styled.span`
  color: var(--accent);
`;

const Description = styled.p`
  max-width: 40rem;
  margin: 0;
  color: var(--muted);
  font-size: 0.98rem;
  line-height: 1.65;

  @media (max-width: 640px) {
    font-size: 0.98rem;
    line-height: 1.7;
  }
`;

const QuickStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 900px) {
    margin-top: 0.25rem;
  }
`;

const Stat = styled.div`
  padding: 0.85rem 0.9rem;
  border-radius: 1.2rem;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid var(--line);
  backdrop-filter: blur(10px);
  box-shadow: 0 18px 36px rgba(24, 36, 61, 0.08);
`;

const StatValue = styled.div`
  color: var(--ink);
  font-size: 1.2rem;
  font-weight: 800;
`;

const StatLabel = styled.div`
  margin-top: 0.2rem;
  color: var(--muted);
  font-size: 0.92rem;
`;

const Layout = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
  gap: 1.2rem;
  margin-top: 1.1rem;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.section`
  border-radius: 1.6rem;
  background: var(--surface);
  border: 1px solid var(--line);
  backdrop-filter: blur(12px);
  box-shadow: 0 24px 56px rgba(24, 36, 61, 0.1);
`;

const PanelBody = styled.div`
  padding: 1.1rem;

  @media (max-width: 640px) {
    padding: 1.05rem;
  }
`;

const PanelTitle = styled.h2`
  margin: 0;
  color: var(--ink);
  font-size: 1.28rem;
`;

const PanelDescription = styled.p`
  margin: 0.4rem 0 0;
  color: var(--muted);
  font-size: 0.94rem;
  line-height: 1.55;
`;

const UserGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin-top: 0.95rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const UserCard = styled.div`
  padding: 0.85rem;
  border-radius: 1.2rem;
  background: rgba(255, 255, 255, 0.84);
  border: 1px solid rgba(24, 36, 61, 0.06);
`;

const UserName = styled.div`
  color: var(--ink);
  font-weight: 700;
`;

const UserMeta = styled.div`
  margin-top: 0.2rem;
  color: var(--muted);
  font-size: 0.88rem;
`;

const Presence = styled.span`
  display: inline-block;
  width: 0.65rem;
  height: 0.65rem;
  margin-right: 0.45rem;
  border-radius: 999px;
  background: var(--highlight);
  box-shadow: 0 0 0 0.3rem rgba(15, 157, 138, 0.12);
`;

const ActionStack = styled.div`
  display: grid;
  gap: 0.8rem;
`;

const ActionCard = styled(Panel)`
  overflow: hidden;
`;

const ActionCardBody = styled.div`
  padding: 1.05rem;

  @media (max-width: 640px) {
    padding: 1.05rem;
  }
`;

const ActionTag = styled.div`
  color: var(--highlight);
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const ActionTitle = styled.h3`
  margin: 0.4rem 0 0.3rem;
  color: var(--ink);
  font-size: 1.12rem;
`;

const ActionBody = styled.p`
  margin: 0;
  color: var(--muted);
  font-size: 0.93rem;
  line-height: 1.55;
`;

const PrimaryAction = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.8rem;
  padding: 0.85rem 1.1rem;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  text-decoration: none;
  font-weight: 700;
  box-shadow: 0 14px 30px rgba(230, 83, 39, 0.24);
  transition:
    transform 0.2s ease,
    background 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    background: var(--accent-deep);
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

const JoinForm = styled.form`
  display: grid;
  gap: 0.7rem;
  margin-top: 0.8rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(24, 36, 61, 0.12);
  background: rgba(255, 255, 255, 0.9);
  color: var(--ink);
  font-size: 1rem;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:focus {
    border-color: rgba(255, 107, 61, 0.5);
    box-shadow: 0 0 0 0.25rem rgba(255, 107, 61, 0.12);
  }
`;

const JoinButton = styled.button`
  padding: 0.85rem 1.1rem;
  border: none;
  border-radius: 999px;
  background: #1a2238;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    background: #0f1729;
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

const Tips = styled.div`
  display: grid;
  gap: 0.65rem;
  margin-top: 0.8rem;
`;

const Tip = styled.div`
  padding: 0.8rem 0.9rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(24, 36, 61, 0.06);
  color: var(--muted);
  font-size: 0.9rem;
  line-height: 1.5;
`;

const EmptyState = styled.div`
  padding: 1rem 0;
  color: var(--muted);
  font-size: 0.95rem;
`;

interface DemoRoom {
  id: string;
  name: string;
  status: string;
  participants: number;
  activity: string;
}

export const RoomManagement = () => {
  const history = useHistory();
  const [roomId, setRoomId] = useState("");
  const [rooms, setRooms] = useState<DemoRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    const configError = getApiHostErrorMessage(API_SERVER_HOST);

    if (configError) {
      setLoadError(configError);
      setIsLoading(false);
      return () => {
        isActive = false;
      };
    }

    fetch(`${API_SERVER_HOST}/v1/rooms`)
      .then((response) => {
        return parseJsonResponse<DemoRoom[]>(response);
      })
      .then((data) => {
        if (!isActive) {
          return;
        }

        setRooms(data);
        setLoadError(null);
      })
      .catch((error: Error) => {
        if (!isActive) {
          return;
        }

        setLoadError(error.message);
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextRoomId = roomId.trim();

    if (!nextRoomId) {
      return;
    }

    history.push(`/rooms/${nextRoomId}`);
  };

  return (
    <Page>
      <GlowOne />
      <GlowTwo />
      <Grid />
      <Shell>
        <Header>
          <div>
            <Eyebrow>
              <Dot />
              Room control
            </Eyebrow>
            <Title>
              Launch, join, and steer the next <Accent>working session</Accent>.
            </Title>
            <Description>
              Move from planning into collaboration with a room built for live
              sketching and quick feedback. Start a fresh board or jump directly
              into an active session with a room ID.
            </Description>
          </div>
          <QuickStats>
            <Stat>
              <StatValue>{rooms.length}</StatValue>
              <StatLabel>active spaces</StatLabel>
            </Stat>
            <Stat>
              <StatValue>Live</StatValue>
              <StatLabel>room presence</StatLabel>
            </Stat>
            <Stat>
              <StatValue>1 Click</StatValue>
              <StatLabel>new room setup</StatLabel>
            </Stat>
          </QuickStats>
        </Header>

        <Layout>
          <Panel>
            <PanelBody>
              <PanelTitle>Current online rooms</PanelTitle>
              <PanelDescription>
                A quick pulse of where collaboration is happening right now.
              </PanelDescription>
              {isLoading && <EmptyState>Loading demo rooms...</EmptyState>}
              {loadError && (
                <EmptyState>
                  Could not load demo rooms from `{API_SERVER_HOST}/v1/rooms`:{" "}
                  {loadError}
                </EmptyState>
              )}
              {!isLoading && !loadError && (
                <UserGrid>
                  {rooms.map((room) => (
                    <UserCard key={room.id}>
                      <UserName>
                        <Presence />
                        {room.name}
                      </UserName>
                      <UserMeta>{room.status}</UserMeta>
                      <UserMeta>
                        {room.participants} participants • {room.activity}
                      </UserMeta>
                    </UserCard>
                  ))}
                </UserGrid>
              )}
            </PanelBody>
          </Panel>

          <ActionStack>
            <ActionCard>
              <ActionCardBody>
                <ActionTag>Create</ActionTag>
                <ActionTitle>Start a fresh whiteboard room</ActionTitle>
                <ActionBody>
                  Open a new room for planning, critique, or fast sketching with
                  your team.
                </ActionBody>
                <PrimaryAction to="/new-room">Create Room</PrimaryAction>
              </ActionCardBody>
            </ActionCard>

            <ActionCard>
              <ActionCardBody>
                <ActionTag>Join</ActionTag>
                <ActionTitle>Enter an existing room</ActionTitle>
                <ActionBody>
                  Paste a room ID and jump directly into the live workspace.
                </ActionBody>
                <JoinForm onSubmit={handleSubmit}>
                  <Input
                    type="text"
                    value={roomId}
                    onChange={(event) => setRoomId(event.target.value)}
                    placeholder="Enter room ID"
                  />
                  <JoinButton type="submit">Join Room</JoinButton>
                </JoinForm>
              </ActionCardBody>
            </ActionCard>

            <ActionCard>
              <ActionCardBody>
                <ActionTag>Tips</ActionTag>
                <ActionTitle>Keep the room moving</ActionTitle>
                <Tips>
                  <Tip>Use the board for visual thinking and chat for decisions.</Tip>
                  <Tip>Name rooms clearly so teammates can rejoin without guesswork.</Tip>
                </Tips>
              </ActionCardBody>
            </ActionCard>
          </ActionStack>
        </Layout>
      </Shell>
    </Page>
  );
};
