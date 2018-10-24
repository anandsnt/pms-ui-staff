angular.module('sntRover').service('RVValidateCheckinSrv', ['$http', '$q', 'RVBaseWebSrv', 'rvBaseWebSrvV2', function($http, $q, RVBaseWebSrv, rvBaseWebSrvV2) {

	var that = this;

	/*
	 * Update guest details
	 * @param data - data to save
	 */
	this.updateGuestDetailsDuringCheckin = function(data) {
		var deferred = $q.defer();
		var url = '/api/guest_details/' + data.user_id;
		var dataToPost = {
			"email": data.email,
			"guest_id": data.guest_id,
			"phone": data.phone,
			"mobile": data.mobile,
			"nationality_id": data.nationality_id
		};
		
		dataToPost.address = {};
		if (data.address) {
			dataToPost.address.country_id = data.address.country_id;
		}	

		rvBaseWebSrvV2.putJSON(url, dataToPost).then(function(data) {
			    deferred.resolve(data);
			}, function(data) {
			    deferred.reject(data);
			});
		return deferred.promise;
	};

	/*
	 * Update demographics
	 * @param data - data to save
	 */
	this.updateDemographicsDuringCheckin = function(data) {
		var deferred = $q.defer();
            var url = '/api/reservations/' + data.reservationId;

            var dataToPost = {
				'reservationId': data.reservationId,
				"reservation_type_id": data.reservation_type_id,
				"source_id": data.source_id,
				"market_segment_id": data.market_segment_id,
				"booking_origin_id": data.booking_origin_id,
				"segment_id": data.segment_id
			};

            rvBaseWebSrvV2.putJSON(url, data).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            
		return deferred.promise;
	};

	this.saveGuestDataAndReservationDemographics = function(data) {
		var deferred = $q.defer();
                
        $q.when().then(function() {
            return that.updateGuestDetailsDuringCheckin(data).then(function() {
            });
        })
        .then(function() {                 
            return that.updateDemographicsDuringCheckin(data).then(function() {                    
            });
        })            
        .then(function() {
            deferred.resolve(data);
        }, function(errorMessage) {
            deferred.reject(errorMessage);
        });

        return deferred.promise;
	};

	this.getKeyEmailModalData = function(data) {

		var deferred = $q.defer();
		var url = "staff/reservations/" + data.reservation_id + "/get_key_setup_popup.json";

		RVBaseWebSrv.getJSON(url).then(function(data) {
			    deferred.resolve(data);
			}, function(data) {
			    deferred.reject(data);
			});
		return deferred.promise;
	};


}]);