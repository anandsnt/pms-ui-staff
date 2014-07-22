sntRover.service('RVSmartBandSrv',['$q', 'BaseWebSrvV2', function($q, BaseWebSrvV2){
		
	this.createSmartBand = function(data){
		var deferred = $q.defer();
		var url = '/api/reservations/' + data.reservationId + '/smartbands';
		BaseWebSrvV2.postJSON(url, data.postData).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;		
	};
	
	


}]);