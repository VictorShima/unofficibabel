angular.module('Socializer').controller('WaitTranslationController',
    function ($scope, $state, $interval, MemoryService, UnbabelApiService)
    {

        // bind scope values to Memory service
        $scope.originalRequest = MemoryService.originalRequest;
        $scope.sessions = MemoryService.sessions;

        $scope.memory = MemoryService;

        console.log('WaitTranslationController sessions promise: ', $scope.sessions.$promise);
        console.log('WaitTranslationController sessions length: ', $scope.sessions.length);
        console.log('WaitTranslationController originalRequest: ', $scope.originalRequest);
        console.log('WaitTranslationController sessions: ', $scope.sessions);

        //$scope.$watch( 'sessions', function ( newValue, oldValue ) {
        //    MemoryService.sessions = newValue;
        //});

        $scope.$watch( 'memory.sessions', function ( newCollection, oldCollection, scope ) {
            console.log("WaitTranslationController watchCollection MemoryService.sessions CHANGED");
            $scope.sessions = MemoryService.sessions;
        });

        $scope.$watchCollection( 'sessions', function ( newCollection, oldCollection, scope ) {
            console.log('WaitTranslationController WatchCollection scope: ', $scope);
            console.log('WaitTranslationController WatchCollection scope.sessions: ', $scope.sessions);


            // every sessions we are waiting for will create a constant polling
            angular.forEach( $scope.sessions, function (session, i, sessions) {

                console.log('WaitTranslationController WatchCollection scope.sessions[i]: ', i, session );

                if ( _.contains( ['new','translating'], session.status ) ) {
                    session.pollHandle = $interval(

                        // constant polling function
                        function() {
                            console.log('WaitTranslationController Poll Service Start: ', i, session, sessions );

                            UnbabelApiService.getTranslationByUid(
                                { uid: session.uid },
                                // polling success function
                                function ( data, headers ) {
                                    session.status = data.status;
                                    if ( ! _.contains( ['new','translating'], session.status ) ) { // abort polling if we aren't waiting anymore
                                        $interval.cancel(session.pollHandle);
                                    }
                                    if ( _.contains( ['accepted','completed'], session.status ) ) { // fetch translated text from completed jobs
                                        session.translatedText = data.translatedText;
                                    }
                                    console.log('WaitTranslationController Poll Service Success: ', session.uid);
                                },
                                // polling error function
                                function ( data, headers ) {
                                    console.log( 'UnbabelApiService.getTranslationByUid PollingLoop Error: ', data );
                                }
                            );

                        },
                        5000
                    );
                }
            });

        });


        // Destroy all intervals
        $scope.$on('$destroy', function() {
            for ( var i = 0; i < $scope.sessions.length; ++i ) {
                if ( angular.isDefined($scope.sessions[i].pollHandle) ) {
                    $interval.cancel( $scope.sessions[i].pollHandle );
                }
            }
        });







        console.log('WaitTranslationController: ', $scope);

    }
);