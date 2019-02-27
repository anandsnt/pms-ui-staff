admin.service('ADAdminUserSrv', ['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', 'ADHotelListSrv',
    function( $http, $q, ADBaseWebSrv, ADBaseWebSrvV2, ADHotelListSrv) {


        var that = this;

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
    * To add new user details
    * @param {object} data - data to be added
    * @return {object}
    */
        this.saveUserDetails = function(data) {
            var newDataToArray = {
                'full_name': data.first_name + ' ' + data.last_name,
                'email': data.email,
                'department': that.getDepartmentName(data.user_department),
                'last_login': '',
                'is_active': 'false',
                'can_delete': 'true'
            };
            var deferred = $q.defer();
            var url = '/admin/users';

            if (data.isSNTAdmin) {
                url += '?hotel_uuid=' + ADHotelListSrv.getSelectedProperty();
            }

            ADBaseWebSrv.postJSON(url, data).then(function(data) {
                newDataToArray.id = data.user_id;
                that.addToUsersArray(newDataToArray);
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

            delete data['index'];

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
