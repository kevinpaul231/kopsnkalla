// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');var app = express();
var server = http.Server(app);
var io = socketIO(server);app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, '/static/index.html'));
});

app.get('/how', function(request, response) {
  response.sendFile(path.join(__dirname, '/static/howto.html'));
});
app.get('/about', function(request, response) {
  response.sendFile(path.join(__dirname, '/static/about.html'));
});
app.get('/play/game', function(request, response) {
  response.sendFile(path.join(__dirname, '/static/game.html'));
});// Starts the server.
app.get('/players', function(request, response) {
  response.json(players);
});
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

// Add the WebSocket handlers

/*
setInterval(function() {
  io.sockets.emit('message', 'hi!');
}, 1000);
*/


var players = {};
io.on('connection', function(socket) {
  socket.on('new player', function(data) {
    players[socket.id] = {
      x: 0,
      y: 0,
     username: data.username,
     playerType:data.playerType,
     oppID:"",
     timestamp:0
    };
    console.log("Player Joined: ");
    console.log(players[socket.id]);
  });
  socket.on('disconnect', function(){
    console.log("Deleted " + socket.id);
    delete players[socket.id];
  });
  socket.on('kopMouse', function(data){
    player = players[socket.id] || {};
    opp = players[player.oppID] || {};
    var distance = Math.sqrt((Math.pow((data[0]-opp.x),2) + Math.pow((data[1]-opp.y),2)))
    io.to(socket.id).emit('kopMouse',distance);
  });

  socket.on('search', function(){
    var player = players[socket.id] || {};
    console.log("Searching Opponent for: " + player.username + "(" + socket.id + ")" )
    for (var opp_id in players){
      if (socket.id != opp_id){
        var opp = players[opp_id] || {};
        if(player.playerType != opp.playerType && opp.oppID == "" && player.oppID == ""){
          player.oppID = opp_id;
          opp.oppID = socket.id;
          var t = new Date().getTime();
          player.timestamp = t;
          opp.timestamp = t;
          io.to(socket.id).emit('search',opp.username);
          io.to(opp_id).emit('search',player.username);
          console.log("Match Found: ");
          console.log(player);
          console.log('vs');
          console.log(opp);
        }
      }
    }
  });
  socket.on('play', function(data){
    var player = players[socket.id] || {};
    var opp = players[player.oppID] || {};
    player.x = data[0];
    player.y = data[1];
    if(player.x == opp.x && player.y == opp.y){
      io.to(socket.id).emit('finish', (player.playerType == "kop" ? "Win" : "Lose"))
      io.to(player.oppID).emit('finish', (opp.playerType == "kop" ? "Win" : "Lose"))

    }
    else{
      var distance = Math.sqrt((Math.pow((player.x-opp.x),2) + Math.pow((player.y-opp.y),2)))
      io.to(player.oppID).emit('move', distance);
      io.to(socket.id).emit('move',distance);
    }
  });
  socket.on('click', function(data) {
    var player = players[socket.id] || {};
    player.x = data.x;
    player.y = data.y;
    console.log("Player " + socket.id + "Sent: " + player.x + " " + player.y)
  });
});
setInterval(function(){
  for(var player in players){
    if(players[player].timestamp){
      var tNow = new Date().getTime();
      var tBefore = players[player].timestamp + 200000;
      if(tBefore<tNow){
        io.to(player).emit('finish', (players[player].playerType == "kalla" ? "Win" : "Lose"));
      }
    }
  }
},1000);
/*
setInterval(function() {
  //io.sockets.emit('state', players);
  for (var player in players){
    io.to(player).emit('state',players[player])
  }
}, 1000);
*/