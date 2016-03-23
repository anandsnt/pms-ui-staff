sntGuestWeb.service('GwCheckinSrv', ['$q', 'GWBaseWebSrv', 'GWBaseWebSrv2', 'GwWebSrv', function($q, GWBaseWebSrv, GWBaseWebSrv2, GwWebSrv) {

	this.checkinData = {};
	this.setcheckinData = function(responseData) {
		this.checkinData = responseData;
	};
	this.getcheckinData = function() {
		return this.checkinData;
	};
	/**
	 * to verify checkin user
	 * @return {undefined}
	 */
	this.findUser = function(params) {
		var deferred = $q.defer();
		params.application = (typeof GwWebSrv.zestwebData.application !== "undefined") ? GwWebSrv.zestwebData.application : "";
		var url = '/guest_web/checkin_reservation_search.json';
		GWBaseWebSrv2.getJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
	 * to generate auth token
	 * @return {undefined}
	 */
	this.generateAuthToken = function(params) {
		var deferred = $q.defer();
		params.application = (typeof GwWebSrv.zestwebData.application !== "undefined") ? GwWebSrv.zestwebData.application : "";
		var url = '/guest_web/authenticate_checkin_guest';
		GWBaseWebSrv2.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
	 * to fetch room upgrades
	 * @return data
	 */

	this.fetchRoomUpgradesDetails = function(params) {
		var deferred = $q.defer();
		var url = '/guest_web/upgrade_options.json';
		GWBaseWebSrv.getJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
	 * to upgrade room
	 * @return {undefined}
	 */
	this.upgradeRoom = function(params) {
		var deferred = $q.defer();
		var url = '/guest_web/upgrade_room.json';
		GWBaseWebSrv2.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.fetchHotelTime = function(params) {
		var deferred = $q.defer();
		var url = '/guest_web/home/fetch_hotel_time.json';
		GWBaseWebSrv2.getJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.updateReservationDetails = function(params) {
		var deferred = $q.defer();
		var url = '/api/reservations/' + params.reservation_id + '/update_stay_details';
		GWBaseWebSrv2.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.completeAutoCheckin = function(params) {
		var deferred = $q.defer();
		var url = '/api/reservations/' + params.reservation_id + '/pre_checkin';
		var data = {};
		data.application = (typeof GwWebSrv.zestwebData.application !== "undefined") ? GwWebSrv.zestwebData.application : "";
		data.url_suffix = (typeof GwWebSrv.zestwebData.urlSuffix !== "undefined") ? GwWebSrv.zestwebData.urlSuffix : "";
		GWBaseWebSrv.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.verifyCheckinUser = function(params) {
		var deferred = $q.defer();
		var url = '/guest_web/search.json';
		GWBaseWebSrv.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

}]);