import { KeyboardEvent, MouseEvent, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useAppSelecter } from "../../app/hooks";
import { API_SERVER_HOST } from "../../config/config";
import { selectUserId, selectUserRole } from "../../features/user/userSlice";
import {
  buildApiUrl,
  getApiHostErrorMessage,
  parseJsonResponse,
} from "../../utils/api";

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
  --accent-soft: #ffe2d7;
  --highlight: #0f9d8a;

  position: relative;
  flex: 1;
  overflow-x: hidden;
  overflow-y: visible;
  background:
    radial-gradient(circle at 12% 12%, rgba(255, 194, 99, 0.32), transparent 24%),
    radial-gradient(circle at 88% 14%, rgba(63, 124, 255, 0.16), transparent 24%),
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
  background: rgba(255, 107, 61, 0.14);
`;

const GlowTwo = styled(Glow)`
  right: -4rem;
  top: 6%;
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
  width: min(1180px, calc(100% - 2rem));
  margin: 0 auto;
  padding: 2rem 0 1.5rem;
  animation: ${rise} 0.7s ease-out;

  @media (max-width: 640px) {
    width: min(100% - 1rem, 1180px);
    padding: 1.4rem 0 2rem;
  }
`;

const Header = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 24rem);
  gap: 1rem;
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
  font-size: clamp(2.6rem, 5vw, 4.2rem);
  line-height: 0.94;
  letter-spacing: -0.05em;

  @media (max-width: 640px) {
    font-size: clamp(2.35rem, 11vw, 3.4rem);
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
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const Stat = styled.div`
  padding: 0.9rem 0.95rem;
  border-radius: 1.2rem;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid var(--line);
  backdrop-filter: blur(10px);
  box-shadow: 0 18px 36px rgba(24, 36, 61, 0.08);
`;

const StatValue = styled.div`
  color: var(--ink);
  font-size: 1.25rem;
  font-weight: 800;
`;

const StatLabel = styled.div`
  margin-top: 0.2rem;
  color: var(--muted);
  font-size: 0.92rem;
`;

const BoardGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1.1rem;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const BoardCard = styled.div`
  display: block;
  width: 100%;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 1.5rem;
  background: var(--surface);
  text-align: left;
  cursor: pointer;
  overflow: hidden;
  backdrop-filter: blur(12px);
  box-shadow: 0 24px 56px rgba(24, 36, 61, 0.1);
  outline: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(255, 107, 61, 0.2);
    box-shadow: 0 28px 58px rgba(24, 36, 61, 0.12);
  }

  &:focus-visible {
    border-color: rgba(255, 107, 61, 0.45);
    box-shadow: 0 0 0 0.24rem rgba(255, 107, 61, 0.12);
  }
