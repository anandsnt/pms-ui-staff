admin.service('ADCheckinEmailSettingsSrv',['$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function($q, ADBaseWebSrv, ADBaseWebSrvV2){
   /**
    * To fetch the saved account receivable status
    */
	this.fetchSelectedRoomList = function(params){

		var deferred = $q.defer();
		var url = '/api/floors/44.json';

		ADBaseWebSrvV2.getJSON(url,params).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};


	this.fetchUnselectedRoomList = function(params){
		var deferred = $q.defer();
		
		var url = '/api/floors/rooms';

		ADBaseWebSrvV2.getJSON(url,params).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	}
	/**
    * To update the account receivable status
    */
	this.save = function(){

		var deferred = $q.defer();
		var url = ' /api/billing_groups/charge_codes.json';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

}]);