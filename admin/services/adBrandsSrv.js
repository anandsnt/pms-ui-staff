admin.service('adBrandsSrv',['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv){
	this.fetch = function(){
	
		var deferred = $q.defer();
		var url = '/admin/hotel_brands.json';	
		
		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
			
		});
		return deferred.promise;
	};	

	this.edit = function(data){

		var editID = data.editID;
		
		var deferred = $q.defer();

		var url = '/admin/hotel_brands/'+editID+'/edit.json';	
		
		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
			
		});
		return deferred.promise;
	};

	this.update = function(data){

		var id  = data.id;
		var updateData = data.updateData;
		var deferred = $q.defer();
		var url = '/admin/hotel_brands/'+id;	
		
		ADBaseWebSrv.putJSON(url,updateData).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
			
		});
		return deferred.promise;
	};

	this.post = function(data){
		
		var deferred = $q.defer();
		var url = '/admin/hotel_brands';	
		
		ADBaseWebSrv.postJSON(url,data).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
			
		});
		return deferred.promise;
	};
}]);