admin.service('adChainsSrv',['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv){



		
	this.fetch = function(){

		
	var deferred = $q.defer();
		var url = '/admin/hotel_chains.json';	
		
		ADBaseWebSrv.getJSON(url).then(function(data) {
				deferred.resolve(data);
			},function(data){
			deferred.reject(data);
			
			});
		return deferred.promise;
	};



	this.edit = function(index){
		
	var deferred = $q.defer();

		var url = '/admin/hotel_chains/'+index+'/edit.json';	
		
		ADBaseWebSrv.getJSON(url).then(function(data) {
				deferred.resolve(data);
			},function(data){
			deferred.reject(data);
			
			});
		return deferred.promise;
	};



	this.update = function(index,data){
		
	var deferred = $q.defer();

		var url = '/admin/hotel_chains/'+index;	
		
		ADBaseWebSrv.putJSON(url,data).then(function(data) {
				deferred.resolve(data);
			},function(data){
			deferred.reject(data);
			
			});
		return deferred.promise;
	};

	this.post = function(data){
		
	var deferred = $q.defer();

		var url = '/admin/hotel_chains';	
		
		ADBaseWebSrv.postJSON(url,data).then(function(data) {
				deferred.resolve(data);
			},function(data){
			deferred.reject(data);
			
			});
		return deferred.promise;
	};



}]);