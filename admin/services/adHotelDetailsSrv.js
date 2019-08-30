admin.service('ADHotelDetailsSrv', [
    '$http',
    '$q',
    'ADBaseWebSrv',
    'ADBaseWebSrvV2',
    'ADHotelListSrv',
    function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2, ADHotelListSrv) {
	/**
    *   An getter method to add deatils for a new hotel.
    */
   var that = this;

   var hotelDetailsData = {};

   this.currentHotelDetails = {};

	that.fetchAddData = function() {
		var deferred = $q.defer();
		var url = '/admin/hotels/new.json';

		ADBaseWebSrv.getJSON(url).then(function(data) {

		    hotelDetailsData.data = data;
		    that.fetchLanguages(deferred);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};

        that.fetchLanguages = function(deferred) {
            var url = '/admin/locales.json?',
                UUID = ADHotelListSrv.getSelectedProperty();

            if (UUID) {
                url += '&hotel_uuid=' + UUID;
            }

            ADBaseWebSrvV2.getJSON(url).then(function(data) {
                hotelDetailsData.languages = data.locales;
                deferred.resolve(hotelDetailsData);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
	/**
    *   An getter method to edit deatils for an existing hotel for SNT Admin
    *   @param {Object} data - deatils of the hotel with hotel id.
    */
	that.fetchEditData = function(data) {
		var deferred = $q.defer();

		var url = '/admin/hotels/' + data.id + '/edit.json?hotel_uuid=' + ADHotelListSrv.getSelectedProperty();

		ADBaseWebSrv.getJSON(url).then(function(data) {
			hotelDetailsData.data = data;
			that.fetchLanguages(deferred);

		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	/**
    *   An getter method to edit deatils for an existing hotel for Hotel Admin
    *   @param {Object} data - deatils of the hotel with hotel id.
    */
	that.hotelAdminfetchEditData = function(data) {
		var deferred = $q.defer();
		var url = '/admin/hotels/edit.json';

		ADBaseWebSrv.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	/**
    *   An post method to add deatils of a new hotel.
    *   @param {Object} data - deatils of the hotel.
    */
	that.addNewHotelDeatils = function(data) {
		var deferred = $q.defer();
		var url = '/admin/hotels';

		ADBaseWebSrv.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	/**
    *   An update method to edit deatils of a hotel.
    *   @param {Object} data - deatils of a hotel.
    */
	that.updateHotelDeatils = function(data) {
		var deferred = $q.defer();
		var url = '/admin/hotels/' + data.id;

        if (data.isSNTAdmin) {
            url += '?hotel_uuid=' + ADHotelListSrv.getSelectedProperty();
        }


        ADBaseWebSrv.putJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	/**
    *   A post method to test Mli Connectivity for a hotel.
    *   @param {Object} data for Mli Connectivity for the hotel.
    */
	that.testMliConnectivity = function(data) {
		var deferred = $q.defer();
		var url = '/admin/hotels/test_mli_settings';

		url += '?hotel_uuid=' + ADHotelListSrv.getSelectedProperty();

		ADBaseWebSrv.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};

	this.testMLIPaymentGateway = function(data) {
		var deferred = $q.defer();
		var url = 'api/test_mli_payment_gate_way';

		url += '?hotel_uuid=' + ADHotelListSrv.getSelectedProperty();

		ADBaseWebSrvV2.getJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
    *   Method to de-select MP flag from SNT Admin.
    *   @param {Object} data - details of a hotel.
    */
	that.deSelectMPFlag = function(data) {
		var deferred = $q.defer(),
			url = '/admin/hotels/' + data.hotel_id + '/deselect_multi_property';

        ADBaseWebSrvV2.putJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	/*
	 * get the financial legal settings
	 */
	that.getFinancialLegalSettings = function(data) {
		var deferred = $q.defer(),
			url = '/admin/hotels/' + data.hotel_id + '/legal_settings';

        ADBaseWebSrvV2.getJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	/*
	 * update the financial legal settings
	 */
	that.updateFinancialLegalSettings = function(params) {
		var deferred = $q.defer(),
			url = '/admin/hotels/' + params.hotel_id + '/legal_settings';

        ADBaseWebSrvV2.putJSON(url, params.data).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
	 * Get hotel details
	 */
	this.fetchHotelDetails = function () {
		var deferred = $q.defer();
		var url = '/api/hotel_settings.json';

		ADBaseWebSrvV2.getJSON(url).then(function (data) {
			data.is_auto_change_bussiness_date = data.business_date.is_auto_change_bussiness_date;
			_.extend(that.currentHotelDetails, data);
			deferred.resolve(data);
		}, function (errorMessage) {
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};
	
}]);