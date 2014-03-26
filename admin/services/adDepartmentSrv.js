admin.service('ADDepartmentSrv',['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv){

	this.postDepartmentDetails = function(data){

		var deferred = $q.defer();
		var url = '/admin/departments/'+data.value;	

		ADBaseWebSrv.putJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};


}]);