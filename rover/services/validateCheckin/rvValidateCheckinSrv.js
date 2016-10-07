angular.module('sntRover').service('RVValidateCheckinSrv',['$http', '$q', 'RVBaseWebSrv', 'rvBaseWebSrvV2', function($http, $q, RVBaseWebSrv, rvBaseWebSrvV2){

	this.saveGuestEmailPhone = function(data){
		var deferred = $q.defer();
		var url = '/api/guest_details/' + data.user_id;
		var dataToPost = {
			"email": data.email,
			"guest_id":data.guest_id,
			"phone":data.phone,
			"mobile": data.mobile
		};
		rvBaseWebSrvV2.putJSON(url, dataToPost).then(function(data) {
			    deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});
		return deferred.promise;
	};

	this.getKeyEmailModalData = function(data){

		var deferred = $q.defer();
		var url = "staff/reservations/" + data.reservation_id + "/get_key_setup_popup.json";
		RVBaseWebSrv.getJSON(url).then(function(data) {
			    deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});
		return deferred.promise;
	};


}]);