angular.module('Socializer').factory('MemoryService',function() {

	var memoryService = {

        originalRequest : {},

        sessions : []

    };

	return memoryService;
});