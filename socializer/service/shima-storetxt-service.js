angular.module('Socializer').factory('ShimaStoretxtService',function() {

    // $resource(url, [paramDefaults], [actions], options);
    return $resource(
        'http://localhost/shima/unbabel/StoreTxt/index.php',
        { },
        // actions
        {
            // get all possible language pairs
            getLanguagePairs : {
                method: 'POST',
                cache: false,
                isArray: false
            },
        }
    );

});