var io = require('socket.io').listen(1337, "0.0.0.0");

var activeClients = 0;
io.sockets.on('connection', function(client){
  activeClients +=1;
  io.sockets.emit('new player', {clients:activeClients})
  client.on('disconnect', function(){clientDisconnect(client)});
  client.on('pushUpdateToServer', function(data){clientUpdate(data)});
});


function clientUpdate(data) {
  io.sockets.emit('pushUpdateToClients', {buffer:data.buffer});
};

function clientDisconnect(client){
  activeClients -=1;
  io.sockets.emit('player left', {clients:activeClients})
};
