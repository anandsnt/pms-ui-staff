admin.service('ADRoomSrv',['$q', 'ADBaseWebSrv', function($q, ADBaseWebSrv){
   /*
	* service class for room related operations
	*/
	var that = this;

    this.roomsArray = {};
    this.roomTypesArray = [];
   /*
    * getter method to fetch rooms list
    * @return {object} room list
    */	
	this.fetchRoomList = function(){
		var deferred = $q.defer();
		var url = '/admin/hotel_rooms.json';	
		if(!isEmptyObject(that.roomsArray)){
			deferred.resolve(that.roomsArray);
		} else {
			ADBaseWebSrv.getJSON(url).then(function(data) {
				that.saveRoomsArray(data);
				deferred.resolve(data);
			},function(errorMessage){
				console.log('failed');
				deferred.reject(errorMessage);
			});
		}
		
		return deferred.promise;
	};
	this.saveRoomsArray = function(data){
		that.roomsArray = data;
	};
   /*
    * getter method for the room details of hotel
    * @return {object} room details
    */
	this.fecthAllRoomDetails = function(data){
		var deferred = $q.defer();
		var url = '/admin/hotel_rooms/new.json';	
		ADBaseWebSrv.getJSON(url).then(function(data) {
			
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

	 /*
    * setter method for room details
    * @return {object} status 
    */
	this.createRoom = function(data){
	
		var updateData = data.updateData;
		var deferred = $q.defer();
		var url = '/admin/hotel_rooms/';
		
		ADBaseWebSrv.postJSON(url,updateData).then(function(data) {
			
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};


   /*
    * getter method for the details of room
    * @param {object} with room id
    * @return {object} room data
    */
	this.roomDetails = function(data){
		var roomId = data.roomId;
		var deferred = $q.defer();
		var url = '/admin/hotel_rooms/'+roomId+'/edit.json';	
		
		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};
	this.saveRoomTypesArray = function(data){
		that.roomTypesArray = data.room_types;
	};
   
   /*
    * setter method for room details
    * @param {object} chain id
    * @return {object} status 
    */
	this.update = function(data){
		var id  = data.room_id;
		var updateData = data.updateData;
		var deferred = $q.defer();
		var url = '/admin/hotel_rooms/'+id;	
		
		ADBaseWebSrv.putJSON(url,updateData).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};
	
	
	this.updateRoomDataOnUpdate = function(roomId, param, updatedValue){
		angular.forEach(that.roomsArray.rooms, function(value, key) {
	     	if(value.id == roomId){
	     		if(param == "room_number"){
	     			value.room_number = updatedValue;
	     		}
	     		if(param == "room_type"){
	     			value.room_type = updatedValue;
	     		}
	     		
	     	}
	    });
	};
	
   /*
    * To add new chain 
    * @param {object} new chain details
    * @return {object} status 
    */
	this.post = function(data){
		var deferred = $q.defer();
		var url = '/admin/hotel_rooms';	
		
		ADBaseWebSrv.postJSON(url,data).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};
}]);