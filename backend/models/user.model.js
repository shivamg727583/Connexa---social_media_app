const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    profilePicture: {
      type: String,
      default: ""
    },
    bio: {
      type: String,
      default: ""
    },
    gender: {
      type: String,
      enum: ["male", "female"]
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    totalFriends: {
      type: Number,
      default: 0
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
