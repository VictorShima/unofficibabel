angular.module('Socializer').controller('SendMessageController',
    function ($scope, $state, $http, MemoryService, UnbabelApiService, FetchTxtService)
    {


        /*
         * Get all translatable languages
         */
        $scope.getSourceLanguages = function ( ) {
            UnbabelApiService.getLanguagePairs({},
                // success
                function ( data, headers ) {
                    $scope.sourceLanguages = [];

                    // extract all language pairs
                    var languages = [];
                    for ( var i = 0; i < data.length; ++i ) {
                        var pair = {
                            label: data[i].lang_pair.source_language.name,
                            value: data[i].lang_pair.source_language.shortname
                        };
                        languages.push(pair);
                    }

                    //for ( i = 0; i < data.length; ++i ) {
                    //    console.log( i + ' : ' + data[i].lang_pair.source_language.shortname + ' => ' + data[i].lang_pair.target_language.shortname );
                    //}

                    // get unique
                    languages.sort( function(a, b) {
                        return a.label.localeCompare( b.label );
                    });
                    languages = languages.filter(function(el,idx,arr) {
                        return ( idx === 0 || arr[idx-1].label !== arr[idx].label );
                    });

                    // fill in source languages
                    $scope.sourceLanguages = languages;

                    console.log('getSourceLanguages Languages: ', languages);
                    console.log('getSourceLanguages Success: ', data, headers());
                },
                // error
                function ( data, headers ) {
                    console.log('getSourceLanguages Error: ', data, headers());
                }
            );
        };


        /*
         * Get all translatable languages and fill in
         */
        $scope.getTranslationPairs = function ( fromLang ) {
            UnbabelApiService.getLanguagePairs({},
                // success
                function ( data, headers ) {

                    // extract all language pairs
                    var languages = [];
                    for ( var i = 0; i < data.length; ++i ) {
                        var pair = {
                            sourceValue: data[i].lang_pair.source_language.shortname,
                            label: data[i].lang_pair.target_language.name,
                            value: data[i].lang_pair.target_language.shortname
                        };
                        languages.push(pair);
                    }

                    // filter out only the ones with selected source language
                    languages = languages.filter( function(el,idx,arr) {
                        return el.shortname === $scope.selectedSourceLanguage.shortname;
                    });

                    // get unique
                    languages.sort( function(a, b) {
                        return a.label.localeCompare( b.label );
                    });
                    languages = languages.filter(function(el,idx,arr) {
                        return ( idx === 0 || arr[idx-1].label !== arr[idx].label );
                    });

                    // fill in target languages
                    $scope.possibleTargetLanguages = languages;

                    console.log('getTranslationLanguages Target Languages: ', languages);

                    console.log('getTranslationLanguages Success: ', data, headers());
                },
                // error
                function ( data, headers ) {
                    console.log('getTranslationLanguages Error: ', data, headers());
                }
            );
        };


        /**
         * Fetch text directly from DropBox
         */
        $scope.loadFromDropbox = function () {

            var options = {
                // files = array( {name,link,bytes,icon,thumbnailLink} )
                success: function( files ) {

                    FetchTxtService.fetch(
                        { url: files[0].link },
                        function ( data, status ) { // success
                            $scope.originalMessage = data;
                            $scope.filename = files[0].name;
                            console.log('SendMessageController LoadFromDropbox Download Content Success: ', data);
                        },
                        function ( data, status ) { // error
                            console.log('SendMessageController LoadFromDropbox Download Content Error: ', data);
                        }
                    );



                    console.log('SendMessageController LoadFromDropbox Load Index Success: ', files);
                },
                cancel: function() { },
                linkType: "direct", // or "direct"
                multiselect: false, // or true
                extensions: ['.txt'],
            };
            /*global Dropbox */
            Dropbox.choose(options);

        };

        /*
         * Submit the form to unbabel
         */
        $scope.submit = function() {

            // form an input bundle with form data
            var input = {};
            input.filename = $scope.filename;
            input.originalMessage = $scope.originalMessage;
            input.sourceLangCode = $scope.selectedSourceLanguage;
            input.targetLangCodes = [];
            for ( var key in $scope.selectedTargetLanguages ) {
                if ( $scope.selectedTargetLanguages[key] ) {
                    input.targetLangCodes.push( key );
                }
            }

            // store in memory
            MemoryService.originalRequest = input;

            // if the form is valid, make requests and go to next stage
            if ( input.originalMessage != null && input.sourceLangCode != null && input.targetLangCodes.length > 0 ) {

                var sendMessageSuccessFunction = function ( data, headers ) {
                    var session = {
                        uid: data.uid,
                        status: data.status,
                        targetLanguageCode: data.target_language,
                    };
                    MemoryService.sessions.push(session);
                };

                var sendMessageErrorFunction = function ( data, headers ) {
                    console.log('postTranslationService Error: ', data, headers());
                };

                // send requests for each target language and store ids
                var targetLangCode;
                for ( var i = 0; i < input.targetLangCodes.length; ++i ) {
                    targetLangCode = input.targetLangCodes[i];

                    // send the translation request
                    UnbabelApiService.postTranslation( {},
                        // post data
                        {
                            text: input.originalMessage,
                            source_language: input.sourceLangCode,
                            target_language: targetLangCode
                        },
                        // success
                        sendMessageSuccessFunction,
                        // error
                        sendMessageErrorFunction
                    );
                }

                $state.go('waittranslation');
            }

            console.log('SendMessageController Form Submit Input: ', input);
        };

        $scope.selectedTargetLanguages = {};


        console.log('SendMessageController: ', $scope);

    }
);