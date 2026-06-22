import React from "react";
import { useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useAppSelecter } from "../../app/hooks";
import { useChatWebSocket } from "../../hooks/useChat";
import { Canvas } from "../whiteboard/Canvas";

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
  --accent-deep: #e65327;
  --highlight: #0f9d8a;

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
  width: min(1280px, calc(100% - 2rem));
  margin: 0 auto;
  padding: 1.7rem 0 1.5rem;
  animation: ${rise} 0.7s ease-out;

  @media (max-width: 640px) {
    width: min(100% - 1rem, 1280px);
    padding: 1.2rem 0 1.5rem;
  }
`;

const TopBar = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
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

const Dot = styled.span<{ $connected: boolean }>`
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  background: ${(props) => (props.$connected ? "#0f9d8a" : "#ff6b3d")};
  box-shadow: ${(props) =>
    props.$connected
      ? "0 0 0 0.35rem rgba(15, 157, 138, 0.14)"
      : "0 0 0 0.35rem rgba(255, 107, 61, 0.14)"};
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

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const MetaCard = styled.div`
  min-width: 8rem;
  padding: 0.85rem 0.95rem;
  border-radius: 1.2rem;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid var(--line);
  backdrop-filter: blur(10px);
  box-shadow: 0 18px 36px rgba(24, 36, 61, 0.08);
`;

const MetaValue = styled.div`
  color: var(--ink);
  font-size: 1.05rem;
  font-weight: 800;
`;

const MetaLabel = styled.div`
  margin-top: 0.2rem;
  color: var(--muted);
  font-size: 0.86rem;
`;

const Workspace = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(320px, 0.7fr);
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.section`
  border-radius: 1.6rem;
  background: var(--surface);
  border: 1px solid var(--line);
  backdrop-filter: blur(12px);
  box-shadow: 0 24px 56px rgba(24, 36, 61, 0.1);
  overflow: hidden;
`;

const BoardPanel = styled(Panel)`
  padding: 1rem;

  @media (max-width: 640px) {
    padding: 0.85rem;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.9rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const PanelTitle = styled.h2`
  margin: 0;
  color: var(--ink);
  font-size: 1.22rem;
`;

const PanelCaption = styled.p`
  margin: 0.3rem 0 0;
  color: var(--muted);
  font-size: 0.92rem;
  line-height: 1.5;
`;

const BoardBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.7rem;
  border-radius: 999px;
  background: rgba(255, 107, 61, 0.1);
  color: var(--accent-deep);
  font-size: 0.8rem;
  font-weight: 700;
`;

