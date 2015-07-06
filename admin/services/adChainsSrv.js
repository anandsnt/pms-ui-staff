admin.service('adChainsSrv',['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv){
   /*
    * To fetch chains list
    * @return {object} chains list
    */
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
   /*
    * To get the details of the chain
    * @param {object} chain id
    * @return {object} chain data
    */
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
   /*
    * To update the chain details
    * @param {object} chain id
    * @return {object} status
    */
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
   /*
    * To add new chain
    * @param {object} new chain details
    * @return {object} status
    */
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