import {
  usersGet,
  usersGetSockedId,
  usersAdd,
  usersRemove,
  usersDisconnect,
  queueAdd,
  queueRemove,
  matchedAccept,
  matchedDecline,
  tryToMatch,
} from "./functions.js";

const matching = (io) => {
  const response = tryToMatch();
  if (response) {
    const [first, second] = response;
    io.to(first.socketId).emit("matched", second.name);
    io.to(second.socketId).emit("matched", first.name);
  }
};

const socket = (io) => {
  io.on("connection", (socket) => {
    socket.on("join", (name) => {
      const isLoggedIn = usersAdd(name, socket.id);
      if (isLoggedIn) {
        socket.emit("server");
      } else {
        io.emit("users", usersGet());
      }
      console.log(usersGet());
    });
    socket.on("leave", (name) => {
      usersRemove(name);
      io.emit("users", usersGet());
      console.log(usersGet());
    });

    socket.on("queue-add", (name) => {
      queueAdd(name);
      matching(io);
    });
    socket.on("queue-remove", (name) => {
      queueRemove(name);
    });
    socket.on("queue-accept", (name) => {
      const response = matchedAccept(name);
      const { isStart, opponentSocketId } = response;
      if (isStart) {
        socket.emit("game");
        io.to(opponentSocketId).emit("game");
      } else {
        io.to(opponentSocketId).emit("ready");
      }
    });
    socket.on("queue-decline", (name) => {
      const response = matchedDecline(name);
      if (response) {
        const { opponentName, opponentSocketId } = response;
        io.to(opponentSocketId).emit("decline");
        queueAdd(opponentName);
        matching(io);
      }
    });

    socket.on("friends-add", (name) => {
      const socketId = usersGetSockedId(name);
      io.to(socketId).emit("invitations");
    });
    socket.on("friends-remove", (name) => {
      socket.emit("friends");
      const socketId = usersGetSockedId(name);
      io.to(socketId).emit("friends");
    });
    socket.on("friends-accept", (name) => {
      socket.emit("friends");
      const socketId = usersGetSockedId(name);
      io.to(socketId).emit("friends");
    });

    socket.on("challenges-add", ({ from, to }) => {
      const socketId = usersGetSockedId(to);
      io.to(socketId).emit("challenges-add", from);
    });
    socket.on("challenges-remove", ({ from, to }) => {
      const socketId = usersGetSockedId(to);
      io.to(socketId).emit("challenges-remove", from);
    });
    socket.on("challenges-ready", (name) => {
      const socketId = usersGetSockedId(name);
      io.to(socketId).emit("challenges-ready");
    });
    socket.on("challenges-start", (name) => {
      const socketId = usersGetSockedId(name);
      io.to(socketId).emit("challenges-start");
    });
    socket.on("challenges-decline", (name) => {
      const socketId = usersGetSockedId(name);
      io.to(socketId).emit("challenges-decline");
    });

    socket.on("lock", ({ name, value }) => {
      const socketId = usersGetSockedId(name);
      io.to(socketId).emit("lock", value);
    });
    socket.on("next", (name) => {
      const socketId = usersGetSockedId(name);
      io.to(socketId).emit("next");
    });
    socket.on("messages", ({ name, message }) => {
      const socketId = usersGetSockedId(name);
      io.to(socketId).emit("messages", message);
    });

    socket.on("disconnect", () => {
      usersDisconnect(socket.id);
      io.emit("users", usersGet());
    });
  });
};

export default socket;
