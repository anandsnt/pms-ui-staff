admin.service('ADUserSrv',['$http', '$q', 'ADBaseWebSrv','ADBaseWebSrvV2', function($http, $q, ADBaseWebSrv,ADBaseWebSrvV2){
	
   /**
    * To fetch the list of users
    * @return {object} users list json
    */
	this.fetch = function(){
		
		var deferred = $q.defer();
		var url = '/admin/users.json';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
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

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
   /**
    * To view add new user screen
    * @param {object} id of the clicked hotel
    * @return {object} departments array
    */
	this.getAddNewDetails = function(data){
		var id = data.id;
		var deferred = $q.defer();
		var url = '/admin/users/new.json';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
	/**
    * To update user details 
    * @param {object} data - data to be updated
    * @return {object} 
    */
	this.updateUserDetails = function(data){
		
		var deferred = $q.defer();
		var url = '/admin/users/'+data.user_id;

		ADBaseWebSrv.putJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
		
	};
	/**
    * To add new user details 
    * @param {object} data - data to be added
    * @return {object} 
    */
	this.saveUserDetails = function(data){
		
		var deferred = $q.defer();
		var url = '/admin/users';

		ADBaseWebSrv.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
		
	};
	/**
    * To activate/inactivate user
    * @param {object} data - data to activate/inactivate
    * @return {object} 
    */
	this.activateInactivate = function(data){
		
		var deferred = $q.defer();
		var url = '/admin/users/toggle_activation';

		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
		
	};
	/**
    * To delete user
    * @param {object} data - data to delete
    * @return {object} 
    */
	this.deleteUser = function(data){
		
		var deferred = $q.defer();
		var url = '/admin/users/'+data.id;

		ADBaseWebSrvV2.deleteJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
		
	};
	/**
    * To link existing user
    * @param {object} data - data to link existing user
    * @return {object} 
    */
	this.linkExistingUser = function(data){
		
		var deferred = $q.defer();
		var url = '/admin/users/link_existing';

		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
		
	};
   /**
    * To send invitation mail
    * @param {object} data - user id
    * @return {object}  status
    */
	this.sendInvitation = function(data){
		var deferred = $q.defer();
		var url = '/admin/user/send_invitation';

		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
}]);