admin.service('ADRoomClassesSrv',['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){
   /**
    * To fetch the list of users
    * @return {object} users list json
    */

	this.fetch = function () {
        var deferred = $q.defer(),
        url = '/admin/room_classes';
        ADBaseWebSrvV2.getJSON(url).then(function (data) {
            deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
    };

	/*
    * To save new room class
    * @param {array} data of the new room class
    * @return {object} status and new id of room class
    */
	this.saveClassRoom = function(data){
		var deferred = $q.defer();
		var url = 'admin/room_classes';
		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

	/*
    * To get details of a room class
    * @param {id} id of the room class
    * @return {object}  of room class
    */
	this.fetchDetailsOfRoomClass = function (data) {
        var deferred = $q.defer(),
        url = '/admin/room_classes/'+ data.id;
        ADBaseWebSrvV2.getJSON(url).then(function (data) {
            deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
    };
    /*
    * To update the details of a room class
    * @param {Object} id of the room class
    * @return {object}  of room class
    */

    this.updateClassRoom = function(data){
		var deferred = $q.defer();
		var url = ' /admin/room_classes/'+data.id;
		ADBaseWebSrvV2.putJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	/*
    * To delete a room class
    * @param {id} id of the room class
    */

	this.deleteClassRoom = function(id){
		var deferred = $q.defer();
		var url ='admin/room_classes/'+id;
		ADBaseWebSrvV2.deleteJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

  
}]);