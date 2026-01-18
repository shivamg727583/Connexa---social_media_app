const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    caption: { type: String, default: "" },
    image: { type: String, required: true },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    contextType: {
      type: String,
      enum: ["USER", "GROUP"],
      default: "USER",
      index: true,
    },

    contextId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

postSchema.index({ contextType: 1, contextId: 1, createdAt: -1 });

module.exports = mongoose.model("Post", postSchema);
