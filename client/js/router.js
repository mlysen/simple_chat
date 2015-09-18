(function() {
  angular.
    module('myApp').
    config(Router);

    Router.$inject = ['$routeProvider'];

    function Router($routeProvider) {

      $routeProvider.
        when('/', {
          templateUrl: 'partials/main.html',
          controller: 'MainController',
          controllerAs: 'main'
        }).
        when('/chat', {
          templateUrl: 'partials/chat.html',
          controller: 'ChatController',
          controllerAs: 'chat'
        }).
        otherwise('/');
    }
})();