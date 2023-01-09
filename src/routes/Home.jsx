import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LINES } from "../utils/constants";

const Home = () => {
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

  return (
    <div className="grid grid-rows-[auto_1fr]">
      <div className="flex items-center p-8 border-b">
        <div className="flex items-center gap-16">
          <Link to="/queue">
            <div className="button">Play now</div>
          </Link>
          <Link to="/room">
            <div className="item">Create room</div>
          </Link>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center overflow-hidden">
        <div onClick={handleClick} className="cursor-pointer flex flex-col justify-center items-center">
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
