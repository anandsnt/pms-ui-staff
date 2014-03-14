hkRover.service('HKRoomDetailsSrv',['$http', '$q', function($http, $q){

	this.fetch = function(id){
		var deferred = $q.defer();
		var url = '/house/room/' + id + '.json';

		$http.get(url).success(function(response, status) {
		    deferred.resolve(response.data);

		}).error(function(response, status) {
		    deferred.reject(response);
		});
		return deferred.promise;
	};

	this.updateHKStatus = function(roomNo, hkStatus){
		var deferred = $q.defer();
		var url = '/house/change_house_keeping_status.json';
		var postData = {'house_keeping_status' : hkStatus, 'room_no': roomNo}

		$http({
            url: url,
            method: "POST",
            data: postData,
        }).success(function (response, status) {
        	console.log("success");
        	deferred.resolve(response.data);
        }).error(function (response, status) {
		    deferred.reject(response);
        });
		return deferred.promise;


	};


}]);
