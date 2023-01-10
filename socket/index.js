import state from "./functions.js";
const { users, queue } = state;

const socket = (io) => {
  io.on("connection", (socket) => {
    socket.on("join", (name) => {
      const status = users.add(name, socket.id);
      if (!status) {
        socket.emit("server");
      } else {
        io.emit("users", users.get());
      }
    });
    socket.on("leave", (name) => {
      users.remove(name);
      io.emit("users", users.get());
    });

    socket.on("queue-add", (name) => {
      const response = queue.add(name, socket.id);
      if (response) {
        const [first, second] = response;
        io.to(first.socketId).emit("matched", second.name);
        io.to(second.socketId).emit("matched", first.name);
      }
    });
    socket.on("queue-remove", (name) => {
      queue.remove(name);
    });
    socket.on("queue-accept", (name) => {
      const { isStart, socketId } = queue.accept(name);
      if (isStart) {
        socket.emit("game");
        io.to(socketId).emit("game");
      } else {
        io.to(socketId).emit("ready");
      }
    });
    socket.on("queue-decline", (name) => {
      const socketId = queue.decline(name);
      io.to(socketId).emit("decline");
    });

    socket.on("friends-add", (name) => {
      const socketId = users.getSocketId(name);
      io.to(socketId).emit("invitations");
    });
    socket.on("friends-remove", (name) => {
      socket.emit("friends");
      const socketId = users.getSocketId(name);
      io.to(socketId).emit("friends");
    });
    socket.on("friends-accept", (name) => {
      socket.emit("friends");
      const socketId = users.getSocketId(name);
      io.to(socketId).emit("friends");
    });

    socket.on("challenges-add", ({ from, to }) => {
      const socketId = users.getSocketId(to);
      io.to(socketId).emit("challenges-add", from);
    });
    socket.on("challenges-remove", ({ from, to }) => {
      const socketId = users.getSocketId(to);
      io.to(socketId).emit("challenges-remove", from);
    });
    socket.on("challenges-ready", (name) => {
      const socketId = users.getSocketId(name);
      io.to(socketId).emit("challenges-ready");
    });
    socket.on("challenges-start", (name) => {
      const socketId = users.getSocketId(name);
      io.to(socketId).emit("challenges-start");
    });
    socket.on("challenges-decline", (name) => {
      const socketId = users.getSocketId(name);
      io.to(socketId).emit("challenges-decline");
    });

    socket.on("lock", ({ name, value }) => {
      const socketId = users.getSocketId(name);
      io.to(socketId).emit("lock", value);
    });
    socket.on("next", (name) => {
      const socketId = users.getSocketId(name);
      io.to(socketId).emit("next");
    });
    socket.on("messages", ({ name, message }) => {
      const socketId = users.getSocketId(name);
      io.to(socketId).emit("messages", message);
    });

    socket.on("disconnect", () => {
      users.disconnect(socket.id);
      io.emit("users", users.get());
    });
  });
};

export default socket;
