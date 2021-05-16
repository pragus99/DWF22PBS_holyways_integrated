require("dotenv").config();

const express = require("express");
const app = express();

const routers = require("./routers");
const cors = require("cors");

const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

const socketFund = require("./socket/fund");

app.use(express.json());
app.use(cors());
app.use("/api/v1", routers);
app.use(express.static("storage"));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const fundNameSpace = io.of("/funds").on("connection", (socket) => {
  socketFund.respond(fundNameSpace, socket);
});

server.listen(9000);
