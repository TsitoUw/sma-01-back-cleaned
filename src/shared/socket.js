const socket = (io) => {
  io.on("connection", (socket) => {
    console.log(`socket connected: ${socket.id}`);
  });
};

module.exports = { socket };
