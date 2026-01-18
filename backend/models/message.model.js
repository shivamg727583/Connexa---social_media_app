const mongoose = require("mongoose");
  


const messageSchema = new mongoose.Schema(
  {
    
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      default: null,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiverType: {
      type: String,
      enum: ["USER", "GROUP"],
      required: true,
      index: true,
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    message: { type: String, required: true },
  },
  { timestamps: true }
);

messageSchema.index({ receiverType: 1, receiverId: 1, createdAt: 1 });

module.exports = mongoose.model("Message", messageSchema);
