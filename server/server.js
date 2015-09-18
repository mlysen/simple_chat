var express = require('express'),
    path = require('path'),
    app = express(),
    server = require('http').createServer(app),
    socketio = require('socket.io'),
    socketIOHandler = socketio.listen(server),
    users = {};

app.use('/js', express.static(path.resolve(path.join(__dirname, '/../build/js'))));
app.use('/css', express.static(path.resolve(path.join(__dirname, '/../build/css'))));
app.use('/socket.io', express.static(path.join(__dirname, '/socket.io')));

server.listen('3000', function() {
  console.log('Express ready');
});

app.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname + '/../build/index.html'));
});


socketIOHandler.on('connection', function(socket) {
  console.log('Client connected');

  var userName = "";

  socket.on('newName', function(name, callback) {
    if (users[name]) {
      callback({ success: false, reason: 'Name is already taken'});
    } else {
      userName = name;
      users[name] = { socket: socket };

      socketIOHandler.emit('newUser', Object.keys(users));
      callback({ success: true });
    }
  });

  socket.on('disconnect', function() {
    console.log('Client disconnected');

    if (userName) {
      delete users[userName];
      socketIOHandler.emit('userDisconnected', Object.keys(users));
    }

    userName = null;
  });

  socket.on('chatMessage', function(data) {
    socketIOHandler.emit('chatMessage', data.user + ': ' + data.message);
  });
});