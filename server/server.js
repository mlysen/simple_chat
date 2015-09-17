var express = require('express'),
    path = require('path'),
    app = express(),
    server = require('http').createServer(app),
    socketio = require('socket.io'),
    socketIOHandler = socketio.listen(server),
    users = {};

app.use('/js', express.static(path.resolve(path.join(__dirname, '/../client/js'))));
app.use('/css', express.static(path.resolve(path.join(__dirname, '/../client/css'))));
app.use('/socket.io', express.static(path.join(__dirname, '/socket.io')));

// No-op for now.
server.listen('3000', function() {
  console.log('Express ready');
});

app.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname + '/../client/index.html'));
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




// Usage of render engine to show html page.
/*
var express = require('express');
var app = express();
var path = require('path');

app.set('views', __dirname + '/../client/');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '../client/')));

app.listen('3000', function() {
  console.log('Express ready');
});

app.get('/', function(req, res) {
  res.render(path.resolve(__dirname + '/../client/index.html'));
});*/

