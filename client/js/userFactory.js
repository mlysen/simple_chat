(function() {
  angular
    .module('myApp')
    .factory('userFactory', ['$rootScope', userFactory]);

  function userFactory($rootScope) {
    var user = {};

    user.getName = getName;
    user.setName = setName;

    return user;

    function getName() {
      return user.name;
    }

    function setName(name) {
      user.name = name;
    }
  }
})();