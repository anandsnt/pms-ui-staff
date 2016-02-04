admin.service('ADAppSrv',['$http', '$q', 'ADBaseWebSrv','ADBaseWebSrvV2', function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2){

	this.fetch = function(){
		var deferred = $q.defer();
		var url = '/admin/settings/menu_items.json';


		var fetchSuccess = function(data){
            // TODO: Clean this code up
            data.menus.push({
                components: [{
                    action_path: "/admin/reports",
                    icon_class: "icon-admin-menu icon-hotel",
                    id: 99,
                    is_bookmarked: true,
                    is_group: false, 
                    name: "Reports",
                    state: "admin.reports",
                    sub_components: []
                }],
                header_name: "Admin Reports",
                menu_id: 13,
                menu_name: "Reports"
            });
			deferred.resolve(data);
		};
		var fetchFailed = function(data){
			deferred.reject(data);
		};

		ADBaseWebSrv.getJSON(url).then(fetchSuccess, fetchFailed);
		return deferred.promise;
	};

	this.fetchDashboardConfig = function(){
		var deferred = $q.defer();
		var url = '/admin/dashboard.json';


		var fetchSuccess = function(data){
			deferred.resolve(data);
		};
		var fetchFailed = function(data){
			deferred.reject(data);
		};

		ADBaseWebSrvV2.getJSON(url).then(fetchSuccess, fetchFailed);
		return deferred.promise;
	};

	this.redirectToHotel = function(hotel_id){
		var deferred = $q.defer();
		var url = '/admin/hotel_admin/update_current_hotel';

		var fetchSuccess = function(data){
			deferred.resolve(data);
		};
		var fetchFailed = function(data){
			deferred.reject(data);
		};
		var data = {"hotel_id": hotel_id};
		ADBaseWebSrv.postJSON(url, data).then(fetchSuccess, fetchFailed);
		return deferred.promise;

	};

	this.bookMarkItem = function(data){
		var deferred = $q.defer();
		var url = '/admin/user_admin_bookmark';

		var fetchSuccess = function(data){
			deferred.resolve(data);
		};
		var fetchFailed = function(data){
			deferred.reject(data);
		};

		ADBaseWebSrv.postJSON(url, data).then(fetchSuccess, fetchFailed);
		return deferred.promise;
	};
	this.removeBookMarkItem = function(data){
		var id = data.id;
		var deferred = $q.defer();
		var url = '/admin/user_admin_bookmark/'+id;

		var fetchSuccess = function(data){
			deferred.resolve(data);
		};
		var fetchFailed = function(data){
			deferred.reject(data);
		};

		ADBaseWebSrv.deleteJSON(url).then(fetchSuccess, fetchFailed);
		return deferred.promise;
	};

	this.fetchHotelBusinessDate = function(data) {
		var deferred = $q.defer();
		var url = '/api/business_dates/active';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data.business_date);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});

		return deferred.promise;
	};

	this.hotelDetails = {};
	this.fetchHotelDetails = function(){
		var that = this;
		var deferred = $q.defer();

		var url = '/api/hotel_settings.json';
		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			that.hotelDetails = data;
			deferred.resolve(that.hotelDetails);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

}]);