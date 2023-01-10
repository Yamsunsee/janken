import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";
import { toast } from "react-toastify";
import { useState } from "react";

const Challenge = () => {
  const navigate = useNavigate();
  const [{ socket, self, opponent }, dispatch] = useStore();
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    socket.on("challenges-remove", () => {
      toast.warn("Challenger has left the room!");
      dispatch({ type: "CHANGE_OPPONENT", payload: {} });
      navigate("/");
    });
    socket.on("challenges-start", () => {
      navigate("/game");
    });
  }, [socket]);

  const handleReady = () => {
    if (isReady) return;
    socket.emit("challenges-ready", opponent.name);
    setReady(true);
  };

  const handleBack = () => {
    socket.emit("challenges-decline", opponent.name);
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
        <div className="border-r flex justify-center items-center flex-col text-4xl">{opponent.name || "..."}</div>
        <div className="flex flex-col justify-between p-8 items-center gap-4">
          <div className="text-4xl uppercase text-center">Challenge room</div>
          <div onClick={handleReady} className={`button ${!opponent.name || isReady ? "disabled" : null}`}>
            Ready
          </div>
        </div>
        <div className="border-l flex justify-center items-center flex-col text-4xl">{self.name}</div>
      </div>
    </div>
  );
};

export default Challenge;
