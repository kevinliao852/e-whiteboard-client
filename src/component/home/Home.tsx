import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

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
  --muted: #5e6c84;
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
    radial-gradient(circle at top left, rgba(255, 194, 99, 0.42), transparent 28%),
    radial-gradient(circle at 85% 12%, rgba(79, 172, 254, 0.24), transparent 24%),
    linear-gradient(135deg, #f7f1e8 0%, #eef5ff 48%, #f7fbf9 100%);
`;

const Glow = styled.div`
  position: absolute;
  border-radius: 999px;
  filter: blur(10px);
  opacity: 0.75;
  animation: ${drift} 6s ease-in-out infinite alternate;
`;

const GlowOne = styled(Glow)`
  top: 10%;
  left: -4rem;
  width: 18rem;
  height: 18rem;
  background: rgba(255, 107, 61, 0.16);
`;

const GlowTwo = styled(Glow)`
  right: -3rem;
  top: 16%;
  width: 14rem;
  height: 14rem;
  background: rgba(15, 157, 138, 0.16);
  animation-duration: 7.5s;
`;

const Grid = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(24, 36, 61, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(24, 36, 61, 0.03) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent 92%);
`;

const Shell = styled.div`
  position: relative;
  z-index: 1;
  width: min(1180px, calc(100% - 2rem));
  margin: 0 auto;
  padding: 2.2rem 0 1.5rem;
  animation: ${rise} 0.7s ease-out;

  @media (max-width: 768px) {
    padding-top: 2rem;
  }

  @media (max-width: 640px) {
    width: min(100% - 1rem, 1180px);
    padding: 1.4rem 0 2rem;
  }
`;

const Hero = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
  gap: 1.4rem;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Copy = styled.div`
  max-width: 40rem;

  @media (max-width: 640px) {
    max-width: none;
  }
`;

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(24, 36, 61, 0.08);
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
  box-shadow: 0 0 0 0.35rem rgba(255, 107, 61, 0.16);
`;

const Title = styled.h1`
  margin: 0.85rem 0 0.75rem;
  color: var(--ink);
  font-size: clamp(2.85rem, 5.8vw, 4.8rem);
  line-height: 0.92;
  letter-spacing: -0.05em;

  @media (max-width: 640px) {
    margin-top: 1rem;
    font-size: clamp(2.5rem, 12vw, 3.6rem);
  }
`;

const Accent = styled.span`
  color: var(--accent);
`;

const Description = styled.p`
  margin: 0;
  color: var(--muted);
  font-size: 1rem;
  line-height: 1.68;

  @media (max-width: 640px) {
    font-size: 0.98rem;
    line-height: 1.7;
  }
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

  @media (max-width: 640px) {
    width: 100%;
    min-width: 0;
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
  background: rgba(255, 255, 255, 0.65);
  color: var(--ink);
  text-decoration: none;
  font-weight: 700;
  backdrop-filter: blur(8px);
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.9);
    border-color: rgba(24, 36, 61, 0.2);
  }

  @media (max-width: 640px) {
    width: 100%;
    min-width: 0;
  }
`;

const Stats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.35rem;

  @media (max-width: 640px) {
    display: grid;
    grid-template-columns: 1fr;
  }
`;

const Stat = styled.div`
  min-width: 8.5rem;
  padding: 0.85rem 1rem;
  border-radius: 1.15rem;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid var(--line);
  backdrop-filter: blur(10px);
`;

const StatValue = styled.div`
  color: var(--ink);
  font-size: 1.28rem;
  font-weight: 800;
`;

const StatLabel = styled.div`
  margin-top: 0.25rem;
  color: var(--muted);
  font-size: 0.92rem;
`;

const Showcase = styled.div`
  position: relative;
  min-height: 24rem;

  @media (max-width: 900px) {
    min-height: 24rem;
  }

  @media (max-width: 640px) {
    min-height: auto;
    display: grid;
    gap: 1rem;
  }
`;

