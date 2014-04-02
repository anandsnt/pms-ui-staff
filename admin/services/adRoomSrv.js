admin.service('adRoomSrv',['$q', 'ADBaseWebSrv', function($q, ADBaseWebSrv){
   /*
	* service class for room related operations
	*/

   /*
    * getter method to fetch rooms list
    * @return {object} room list
    */	
	this.fetchRoomList = function(){
		var deferred = $q.defer();
		var url = '/admin/hotel_rooms.json';	
		
		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage){
			console.log('failed');
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
   
   /*
    * setter method for room details
    * @param {object} chain id
    * @return {object} status 
    */
	this.update = function(data){
		var id  = data.id;
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