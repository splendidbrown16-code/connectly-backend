const Conversation = require("../models/Conversation");

// Create or get conversation
exports.createConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;

    const senderId = req.user.id;

    let conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, receiverId],
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get all conversations
exports.getConversations = async (req, res) => {
  try {
    const conversations =
      await Conversation.find({
        participants: req.user.id,
      })
        .populate(
          "participants",
          "username fullName profilePicture"
        )
        .sort({ updatedAt: -1 });

    res.json({
      success: true,
      conversations,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
