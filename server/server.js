const express = require('express');
const app = express();
const http = require('http').createServer(express);
const io = require("socket.io")(http, {
    cors: {
      origin: "http://localhost:8080",
      methods: ["GET", "POST"]
    }
  });
let players = [];

app.use(express.static(__dirname + './public'));

io.on('connection', function (socket) {
    console.log('A user connected: ' + socket.id);

    players.push(socket.id);

    if (players.length === 1) {
        io.emit('isPlayerA');
    };

    socket.on('dealCards', function () {
        io.emit('dealCards');
    });

    socket.on('cardDropped', function (gameObject, isPlayerA) {
        io.emit('cardDropped', gameObject, isPlayerA);
    });

    //needed if you want Player B to see resource cards of player A
    socket.on('resDropped', function(gameObject, isPlayerA) {
        io.emit('resDropped', gameObject, isPlayerA);
    });

    socket.on('debuffed', function(modifier, isPlayerA) {
        io.emit('debuffed',modifier, isPlayerA);
    } );

    socket.on('razed', function(modifier, isPlayerA) {
        io.emit('razed', modifier, isPlayerA);
    })

    //the event that should trigger when mascot attacks another
    socket.on('mascotAttacked', function(gameObject, isPlayerA){
        io.emit('mascotAttacked', gameObject, isPlayerA);
    });

    socket.on('mascotDropped', function(hp, isPlayerA){
        io.emit('mascotDropped', hp);
    });

    socket.on('mascotDestroyed', function(isPlayerA){
        io.emit('mascotDestroyed', isPlayerA);
    });

    socket.on('disconnect', function () {
        console.log('A user disconnected: ' + socket.id);
        players = players.filter(player => player !== socket.id);
    });
});

http.listen(3000, function () {
    console.log('Server started!');
});