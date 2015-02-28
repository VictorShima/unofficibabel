angular.module('Socializer').factory('FetchTxtService',function($http) {

    var FetchTxtService = {};

    FetchTxtService.fetch = function ( params, success, error ) {
        return $http({
            method: 'GET',
            url: params.url
        })
        .success(success)
        .error(error);
    };

    return FetchTxtService;

});