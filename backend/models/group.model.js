const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    avatar: {
      type: String,
      default: "",
    },

    coverImage: {
      type: String,
      default: "",
    },

    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    joinRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    privacy: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", groupSchema);
