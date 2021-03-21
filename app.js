if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const http = require('http')
const socketio = require('socket.io')

const cors = require("cors");
const router = require("./routes/index");
const errHandler = require("./middlewares/errorHandler");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", router);

app.use(errHandler);

const server = http.createServer(app)
const io = socketio(server)
// console.log(io)

io.on('connection', (client) => {
  // console.log('connect lhoo', client)
  console.log('tolonggg bisa connect')
  // gameLogic.initializeGame(io, client)
  
})

module.exports = server;
