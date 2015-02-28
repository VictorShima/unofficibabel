angular.module('Socializer').factory('ShimaStoretxtService',function($resource) {

    // $resource(url, [paramDefaults], [actions], options);
    return $resource(
        'http://localhost/shima/unbabel/storetext/index.php',
        { },
        // actions
        {
            // get all possible language pairs
            store : {
                method: 'POST',
                cache: false,
                isArray: false
            },
        }
    );

});