`;

const CardArt = styled.div`
  position: relative;
  height: 8.5rem;
  background:
    linear-gradient(rgba(24, 36, 61, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(24, 36, 61, 0.04) 1px, transparent 1px),
    linear-gradient(135deg, #fff7ef 0%, #fff 100%);
  background-size: 22px 22px, 22px 22px, auto;
  border-bottom: 1px solid rgba(24, 36, 61, 0.08);
  overflow: hidden;
`;

const Stroke = styled.div<{ top: string; left: string; width: string; rotate: string; color: string }>`
  position: absolute;
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  width: ${(props) => props.width};
  height: 0.42rem;
  border-radius: 999px;
  background: ${(props) => props.color};
  transform: rotate(${(props) => props.rotate});
`;

const CardBody = styled.div`
  padding: 1rem 1rem 1.05rem;
`;

const CardTitle = styled.h2`
  margin: 0;
  color: var(--ink);
  font-size: 1.1rem;
`;

const CardMeta = styled.div`
  margin-top: 0.35rem;
  color: var(--muted);
  font-size: 0.9rem;
  line-height: 1.5;
`;

const CardActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 0.85rem;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.65rem;
  border-radius: 999px;
  background: rgba(255, 107, 61, 0.1);
  color: var(--accent-deep);
  font-size: 0.8rem;
  font-weight: 700;
`;

const OpenText = styled.span`
  color: var(--ink);
  font-size: 0.9rem;
  font-weight: 700;
`;

const DeleteButton = styled.button`
  padding: 0.55rem 0.8rem;
  border: none;
  border-radius: 999px;
  background: rgba(185, 56, 27, 0.12);
  color: #b9381b;
  font-size: 0.84rem;
  font-weight: 800;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    background 0.18s ease,
    color 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(185, 56, 27, 0.18);
  }

  &:disabled {
    cursor: wait;
    opacity: 0.7;
    transform: none;
  }
`;

const EmptyState = styled.div`
  margin-top: 1.1rem;
  padding: 1.2rem;
  border-radius: 1.4rem;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid var(--line);
  color: var(--muted);
  font-size: 0.95rem;
`;

interface Whiteboard {
  id: string;
  name: string;
  "user-id": number;
}

export const NewWhiteboardList = () => {
  const userId = useAppSelecter(selectUserId);
  const userRole = useAppSelecter(selectUserRole);
  const history = useHistory();
  const [whiteboards, setWhiteboards] = useState<Whiteboard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const canMutateWhiteboards = userRole === "user";

  useEffect(() => {
    const currentUserId = userId ?? 1;
    let isActive = true;
    const configError = getApiHostErrorMessage(API_SERVER_HOST);

    if (configError) {
      setLoadError(configError);
      setIsLoading(false);
      return () => {
        isActive = false;
      };
    }

    getWhiteboardList(currentUserId.toString())
      .then((data) => {
        if (!isActive) {
          return;
        }

        setWhiteboards(data);
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
  }, [userId]);

  const handleWhiteboardClick = (id: string) => {
    history.push(`/whiteboards/${id}`);
  };

  const handleWhiteboardKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    id: string,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleWhiteboardClick(id);
    }
  };

  const handleDeleteWhiteboard = async (
    event: MouseEvent<HTMLButtonElement>,
    id: string,
  ) => {
    if (!canMutateWhiteboards) {
      return;
    }

    event.stopPropagation();

    const confirmed = window.confirm(
      "Delete this whiteboard? This cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    setDeleteError(null);
    setDeletingId(id);

    try {
      const response = await fetch(`${API_SERVER_HOST}/v1/whiteboards/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Delete failed with status ${response.status}`);
      }

      setWhiteboards((prev) => prev.filter((whiteboard) => whiteboard.id !== id));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete whiteboard";
      setDeleteError(message);
    } finally {
      setDeletingId(null);
    }
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
              My boards
            </Eyebrow>
            <Title>
              Keep every idea board ready for the next <Accent>working session</Accent>.
            </Title>
            <Description>
              Browse active whiteboards, reopen a discussion quickly, and keep
              the visual context of your team work one click away.
            </Description>
          </div>
          <StatGrid>
            <Stat>
              <StatValue>{whiteboards.length}</StatValue>
              <StatLabel>saved boards</StatLabel>
            </Stat>
            <Stat>
              <StatValue>{isLoading ? "..." : "Ready"}</StatValue>
              <StatLabel>workspace status</StatLabel>
            </Stat>
          </StatGrid>
        </Header>

        {isLoading && <EmptyState>Loading boards...</EmptyState>}
        {loadError && (
          <EmptyState>
            Could not load boards from `{API_SERVER_HOST}/v1/whiteboards?user-id=
            {userId ?? 1}`: {loadError}
          </EmptyState>
        )}
        {deleteError && <EmptyState>{deleteError}</EmptyState>}
        {!isLoading && !loadError && whiteboards.length === 0 && (
          <EmptyState>
            No boards yet. Create a room or seed mock data to start your first
            whiteboard workspace.
          </EmptyState>
        )}
        {!isLoading && !loadError && whiteboards.length > 0 && (
          <BoardGrid>
            {whiteboards.map((whiteboard, index) => (
              <BoardCard
                key={whiteboard.id}
                onClick={() => handleWhiteboardClick(whiteboard.id)}
                onKeyDown={(event) =>
                  handleWhiteboardKeyDown(event, whiteboard.id)
                }
                role="button"
                tabIndex={0}
              >
                <CardArt>
                  <Stroke
                    top="24%"
                    left="14%"
                    width="34%"
                    rotate="12deg"
                    color={index % 3 === 0 ? "#ff6b3d" : "#3f7cff"}
                  />
                  <Stroke
                    top="40%"
                    left="26%"
                    width="24%"
                    rotate="-18deg"
                    color={index % 3 === 1 ? "#0f9d8a" : "#ffb36b"}
                  />
                  <Stroke
                    top="58%"
                    left="18%"
                    width="42%"
                    rotate="7deg"
                    color={index % 3 === 2 ? "#1a2238" : "#0f9d8a"}
                  />
                </CardArt>
                <CardBody>
                  <CardTitle>{whiteboard.name}</CardTitle>
                  <CardMeta>Board ID: {whiteboard.id}</CardMeta>
                  <CardMeta>User: {whiteboard["user-id"]}</CardMeta>
                  <CardActions>
                    <Badge>Live board</Badge>
                    <OpenText>Open room</OpenText>
                    {canMutateWhiteboards && (
                      <DeleteButton
                        type="button"
                        onClick={(event) =>
                          handleDeleteWhiteboard(event, whiteboard.id)
                        }
                        disabled={deletingId === whiteboard.id}
                      >
                        {deletingId === whiteboard.id
                          ? "Deleting..."
                          : "Delete"}
                      </DeleteButton>
                    )}
                  </CardActions>
                </CardBody>
              </BoardCard>
            ))}
          </BoardGrid>
        )}
      </Shell>
    </Page>
  );
};

function getWhiteboardList(userId: string) {
  return fetch(
    buildApiUrl(API_SERVER_HOST, "/v1/whiteboards", {
      "user-id": userId,
    }),
    {
      credentials: "include",
    },
  ).then((response) => parseJsonResponse<Whiteboard[]>(response));
}
