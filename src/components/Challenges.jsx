import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";

const Challenges = () => {
  const navigate = useNavigate();
  const [{ socket, self }, dispatch] = useStore();
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    socket.on("challenges-add", (name) => {
      setChallenges((prev) => [name, ...prev]);
    });
    socket.on("challenges-remove", (name) => {
      setChallenges((prev) => prev.filter((item) => item !== name));
    });
  }, [socket]);

  const handleAcceptChallenges = (name) => {
    setChallenges((prev) => prev.filter((item) => item !== name));
    socket.emit("challenges-accept", name);
    dispatch({ type: "CHANGE_OPPONENT", payload: { name } });
    navigate("/challenge");
  };

  const handleDeclineChallenges = (name) => {
    setChallenges((prev) => prev.filter((item) => item !== name));
    socket.emit("challenges-decline", name);
  };

  return (
    <div className="flex flex-col gap-2 max-h-36 overflow-auto">
      {challenges.map((name) => (
        <div key={name} className="ticket" onAnimationEnd={() => handleDeclineChallenges(name)}>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-4xl">
              <ion-icon name="ticket"></ion-icon>
            </div>
            <div className="text-2xl font-bold">{name}</div>
          </div>
          <div className="flex items-center gap-2 text-2xl">
            <div
              onClick={() => handleAcceptChallenges(name)}
              className="flex items-center hover:text-green-400 cursor-pointer"
            >
              <ion-icon name="checkmark-circle"></ion-icon>
            </div>
            <div
              onClick={() => handleDeclineChallenges(name)}
              className="flex items-center hover:text-red-400 cursor-pointer"
            >
              <ion-icon name="close-circle"></ion-icon>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Challenges;
