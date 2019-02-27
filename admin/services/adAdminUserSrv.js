admin.service('ADAdminUserSrv', ['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', 'ADHotelListSrv',
	function( $http, $q, ADBaseWebSrv, ADBaseWebSrvV2, ADHotelListSrv) {


	var that = this;

	this.usersArray = {};
    this.departmentsArray = [];
   /**
    * To fetch the list of users
    * @return {object} users list json
    */

	this.fetch = function(params) {
       
		var deferred = $q.defer();
		var url = '/admin/users.json';
		ADBaseWebSrvV2.getJSON(url, params).then(function(data) {
			    deferred.resolve(data);
			}, function(data) {
			    deferred.reject(data);
			});
		return deferred.promise;
	};
	/**
    * To fetch the details of users
    * @param {object} id of the clicked user
    * @return {object} users details json
    */
	this.getUserDetails = function(data) {
		var id = data.id;
		var deferred = $q.defer();
		var url = '/admin/users/' + id + '/edit.json';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};
   /**
    * To view add new user screen
    * @param {object} id of the clicked hotel
    * @return {object} departments array
    */
	this.getAddNewDetails = function(isSNTAdmin) {
		var deferred = $q.defer();
		var url = '/admin/users/new.json';

        if (isSNTAdmin) {
            url += '?hotel_uuid=' + ADHotelListSrv.getSelectedProperty();
        }

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	/**
    * To update user details
    * @param {object} data - data to be updated
    * @return {object}
    */
	this.updateUserDetails = function(data) {

		var deferred = $q.defer();
		var url = '/admin/users/' + data.user_id;
		data.admin_only=true;
		ADBaseWebSrv.putJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;

	};
	/**
    * To add new user details
    * @param {object} data - data to be added
    * @return {object}
    */
	this.saveUserDetails = function(data) {
		var params = {
            "first_name":data.first_name,
            "last_name":data.last_name,
            "job_title":data.job_title,
            "email":data.email,
            "confirm_email":data.confirm_email,
            "password":data.password,
            "confirm_password":data.confirm_password,
            "user_photo":data.user_photo,
            "admin_only": true,
        };
        
		var deferred = $q.defer();
        var url = '/admin/users';
        
		ADBaseWebSrv.postJSON(url, params).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;

	};	

	/**
    * To activate/inactivate user
    * @param {object} data - data to activate/inactivate
    * @return {object}
    */
	this.activateInactivate = function(data) {

		var deferred = $q.defer();
		var url = '/admin/users/toggle_activation';

		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;

	};

	/**
    * To delete user
    * @param {object} data - data to delete
    * @return {object}
    */
	this.deleteUser = function(data) {

		var deferred = $q.defer();
		var url = '/admin/users/' + data.id;
		var itemToRemove = data.index;

		delete data["index"];

		ADBaseWebSrvV2.deleteJSON(url, data).then(function(data) {
			that.usersArray.users.splice(itemToRemove, 1);
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;

	};


   /**
    * To send invitation mail
    * @param {object} data - user id
    * @return {object}  status
    */
	this.sendInvitation = function(data) {
		var deferred = $q.defer();
		var url = '/admin/user/send_invitation';

		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};



}]);