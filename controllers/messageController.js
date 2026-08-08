const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const {
      conversationId,
      text,
      replyTo,
    } = req.body;

    const sender = req.user.id;

    const message = await Message.create({
      conversation: conversationId,
      sender,
      text,
      replyTo: replyTo || null,
    });

    await Conversation.findByIdAndUpdate(
      conversationId,
      {
        lastMessage: text,
      }
    );

    const populatedMessage =
      await Message.findById(message._id)
        .populate(
          "sender",
          "username name"
        )
        .populate({
  path: "replyTo",
  select: "text sender",
  populate: {
    path: "sender",
    select: "name username",
  },
})

    res.status(201).json({
      success: true,
      message: populatedMessage,
    });

  } catch (err) {
    console.error(
      "SEND MESSAGE ERROR:",
      err
    );

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// Get all messages
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversation:
        req.params.conversationId,
    })
      .populate(
        "sender",
        "username name"
      )
      .populate({
  path: "replyTo",
  select: "text sender",
  populate: {
    path: "sender",
    select: "name username",
  },
})
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      messages,
    });

  } catch (err) {
    console.error(
      "GET MESSAGES ERROR:",
      err
    );

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
