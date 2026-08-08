require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const { initializeSocket } = require("./socket/socket");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
const server = http.createServer(app);

const io = initializeSocket(server);

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.json({
    app: "Connectly",
    status: "Running 🚀"
  });
});

const PORT = process.env.PORT || 5000;

connectDB();

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
