admin.service('ADUserSrv',['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv){
	
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
	this.getUserDetails = function(data){
		
		var id = data.id;
		var deferred = $q.defer();
		var url = '/admin/users/'+id+'/edit.json';

		
		$http.get(url).success(function(response, status) {
			console.log("=================");
			console.log((response.data));
		//	if(response.status == "success"){
			    _this.userDetails = response.data;
			    deferred.resolve(_this.userDetails);
			//}else{
				//console.log("error");
			//}
			
		}).error(function(data, status) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	this.getAddNewDetails = function(data){
		
		
		var deferred = $q.defer();
		var url = '/admin/users/new.json';

		
		$http.get(url).success(function(response, status) {
			console.log("==========444444444444=======");
			console.log((response.data));
		//	if(response.status == "success"){
			    _this.userDetails = response.data;
			    deferred.resolve(_this.userDetails);
			//}else{
				//console.log("error");
			//}
			
		}).error(function(data, status) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	
	
	this.updateUserDetails = function(data){
		
		var deferred = $q.defer();
		var url = 'admin/users/'+data.user_id;

		ADBaseWebSrv.putJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
		
	};
	this.saveUserDetails = function(data){
		
		var deferred = $q.defer();
		var url = 'admin/users';

		ADBaseWebSrv.postJSON(url, data).then(function(data) {
			console.log('in success');
		    deferred.resolve(data);
		},function(data){
			console.log('in error');
			console.log('sdfd');
			console.log(JSON.stringify(data));
		    deferred.reject(data);
		});	
		return deferred.promise;
		
	};


}]);