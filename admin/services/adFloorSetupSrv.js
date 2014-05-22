admin.service('ADFloorSetupSrv',['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv){
   /**
    * To fetch the list of room types
    * @return {object} room types list json
    */
	this.fetch = function(){
		
		var deferred = $q.defer();
		var url = '/api/floors.json';

		ADBaseWebSrv.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
  
   /*
    * To get the details of the selected room type
    * @param {array} selected room type id
    * @return {object} selected room type details
    */
	this.getRoomTypeDetails = function(data){
		var deferred = $q.defer();
		var id = data.id;
		var url = '/admin/room_types/'+id+'/edit.json';	

		ADBaseWebSrv.getJSON(url).then(function(data) {
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
	this.updateRoomTypes = function(data){

		var deferred = $q.defer();
		var url = '/admin/room_types/'+data.room_type_id;	
		ADBaseWebSrv.putJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
   /*
    * To import room
    * @return {object} status of import
    */
	this.importFromPms = function(){
		var deferred = $q.defer();
		var url = '/admin/rooms/import';	

		ADBaseWebSrv.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
}]);