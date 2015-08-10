admin.service('ADUserSrv',['$http', '$q', 'ADBaseWebSrv','ADBaseWebSrvV2', 'ADBaseWebSrv', function( $http, $q, ADBaseWebSrv,ADBaseWebSrvV2, ADBaseWebSrv){


	var that = this;
	this.usersArray = {};
    this.departmentsArray = [];
   /**
    * To fetch the list of users
    * @return {object} users list json
    */

	this.fetch = function(params){

		var deferred = $q.defer();
		var url = '/admin/users.json';
		ADBaseWebSrvV2.getJSON(url ,params).then(function(data) {
				

				that.saveUserArray(data);
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
		var updateData = data;
		ADBaseWebSrv.putJSON(url, data).then(function(data) {
			that.updateUserDataOnUpdate(updateData.user_id, "full_name", updateData.first_name+" "+updateData.last_name);
			that.updateUserDataOnUpdate(updateData.user_id, "email", updateData.email);
			that.updateUserDataOnUpdate(updateData.user_id, "department", that.getDepartmentName(updateData.user_department));
			that.updateUserDataOnUpdate(updateData.user_id, "is_active", updateData.is_activated);
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
		var newDataToArray = {
            "full_name": data.first_name+" "+data.last_name,
            "email": data.email,
            "department": that.getDepartmentName(data.user_department),
            "last_login": "",
            "is_active": "false",
            "can_delete": "true"
		};
		var deferred = $q.defer();
		var url = '/admin/users';

		ADBaseWebSrv.postJSON(url, data).then(function(data) {
			newDataToArray.id = data.user_id;
			that.addToUsersArray(newDataToArray);
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;

	};
	/*
	 * Saving data to service
	 */
	this.saveUserArray = function(data){
		that.usersArray = data;
		that.departmentsArray = data.departments;
	};
	/*
	 * Add new user data to saved data
	 */
	this.addToUsersArray = function(newData){
		that.usersArray.users.push(newData);
	};
	/*
	 * To get the department name
	 */
	this.getDepartmentName = function(departmentId){
		var deptName = "";
		angular.forEach(that.departmentsArray, function(value, key) {
	     	if(value.value === departmentId){
	     		deptName = value.name;
	     	}
	    });
	    return deptName;
	};
	this.updateUserDataOnUpdate = function(userId, param, updatedValue){
		angular.forEach(that.usersArray.users, function(value, key) {
	     	if(value.id === userId){
	     		if(param === "full_name"){
	     			value.full_name = updatedValue;
	     		}
	     		if(param === "email"){
	     			value.email = updatedValue;
	     		}
	     		if(param === "department"){
	     			value.department = updatedValue;
	     		}
	     		if(param === "is_active"){
	     			value.is_active = updatedValue;
	     		}
	     	}
	    });
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
		var itemToRemove = data.index;
		delete data["index"];

		ADBaseWebSrvV2.deleteJSON(url, data).then(function(data) {
			that.usersArray.users.splice(itemToRemove, 1);
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

		ADBaseWebSrv.postJSON(url, data).then(function(data) {
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