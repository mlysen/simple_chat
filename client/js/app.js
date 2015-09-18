(function(window) {
  angular
    .module('myApp',
      [
        'ngAnimate'
      ]
  );

  angular
    .module('myApp')
    .run(function($rootScope) {
      // Do initialization stuff.
    }
  );

  angular
    .module('myApp')
    .directive('showChat', function($animate) {
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
    }
  );
})(window);