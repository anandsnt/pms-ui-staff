sntZestStation.service('zsHotelDetailsSrv', ['zsBaseWebSrv2', 'zsBaseWebSrv', '$q', function(ZSBaseWebSrvV2, zsBaseWebSrv, $q) {
	var that = this;

	this.data = {};
	this.hotelDetails = {};
	var business_date = null;
	this.fetchUserHotels = function() {
		var deferred = $q.defer();
		var url = '/api/current_user_hotels';
		ZSBaseWebSrvV2.getJSON(url).then(function(data) {
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
		ZSBaseWebSrvV2.getJSON(url).then(function(data) {
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
		var deferred = $q.defer(),
			url = '/api/hotel_settings.json';

		zsBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.fetchHotelDetails = function() {
		var deferred = $q.defer(),
			promises = [that.fetchUserHotels(), that.fetchHotelBusinessDate(), that.fetchHotelSettings()];
		$q.all(promises).then(function(data) {
				//look this.fetchHotelBusinessDate
				//since api/hotelsettings.json is returing a business date key and that is not the buiness date :(
				that.hotelDetails.business_date = business_date;

				deferred.resolve(that.hotelDetails);
			},
			function(errorMessage) {
				deferred.reject(errorMessage);
			})
		return deferred.promise;
	};

	this.fetchCountryList = function() {
		var deferred = $q.defer(),
			url = '/ui/country_list.json';
		zsBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.fetchTranslationData = function(lang_code) {
		var deferred = $q.defer();
		var url = '/api/locales/' + lang_code + '.json';
		ZSBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(errorMessage) {
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

}]);