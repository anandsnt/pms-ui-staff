angular.module('sntRover').service('RVHotelDetailsSrv', ['$q', 'rvBaseWebSrvV2', function( $q, RVBaseWebSrvV2) {

   	var that = this;

   	this.hotelDetails = {};
   	var business_date = null;

	this.fetchUserHotels = function() {
		var deferred = $q.defer();
		var url = '/api/current_user_hotels';

		RVBaseWebSrvV2.getJSON(url).then(function(data) {
			_.extend(that.hotelDetails, {
				userHotelsData: data
			});
			deferred.resolve(data);
		}, function(errorMessage) {
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

	this.fetchHotelBusinessDate = function() {
		var deferred = $q.defer();
		var url = '/api/business_dates/active';

		RVBaseWebSrvV2.getJSON(url).then(function(data) {
			_.extend(that.hotelDetails, {
				business_date: data.business_date
			});
			business_date = data.business_date;
			deferred.resolve(data);
		}, function(errorMessage) {
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

	this.fetchHotelSettings = function() {
		var deferred = $q.defer();
		var url = '/api/hotel_settings.json';

		RVBaseWebSrvV2.getJSON(url).then(function(data) {
			data.is_auto_change_bussiness_date = data.business_date.is_auto_change_bussiness_date;
			_.extend(that.hotelDetails, data);
			deferred.resolve(data);
		}, function(errorMessage) {
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

	this.fetchHotelDetails = function() {
		var deferred = $q.defer(),
			promises = [that.fetchUserHotels(), that.fetchHotelBusinessDate(), that.fetchHotelSettings()];

		$q.all(promises).then(function(data) {
			// look this.fetchHotelBusinessDate
			// since api/hotelsettings.json is returing a business date key and that is not the buiness date :(
			that.hotelDetails.business_date = business_date;

			deferred.resolve(that.hotelDetails);
		},
		function(errorMessage) {
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

    this.getDefaultUUID = function() {
        var deferred = $q.defer();
        var url = '/api/current_user_hotels';

        RVBaseWebSrvV2.getJSON(url).then(function(data) {
            var hotels = data['hotel_list'];

            if (hotels.length > 0) {
                deferred.resolve(hotels[0].hotel_uuid);
            } else {
                deferred.resolve(null);
            }
        }, function(errorMessage) {
            deferred.reject(errorMessage);
        });

        return deferred.promise;
    };

}]);