if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const cors = require("cors");
const router = require("./routes/index");
const errHandler = require("./middlewares/errorHandler");
const app = express();
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", router);

app.use(errHandler);

const rooms = []
io.on('connection', (socket) => {
  
  console.log('new connection from', socket.id)
  let playerId = socket.id

  socket.on('message', function (msg) {
    console.log('got message from client: ' + msg)
  })

  socket.on('disconnect', function () {
    console.log(playerId + ' disconnected');
  })

  socket.on('joined', function (roomId) {
    // if the room is not full then add the player to that room
    if (games[roomId].players < 2) {
        games[roomId].players++;
        games[roomId].pid[games[roomId].players - 1] = playerId;
    } // else emit the full event
    else {
        socket.emit('full', roomId)
        return;
    }
    console.log(games[roomId]);
    players = games[roomId].players
    // the first player to join the room gets white
    if (players % 2 == 0) color = 'black';
    else color = 'white';

    // this is an important event because, once this is emitted the game
    // will be set up in the client side, and it'll display the chess board
    socket.emit('player', {
        playerId,
        players,
        color,
        roomId
    })

  });



})

module.exports = app;
