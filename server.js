var express = require('express'),
socket = require('socket.io');

var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});


var port = process.env.PORT || 8000;
app.listen(port, function() {
  console.log("Express server listening on port %d", app.address().port);
});


//Socket.io
var io = socket.listen(app);

//Needed for Heroku
//https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

io.on('connection', function(socket){

  socket.on('add', function(message){
    console.log("ID: %s latitude = %d longitude = %d", socket.id,  message.latitude, message.longitude);
    io.sockets.emit("add", {'id': socket.id,  'latitude': message.latitude, 'longitude': message.longitude});
  });
		
	//Remove client from Google Map 
	socket.on('disconnect', function(){
    io.sockets.emit("remove", {'id': socket.id});
	});
	 
});


