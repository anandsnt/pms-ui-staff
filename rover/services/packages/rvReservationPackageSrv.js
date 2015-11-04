sntRover.service('RVReservationPackageSrv', ['$http', '$q', 'rvBaseWebSrvV2', function($http, $q, RVBaseWebSrvV2) {


	var that = this;
	this.getReservationPackages = function(reservationId) {
		var deferred = $q.defer();

		var url = '/staff/staycards/reservation_addons?reservation_id=' + reservationId;
		RVBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.deleteAddonsFromReservation = function(dataToApi) {
		var deferred = $q.defer();

		var url = 'api/reservations/' + dataToApi.reservationId + '/delete_addons';

		RVBaseWebSrvV2.postJSON(url, dataToApi.postData).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.parseAddonItem = function(item, forAssociated) {
		var addonItem = {};
		addonItem.id = item.id;
		addonItem.isBestSeller = item.bestseller;
		addonItem.category = item.charge_group.name;
		addonItem.title = item.name;
		addonItem.description = item.description;
		addonItem.price = item.amount;
		addonItem.taxes = item.taxes;
		addonItem.stay = "";
		if (item.amount_type !== "") {
			addonItem.stay = item.amount_type.description;
		}
		if (item.post_type !== "") {
			if (addonItem.stay !== "") {
				addonItem.stay += " / " + item.post_type.description;
			} else {
				addonItem.stay = item.post_type.description;
			}
		}
		addonItem.amountType = item.amount_type;
		addonItem.postType = item.post_type;
		addonItem.amountTypeDesc = item.amount_type.description;
		addonItem.postTypeDesc = item.post_type.description;
		if (forAssociated) {
			addonItem.quantity = 1;
			addonItem.is_inclusive = item.is_inclusive;
		}
		addonItem.chargefullweeksonly = item.charge_full_weeks_only;
		return addonItem;
	};

	this.parseRateAddonItem = function(addon) {
		var newAddonToReservation = {};
		newAddonToReservation.id = addon.id;
		newAddonToReservation.quantity = 1;
		newAddonToReservation.title = addon.name;
		newAddonToReservation.totalAmount = (newAddonToReservation.quantity) * (addon.amount);
		newAddonToReservation.price_per_piece = addon.amount;
		newAddonToReservation.amount_type = addon.amount_type.description;
		newAddonToReservation.post_type = addon.post_type.description;
		newAddonToReservation.is_inclusive = !!addon.is_inclusive;
		return newAddonToReservation;
	}



}]);