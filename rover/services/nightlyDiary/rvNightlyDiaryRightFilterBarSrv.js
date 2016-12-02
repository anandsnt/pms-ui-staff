angular.module('sntRover').service('RVNightlyDiaryRightFilterBarSrv',
	['$q',
	'BaseWebSrvV2',
	function($q, BaseWebSrvV2){
		var that = this;

		/*
         * To fetch the filter list
         */
		that.fetchFilterList = function(params) {
			var deferred = $q.defer(),
	            url = '/api/nightly_diary/filter_list';
			BaseWebSrvV2.getJSON(url, data).then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
		};
}]);