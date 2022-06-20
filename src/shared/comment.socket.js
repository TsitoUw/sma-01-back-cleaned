const commentSocket = (socket) => {
  //join post's room
  socket.on("join-post", (id) => {
    socket.join(id);
  });
  //leave post's room
  socket.on("leave-post", (id) => {
    socket.leave(id);
  });

  socket.on("writing", (id) => {
    socket.to(id).emit("is-writing");
  });

  socket.on("not-writing", (id) => {
    socket.to(id).emit("is-not-writing");
  });

  socket.on("commenting", (id) => {
    socket.to(id).emit("commented");
  });
};

module.exports = { commentSocket };
