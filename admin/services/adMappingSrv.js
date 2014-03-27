admin.service('ADMappingSrv', ['$http', '$q', 'ADBaseWebSrv',
function($http, $q, ADBaseWebSrv) {

	var _this = this;
	_this.mappingList = "";
	//To fetch mappingList
	this.fetch = function(hotel_id) {
		var deferred = $q.defer();
		var url = "/admin/external_mappings/"+hotel_id+"/new_mappings.json";

		$http.get(url).success(function(response, status) {
			if (response.status == "success") {
				_this.mappingList = response.data;
				deferred.resolve(_this.mappingList);
			} else {
				console.log("error");
			}

		}).error(function(data, status) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
	
	
	

}]); 