import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../store";
import AddFriends from "./AddFriends";
import Challenges from "./Challenges";
import Friends from "./Friends";
import Notifications from "./Notifications";

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [{ socket, self }, dispatch] = useStore();

  const handleSignOut = () => {
    socket.emit("leave", self.name);
    dispatch({ type: "CHANGE_SELF", payload: {} });
    localStorage.removeItem("janken-data");
    navigate("/login");
  };

  return (
    <div className="border-l flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center p-8 h-[7.75rem] border-b">
          <div className="flex items-center">
            <div className="flex justify-center items-center text-4xl">
              <ion-icon name="person-circle"></ion-icon>
            </div>
            <div className="ml-1 text-2xl font-bold">{self.name}</div>
          </div>
          <Notifications />
        </div>
        <Challenges />
        <AddFriends />
        <Friends />
      </div>
      {pathname === "/" && (
        <div onClick={handleSignOut} className="button mb-8">
          Sign out
        </div>
      )}
    </div>
  );
};

export default Sidebar;
