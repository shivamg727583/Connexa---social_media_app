const { Server } = require("socket.io");

const userSocketMap = {};

const initSocket = (server) => {
 
  const io = new Server(server, {
  cors: {
    origin: (origin, cb) => {
      if (!origin || origin === process.env.FRONTEND_URL) {
        cb(null, true);
      } else {
        cb(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  },
   pingTimeout: 60000,
    pingInterval: 25000,
});


  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId && userId !== "undefined") {
      userSocketMap[userId] = socket.id;
      
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    socket.on("typing", ({ receiverId, isTyping }) => {
      const receiverSocketId = userSocketMap[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing", {
          userId,
          isTyping,
        });
      }
    });

    socket.on("markAsRead", ({ conversationId, userId: otherUserId }) => {  
      const otherSocketId = userSocketMap[otherUserId];
      if (otherSocketId) {
        io.to(otherSocketId).emit("markAsRead", {
          conversationId,
          userId: socket.handshake.query.userId,
        });
      } 
    });


    socket.on("disconnect", () => {
      
      if (userId) {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
      }
    });
  });

  const getReceiverSocketId = (userId) => {
    return userSocketMap[userId];
  };

  return { io, getReceiverSocketId };
};

module.exports = initSocket;