angular.module('Socializer').controller('ApiTestController',
    function ($scope, UnbabelApiService)
    {
        $scope.fetchTopics = function () {
            $scope.output = UnbabelApiService.getTopics({},
                // success
                function ( data, headers ) {
                    console.log('FetchTopics Success: ', data, headers());
                },
                // error
                function ( data, headers ) {
                    console.log('FetchTopics Error: ', data, headers());
                }
            );
            console.log('FetchTopics scope: ', $scope.output);
        };


        console.log('ApiTestController: ', $scope);

    }
);