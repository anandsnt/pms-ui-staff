(function() {
	var checkinAddonService = function($q, $http, $rootScope) {

		var getAddonList = function() {

			var deferred = $q.defer();
			var url = '/api/upsell_addons';
			var params = {
				'for_zest_web': true,
				'reservation_id': $rootScope.reservationID
			};

			params.application = (typeof $rootScope.application !== "undefined") ? $rootScope.application : "WEB";
			params.url_suffix = (typeof $rootScope.urlSuffix !== "undefined") ? $rootScope.urlSuffix : "";
			$http.get(url, {
					params: params
				}).success(function(response) {
					deferred.resolve(response);
				})
				.error(function() {
					deferred.reject();
				});
			return deferred.promise;
		};

		var updateAddon = function(params) {

			var deferred = $q.defer();
			var url = '/api/reservations/update_package';

			params.application = (typeof $rootScope.application !== "undefined") ? $rootScope.application : "WEB";
			params.url_suffix = (typeof $rootScope.urlSuffix !== "undefined") ? $rootScope.urlSuffix : "";
			params.id = $rootScope.reservationID;
			$http.post(url, params).success(function(response) {
					deferred.resolve(response);
				})
				.error(function() {
					deferred.reject();
				});
			return deferred.promise;
		};

		var deleteAddon = function(params) {

			var deferred = $q.defer();
			var url = '/api/reservations/delete_package';

			params.id = $rootScope.reservationID;
			params.application = (typeof $rootScope.application !== "undefined") ? $rootScope.application : "WEB";
			params.url_suffix = (typeof $rootScope.urlSuffix !== "undefined") ? $rootScope.urlSuffix : "";
			$http.post(url, params).success(function(response) {
					deferred.resolve(response);
				})
				.error(function() {
					deferred.reject();
				});
			return deferred.promise;
		};

		var getExistingAddonsList = function() {

			var deferred = $q.defer();
			var url = '/staff/staycards/reservation_addons';
			var params = {
				'reservation_id': $rootScope.reservationID,
				'sync_with_pms': true
			};
			
			$http.get(url, {
					params: params
				}).success(function(response) {
					if (response.status === 'success') {
						deferred.resolve(response.existing_packages);
					} else {
						deferred.reject();
					}

				})
				.error(function() {
					deferred.reject();
				});
			return deferred.promise;
		};

		var getAddonAdminSettings = function() {
			var deferred = $q.defer();
			var url = '/api/upsell_addons_setups';
			var params = {
				'reservation_id': $rootScope.reservationID
			};
			
			$http.get(url, {
					params: params
				}).success(function(response) {
					deferred.resolve(response);
				})
				.error(function() {
					deferred.reject();
				});
			return deferred.promise;
		};

		var getlateCheckoutSettings = function() {
			var deferred = $q.defer();
			var url = '/admin/hotel/get_late_checkout_setup.json';

			var data = {
				"status": "success",
				"data": {
					"currency_code": "GBP",
					"room_types": [{
						"id": 488,
						"name": "11. 01 up",
						"max_late_checkouts": ""
					}, {
						"id": 489,
						"name": "2. 02 up",
						"max_late_checkouts": 10
					}, {
						"id": 525,
						"name": "10. 00007",
						"max_late_checkouts": ""
					}, {
						"id": 464,
						"name": "123",
						"max_late_checkouts": ""
					}, {
						"id": 315,
						"name": "1. Deluxe King",
						"max_late_checkouts": ""
					}, {
						"id": 663,
						"name": "Testtonos",
						"max_late_checkouts": ""
					}, {
						"id": 147,
						"name": "Zoku Loft XL",
						"max_late_checkouts": ""
					}, {
						"id": 145,
						"name": "Zoku Loft",
						"max_late_checkouts": ""
					}, {
						"id": 144,
						"name": "Zoku Bunk",
						"max_late_checkouts": ""
					}, {
						"id": 150,
						"name": "Zoku Room",
						"max_late_checkouts": ""
					}, {
						"id": 149,
						"name": "Zoku Loft XXL",
						"max_late_checkouts": ""
					}, {
						"id": 469,
						"name": "Double Deluxe",
						"max_late_checkouts": ""
					}, {
						"id": 346,
						"name": "Deluxe Twin",
						"max_late_checkouts": ""
					}, {
						"id": 642,
						"name": "DEMO-SUITE",
						"max_late_checkouts": ""
					}, {
						"id": 596,
						"name": "jamesbond007",
						"max_late_checkouts": ""
					}, {
						"id": 146,
						"name": "Zoku Loft - Wall View",
						"max_late_checkouts": ""
					}, {
						"id": 486,
						"name": "Nicki",
						"max_late_checkouts": ""
					}, {
						"id": 813,
						"name": "New Room Type",
						"max_late_checkouts": ""
					}, {
						"id": 474,
						"name": "OceanView",
						"max_late_checkouts": ""
					}, {
						"id": 148,
						"name": "Zoku Loft XL - Rijksmuseum View",
						"max_late_checkouts": ""
					}, {
						"id": 231,
						"name": "pre-check in room",
						"max_late_checkouts": ""
					}, {
						"id": 664,
						"name": "regression",
						"max_late_checkouts": ""
					}, {
						"id": 665,
						"name": "RegressionRoom",
						"max_late_checkouts": ""
					}, {
						"id": 471,
						"name": "Suite 2",
						"max_late_checkouts": ""
					}, {
						"id": 812,
						"name": "Shiju",
						"max_late_checkouts": ""
					}, {
						"id": 347,
						"name": "Standard Twin",
						"max_late_checkouts": ""
					}, {
						"id": 490,
						"name": "Suite Room 2",
						"max_late_checkouts": ""
					}, {
						"id": 401,
						"name": "Suite Room",
						"max_late_checkouts": ""
					}, {
						"id": 716,
						"name": "Test 567",
						"max_late_checkouts": ""
					}, {
						"id": 524,
						"name": "testingthi",
						"max_late_checkouts": ""
					}, {
						"id": 155,
						"name": "Test Room",
						"max_late_checkouts": ""
					}, {
						"id": 645,
						"name": "xyz",
						"max_late_checkouts": ""
					}],
					"extended_checkout_charge_0": {
						"time": "01",
						"charge": "30.00",
						"addon_id": "125"
					},
					"extended_checkout_charge_1": {
						"time": "02",
						"charge": "45.00",
						"addon_id": "118"
					},
					"extended_checkout_charge_2": {
						"time": "03",
						"charge": "25.00",
						"addon_id": "126"
					},
					"is_sell_late_checkout_as_addon": true,
					"is_allow_additional_late_checkout_offers": true,
					"is_late_checkout_set": "true",
					"allowed_late_checkout": "10000",
					"is_exclude_guests": "false",
					"alert_hour": null,
					"alert_minute": null,
					"selected_charge_code": 8014,
					"selected_charge_code_name": "110 Late chekout"
				},
				"errors": []
			};
			deferred.resolve(data);
			// $http.get(url).success(function(response) {
			// 		if(response.status === 'success'){
			// 			deferred.resolve(response);
			// 		}else{
			// 			deferred.reject();
			// 		}
			// 	})
			// 	.error(function() {
			// 		deferred.reject();
			// 	});
			return deferred.promise;
		};

		return {
			getAddonList: getAddonList,
			updateAddon: updateAddon,
			deleteAddon: deleteAddon,
			getExistingAddonsList: getExistingAddonsList,
			getAddonAdminSettings: getAddonAdminSettings,
			getlateCheckoutSettings: getlateCheckoutSettings
		};
	};

	var dependencies = [
		'$q', '$http', '$rootScope',
		checkinAddonService
	];

	sntGuestWeb.factory('checkinAddonService', dependencies);
})();