import { Server } from "socket.io";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("⚡ Admin connected:", socket.id);
  });

  return io;
};

export const emitNewOrder = (io, order) => {
  io.emit("NEW_ORDER", order);
};