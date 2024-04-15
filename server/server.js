const express = require('express');
const app = express();
const http = require('http').createServer(express);
const io = require("socket.io")(http, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
const port = process.env.PORT || 4000;
let players = [];

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
    console.log("Online: " + socket.id);
    if (!players.includes(socket.id)) {
        players.push(socket.id);
    }

        console.log(players.length);

        if (players.length === 1) {
            io.emit('isPlayerA');
    };

    socket.on('draw', function(isPlayerA) {
        io.emit('draw', isPlayerA);
    })

    socket.on('dealCards', function () {
        io.emit('dealCards');
    });

    socket.on('updateEnemy', function(isPlayerA, health, hit) {
        io.emit('updateEnemy', isPlayerA, health, hit);
    })

    socket.on('usersPlaying', function(email) {
        if (players.length === 2) {
            console.log("Received email!");
            io.emit('usersPlaying', email);
        }
    })

    socket.on('cardDropped', function (gameObject, isPlayerA) {
        io.emit('cardDropped', gameObject, isPlayerA);
    });

    //needed if you want Player B to see resource cards of player A
    socket.on('resDropped', function(isPlayerA) {
        io.emit('resDropped', isPlayerA);
    });

    socket.on('buffed', function(isPlayerA) {
        io.emit('buffed',isPlayerA);
    })

    socket.on('debuffed', function(modifier,type, isPlayerA) {
        io.emit('debuffed',modifier, type, isPlayerA);
    } );

    socket.on('razed', function(modifier, isPlayerA) {
        io.emit('razed', modifier, isPlayerA);
    })

    //the event that should trigger when mascot attacks another
    socket.on('mascotAttacked', function(attackPoints, isPlayerA){
        io.emit('mascotAttacked', attackPoints, isPlayerA);
    });

    socket.on('mascotDropped', function(hp, region, isPlayerA){
        io.emit('mascotDropped', hp, region, isPlayerA);
    });

    socket.on('mascotDestroyed', function(isPlayerA){
        io.emit('mascotDestroyed', isPlayerA);
    });

    socket.on('switchTurn', function(turn, isPlayerA){
        io.emit('switchTurn',turn, isPlayerA);
    })

    socket.on('disconnect', function () {
        console.log('A user disconnected: ' + socket.id);
        players = players.filter(player => player !== socket.id);
        console.log(players.length);
    });

    socket.on('queueAdd', function(uuid) {
        console.log('User ' + uuid +  ' is now in queue. Emitting: ' + uuid);
        io.emit('queueAdd', uuid);
    });

    socket.on('queueRemove', function(uuid) {
        console.log('User ' + uuid +  ' is now out of queue');
        io.emit('queueRemove', uuid);
    });

    socket.on('successMatch', function() {
        io.emit('successMatch');
    })
});

http.listen(port, function () {
    var host = http.address().address
    var port = http.address().port
    console.log('Now listening on http://%s:%s' , host, port);
    console.log('Host: ' + host);
    console.log('Port: ' + port);
});