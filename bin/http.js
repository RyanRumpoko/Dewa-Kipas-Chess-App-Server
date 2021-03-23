const app= require("../app");
const port = process.env.PORT || 4000;
const http = require("http");
const socketio = require("socket.io");

const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

const activeRooms = []; // isi nya array of object { roomid, playerOne, playerTwo }

const users = {};

io.on("connection", (socket) => {
  // console.log('connect lhoo', client)
  // console.log('tolonggg bisa connect')
  // gameLogic.initializeGame(io, client)

  socket.on("create-room", function (data) {
    // isinya { roomid: '', playerData }
    console.log(data.roomid, "ini roomid nya create room");
    activeRooms.push({ roomid: data.roomid, playerOne: data.playerData });
    socket.join(data.roomid);
  });

  socket.on("join-room", function (data) {
    // isinya { roomid: '', playerData }
    console.log(data.roomid, "ini roomid nya joinroom");
    const selectedRoom = activeRooms.find(
      (datum) => datum.roomid === data.roomid
    );
    if (selectedRoom) {
      selectedRoom.playerTwo = data.playerData;
      console.log(selectedRoom);
      socket.join(data.roomid);
      io.to(data.roomid).emit("fullroom", { selectedRoom });
    }
  });

  socket.on("move", function (data) {
    console.log(data);
    io.to(data.roomid).emit("enemymove", data);
  });

  socket.on("gameover", function (data) {
    console.log(data);
    io.to(data.roomid).emit("youlose");
  });

  if (!users[socket.id]) {
    users[socket.id] = socket.id;
  }
  socket.emit("yourID", socket.id);
  io.sockets.emit("allUsers", users);
  socket.on("disconnect", () => {
    delete users[socket.id];
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("hey", {
      signal: data.signalData,
      from: data.from,
    });
  });

  socket.on("acceptCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});


server.listen(port, () => console.log("Running on port: ", port));
