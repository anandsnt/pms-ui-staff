admin.service('ADUserSrv',['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv){
	
	var _this = this;
	_this.userList = "";
   /**
    * To fetch the list of users
    * @return {object} users list json
    */
	this.fetch = function(){
		
		var deferred = $q.defer();
		var url = '/admin/users.json';

		ADBaseWebSrv.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
	/**
    * To fetch the details of users
    * @param {object} id of the clicked user
    * @return {object} users details json
    */
	this.getUserDetails = function(data){
		
		var id = data.id;
		var deferred = $q.defer();
		var url = '/admin/users/'+id+'/edit.json';

		ADBaseWebSrv.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
		
		
		
		
		
		
	};
	this.getAddNewDetails = function(data){
		
		
		var id = data.id;
		var deferred = $q.defer();
		var url = '/admin/users/new.json';

		ADBaseWebSrv.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
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