var express = require('express'),
    mongoose = require('mongoose'),
    path = require('path'),
    app = express(),
    server = require('http').createServer(app),
    socketio = require('socket.io'),
    socketIOHandler = socketio.listen(server),
    users = {},
    chatMessageSchema,
    chatMessageModel;

// Mongoose Configuration
mongoose.connect('mongodb://localhost/simple_chat');

chatMessageSchema = new mongoose.Schema({
  message: String
});

chatMessageModel = mongoose.model('chat_messages', chatMessageSchema);

// Server Configurations
app.use('/js', express.static(path.resolve(path.join(__dirname, '/../build/js'))));
app.use('/css', express.static(path.resolve(path.join(__dirname, '/../build/css'))));
app.use('/partials', express.static(path.resolve(path.join(__dirname, '/../build/partials'))));
app.use('/socket.io', express.static(path.join(__dirname, '/socket.io')));

server.listen('3000', function() {
  console.log('Express ready');
});

app.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname + '/../build/index.html'));
});

app.get('/db/', function(req, res) {
  mongoose.model('chat_messages').find(function(err, chatMessages) {
    res.send(chatMessages);
  });
});


socketIOHandler.on('connection', function(socket) {
  console.log('Client connected');

  var userName = '';

  socket.on('setName', function(name, callback) {
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

  socket.on('getUsers', function(data, callback) {
    callback(Object.keys(users));
  });

  socket.on('chatMessage', function(data) {
    var chatMessage = data.user + ': ' + data.message,
        mongoDbMessage = new chatMessageModel({
          message: chatMessage
        });

    socketIOHandler.emit('chatMessage', chatMessage);

    mongoDbMessage.save(function(err, product, numberAffected) {
      if (err) console.log('DB ERR: ' + err);
      console.log('DB save successful');
    });    
  });

  socket.on('getChatHistory', function(data, callback) {
    getChatHistory().then(function(messages) {
      callback(messages);
    }).error(function() {
      callback([]);
    });
  });

  function getChatHistory(socket) {
    var messages;

    return mongoose.model('chat_messages').find().then(function(chatMessages) {
      messages = chatMessages.map(function(obj) {
        return obj.message;
      })

      console.log(messages);

      return messages;
    }).error(function() {
      console.log('Error retreiving chat_messages');
    });
  }
});