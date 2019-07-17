angular.module('sntRover').service('RVValidateCheckinSrv', ['$http', 
	'$q', 
	'RVBaseWebSrv', 
	'rvBaseWebSrvV2',
	'$filter',
	function($http, $q, RVBaseWebSrv, rvBaseWebSrvV2, $filter) {

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
			"nationality_id": data.nationality_id,
			"reservation_type_id": data.reservation_type_id,
			"source_id": data.source_id,
			"market_segment_id": data.market_segment_id,
			"booking_origin_id": data.booking_origin_id,
			"segment_id": data.segment_id,
			"job_title": data.job_title,
			"father_name": data.father_name,
			"mother_name": data.mother_name,
			"birth_place": data.birth_place,
			"gender": data.gender,
			"vehicle_registration_number": data.vehicle_registration_number,
			"personal_id_no": data.personal_id_no,
			"home_town": data.home_town,
			"place_of_residence": data.place_of_residence,
			"country_code": data.country_code,
			"birthday": $filter('date')(tzIndependentDate(data.birth_day), "MM-dd-yyyy")
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

			rvBaseWebSrvV2.putJSON(url, dataToPost).then(function(data) {
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
			if (!data.ignoreDemographicsUpdate) {
				return that.updateDemographicsDuringCheckin(data).then(function() {					
				});
			}				 
			
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