admin.service('ADHotelListSrv',['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv){

	/**
    *   A getter method to return the hotel list
    */
	this.fetch = function(params){
		var deferred = $q.defer();
		var url = '/admin/hotels.json';
		ADBaseWebSrv.getJSON(url,params).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
    *   A post method to update ReservationImport for a hotel
    *   @param {Object} data for the hotel list item details.
    */
	this.postReservationImportToggle = function(data){
		var deferred = $q.defer();
		var url = '/admin/hotels/'+data.hotel_id+'/toggle_res_import_on';

		ADBaseWebSrv.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
}]);