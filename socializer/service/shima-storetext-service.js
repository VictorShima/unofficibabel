angular.module('Socializer').factory('ShimaStoretextService',function($resource) {

    // $resource(url, [paramDefaults], [actions], options);
    return $resource(
        'http://victorshima.com/storetext/index.php',
        { },
        // actions
        {
            // get all possible language pairs
            store : {
                method: 'POST',
                cache: false,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                isArray: false
            },
        }
    );

});