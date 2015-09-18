(function() {
  angular
    .module('myApp')
    .factory('socketio', ['$rootScope', socketIOFactory]);

  function socketIOFactory($rootScope) {
    var socket = io.connect();

    return {
      on: function (eventName, callback) {
        // Pointless to listen to the event without a callback.
        if (callback) {
          socket.on(eventName, function() {
            var args = arguments;
            $rootScope.$apply(function() {
              callback.apply(socket, args);
            });
          });
        }
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function() {
          var args = arguments;
          if (callback) {
            $rootScope.$apply(function() {
              callback.apply(socket, args);
            });
          }
        });
      }
    }
  }
})();