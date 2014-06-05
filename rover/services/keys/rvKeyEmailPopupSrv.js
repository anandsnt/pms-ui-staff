sntRover.service('RVKeyEmailPopupSrv',['$q', 'RVBaseWebSrv', function($q, RVBaseWebSrv){
		
	this.fetchKeyEmailData = function(param){
		
		var deferred = $q.defer();
		var url =  "staff/reservations/" + param.reservation_id + "/get_key_setup_popup";			
		
		RVBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;		
		
	};


}]);