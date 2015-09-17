(function(window) {
  var app = angular.module('myApp',
    [
      'ngAnimate'
    ]
  );

  app.run(function($rootScope) {
    // Do initialization stuff.
  });

  app.directive('showChat', function($animate) {
    return {
      scope: {
        'showChat': '=',
        'afterShow': '&',
        'afterHide': '&'
      },
      link: function(scope, element) {
        scope.$watch('showChat', function(show, oldShow) {
          if (show) {
            $animate.removeClass(element, 'ng-hide').then(scope.afterShow);
          }
          if (!show) {
            $animate.addClass(element, 'ng-hide').then(scope.afterHide);
          }
        });
      }
    }
  });

  app.controller('ChatController', ['$scope', 'socketio', '$animate', function($scope, socketio, $animate) {

    var MAXIMUM_CHAT_HISTORY = 30,
      chatAnimationDone = false,
      tempUserList;

    $scope.chatmessages = [];
    $scope.users = [];
    $scope.whatsYourName = "Sup, what's your name?";

    var addChatMessage = function(message) {
        if ($scope.chatmessages.length > MAXIMUM_CHAT_HISTORY) {
          $scope.chatmessages.shift();
        }

        $scope.chatmessages.push(message);
      },
      updateUserList = function(userList) {
        console.log(userList);
        if (chatAnimationDone) {
          $scope.users = userList;
        } else {
          tempUserList = userList;
        }
      };


    socketio.on('newUser', function(userList) {
      updateUserList(userList);
    });

    socketio.on('userDisconnected', function(userList) {
      updateUserList(userList);
    });

    socketio.on('chatMessage', function(newMessage) {
      addChatMessage(newMessage);
    });

    $scope.showChatWindow = function() {
      chatAnimationDone = true;

      if (tempUserList) {
        updateUserList(tempUserList);
        tempUserList = null;
      }
    }

    $scope.nameEntered = function(name) {
      // We should hide the name entering information.
      if (!name) {
        $scope.whatsYourName = "Really, you don't have a name? Come on.";
        return;
      }
      socketio.emit('newName', name, function(result) {
        console.log(JSON.stringify(result));
        if (result.success === true) {
          $scope.showEnteringNameDialog = false;
          $scope.chatVisible = true;
        } else {
          $scope.whatsYourName = result.reason;
        }
      });
    };

    $scope.sendChatMessage = function(message) {
        if (message) {
          socketio.emit('chatMessage', { user: $scope.name, message: message });
        }

        $scope.chatMessage = "";
    };

    // Clock
    var updateClock = function() {
      $scope.clock = (new Date()).toLocaleTimeString();
    };

    var timer = setInterval(function() {
      $scope.$apply(updateClock);
    }, 1000);

    updateClock();
  }]).factory('socketio', ['$rootScope', function($rootScope) {
    var socket = io.connect();

    return {
      on: function (eventName, callback) {
        // Pointless to listen to the event without a callback.
        if (callback) {
          socket.on(eventName, function() {
            var args = arguments;
            callback.apply(socket, args);
          });
        }
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function() {
          var args = arguments;
          if (callback) {
            callback.apply(socket, args);
          }
        });
      }
    }
  }]);

})(window);