admin.service('adCheckinSrv', ['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2) {
/*
* To fetch checkin
* @return {object} checkin details
*/
this.fetch = function() {
	var deferred = $q.defer();
	var url = '/admin/checkin_setups/list_setup.json';

	ADBaseWebSrv.getJSON(url).then(function(data) {
		deferred.resolve(data);
	}, function(data) {
		deferred.reject(data);
	});
	return deferred.promise;
};

/*
* To save checkin
* @param {object} checkin details
*/
this.save = function(data) {
	var deferred = $q.defer();
	var url = '/admin/checkin_setups/save_setup';

	ADBaseWebSrv.postJSON(url, data).then(function(data) {
		deferred.resolve(data);
	}, function(data) {
		deferred.reject(data);
	});
	return deferred.promise;
};


/*
* To get Rate codes
*
*/
this.getRateCodes = function(data) {
	var deferred = $q.defer();
	var url = '/api/rates.json';

	ADBaseWebSrvV2.getJSON(url, data).then(function(data) {
		deferred.resolve(data);
	}, function(data) {
		deferred.reject(data);
	});
	return deferred.promise;
};

/*
* To get block codes
*
*/
this.getBlockCodes = function(data) {
	var deferred = $q.defer();
	var url = '/api/groups.json';

	ADBaseWebSrvV2.getJSON(url, data).then(function(data) {
		deferred.resolve(data);
	}, function(data) {
		deferred.reject(data);
	});
	return deferred.promise;
};


	// for groups
	this.getExcludedBlockCodes = function() {
		var url = '/api/groups/pre_checkin_excluded_block_codes.json';

		return ADBaseWebSrvV2.getJSON(url);
	};

	// for rates
	this.getExcludedRateCodes = function() {
		var url = '/api/rates/pre_checkin_excluded_rate_codes.json';

		return ADBaseWebSrvV2.getJSON(url);
	};

	// for rates
	this.getExcludedRoomTypes = function() {
		var url = '/api/room_types/pre_checkin_excluded_room_types.json';

		return ADBaseWebSrvV2.getJSON(url);
	};
}]);