admin.service('ADHotelListSrv',['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv){
	
	var _this = this;
	_this.hotelList = "";
	//To fetch users list
	this.fetch = function(){
		var deferred = $q.defer();
		var url = '/admin/hotels.json';
		
		$http.get(url).success(function(response, status) {
			if(response.status == "success"){
			    _this.hotelList = response.data;
			    deferred.resolve(_this.hotelList);
			}else{
				console.log("error");
			}
			
		}).error(function(data, status) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	//To fetch users list
	
	this.getHotelDetails = function(id){
		var deferred = $q.defer();
		var url = '/admin/hotels/'+id+'/edit.json';

		
		$http.get(url).success(function(response, status) {
		//	if(response.status == "success"){
			    _this.hotelDetails = response.id;
			    deferred.resolve(_this.hotelDetails);
			//}else{
				//console.log("error");
			//}
			
		}).error(function(data, status) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	

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