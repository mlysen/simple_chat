(function() {
  angular
    .module('myApp')
    .factory('socketio', ['$rootScope', socketIOFactory]);

  function socketIOFactory($rootScope) {
    var socket = io.connect(),
      socketio = {};

    socketio.setName = setName;
    socketio.onNewUser = onNewUser;
    socketio.sendChatMessage = sendChatMessage;
    socketio.onChatMessage = onChatMessage;
    socketio.onUserDisconnect = onUserDisconnect;
    socketio.getUsers = getUsers;
    socketio.connect = connect;
    socketio.disconnect = disconnect;

    return socketio;

    function socketEmit(eventName, data, callback) {
      socket.emit(eventName, data, function() {
        var args = arguments;
        if (callback) {
          $rootScope.$apply(function() {
            callback.apply(socket, args);
          });
        }
      });
    }

    function socketOn(eventName, callback) {
      // Pointless to listen to the event without a callback.
      if (callback) {
        socket.on(eventName, function() {
          var args = arguments;
          $rootScope.$apply(function() {
            callback.apply(socket, args);
          });
        });
      }
    }

    function connect() {
      socket = io.connect();
    }

    function disconnect() {
      socket.disconnect();
    }

    function onNewUser(callback) {
      socketOn('newUser', callback);
    }

    function onUserDisconnect(callback) {
      socketOn('userDisconnected', callback);
    }

    function getUsers(callback) {
      socketEmit('getUsers', null, callback);
    }

    function setName(name, callback) {
      socketEmit('setName', name, callback);
    }

    function onChatMessage(callback) {
      socketOn('chatMessage', callback);
    }

    function sendChatMessage(message) {
      socketEmit('chatMessage', message);
    }
  }
})();