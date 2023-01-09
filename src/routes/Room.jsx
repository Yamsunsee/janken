import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store";

const Room = () => {
  const navigate = useNavigate();
  const [{ socket, self, opponent }, dispatch] = useStore();

  useEffect(() => {
    socket.on("", () => {});
  }, [socket]);

  const handleStart = () => {};

  return (
    <div className="grid grid-rows-[auto_1fr]">
      <div className="flex items-center p-8 border-b">
        <Link to="/">
          <div className="button">Back to home</div>
        </Link>
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
          <div onClick={handleStart} className={`button ${!opponent.name ? "disabled" : null}`}>
            Ready
          </div>
        </div>
        <div className="border-l flex justify-center items-center flex-col text-4xl">{opponent.name || "..."}</div>
      </div>
    </div>
  );
};

export default Room;
