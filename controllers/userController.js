const User = require("../models/User");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username query is required"
      });
    }

    const users = await User.find({
      username: {
        $regex: username,
        $options: "i"
      },
      _id: {
        $ne: req.user.id
      }
    })
      .select("name username profilePicture")
      .limit(20);

    res.json({
      success: true,
      count: users.length,
      users
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
  getProfile,
  searchUsers
};
