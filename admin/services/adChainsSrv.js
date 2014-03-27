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



	this.edit = function(data){

	var editID = data.editID;
		
	var deferred = $q.defer();

		var url = '/admin/hotel_chains/'+editID+'/edit.json';	
		
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

		var url = '/admin/hotel_chains/'+id;	
		
		ADBaseWebSrv.putJSON(url,updateData).then(function(data) {
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