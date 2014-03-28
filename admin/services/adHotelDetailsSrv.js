admin.service('ADHotelDetailsSrv', ['$http', '$q','ADBaseWebSrv', function($http, $q, ADBaseWebSrv){
	// To fetch data for Add New hotel view
	this.fetchAddData = function(){
		var deferred = $q.defer();
		var url = '/admin/hotels/new.json';	
		
		ADBaseWebSrv.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};	
	// To fetch data for Edit hotel view
	this.fetchEditData = function(data){
		var deferred = $q.defer();
		var url = '/admin/hotels/'+data.id+'/edit.json';	
		
		ADBaseWebSrv.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};	
	// To POST data for Add new hotel
	this.addNewHotelDeatils = function(data){
		var deferred = $q.defer();
		var url = '/admin/hotels';	

		ADBaseWebSrv.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
	// To UPDATE data for edit hotel
	this.updateHotelDeatils = function(data){
		var deferred = $q.defer();
		var url = '/admin/hotels/'+data.id;	

		ADBaseWebSrv.putJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};

}]);