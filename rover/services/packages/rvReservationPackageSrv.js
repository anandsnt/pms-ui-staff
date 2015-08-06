sntRover.service('RVReservationPackageSrv',['$http', '$q', 'rvBaseWebSrvV2', function($http, $q, RVBaseWebSrvV2){


	var that = this;
	this.getReservationPackages = function(reservationId){
		var deferred = $q.defer();
		//var url = '/sample_json/packages/reservationPackages.json';
		var url = '/staff/staycards/reservation_addons?reservation_id='+reservationId;
		RVBaseWebSrvV2.getJSON(url).then(function(data) {
			    deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});
		return deferred.promise;
	};

	this.deleteAddonsFromReservation = function(dataToApi){
		var deferred = $q.defer();
		//var url = '/sample_json/packages/reservationPackages.json';
		var url = 'api/reservations/'+dataToApi.reservationId+'/delete_addons';

		RVBaseWebSrvV2.postJSON(url, dataToApi.postData).then(function(data) {
			    deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});
		return deferred.promise;

	}



}]);