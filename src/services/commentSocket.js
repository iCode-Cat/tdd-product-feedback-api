const socketIO = io => {
  // IO test
  // handles socket.io connections
  io.on("connection", socket => {
    console.log("User connected");

    // when a user sends a message, broadcast it to all other users
    socket.on("message", message => {
      console.log("Message: " + message);
      socket.broadcast.emit("message", message);
    });

    socket.on("click", () => {
      console.log("user clicked a username!");
      socket.emit("click");
    });

    // if a user disconnects, log it to the console
    socket.on("disconnect", reason => {
      console.log(`User disconnected (${reason})`);
    });
  });
};

module.exports = {
  socketIO
};