const BoardSurface = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 36rem;
  border-radius: 1.25rem;
  background:
    linear-gradient(rgba(24, 36, 61, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(24, 36, 61, 0.035) 1px, transparent 1px),
    linear-gradient(180deg, #fff9f3 0%, #fff 100%);
  background-size: 26px 26px, 26px 26px, auto;
  border: 1px solid rgba(24, 36, 61, 0.08);
  overflow: auto;

  @media (max-width: 640px) {
    min-height: 20rem;
  }
`;

const ChatPanel = styled(Panel)`
  display: flex;
  flex-direction: column;
  min-height: 36rem;

  @media (max-width: 1100px) {
    min-height: 28rem;
  }
`;

const ChatHeader = styled.div`
  padding: 1rem 1rem 0.8rem;
  border-bottom: 1px solid rgba(24, 36, 61, 0.08);
`;

const ChatMessages = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  padding: 1rem;
  overflow-y: auto;
`;

const EmptyMessage = styled.div`
  color: var(--muted);
  font-size: 0.94rem;
`;

const HistoryError = styled.div`
  margin: 0 1rem;
  padding: 0.8rem 0.9rem;
  border-radius: 1rem;
  background: rgba(255, 107, 61, 0.1);
  color: var(--accent-deep);
  font-size: 0.88rem;
  line-height: 1.45;
`;

const Message = styled.div<{ $self?: boolean }>`
  align-self: ${(props) => (props.$self ? "flex-end" : "flex-start")};
  max-width: min(100%, 17rem);
  padding: 0.72rem 0.85rem;
  border-radius: 1rem;
  background: ${(props) =>
    props.$self ? "rgba(255, 107, 61, 0.14)" : "rgba(24, 36, 61, 0.07)"};
  color: var(--ink);
  font-size: 0.92rem;
  line-height: 1.45;
`;

const Composer = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.7rem;
  padding: 0.9rem 1rem 1rem;
  border-top: 1px solid rgba(24, 36, 61, 0.08);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ChatInput = styled.input`
  width: 100%;
  padding: 0.95rem 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(24, 36, 61, 0.12);
  background: rgba(255, 255, 255, 0.9);
  color: var(--ink);
  font-size: 0.96rem;
  outline: none;

  &:focus {
    border-color: rgba(255, 107, 61, 0.45);
    box-shadow: 0 0 0 0.24rem rgba(255, 107, 61, 0.1);
  }
`;

const SendButton = styled.button`
  padding: 0.95rem 1.2rem;
  border: none;
  border-radius: 999px;
  background: #18243d;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background: #0f1729;
  }
`;

export const Room = () => {
  const { id } = useParams<{ id: string }>();
  const [inputValue, setInputValue] = React.useState("");
  const { messages, sendMessage, historyError } = useChatWebSocket(id);
  const status = useAppSelecter((state) => state.whiteboard.status);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <Page>
      <GlowOne />
      <GlowTwo />
      <Grid />
      <Shell>
        <TopBar>
          <div>
            <Eyebrow>
              <Dot $connected={status === "connected"} />
              Live collaboration room
            </Eyebrow>
            <Title>Room {id}</Title>
            <Description>
              Draw in real time, leave decisions in chat, and keep the room
              context visible while the conversation moves.
            </Description>
          </div>
          <MetaGrid>
            <MetaCard>
              <MetaValue>{status}</MetaValue>
              <MetaLabel>whiteboard status</MetaLabel>
            </MetaCard>
            <MetaCard>
              <MetaValue>{messages.length}</MetaValue>
              <MetaLabel>chat messages</MetaLabel>
            </MetaCard>
            <MetaCard>
              <MetaValue>{id || "pending..."}</MetaValue>
              <MetaLabel>room identifier</MetaLabel>
            </MetaCard>
          </MetaGrid>
        </TopBar>

        <Workspace>
          <BoardPanel>
            <PanelHeader>
              <div>
                <PanelTitle>Shared canvas</PanelTitle>
                <PanelCaption>
                  Sketch flows, annotate decisions, and collaborate directly on
                  the board.
                </PanelCaption>
              </div>
              <BoardBadge>Realtime sync</BoardBadge>
            </PanelHeader>
            <BoardSurface>
              <Canvas />
            </BoardSurface>
          </BoardPanel>

          <ChatPanel>
            <ChatHeader>
              <PanelTitle>Room chat</PanelTitle>
              <PanelCaption>
                Capture context and quick decisions without leaving the board.
              </PanelCaption>
            </ChatHeader>

            {historyError && <HistoryError>{historyError}</HistoryError>}

            <ChatMessages>
              {messages.length === 0 && (
                <EmptyMessage>
                  No messages yet. Use chat to coordinate while drawing.
                </EmptyMessage>
              )}
              {messages.map((message, index) => (
                <Message key={index} $self={index % 2 === 1}>
                  {message}
                </Message>
              ))}
            </ChatMessages>

            <Composer>
              <ChatInput
                type="text"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message for the room..."
              />
              <SendButton onClick={handleSendMessage}>Send</SendButton>
            </Composer>
          </ChatPanel>
        </Workspace>
      </Shell>
    </Page>
  );
};
