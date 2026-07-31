const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const { getIO, onlineUsers } = require("../socket/socket");

const startConversation = async (req, res) => {
  try {
    const { participantId } = req.body;

    if (!participantId) {
      return res.status(400).json({
        success: false,
        message: "Participant ID is required"
      });
    }

    const myId = req.user.id;

    let conversation = await Conversation.findOne({
      participants: {
        $all: [myId, participantId]
      }
    }).populate("participants", "name username profilePicture");

    if (conversation) {
      return res.json({
        success: true,
        message: "Conversation already exists",
        conversation
      });
    }

    conversation = await Conversation.create({
      participants: [myId, participantId]
    });

    conversation = await conversation.populate(
      "participants",
      "name username profilePicture"
    );

    res.status(201).json({
      success: true,
      message: "Conversation created",
      conversation
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;

   if (!conversationId || !text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID and message are required"
      });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }
const isParticipant = conversation.participants.some(
  participant => participant.toString() === req.user.id
);

if (!isParticipant) {
  return res.status(403).json({
    success: false,
    message: "You are not allowed to send messages in this conversation"
  });
}
    const message = await Message.create({
      conversation: conversationId,
      sender: req.user.id,
      text
    });

    conversation.lastMessage = text.trim();
    conversation.lastMessageSender = req.user.id;
    conversation.lastMessageAt = new Date();

    await conversation.save();
const recipientId = conversation.participants
  .find(
    id => id.toString() !== req.user.id
  )
  .toString();

const recipientSocket = onlineUsers.get(recipientId);

if (recipientSocket) {
  const io = getIO();

  io.to(recipientSocket).emit("new_message", message);

  console.log(
    `📨 Message delivered instantly to ${recipientId}`
  );
}
    res.status(201).json({
      success: true,
      message: "Message sent",
      data: message
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    })
      .populate("participants", "name username profilePicture")
      .sort({ lastMessageAt: -1 });

    res.json({
      success: true,
      count: conversations.length,
      conversations
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    // Make sure the logged-in user belongs to this conversation
    const isParticipant = conversation.participants.some(
      participant => participant.toString() === req.user.id
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view this conversation"
      });
    }

    const messages = await Message.find({
      conversation: conversationId
    })
      .populate("sender", "name username profilePicture")
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      count: messages.length,
      messages
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = {
  startConversation,
  sendMessage,
  getConversations,
  getMessages
};
