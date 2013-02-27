var io = require('socket.io').listen(1337, "0.0.0.0");

//keep track of all the drawn points...
var points = [];

var activeClients = 0;
io.sockets.on('connection', function(client){
  activeClients +=1;
  io.sockets.emit('new player', {clients:activeClients})
  client.on('disconnect', function(){clientDisconnect(client)});
  client.emit('pushUpdateToClient', {points:points}); 

  //when a client sends us updates save them and push the info to all other clients
  client.on('pushUpdateToServer', function(data){
	for (var b in data.buffer) {
		points.push({color:data.color, x:data.buffer[b].x, y:data.buffer[b].y});
	}
	clientUpdate(data)
  });
});

function clear() {
  points = [];
}

function clientUpdate(data) {
  io.sockets.emit('pushUpdateToClients', {buffer:data.buffer, color: data.color});
};

function clientDisconnect(client){
  activeClients -=1;
  io.sockets.emit('player left', {clients:activeClients})
};
