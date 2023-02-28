import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useTimer from "../hooks/useTimer";
import { useStore } from "../store";

const Room = () => {
  const navigate = useNavigate();
  const [{ socket, self, opponent }, dispatch] = useStore();
  const [isReady, setReady] = useState(false);
  const [timer, isRunning, isTimeUp, startTimer, stopTimer] = useTimer(10, true);

  useEffect(() => {
    if (opponent.name) startTimer();
    else stopTimer();
  }, [opponent]);

  useEffect(() => {
    if (!isTimeUp) return;
    dispatch({ type: "CHANGE_OPPONENT", payload: {} });
  }, [isTimeUp]);

  useEffect(() => {
    socket.on("challenges-decline", () => {
      dispatch({ type: "CHANGE_OPPONENT", payload: {} });
    });
    socket.on("challenges-accept", () => {
      stopTimer();
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
          <div className="text-3xl 2xl:text-4xl">{self.name}</div>
        </div>
        <div className="flex flex-col justify-between p-8 items-center gap-4">
          <div className="text-3xl 2xl:text-4xl uppercase text-center">
            Invite <br />
            your friend
          </div>
          {isRunning && (
            <div className="timer countdown">
              <div className="timer-text">{timer}</div>
            </div>
          )}
          {opponent.name &&
            (isReady ? (
              <div className="italic">
                <span className="font-bold">{opponent.name}</span> is ready to fight!
              </div>
            ) : isRunning ? (
              <div className="italic">
                Waiting for <span className="font-bold">{opponent.name}</span> to accept!
              </div>
            ) : (
              <div className="italic">
                Waiting for <span className="font-bold">{opponent.name}</span> to ready!
              </div>
            ))}
          <div onClick={handleStart} className={`button ${!opponent.name || !isReady ? "disabled" : null}`}>
            Start
          </div>
        </div>
        <div className="border-l flex justify-center items-center flex-col text-3xl 2xl:text-4xl">
          {opponent.name || "..."}
        </div>
      </div>
    </div>
  );
};

export default Room;
