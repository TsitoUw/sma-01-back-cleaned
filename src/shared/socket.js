const { commentSocket } = require("./comment.socket");
const { postSocket } = require("./post.socket");

const socket = (io) => {
  io.on("connection", (socket) => {
    console.log(`socket connected: ${socket.id}`);
    commentSocket(socket);
    postSocket(socket);
  });
};

module.exports = { socket };
