admin.service('ADUserSrv', ['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', 'ADHotelListSrv',
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


                that.saveUserArray(data);
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
            var updateData = data;

            if (data.isSNTAdmin) {
                url += '?hotel_uuid=' + ADHotelListSrv.getSelectedProperty();
            }

            ADBaseWebSrv.putJSON(url, data).then(function(data) {
                that.updateUserDataOnUpdate(updateData.user_id, "full_name", updateData.first_name + " " + updateData.last_name);
                that.updateUserDataOnUpdate(updateData.user_id, "email", updateData.email);
                that.updateUserDataOnUpdate(updateData.user_id, "department", that.getDepartmentName(updateData.user_department));
                that.updateUserDataOnUpdate(updateData.user_id, "is_active", updateData.is_activated);
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
                "full_name": data.first_name + " " + data.last_name,
                "email": data.email,
                "department": that.getDepartmentName(data.user_department),
                "last_login": "",
                "is_active": "false",
                "can_delete": "true"
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
        /*
         * Saving data to service
         */
        this.saveUserArray = function(data) {
            that.usersArray = data;
            that.departmentsArray = data.departments;
        };
        /*
         * Add new user data to saved data
         */
        this.addToUsersArray = function(newData) {
            that.usersArray.users.push(newData);
        };
        /*
         * To get the department name
         */
        this.getDepartmentName = function(departmentId) {
            var deptName = "";

            angular.forEach(that.departmentsArray, function(value, key) {
                if (value.value === departmentId) {
                    deptName = value.name;
                }
            });
            return deptName;
        };
        this.updateUserDataOnUpdate = function(userId, param, updatedValue) {
            angular.forEach(that.usersArray.users, function(value, key) {
                if (value.id === userId) {
                    if (param === "full_name") {
                        value.full_name = updatedValue;
                    }
                    if (param === "email") {
                        value.email = updatedValue;
                    }
                    if (param === "department") {
                        value.department = updatedValue;
                    }
                    if (param === "is_active") {
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
         * To link existing user
         * @param {object} data - data to link existing user
         * @return {object}
         */
        this.linkExistingUser = function(params) {

            var deferred = $q.defer();
            var url = '/admin/users/link_existing';

            if (params.isSNTAdmin) {
                url += '?hotel_uuid=' + ADHotelListSrv.getSelectedProperty();
            }


            ADBaseWebSrv.postJSON(url, params.data).then(function(data) {
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

        /**
         * To fetch mp hotels list on subscription popup.
         * @param {object} data
         * @return {object}
         */
        this.fetchMPHotelDetails = function(data) {
            var deferred = $q.defer(),
                url = '/admin/multi_properties/subscription_list';

            ADBaseWebSrvV2.getJSON(url, data).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        /**
         * To subascribe/unsubscribe hotels list on subascription popup.
         * @param {object} data
         * @return {object}
         */
        this.subscribeHotel = function(data) {
            var deferred = $q.defer(),
                url = '/admin/multi_properties/subscribe';

            ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        /**
         * To update hotel role.
         * @param {object} data
         * @return {object}
         */
        this.updateHotelRole = function(data) {
            var deferred = $q.defer(),
                url = '/admin/multi_properties/update';

            ADBaseWebSrvV2.putJSON(url, data).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        /**
         * To update default hotel
         * CICO-66189
         */
        this.updateDefaultHotel = function(data) {
            var deferred = $q.defer(),
                url = ' /admin/multi_properties/update_default_hotel';

            ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        /*
         * To update default hotel
         */
        this.updateDefaultHotel = function(data) {
            var deferred = $q.defer(),
                url = ' /admin/multi_properties/update_default_hotel';

            ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


    }]);
