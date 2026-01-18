require("dotenv").config();
const http = require("http");
const connectDB = require("./config/db.config");

const app = require("./app");
const initSocket = require("./socket/socket");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(); 

    const server = http.createServer(app);

    const { io, getReceiverSocketId } = initSocket(server);

    global.io = io;
    global.getReceiverSocketId = getReceiverSocketId;

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
