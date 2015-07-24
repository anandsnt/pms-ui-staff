admin.service('ADFloorSetupSrv',['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2){
   /**
    * To fetch the list of room types
    * @return {object} room types list json
    */
	this.fetch = function(){

		var deferred = $q.defer();
		var url = '/api/floors.json';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

   /*
    * To update room types data
    * @param {array} data of the modified room type
    * @return {object} status of updated room type
    */
	this.updateFloor = function(data){

		var deferred = $q.defer();
		var url = '/api/floors/save';
		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

	this.deleteFloor = function(data){

		var deferred = $q.defer();
		var url = '/api/floors/'+data.id;
		ADBaseWebSrvV2.deleteJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

   	/*
    * To update room types data
    * @params {object} with query
    */
	this.getUnAssignedRooms = function(params){
		var deferred = $q.defer();
		var data = {
			query: params.query,
			floor_unassigned:true
		};
		var url = '/api/floors/rooms';
		ADBaseWebSrvV2.getJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};


   	/*
    * To update room types data
    * @params {object} with floorID
    */
	this.getFloorDetails = function(params){
		var deferred = $q.defer();
		var floorID = params.floorID;
		var url = '/api/floors/' + floorID + ".json";
		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

}]);
