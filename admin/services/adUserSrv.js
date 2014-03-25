admin.service('ADUserSrv',['$http', '$q', function($http, $q){
	
	var _this = this;
	_this.userList = "";
	//To fetch users list
	this.fetch = function(){
		var deferred = $q.defer();
		var url = '/admin/users.json';
		
		$http.get(url).success(function(response, status) {
			if(response.status == "success"){
			    _this.userList = response.data;
			    deferred.resolve(_this.userList);
			}else{
				console.log("error");
			}
			
		}).error(function(data, status) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	//To fetch users list
	this.getUserDetails = function(id){
		var deferred = $q.defer();
		var url = '/admin/users/'+id+'/edit.json';

		
		$http.get(url).success(function(response, status) {
		//	if(response.status == "success"){
			    _this.userDetails = response.user_id;
			    deferred.resolve(_this.userDetails);
			//}else{
				//console.log("error");
			//}
			
		}).error(function(data, status) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};


}]);