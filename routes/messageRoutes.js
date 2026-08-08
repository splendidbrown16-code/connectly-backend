const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController");

router.post(
  "/send",
  protect,
  sendMessage
);

router.get(
  "/:conversationId",
  protect,
  getMessages
);

module.exports = router;
