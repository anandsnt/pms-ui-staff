admin.service('ADGuestCardSrv', ['$q', 'ADBaseWebSrvV2',
function($q, ADBaseWebSrvV2) {
   /*
	* To fetch mandatory fields
	*/
	this.loadGuestCardFields = function(params) {
		var deferred = $q.defer(),
			url = '/admin/guest_card_settings/current_settings';

		ADBaseWebSrvV2.getJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(errorMessage) {
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};
	/*
	* To fetch mandatory fields
	*/
	this.saveGuestCardFields = function(params) {
		var deferred = $q.defer(),
			url = '/admin/guest_card_settings/save';

		ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(errorMessage) {
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};
		
	
}]);