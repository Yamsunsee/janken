import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useTimer from "../hooks/useTimer";
import { useStore } from "../store";
import { delay, getTimerText } from "../utils";

const Queue = () => {
  const navigate = useNavigate();
  const [{ socket, self, opponent, status }, dispatch] = useStore();
  const [isOpponentReady, setOpponentReady] = useState(false);
  const [timerCU, isRunningCU, startTimerCU, stopTimerCU] = useTimer(0);
  const [timerCD, isRunningCD, isTimeUpCD, startTimerCD, stopTimerCD] = useTimer(10, true);

  const title = useMemo(() => {
    switch (status) {
      case "idle":
        return "Find match";
      case "queueing":
        return "In queue";
      default:
        return "Match found";
    }
  }, [status]);

  useEffect(() => {
    switch (status) {
      case "queueing":
        stopTimerCD();
        startTimerCU();
        break;

      case "pending":
      case "accepted":
        startTimerCD();
        break;

      default:
        stopTimerCU();
        stopTimerCD();
    }
  }, [status]);

  useEffect(() => {
    if (!isTimeUpCD) return;
    if (isOpponentReady) handleDecline();
    else if (status !== "accepted") handleCancel();
  }, [isTimeUpCD]);

  useEffect(() => {
    socket.on("matched", (name) => {
      dispatch({ type: "CHANGE_OPPONENT", payload: { name } });
      dispatch({ type: "CHANGE_STATUS", payload: "pending" });
    });
    socket.on("decline", () => {
      setOpponentReady(false);
      dispatch({ type: "CHANGE_STATUS", payload: "queueing" });
      dispatch({ type: "CHANGE_OPPONENT", payload: {} });
    });
    socket.on("ready", () => {
      setOpponentReady(true);
    });
    socket.on("game", () => {
      dispatch({ type: "CHANGE_STATUS", payload: "idle" });
      navigate("/game");
    });
  }, [socket]);

  const handleStart = () => {
    socket.emit("queue-add", self.name);
    dispatch({ type: "CHANGE_STATUS", payload: "queueing" });
  };

  const handleCancel = () => {
    setOpponentReady(false);
    socket.emit("queue-remove", self.name);
    dispatch({ type: "CHANGE_STATUS", payload: "idle" });
    dispatch({ type: "CHANGE_OPPONENT", payload: {} });
  };

  const handleAccept = () => {
    if (status === "accepted") return;
    socket.emit("queue-accept", self.name);
    dispatch({ type: "CHANGE_STATUS", payload: "accepted" });
  };

  const handleDecline = () => {
    if (status === "accepted") return;
    setOpponentReady(false);
    socket.emit("queue-decline", self.name);
    dispatch({ type: "CHANGE_STATUS", payload: "idle" });
    dispatch({ type: "CHANGE_OPPONENT", payload: {} });
  };

  const handleBack = () => {
    if (status === "accepted") return;
    else if (status === "queueing") handleCancel();
    else if (status === "pending") handleDecline();
    navigate("/");
  };

  const handleOffline = () => {
    if (status !== "idle") return;
    dispatch({ type: "CHANGE_OPPONENT", payload: { name: "Computer" } });
    navigate("/computer");
  };

  return (
    <div className="grid grid-rows-[auto_1fr]">
      <div className="flex items-center p-8 border-b justify-between">
        <div onClick={handleBack} className={`button ${status === "accepted" ? "disabled" : null}`}>
          Back to home
        </div>
        <div onClick={handleOffline} className={`button ${status !== "idle" ? "disabled" : null}`}>
          Play with computer
        </div>
      </div>
      <div className="grid grid-cols-[1fr_24rem_1fr]">
        <div className="border-r flex justify-center items-center text-3xl 2xl:text-4xl">{self.name}</div>
        <div className="flex flex-col justify-between p-8 items-center">
          <div className="text-3xl 2xl:text-4xl uppercase text-center">{title}</div>
          {isRunningCU && !isRunningCD && (
            <div className="timer countup">
              <div className="timer-text">{timerCU}</div>
            </div>
          )}
          {isRunningCD && (
            <div className="timer countdown">
              <div className="timer-text">{timerCD}</div>
            </div>
          )}
          {status === "accepted" && (
            <div className="italic">
              Waiting for <span className="font-bold">{opponent.name}</span>!
            </div>
          )}
          {status === "pending" && isOpponentReady && (
            <div className="italic">
              <span className="font-bold">{opponent.name}</span> is waiting for you!
            </div>
          )}
          {status === "queueing" && (
            <div onClick={handleCancel} className="button">
              Cancle
            </div>
          )}
          {status === "idle" && (
            <div onClick={handleStart} className="button">
              Start
            </div>
          )}
          {(status === "pending" || status === "accepted") && (
            <div className="flex gap-4 items-center">
              <div onClick={handleAccept} className={`button ${status === "accepted" ? "active" : null}`}>
                Accept
              </div>
              <div onClick={handleDecline} className={`button ${status === "accepted" ? "disabled" : null}`}>
                Decline
              </div>
            </div>
          )}
        </div>
        <div className="border-l flex flex-col justify-center items-center text-3xl 2xl:text-4xl">
          {opponent.name || "..."}
        </div>
      </div>
    </div>
  );
};

export default Queue;
