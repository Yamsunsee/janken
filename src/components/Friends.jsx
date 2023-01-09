import { useEffect, useState } from "react";
import { useStore } from "../store";
import { getFriends } from "../utils";
import Friend from "./Friend";

const Friends = () => {
  const [{ socket, self, friends }, dispatch] = useStore();
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    self._id && fecthFriends();
  }, [self]);

  useEffect(() => {
    socket.on("users", (data) => {
      setOnlineUsers(data);
    });
    socket.on("friends", () => {
      fecthFriends();
    });
  }, [socket]);

  const fecthFriends = async () => {
    const response = await getFriends(self._id);
    if (response.isSuccess) {
      dispatch({ type: "CHANGE_FRIENDS", payload: response.data });
    }
  };

  return (
    <div>
      {friends.map((friend) => (
        <Friend key={friend.name} friend={friend} onlineUsers={onlineUsers} />
      ))}
    </div>
  );
};

export default Friends;
