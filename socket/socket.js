const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const onlineUsers = new Map();

let ioInstance = null;
function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*"
    }
  });
ioInstance = io;

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication failed"));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;

      next();

    } catch (error) {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    onlineUsers.set(
      socket.user._id.toString(),
      socket.id
    );

    console.log(
      `✅ ${socket.user.username} connected (${socket.id})`
    );

    console.log("🟢 Online users:", onlineUsers.size);

    socket.on("disconnect", () => {
      onlineUsers.delete(
        socket.user._id.toString()
      );

      console.log(
        `❌ ${socket.user.username} disconnected`
      );

      console.log("🟢 Online users:", onlineUsers.size);
    });
  });

  return io;
}

function getIO() {
  return ioInstance;
}

module.exports = {
  initializeSocket,
  getIO,
  onlineUsers
};
