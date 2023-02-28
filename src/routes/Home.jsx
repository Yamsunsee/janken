import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LINES } from "../utils/constants";

const Home = () => {
  const navigate = useNavigate();
  const [isDone, setDone] = useState(false);
  const lineElements = useMemo(() => document.getElementsByClassName("line"), []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDone(true);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const handleClick = async () => {
    if (!isDone) return;
    setDone(false);
    Array.from(lineElements).forEach((line) => {
      line.style.opacity = 1;
      line.style.translate = 0;
      line.style.animation = "hide 1s ease-out calc(var(--delay, 1) * 100ms) forwards";
    });
    await new Promise((resolve) => setTimeout(resolve, 3000));
    Array.from(lineElements).forEach((line) => {
      line.style.opacity = 0.3;
      line.style.translate = "calc(var(--offset) * 20rem)";
      line.style.animation = "show 1s ease-out calc(var(--delay, 1) * 100ms) forwards";
    });
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setDone(true);
  };

  const handleJoinQueue = () => {
    navigate("/queue");
  };

  const handleCreateRoom = () => {
    navigate("/room");
  };

  return (
    <div className="grid grid-rows-[auto_1fr]">
      <div className="flex items-center p-8 border-b">
        <div className="flex items-center gap-16">
          <div onClick={handleJoinQueue} className="button">
            Play now
          </div>
          <div onClick={handleCreateRoom} className="item">
            Create room
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center overflow-hidden">
        <div
          onClick={handleClick}
          className="transform scale-75 2xl:scale-100 cursor-pointer flex flex-col justify-center items-center"
        >
          {LINES.map((line, index) => (
            <div className="line" key={index}>
              {line.split(" ").map((piece, index) => {
                const length = piece.match(/\d+/g);
                const color = piece.match(/\D+/g);
                return <div className={`piece length-${length} ${color ? "color" : null}`} key={index}></div>;
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
