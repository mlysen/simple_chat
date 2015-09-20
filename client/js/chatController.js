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
      vm.clock = '';
      vm.chatVisible = true;
      vm.name = userFactory.getName();

    }

    var addChatMessage = function(message) {
        var exceedAmount = 0;

        if (!message) return;

        if (message.shift) {
          vm.chatmessages = vm.chatmessages.concat(message);
        } else {
          vm.chatmessages.push(message);
        }

        if (vm.chatmessages.length > MAXIMUM_CHAT_HISTORY) {
          exceedAmount = vm.chatmessages.length - MAXIMUM_CHAT_HISTORY;
          vm.chatmessages.splice(0, exceedAmount);
        }
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
      socketio.getChatHistory(addChatMessage);
    }

    vm.sendChatMessage = function(message) {
        vm.chatMessage = '';

        if (message) {
          socketio.sendChatMessage({ user: vm.name, message: message });
        }
    };

    socketio.onNewUser(updateUserList);
    socketio.onUserDisconnect(updateUserList);
    socketio.onChatMessage(addChatMessage);
  }
})();
