import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../store";
import { removeFriends } from "../utils";

const Friend = ({ friend, onlineUsers }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [{ socket, self, opponent, status }, dispatch] = useStore();
  const [isShow, setShow] = useState(false);

  const handleChallenges = () => {
    if (opponent.name && pathname === "/room") {
      socket.emit("challenges-remove", { from: self.name, to: opponent.name });
    }
    dispatch({ type: "CHANGE_OPPONENT", payload: { name: friend.name } });
    socket.emit("challenges-add", { from: self.name, to: friend.name });
    navigate("/room");
  };

  const handleUnfriends = async () => {
    const response = await removeFriends(self._id, friend._id);
    if (response.isSuccess) {
      socket.emit("friends-remove", friend.name);
    }
  };

  return (
    <div
      key={friend.name}
      className="text-sm py-2 px-8 flex items-center justify-between border-b-2 border-dashed border-[#ccc]"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <div className={`avatar ${onlineUsers.includes(friend.name) ? "online" : null}`}>
            <ion-icon name="person-circle"></ion-icon>
          </div>
          <div className="ml-1 flex flex-col">
            <div className="font-bold text-2xl">{friend.name}</div>
            <div className="italic">{onlineUsers.includes(friend.name) ? "Online" : "Offline"}</div>
          </div>
        </div>
      </div>
      <div onClick={() => setShow((prev) => !prev)} className={`options ${isShow ? "show" : null}`}>
        <ion-icon name="options"></ion-icon>
        {isShow && (
          <div className="options-items">
            {pathname !== "/challenge" && onlineUsers.includes(friend.name) && !opponent.name && status === "idle" && (
              <div
                onClick={handleChallenges}
                className="flex justify-between items-center px-4 py-2 italic text-[#ccc] hover:text-slate-700 cursor-pointer"
              >
                <div>Challenge</div>
                <div className="flex items-center">
                  <ion-icon name="receipt"></ion-icon>
                </div>
              </div>
            )}
            <div
              onClick={handleUnfriends}
              className="flex justify-between items-center px-4 py-2 italic text-[#ccc] hover:text-slate-700 cursor-pointer"
            >
              <div>Unfriend</div>
              <div className="flex items-center">
                <ion-icon name="trash"></ion-icon>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Friend;
