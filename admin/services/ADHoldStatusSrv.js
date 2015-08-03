admin.service('ADHoldStatusSrv',['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){
   /**
    * To fetch the list of hold status
    * @return {object} hold statuses json
    */
	this.fetch = function(){
		var deferred = $q.defer();
		var url = '/api/group_hold_statuses';
		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
   /*
    * To save new HoldStatus
    * @param {array} data of the new HoldStatus
    * @return {object} status and new id of new HoldStatus
    */
	this.saveHoldStatus = function(data){
		var deferred = $q.defer();
		var url = '/api/group_hold_statuses';
		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
   /*
    * To update HoldStatus data
    * @param {array} data of the modified HoldStatus
    * @return {object} status of updated HoldStatus
    */
	this.updateHoldStatus = function(data){
		var deferred = $q.defer();
		var url = ' /api/group_hold_statuses/'+data.id;
		ADBaseWebSrvV2.putJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
   /*
    * To delete the seleceted HoldStatus
    * @param {int} id of the selected HoldStatus
    * @return {object} status of delete
    */
	this.deleteHoldStatus = function(id){
		var deferred = $q.defer();
		var url ='/api/group_hold_statuses/'+id;
		ADBaseWebSrvV2.deleteJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
}]);