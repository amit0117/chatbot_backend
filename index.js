const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const {
  addUser,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/functionality.js");
const formatMessage = require("./utils/messages.js");
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);
const PORT = process.env.PORT || 3001;

io.on("connection", (socket) => {
  console.log("connection on");
  socket.on("joinRoom", ({ username, room }) => {
    socket.join(room);
    const user = addUser({ id: socket.id, username, room });
    console.log("joine room called user is", user);
    // Welcome current user
    socket.emit(
      "message",
      formatMessage("Admin", `Welcome to the chatbot ${user.username}!`)
    );

    // Broadcast when a user connect
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage("Admin", `${user.username} has joined the chat`)
      );

    // Send users and room information
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessages
  socket.on("chatMessage", (message) => {
    const user = getCurrentUser(socket.id);
    console.log("in chatmessage event recieved");
    io.to(user.room).emit("message", formatMessage(user.username, message));
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    console.log("in disconnect ");
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage("Admin", `${user.username} has left the chat`)
      );

      // sends user and room information
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});
app.get("/",(req,res)=>{
  return res.json({message:"hello world"})
})

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
