import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";

const Room = () => {
  const navigate = useNavigate();
  const [{ socket, self, opponent }, dispatch] = useStore();
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    socket.on("challenges-decline", () => {
      dispatch({ type: "CHANGE_OPPONENT", payload: {} });
    });
    socket.on("challenges-ready", () => {
      setReady(true);
    });
  }, [socket]);

  const handleStart = () => {
    if (!isReady) return;
    socket.emit("challenges-start", opponent.name);
    navigate("/game");
  };

  const handleBack = () => {
    socket.emit("challenges-remove", { from: self.name, to: opponent.name });
    dispatch({ type: "CHANGE_OPPONENT", payload: {} });
    navigate("/");
  };

  return (
    <div className="grid grid-rows-[auto_1fr]">
      <div className="flex items-center p-8 border-b">
        <div onClick={handleBack} className="button">
          Back to home
        </div>
      </div>
      <div className="grid grid-cols-[1fr_24rem_1fr]">
        <div className="border-r flex justify-center items-center flex-col gap-4">
          <div className="text-4xl">{self.name}</div>
        </div>
        <div className="flex flex-col justify-between p-8 items-center gap-4">
          <div className="text-4xl uppercase text-center">
            Invite <br />
            your friend
          </div>
          <div onClick={handleStart} className={`button ${!opponent.name || !isReady ? "disabled" : null}`}>
            Start
          </div>
        </div>
        <div className="border-l flex justify-center items-center flex-col text-4xl">{opponent.name || "..."}</div>
      </div>
    </div>
  );
};

export default Room;
