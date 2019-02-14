admin.service('ADCoTaMandatorySrv', ['$q', 'ADGuestCardSrv',
function($q, ADGuestCardSrv) {
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
	this.saveCoTaMandatoryFields = function(params) {
		var deferred = $q.defer(),
			url = '/admin/co_ta_settings/save_mandatory';

		ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(errorMessage) {
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};
		
	
}]);