const postSocket = (socket) => {
  socket.on("post-liked", () => {
    socket.broadcast.emit("someone-liked");
  });
};

module.exports = { postSocket };
