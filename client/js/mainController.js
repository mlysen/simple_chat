(function() {
  
  angular.
    module('myApp').
    controller('MainController', MainController);

    MainController.$inject = ['$location', 'socketio', 'userFactory'];

    function MainController($location, socketio, userFactory) {
      var vm = this;

      vm.whatsYourName = "Sup, what's your name?";

      init();

      function init() {
        console.log('INIT');
        vm.whatsYourName = "Sup, what's your name?";

        // Reconnect socket if we've gone back in history.
        console.log($location.history);
      }

      vm.nameEntered = function(name) {
        // We should hide the name entering information.
        if (!name) {
          vm.whatsYourName = "Really, you don't have a name? Come on.";
          return;
        }

        socketio.setName(name, function(result) {
          if (result.success === true) {
            userFactory.setName(name);
            $location.path('/chat');
            $location.replace();
          } else {
            vm.whatsYourName = result.reason;
          }
        });
      };
    }
})();