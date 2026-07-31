const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { startConversation, sendMessage, getConversations, getMessages } = require("../controllers/chatController");

router.post("/start", protect, startConversation);
router.post("/send", protect, sendMessage);
router.get("/conversations", protect, getConversations);
router.get("/:conversationId/messages", protect, getMessages);

module.exports = router;
