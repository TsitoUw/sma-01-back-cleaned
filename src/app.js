const http = require("http");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const socketIo = require("socket.io");
const dotenv = require("dotenv");
const api = require("./module");
const { socket } = require("./shared/socket");

dotenv.config();

const PORT = process.env.PORT || 3333;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("static"));

const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });
socket(io);

const connectionParams = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose
  .connect(process.env.DATABASE, connectionParams)
  .then(() => console.log("Connected to MongoDb"))
  .catch((err) => console.log(err.message));
//

app.use("/api/users", api.users);
app.use("/api/posts", api.posts);
app.use("/api/discussions", api.discussions);
server.listen(PORT, () => console.log(`Server are runing on port ${PORT}`));
