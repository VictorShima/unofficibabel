angular.module('Socializer', ['ui.bootstrap','ui.utils','ui.router','ngAnimate','ngResource']);

angular.module('Socializer').config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state( 'newmessage', {
            url: '/new',
            templateUrl: 'template/sendmessage.html'
        })
        .state( 'waittranslation', {
            url: '/distribute',
            templateUrl: 'template/waittranslation.html'
        });

    /* Add New States Above */
    $urlRouterProvider.otherwise('/newmessage');

});


angular.module('Socializer').run(function($rootScope) {

    $rootScope.safeApply = function(fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

});

/*angular.module('Socializer').config(['$resourceProvider', function($resourceProvider) {
  // Don't strip trailing slashes from calculated URLs
  $resourceProvider.defaults.stripTrailingSlashes = false;
}]);*/
