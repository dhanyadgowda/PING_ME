const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require("./routes/UserRoutes");
const messagesRoute = require("./routes/messagesRoute");
const socket = require("socket.io");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messagesRoute);

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("DB connected");
}).catch((err) => {
  console.log(err.message);
});

// Starting server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000", 
    credentials: true
  }
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  
  socket.on("add-user", (userId) => {
    global.onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = global.onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data.message); 
    }
  });

  socket.on("disconnect", () => {
    global.onlineUsers.delete(socket.id); 
    console.log("User disconnected", socket.id);
  });
});
