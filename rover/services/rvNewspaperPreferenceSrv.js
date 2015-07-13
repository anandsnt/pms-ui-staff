sntRover.service('RVNewsPaperPreferenceSrv',['$q', 'RVBaseWebSrv', function($q, RVBaseWebSrv){

	this.saveNewspaperPreference = function(params){
		var deferred = $q.defer();
		var url =  '/reservation/add_newspaper_preference';
		RVBaseWebSrv.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;

	};


}]);