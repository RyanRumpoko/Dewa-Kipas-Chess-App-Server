const app = require("../app");
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

let activeRooms = []; // isi nya array of object { roomid, playerOne, playerTwo }

let users = {};

let roomId;

io.on("connection", (socket) => {
  // console.log('connect lhoo', client)
  // console.log('tolonggg bisa connect')
  // gameLogic.initializeGame(io, client)

  socket.on("create-room", function (data) {
    // isinya { roomid: '', playerData }
    // console.log(data.roomid, "ini roomid nya create room");
    roomId = data.roomid;
    activeRooms.push({ roomid: data.roomid, playerOne: data.playerData });
    socket.join(data.roomid);
  });

  socket.on("disconnect", () => {
    // socket.rooms.size === 0
    console.log("Player leave the room");
  });

  socket.on("join-room", function (data) {
    // isinya { roomid: '', playerData }
    console.log(data.roomid, "ini roomid nya joinroom");
    const selectedRoom = activeRooms.find(
      (datum) => datum.roomid === data.roomid
    );
    if (selectedRoom) {
      selectedRoom.playerTwo = data.playerData;
      roomId = selectedRoom.roomid;
      console.log(selectedRoom);
      socket.join(data.roomid);
      io.to(data.roomid).emit("fullroom", { selectedRoom });
    } else {
      roomId = data.roomid;
      activeRooms.push({ roomid: data.roomid, playerOne: data.playerData });
      socket.join(data.roomid);
    }
  });

  socket.on("move", function (data) {
    console.log(data);
    socket.to(data.roomid).emit("enemymove", data); // exclude sender
  });

  socket.on("gameOver", function (data) {
    activeRooms = activeRooms.filter(room => room.roomid !== data.roomid)
    console.log(data);
    socket.to(data.roomid).emit("youlose");
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
    console.log(data, 'calluser triggered')
    socket.to(data.roomid).emit("hey", {
      signal: data.signalData,
      from: data.from,
    });
  });

  socket.on("acceptCall", (data) => {
    console.log(data, 'acceptcall received to server')
    socket.to(data.roomid).emit("callAccepted", data.signal);
  });

  socket.on("sendEmot", (data) => {
    console.log(data, "<<<<<<< CHECK ROOM ID");
    socket.to(roomId).emit("testing", data);
  });
});

server.listen(port, () => console.log("Running on port: ", port));
