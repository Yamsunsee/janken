import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";

const Queue = () => {
  const navigate = useNavigate();
  const [{ socket, self, opponent, status }, dispatch] = useStore();
  const [timer, setTimer] = useState(0);
  const [isOpponentReady, setOpponentReady] = useState(false);

  const timerText = useMemo(() => {
    const seconds = timer % 60;
    const minutes = (timer - seconds) / 60;
    return `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  }, [timer]);

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
    let timeoutId;
    if (status === "pending" || status === "accepted") timeoutId = handleCountdown();
    else if (status === "queueing") timeoutId = handleCountup();
    return () => {
      clearTimeout(timeoutId);
    };
  }, [timer]);

  useEffect(() => {
    socket.on("matched", (name) => {
      dispatch({ type: "CHANGE_OPPONENT", payload: { name } });
      dispatch({ type: "CHANGE_STATUS", payload: "pending" });
      setTimer(15);
    });
    socket.on("decline", () => {
      setOpponentReady(false);
      dispatch({ type: "CHANGE_STATUS", payload: "queueing" });
      dispatch({ type: "CHANGE_OPPONENT", payload: {} });
      setTimer(1);
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
    setTimer(1);
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

  const handleCountup = () => {
    if (!status === "queueing") return;
    return setTimeout(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  const handleCountdown = () => {
    return setTimeout(() => {
      if (timer > 0) setTimer((prev) => prev - 1);
      else if (isOpponentReady) handleDecline();
      else if (status !== "accepted") handleCancel();
    }, 1000);
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
        <div className="border-r flex justify-center items-center text-4xl">{self.name}</div>
        <div className="flex flex-col justify-between p-8 items-center">
          <div className="text-4xl uppercase text-center">{title}</div>
          {status !== "idle" && (
            <div className={`timer ${opponent.name ? "countdown" : "countup"}`}>
              <div className="timer-text">{timerText}</div>
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
        <div className="border-l flex flex-col justify-center items-center text-4xl">{opponent.name || "..."}</div>
      </div>
    </div>
  );
};

export default Queue;
