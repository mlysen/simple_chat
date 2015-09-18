(function() {
  angular
    .module('myApp')
    .controller('ChatController', ChatController);

    ChatController.$inject = ['socketio', '$animate'];

  function ChatController(socketio, $animate) {
    var vm = this;

    var MAXIMUM_CHAT_HISTORY = 30,
      chatAnimationDone = false,
      tempUserList;

    vm.chatmessages = [];
    vm.users = [];
    vm.whatsYourName = "Sup, what's your name?";
    vm.clock = "";

    var addChatMessage = function(message) {
        if (vm.chatmessages.length > MAXIMUM_CHAT_HISTORY) {
          vm.chatmessages.shift();
        }

        vm.chatmessages.push(message);
      },
      updateUserList = function(userList) {
        if (chatAnimationDone) {
          vm.users = userList;
        } else {
          tempUserList = userList;
        }
      };

    vm.showChatWindow = function() {
      chatAnimationDone = true;

      if (tempUserList) {
        updateUserList(tempUserList);
        tempUserList = null;
      }
    }

    vm.nameEntered = function(name) {
      // We should hide the name entering information.
      if (!name) {
        vm.whatsYourName = "Really, you don't have a name? Come on.";
        return;
      }
      socketio.emit('newName', name, function(result) {
        if (result.success === true) {
          vm.showEnteringNameDialog = false;
          vm.chatVisible = true;
        } else {
          vm.whatsYourName = result.reason;
        }
      });
    };

    vm.sendChatMessage = function(message) {
        vm.chatMessage = "";

        if (message) {
          socketio.emit('chatMessage', { user: vm.name, message: message });
        }
    };

    socketio.on('newUser', function(userList) {
      updateUserList(userList);
    });

    socketio.on('userDisconnected', function(userList) {
      updateUserList(userList);
    });

    socketio.on('chatMessage', function(message) {
      addChatMessage(message);
    });

    // Clock
    var updateClock = function() {
      vm.clock = (new Date()).toLocaleTimeString();
    };

    var timer = setInterval(function() {
      updateClock(vm);
    }, 1000);

    updateClock();
  }
})();