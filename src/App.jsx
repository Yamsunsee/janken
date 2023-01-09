import { useStore } from "./store";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Lobby from "./routes/Lobby";
import Home from "./routes/Home";
import Queue from "./routes/Queue";
import Room from "./routes/Room";
import Login from "./routes/Login";
import Game from "./routes/Game";

const App = () => {
  const navigate = useNavigate();
  const [{ socket, self }, dispatch] = useStore();
  const [isShow, setShow] = useState(false);

  useEffect(() => {
    socket.on("server", () => {
      setShow(true);
    });
  }, [socket]);

  useEffect(() => {
    self.name && socket.emit("join", self.name);
  }, [self]);

  useEffect(() => {
    window.addEventListener("beforeunload", (event) => {
      event.preventDefault();
      event.returnValue = "";
    });

    const payload = JSON.parse(localStorage.getItem("janken-data"));
    if (payload) dispatch({ type: "CHANGE_SELF", payload });
    else navigate("/login");
  }, []);

  return (
    <>
      {isShow ? (
        <div className="min-h-screen flex justify-center items-center select-none text-slate-700 font-semibold text-4xl uppercase">
          You are signed in somewhere else!
        </div>
      ) : (
        <>
          <Routes>
            <Route path="/" element={<Lobby />}>
              <Route path="/" element={<Home />} />
              <Route path="queue" element={<Queue />} />
              <Route path="room" element={<Room />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/game" element={<Game />} />
          </Routes>
          <ToastContainer autoClose={3000} newestOnTop={true} closeOnClick pauseOnHover />
        </>
      )}
    </>
  );
};

export default App;

