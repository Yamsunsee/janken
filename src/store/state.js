import io from "socket.io-client";
import { PATH } from "../utils";

const initialState = {
  self: {},
  opponent: {},
  friends: [],
  status: "idle",
  socket: io(PATH, { transports: ["websocket", "polling"] }),
};

export default initialState;
