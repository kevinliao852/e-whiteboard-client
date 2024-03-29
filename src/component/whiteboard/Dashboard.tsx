import SideBar from "./SideBar";
import { Canvas } from "./Canvas";
import { ChatBox } from "../chat/ChatBox";

export const Dashboard = (): JSX.Element => {
  return (
    <div>
      <SideBar>
        <Canvas />
        <ChatBox />
      </SideBar>
    </div>
  );
};
