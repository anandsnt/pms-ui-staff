admin.service('ADHotelListSrv',['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv){
	// To fetch hotel list
	this.fetch = function(){
		var deferred = $q.defer();
		var url = '/admin/hotels.json';
		
		ADBaseWebSrv.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
	// To update - toggle ReservationImport
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