const FloatingCard = styled.div`
  position: absolute;
  border-radius: 1.5rem;
  background: var(--surface);
  border: 1px solid var(--line);
  backdrop-filter: blur(14px);
  box-shadow: 0 20px 50px rgba(24, 36, 61, 0.12);

  @media (max-width: 640px) {
    position: relative;
  }
`;

const CanvasCard = styled(FloatingCard)`
  inset: 0.75rem 0 3rem 1.5rem;
  padding: 1rem;
  transform: rotate(-3deg);

  @media (max-width: 900px) {
    inset: 0.5rem 0 3.5rem 1rem;
  }

  @media (max-width: 640px) {
    inset: auto;
    padding: 0.9rem;
    transform: none;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  gap: 0.45rem;
`;

const Chip = styled.span<{ tone: string }>`
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 999px;
  background: ${(props) => props.tone};
`;

const SketchArea = styled.div`
  position: relative;
  margin-top: 0.8rem;
  height: calc(100% - 2rem);
  border-radius: 1.15rem;
  background:
    linear-gradient(rgba(24, 36, 61, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(24, 36, 61, 0.04) 1px, transparent 1px),
    linear-gradient(180deg, #fffaf4 0%, #fff 100%);
  background-size: 24px 24px, 24px 24px, auto;
  overflow: hidden;

  @media (max-width: 640px) {
    height: 15rem;
  }
`;

const Stroke = styled.div<{ top: string; left: string; width: string; rotate: string; color: string }>`
  position: absolute;
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  width: ${(props) => props.width};
  height: 0.45rem;
  border-radius: 999px;
  background: ${(props) => props.color};
  transform: rotate(${(props) => props.rotate});
`;

const Note = styled.div`
  position: absolute;
  right: 1.2rem;
  bottom: 1.2rem;
  width: 8.5rem;
  padding: 0.75rem;
  border-radius: 1rem;
  background: #fff3be;
  color: #54410d;
  box-shadow: 0 16px 30px rgba(84, 65, 13, 0.14);
  transform: rotate(6deg);
  font-weight: 600;
  line-height: 1.4;
  font-size: 0.88rem;

  @media (max-width: 640px) {
    right: 0.75rem;
    bottom: 0.75rem;
    width: 8rem;
    padding: 0.7rem;
    font-size: 0.82rem;
  }
`;

const ChatCard = styled(FloatingCard)`
  right: 0;
  bottom: 0;
  width: 13.5rem;
  padding: 0.9rem;

  @media (max-width: 640px) {
    right: auto;
    bottom: auto;
    width: 100%;
    padding: 0.9rem;
  }
`;

const CardTitle = styled.div`
  color: var(--ink);
  font-weight: 800;
`;

const MessageList = styled.div`
  display: grid;
  gap: 0.7rem;
  margin-top: 0.75rem;
`;

const MessageBubble = styled.div<{ align?: "left" | "right"; tone?: "accent" | "neutral" }>`
  justify-self: ${(props) =>
    props.align === "right" ? "end" : "start"};
  max-width: 10rem;
  padding: 0.62rem 0.78rem;
  border-radius: 1rem;
  background: ${(props) =>
    props.tone === "accent" ? "var(--accent-soft)" : "rgba(24, 36, 61, 0.08)"};
  color: var(--ink);
  font-size: 0.86rem;
  line-height: 1.38;
`;

const Features = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1.1rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 640px) {
    margin-top: 1.25rem;
  }
`;

const Feature = styled.article`
  padding: 1rem 1.05rem;
  border-radius: 1.4rem;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid var(--line);
  backdrop-filter: blur(10px);
  box-shadow: 0 16px 32px rgba(24, 36, 61, 0.08);
`;

const FeatureTag = styled.div`
  color: var(--highlight);
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const FeatureTitle = styled.h2`
  margin: 0.45rem 0 0.35rem;
  color: var(--ink);
  font-size: 1.1rem;
`;

