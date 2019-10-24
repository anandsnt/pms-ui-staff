sntGuestWeb.service('GwCheckinSrv', [
	'$rootScope',
	'$q',
	'GWBaseWebSrv',
	'GWBaseWebSrv2',
	'GwWebSrv',
	function($rootScope,
		$q,
		GWBaseWebSrv,
		GWBaseWebSrv2,
		GwWebSrv) {

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
		// use dummy data for demo mode
		var url = "";

		if (GwWebSrv.zestwebData.isInZestwebDemoMode) {
			url = '/sample_json/zestweb_v2/ext_checkin_verfication.json';
		}
		else {
			url = '/guest_web/checkin_reservation_search.json';
		} 
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
		// if controller didn't send the url suffix
		if (typeof params.url_suffix === "undefined") {
			params.url_suffix = (typeof GwWebSrv.zestwebData.urlSuffix !== "undefined") ? GwWebSrv.zestwebData.urlSuffix : "";
		}
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
		var url = "";

		if (GwWebSrv.zestwebData.isInZestwebDemoMode) {
			url = '/sample_json/zestweb_v2/room_upgrades.json';
		}
		else {
			url = '/guest_web/upgrade_options.json';
		}
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

		params.application = (typeof GwWebSrv.zestwebData.application !== "undefined") ? GwWebSrv.zestwebData.application : "";
		params.url_suffix = (typeof GwWebSrv.zestwebData.urlSuffix !== "undefined") ? GwWebSrv.zestwebData.urlSuffix : "";
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

		// if controller didn't send the url suffix
		if (typeof params.url_suffix === "undefined") {
			params.url_suffix = (typeof GwWebSrv.zestwebData.urlSuffix !== "undefined") ? GwWebSrv.zestwebData.urlSuffix : "";
		}

		GWBaseWebSrv.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.applyEarlyCheckin = function(params) {
		var deferred = $q.defer();
		var url = '/api/reservations/apply_early_checkin_offer';

		GWBaseWebSrv2.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.postGuestDetails = function(params) {
		var deferred = $q.defer();
		
		if (GwWebSrv.zestwebData.isInZestwebDemoMode) {
			deferred.resolve({});
		} else {
			var url = '/guest_web/guest_details/' + GwWebSrv.zestwebData.reservationID + '.json';

			params.application = (typeof GwWebSrv.zestwebData.application !== "undefined") ? GwWebSrv.zestwebData.application : "";
			GWBaseWebSrv2.putJSON(url, params.data).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
		}
		
		return deferred.promise;
	};

	this.getGuestDetails = function(params) {

		var deferred = $q.defer();
		var url;

		if (GwWebSrv.zestwebData.isInZestwebDemoMode) {
			url = '/sample_json/zestweb_v2/guest_details.json';
		}
		else {
			url = '/guest_web/guest_details/' + params.reservation_id + '.json';
		}

		GWBaseWebSrv2.getJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.fetchCountryList = function() {
		var deferred = $q.defer();
		var url = '/ui/country_list';

		GWBaseWebSrv2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.checkinGuest = function(params) {
		var deferred = $q.defer();
		var url = '/guest_web/checkin.json';

		params.application = (typeof GwWebSrv.zestwebData.application !== "undefined") ? GwWebSrv.zestwebData.application : "";
		params.url_suffix = (typeof GwWebSrv.zestwebData.url_suffix !== "undefined") ? GwWebSrv.zestwebData.url_suffix : "";
		GWBaseWebSrv.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.sampleETAupdationResponse = {
		"early_checkin_on": true,
		"early_checkin_available": true,
		"reservation_in_early_checkin_window": true,
		"checkin_time": " 3:00 PM",
		"last_early_checkin_hour": "12",
		"last_early_checkin_minute": "00",
		"last_early_checkin_primetime": "PM",
		"early_checkin_restrict_hour_for_display": " 2",
		"early_checkin_restrict_hour": "02",
		"early_checkin_restrict_minute": "30",
		"early_checkin_restrict_primetime": "PM",
		"early_checkin_restrict_time": "02:30:00 PM",
		"bypass_early_checkin": false,
		"early_checkin_offer_id": 12,
		"early_checkin_charge": '$30'
	};

	this.getAddonList = function() {

		var deferred = $q.defer();
		var url;

		if (GwWebSrv.zestwebData.isInZestwebDemoMode) {
			url = '/sample_json/zestweb_v2/upsell_addons.json';
		}
		else {
			url = '/api/upsell_addons';
		} 
		var params = {
			'for_zest_web': true,
			'reservation_id': GwWebSrv.zestwebData.reservationID
		};

		params.application = (typeof GwWebSrv.zestwebData.application !== "undefined") ? GwWebSrv.zestwebData.application : "WEB";
		params.url_suffix = (typeof GwWebSrv.zestwebData.urlSuffix !== "undefined") ? GwWebSrv.zestwebData.urlSuffix : "";

		GWBaseWebSrv2.getJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.updateAddon = function(params) {

		var deferred = $q.defer();
		var url = '/api/reservations/update_package';

		params.application = (typeof GwWebSrv.zestwebData.application !== "undefined") ? GwWebSrv.zestwebData.application : "WEB";
		params.url_suffix = (typeof GwWebSrv.zestwebData.urlSuffix !== "undefined") ? GwWebSrv.zestwebData.urlSuffix : "";
		params.id = GwWebSrv.zestwebData.reservationID;

		GWBaseWebSrv2.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.deleteAddon = function(params) {

		var deferred = $q.defer();
		var url = '/api/reservations/delete_package';

		params.id = GwWebSrv.zestwebData.reservationID;
		params.application = (typeof GwWebSrv.zestwebData.application !== "undefined") ? GwWebSrv.zestwebData.application : "WEB";
		params.url_suffix = (typeof GwWebSrv.zestwebData.urlSuffix !== "undefined") ? GwWebSrv.zestwebData.urlSuffix : "";
		GWBaseWebSrv2.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.getExistingAddonsList = function() {

		var deferred = $q.defer();
		var url = '/staff/staycards/reservation_addons';
		var params = {
			'reservation_id': GwWebSrv.zestwebData.reservationID,
			'sync_with_pms': true
		};

		GWBaseWebSrv.getJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.getAddonAdminSettings = function() {
		var deferred = $q.defer();
		var url;

		if (GwWebSrv.zestwebData.isInZestwebDemoMode) {
			url = '/sample_json/zestweb_v2/upsell_addons_setups.json';
		}
		else {
			url = '/api/upsell_addons_setups';
		} 
		var params = {
			'reservation_id': GwWebSrv.zestwebData.reservationID
		};

		GWBaseWebSrv2.getJSON(url, params).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.getlateCheckoutSettings = function() {
		var deferred = $q.defer();
		var url;

		if (GwWebSrv.zestwebData.isInZestwebDemoMode) {
			url = '/sample_json/zestweb_v2/get_late_checkout_setup.json';
		}
		else {
			url = '/admin/hotel/get_late_checkout_setup.json';
		} 

		GWBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

}]);