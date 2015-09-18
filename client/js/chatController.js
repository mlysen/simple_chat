(function() {
  angular
    .module('myApp')
    .controller('ChatController', ChatController);

    ChatController.$inject = ['$location', 'socketio', '$animate', 'userFactory'];

  function ChatController($location, socketio, $animate, userFactory) {
    var vm = this;

    var MAXIMUM_CHAT_HISTORY = 30,
      chatAnimationDone = false;

    init();

    function init() {
      vm.chatmessages = [];
      vm.users = [];
      vm.clock = "";
      vm.chatVisible = true;
      vm.name = userFactory.getName();

    }

    var addChatMessage = function(message) {
        if (vm.chatmessages.length > MAXIMUM_CHAT_HISTORY) {
          vm.chatmessages.shift();
        }

        // 00:00
        var time = (new Date()).toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric" });

        message = time + ' ' + message;

        vm.chatmessages.push(message);
      },
      updateUserList = function(userList) {
        console.log('updateUserList');
        if (chatAnimationDone) {
          vm.users = userList;
        } else {
          tempUserList = userList;
        }
      };

    vm.showChatWindow = function() {
      chatAnimationDone = true;

      socketio.getUsers(updateUserList);
    }

    vm.sendChatMessage = function(message) {
        vm.chatMessage = "";

        if (message) {
          socketio.sendChatMessage({ user: vm.name, message: message });
        }
    };

    socketio.onNewUser(updateUserList);
    socketio.onUserDisconnect(updateUserList);
    socketio.onChatMessage(addChatMessage);
  }
})();