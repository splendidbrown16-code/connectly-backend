const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  getProfile,
  searchUsers
} = require("../controllers/userController");

router.get("/profile", protect, getProfile);
router.get("/search", protect, searchUsers);

module.exports = router;