const FeatureBody = styled.p`
  margin: 0;
  color: var(--muted);
  font-size: 0.94rem;
  line-height: 1.55;
`;

export const Home = () => {
  return (
    <Page>
      <GlowOne />
      <GlowTwo />
      <Grid />
      <Shell>
        <Hero>
          <Copy>
            <Eyebrow>
              <Dot />
              Real-time teamwork
            </Eyebrow>
            <Title>
              Sketch ideas at the speed of <Accent>conversation</Accent>.
            </Title>
            <Description>
              Turn a room into a shared thinking surface. Draw, annotate, and
              react together without breaking the flow between brainstorming and
              execution.
            </Description>
            <Actions>
              <PrimaryAction to="/room-management">Start a Room</PrimaryAction>
              <SecondaryAction to="/my">Open My Boards</SecondaryAction>
            </Actions>
            <Stats>
              <Stat>
                <StatValue>Live</StatValue>
                <StatLabel>drawing sync</StatLabel>
              </Stat>
              <Stat>
                <StatValue>Chat</StatValue>
                <StatLabel>inside every room</StatLabel>
              </Stat>
              <Stat>
                <StatValue>Fast</StatValue>
                <StatLabel>setup for teams</StatLabel>
              </Stat>
            </Stats>
          </Copy>
          <Showcase>
            <CanvasCard>
              <PanelHeader>
                <Chip tone="#ff6b3d" />
                <Chip tone="#ffc94d" />
                <Chip tone="#0f9d8a" />
              </PanelHeader>
              <SketchArea>
                <Stroke
                  top="20%"
                  left="12%"
                  width="36%"
                  rotate="12deg"
                  color="#ff6b3d"
                />
                <Stroke
                  top="32%"
                  left="22%"
                  width="28%"
                  rotate="-18deg"
                  color="#0f9d8a"
                />
                <Stroke
                  top="48%"
                  left="16%"
                  width="44%"
                  rotate="8deg"
                  color="#3f7cff"
                />
                <Stroke
                  top="62%"
                  left="34%"
                  width="22%"
                  rotate="-28deg"
                  color="#1a2238"
                />
                <Note>
                  Review flow
                  <br />
                  then ship it.
                </Note>
              </SketchArea>
            </CanvasCard>
            <ChatCard>
              <CardTitle>Room Pulse</CardTitle>
              <MessageList>
                <MessageBubble tone="neutral">
                  Let&apos;s map the user journey first.
                </MessageBubble>
                <MessageBubble align="right" tone="accent">
                  I&apos;ll sketch the edge cases on the board.
                </MessageBubble>
                <MessageBubble tone="neutral">
                  Perfect. Drop decisions in chat as we go.
                </MessageBubble>
              </MessageList>
            </ChatCard>
          </Showcase>
        </Hero>

        <Features>
          <Feature>
            <FeatureTag>Visual Flow</FeatureTag>
            <FeatureTitle>Draw directly where the discussion happens</FeatureTitle>
            <FeatureBody>
              Keep whiteboard strokes and room context together so ideas do not
              get fragmented across tools.
            </FeatureBody>
          </Feature>
          <Feature>
            <FeatureTag>Room Based</FeatureTag>
            <FeatureTitle>Jump between boards without extra ceremony</FeatureTitle>
            <FeatureBody>
              Create a room, share the link, and move from planning to active
              collaboration in a few clicks.
            </FeatureBody>
          </Feature>
          <Feature>
            <FeatureTag>Team Tempo</FeatureTag>
            <FeatureTitle>Built for quick feedback and shared iteration</FeatureTitle>
            <FeatureBody>
              Use chat for decisions, use the canvas for thinking, and keep the
              team moving in one synchronized workspace.
            </FeatureBody>
          </Feature>
        </Features>
      </Shell>
    </Page>
  );
};
