sntRover.service('RVHkRoomDetailsSrv', [
	'RVBaseWebSrv',
	'$q',
	function(RVBaseWebSrv, $q) {

		this.fetch = function(id){
			var deferred = $q.defer();
			var url = '/house/room/' + id + '.json';
			RVBaseWebSrv.getJSON(url).then(function(response) {
				deferred.resolve(response);
			},
			function(errorMessage){
				deferred.reject(errorMessage);
			});
			return deferred.promise;
		};

		this.updateHKStatus = function( params){
			var roomNo = params.roomNo;
			var hkStatusId = params.hkstatusId;
			var deferred = $q.defer();
			var url = '/house/change_house_keeping_status.json';
			var postData = {'hkstatus_id' : hkStatusId, 'room_no': roomNo}
			RVBaseWebSrv.postJSON(url, postData).then(function(response) {
				deferred.resolve(response.data);
			},
			function(errorMessage){
				deferred.reject(errorMessage);
			});
			return deferred.promise;
		};
	}
]);
