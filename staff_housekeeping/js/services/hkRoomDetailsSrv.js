hkRover.service('HKRoomDetailsSrv',['$http', '$q', function($http, $q){

	this.fetch = function(id){
		var deferred = $q.defer();
		var url = '/house/room/' + id + '.json';

		$http.get(url).success(function(response, status) {
			if(response.status == "success"){
		    	deferred.resolve(response.data);
		    }else{
		    	console.log("error");
		    }

		}).error(function(response, status) {
		    deferred.reject(response);
		});
		return deferred.promise;
	};

	this.updateHKStatus = function(roomNo, hkStatusId){
		var deferred = $q.defer();
		var url = '/house/change_house_keeping_status.json';
		var postData = {'hkstatus_id' : hkStatusId, 'room_no': roomNo}

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
