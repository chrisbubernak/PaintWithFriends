var io = require('socket.io').listen(1337, "0.0.0.0");

//keep track of all the drawn shapes...
var shapes = [];

var activeClients = 0;
io.sockets.on('connection', function(client){
  activeClients +=1;
  io.sockets.emit('new player', {clients:activeClients})
  client.on('disconnect', function(){clientDisconnect(client)});


  //push all the shapes to a client
  client.emit('pushUpdateToClients', {shapes:shapes}); 
  
  //when a client hits the clear button clear the points array
  //and then tell all the clients do clear their local whiteboards
  client.on('clear', function() {
	shapes = []
        io.sockets.emit('clearClients');
  });

  //when a client sends us updates save them and push the info to all other clients
  client.on('pushUpdateToServer', function(data){
	shapes.push(data.shape);
	clientUpdate(data)
  });
});


//update all the clients with the new shape
function clientUpdate(data) {
  io.sockets.emit('pushUpdateToClients', {shapes: [data.shape]});
};

function clientDisconnect(client){
  activeClients -=1;
  io.sockets.emit('player left', {clients:activeClients})
};
