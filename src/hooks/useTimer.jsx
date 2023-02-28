import { useState, useEffect, useRef, useMemo } from "react";

const useTimer = (initialTime, isCountdown = false) => {
  const [timer, setTimer] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const startTimeRef = useRef(0);
  const rafIdRef = useRef(null);

  const startTimer = () => {
    if (isRunning) return;
    setIsRunning(true);
    setIsTimeUp(false);
    startTimeRef.current = performance.now();
    rafIdRef.current = requestAnimationFrame(updateTimer);
  };

  const stopTimer = () => {
    setIsRunning(false);
    cancelAnimationFrame(rafIdRef.current);
  };

  const updateTimer = (currentTime) => {
    const elapsedTime = (currentTime - startTimeRef.current) / 1000;
    let newValue = Math.round(isCountdown ? initialTime - elapsedTime : elapsedTime);
    setTimer(newValue > 0 ? newValue : 0);

    if (newValue > 0 || !isCountdown) {
      rafIdRef.current = requestAnimationFrame(updateTimer);
    } else {
      setIsRunning(false);
      setIsTimeUp(true);
    }
  };

  useEffect(() => {
    if (isRunning) {
      rafIdRef.current = requestAnimationFrame(updateTimer);
    }
    return () => {
      cancelAnimationFrame(rafIdRef.current);
    };
  }, [isRunning]);

  const timerText = useMemo(() => {
    const seconds = timer % 60;
    const minutes = (timer - seconds) / 60;
    return `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  }, [timer]);

  return isCountdown
    ? [timerText, isRunning, isTimeUp, startTimer, stopTimer]
    : [timerText, isRunning, startTimer, stopTimer];
};

export default useTimer;
