import { Route, BrowserRouter } from "react-router-dom";
import { Home } from "./home/Home";
import { ProtectRoute } from "./common//ProtectRoute";
import { WhiteboardList } from "./whiteboardlist/WhiteboardList";
import { Nav } from "./nav/Nav";
import { RoomManagement } from "./roomManagement/RoomManagement";
import { NotLoggedIn } from "./common/NotLoggedIn";
import { Room } from "./room/Room";
import { NewRoom } from "./room/NewRoom";
import { NewWhiteboardList } from "./whiteboardlist/NewWhiteboardList";

export const Routes = () => {
  return (
    <BrowserRouter>
      <Nav />
      <Route path="/" exact component={Home} />
      <ProtectRoute path="/home" exact component={Home} />
      <ProtectRoute path="/room-management" exact component={RoomManagement} />
      <Route path="/not-login" exact component={NotLoggedIn} />
      <ProtectRoute path="/my" exact component={NewWhiteboardList} />
      <ProtectRoute path="/rooms/:id" exact component={Room} />
      <ProtectRoute path="/new-room" exact component={NewRoom} />
    </BrowserRouter>
  );
};
