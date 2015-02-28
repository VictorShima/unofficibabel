angular.module('Socializer').factory('UnbabelApiService',function($resource) {

    var basePath = 'http://sandbox.unbabel.com/tapi/v2/';

    var baseheaders = {
        'Content-Type': 'application/json',
        'Authorization': 'ApiKey rvs:5a598f929478505895c823917c7f7a985f870cde'
    };

    // $resource(url, [paramDefaults], [actions], options);
	return $resource(
        'http://sandbox.unbabel.com',
        { },
        // actions
        {
            // get all possible language pairs
            getLanguagePairs : {
                method: 'GET',
                url: basePath + 'language_pair/',
                cache: false,
                isArray: true,
                headers: baseheaders,
                transformResponse: function(data, headers) {
                    var output = angular.fromJson(data);
                    return output['objects'];
                }
            },

            // get all possible topics for messages
            getTopics : {
                method: 'GET',
                url: basePath + 'topic/',
                cache: false,
                isArray: true,
                headers: baseheaders,
                transformResponse: function(data, headers) {
                    var output = angular.fromJson(data);
                    return output['objects'];
                }
            },

            // get translation jobs by Uid
            getTranslationByUid : {
                method: 'GET',
                url: basePath + 'translation/:uid/',
                cache: false,
                isArray: false,
                headers: baseheaders
            },

            // get translation jobs by status
            getTranslationsByStatus : {
                method: 'GET',
                url: basePath + 'translation/', // will accept the 'status' query param
                cache: false,
                isArray: true,
                headers: baseheaders,
                transformResponse: function(data, headers) {
                    var output = angular.fromJson(data);
                    return output['objects'];
                }
            },

            // post a new translation job
            postTranslation : {
                method: 'POST',
                url: basePath + 'translation/',
                cache: false,
                isArray: false,
                headers: baseheaders,
            }


        },
        {
            stripTrailingSlashes: false
        }
    );

});