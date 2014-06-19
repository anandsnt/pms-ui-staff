sntRover.service('RVValidateCheckinSrv',['$http', '$q', 'RVBaseWebSrv', function($http, $q, RVBaseWebSrv){
   
	this.saveGuestEmailPhone = function(data){
		var deferred = $q.defer();
		var url = '/staff/guest_cards/' + data.user_id;
		RVBaseWebSrv.putJSON(url, data.saveData).then(function(data) {
			    deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});	
		return deferred.promise;
	};
	
	
	
	
}]);