admin.service('ADAppSrv', ['ADBaseWebSrv', 'ADBaseWebSrvV2', '$q',
	function(ADBaseWebSrv, ADBaseWebSrvV2, $q) {
	
	// varibale to keep header_info.json's output
	var userDetails = null;	    

	this.fetch = function() {
		var url = '/admin/settings/menu_items.json';
		// var url = "ui/show?json_input=zestweb_v2/menuItem.json&format=json";

		return ADBaseWebSrv.getJSON(url);
	};

	this.fetchDashboardConfig = function(uuid) {
		var url = '/admin/dashboard.json';

        if (uuid) {
            url += "?hotel_uuid=" + uuid;
        }

		return ADBaseWebSrvV2.getJSON(url);
	};

	this.redirectToHotel = function(hotel_id) {
		var url = '/admin/hotel_admin/update_current_hotel';
		var data = {"hotel_id": hotel_id};

		return ADBaseWebSrv.postJSON(url, data);
	};

	this.bookMarkItem = function(data) {
		var url = '/admin/user_admin_bookmark';

		return ADBaseWebSrv.postJSON(url, data);
	};
	this.removeBookMarkItem = function(data) {
		var id = data.id,
			url = '/admin/user_admin_bookmark/' + id;

		return ADBaseWebSrv.deleteJSON(url);
	};

	this.fetchHotelBusinessDate = function(data) {
		var url = '/api/business_dates/active';

		return ADBaseWebSrvV2.getJSON(url).then(function(data) {
				return (data.business_date);
			}, function(errorMessage) {
				return (errorMessage);
			});
	};

	this.hotelDetails = {};
	this.fetchHotelDetails = function() {
		var that = this,
			url = '/api/hotel_settings.json';

		return ADBaseWebSrvV2.getJSON(url).then(function(data) {
			that.hotelDetails = data;
			return (that.hotelDetails);
		}, function(errorMessage) {
			return (errorMessage);
		});
	};

    this.getDefaultUUID = function() {
        var deferred = $q.defer();
        var url = '/api/current_user_hotels';

        ADBaseWebSrvV2.getJSON(url).then(function(data) {
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

    this.signOut = function() {
        return ADBaseWebSrvV2.getJSON('/logout');
    };

    /*
  	* To fetch user details
  	* @return {object} user details
  	*/
    this.fetchUserInfo = function() {
        var deferred = $q.defer();
        var url = '/api/rover_header_info.json';

		if (userDetails) {
			deferred.resolve(userDetails);
		} else {
			ADBaseWebSrvV2.getJSON(url).then(function(data) {
				userDetails = data.data;
				deferred.resolve(data.data);
			}, function(data) {
				deferred.reject(data);
			});
		}

        return deferred.promise;
	};
	
	/**
	 * Get cached data of user details
	 */
	this.getUserDetails = function() {
		return userDetails;
	};

}]);
