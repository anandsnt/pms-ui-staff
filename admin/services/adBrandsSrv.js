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

	this.addRender = function(){

	
		var deferred = $q.defer();

		var url = '/admin/hotel_brands/new.json';	
		
		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
			
		});
		return deferred.promise;
	};

	this.editRender = function(data){

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

		var id  = data.value;
		
		var deferred = $q.defer();
		var url = '/admin/hotel_brands/'+id;	
		
		ADBaseWebSrv.putJSON(url,data).then(function(data) {
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