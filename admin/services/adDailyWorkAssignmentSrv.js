admin.service('ADDailyWorkAssignmentSrv', [
    '$q',
    'ADBaseWebSrvV2',
    function($q, ADBaseWebSrvV2) {

        var self = this;

        /*
         * To fetch task types
         *
         */
        this.fetchWorkType = function() {
            var deferred = $q.defer(),
                url = 'api/work_types';

            ADBaseWebSrvV2.getJSON(url)
                .then(function(data) {
                    // since not avail from server
                    _.each(data.results, function(item) {
                        item.is_system_defined = false;
                    });
                    deferred.resolve(data.results);
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });

            return deferred.promise;
        };

        /*
         * To add new task type
         *
        */
        this.addTaskType = function(item) {
            var deferred = $q.defer(),
                url = '';

            ADBaseWebSrvV2.getJSON(url, params)
                .then(function(data) {
                    deferred.resolve(data);
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });

            // temp, delete later
            this.taskType.push(item);
            deferred.resolve(this.taskType);
            // temp, delete later

            return deferred.promise;
        };

        /*
         * To delete a work type
         *
        */
        this.deleteWorkType = function(params) {
            var deferred = $q.defer(),
                url = 'api/work_types/' + params.id;

            ADBaseWebSrvV2.deleteJSON(url)
                .then(function(data) {
                    deferred.resolve(data);
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });

            return deferred.promise;
        };

        /*
         * To update a work type
         *
         */
        this.putWorkType = function(params) {
            var deferred = $q.defer(),
                url = 'api/work_types/' + params.id,
                params = _.omit(params, 'id');

            ADBaseWebSrvV2.putJSON(url, params)
                .then(function(data) {
                    deferred.resolve(data);
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });

            return deferred.promise;
        };

        /*
         * To add a new work type
         *
         */
        this.postWorkType = function(params) {
            var deferred = $q.defer(),
                url = 'api/work_types/',
                params = _.omit(params, 'id');

            ADBaseWebSrvV2.postJSON(url, params)
                .then(function(data) {
                    deferred.resolve(data);
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });

            return deferred.promise;
        };



        /*
         * To fetch work shifts
         *
         */
        this.fetchWorkShift = function() {
            var deferred = $q.defer(),
                url = 'api/shifts/';

            ADBaseWebSrvV2.getJSON(url)
                .then(function(data) {
                    // since not avail from server
                    _.each(data.results, function(item) {
                        item.is_system_defined = false;
                    });
                    deferred.resolve(data.results);
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });

            return deferred.promise;
        };

        /*
         * To delete a work shift
         *
         */
        this.deleteWorkShift = function(params) {
            var deferred = $q.defer(),
                url = 'api/shifts/' + params.id;

            ADBaseWebSrvV2.deleteJSON(url)
                .then(function(data) {
                    deferred.resolve(data);
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });

            return deferred.promise;
        };

        /*
         * To add a new work shift
         *
         */
        this.postWorkShift = function(params) {
            var deferred = $q.defer(),
                url = 'api/shifts/',
                params = _.omit(params, 'id');

            ADBaseWebSrvV2.postJSON(url, params)
                .then(function(data) {
                    deferred.resolve(data);
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });

            return deferred.promise;
        };

        /*
         * To update a work shift
         *
         */
        this.putWorkShift = function(params) {
            var deferred = $q.defer(),
                url = 'api/shifts/' + params.id,
                params = _.omit(params, 'id');

            ADBaseWebSrvV2.putJSON(url, params)
                .then(function(data) {
                    deferred.resolve(data);
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });

            return deferred.promise;
        };



        /*
         * fetch additional APIs and preserve
         *
         */


        var roomTypesList = [];
        this.fetchRoomTypes = function() {
            var deferred = $q.defer(),
                url = 'api/room_types/';

            if (roomTypesList.length) {
                deferred.resolve(roomTypesList);
            } else {
                ADBaseWebSrvV2.getJSON(url)
                    .then(function(data) {
                        roomTypesList = data.results;
                        deferred.resolve(roomTypesList);
                    }, function(errorMessage) {
                        deferred.reject(errorMessage);
                    });
            }

            return deferred.promise;
        };

        this.resetRoomTypesList = function() {
            roomTypesList = [];
        };

        var resHkStatusList = [];
        this.fetchResHkStatues = function() {
            var deferred = $q.defer(),
                url = '/api/reservation_hk_statuses';

            if (resHkStatusList.length) {
                deferred.resolve(resHkStatusList);
            } else {
                ADBaseWebSrvV2.getJSON(url)
                    .then(function(data) {
                        resHkStatusList = data.reservation_statuses;
                        deferred.resolve(resHkStatusList);
                    }, function(errorMessage) {
                        deferred.reject(errorMessage);
                    });
            }

            return deferred.promise;
        };

        var foStatusList = [];
        this.fetchFoStatues = function() {
            var deferred = $q.defer(),
                url = '/api/front_office_statuses';

            if (foStatusList.length) {
                deferred.resolve(foStatusList);
            } else {
                ADBaseWebSrvV2.getJSON(url)
                    .then(function(data) {
                        foStatusList = data.front_office_statuses;
                        deferred.resolve(foStatusList);
                    }, function(errorMessage) {
                        deferred.reject(errorMessage);
                    });
            }

            return deferred.promise;
        };

        var HkStatusList = [];
        this.fetchHkStatues = function() {
            var deferred = $q.defer(),
                url = '/api/tasks/hk_applicable_statuses'; // CICO-8620 Need to get only valid statuses here

            if (HkStatusList.length) {
                deferred.resolve(HkStatusList);
            } else {
                ADBaseWebSrvV2.getJSON(url)
                    .then(function(data) {
                        HkStatusList = data.hk_applicable_statuses;
                        deferred.resolve(HkStatusList);
                    }, function(errorMessage) {
                        deferred.reject(errorMessage);
                    });
            }

            return deferred.promise;
        };

        /*
         * To fetch task lists
         *
         */
        this.fetchTaskList = function() {
            var deferred = $q.defer(),
                url = 'api/tasks/';

            ADBaseWebSrvV2.getJSON(url)
                .then(function(data) {
                    deferred.resolve(data.results);
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });

            return deferred.promise;
        };

        /*
         * To delete a Task list item
         *
         */
        this.deleteTaskListItem = function(params) {
            var deferred = $q.defer(),
                url = 'api/tasks/' + params.id;

            ADBaseWebSrvV2.deleteJSON(url)
                .then(function(data) {
                    deferred.resolve(data);
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });

            return deferred.promise;
        };

        /*
         * To add a Task list item
         *
         */
        this.postTaskListItem = function(params) {
            var deferred = $q.defer(),
                url = 'api/tasks/';

            ADBaseWebSrvV2.postJSON(url, params)
                .then(function(data) {
                    deferred.resolve(data);
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });

            return deferred.promise;
        };

        /*
         * To update a Task list item
         *
         */
        this.putTaskListItem = function(params) {
            var deferred = $q.defer(),
                url = 'api/tasks/' + params.id,
                params = _.omit(params, 'id');

            ADBaseWebSrvV2.putJSON(url, params)
                .then(function(data) {
                    deferred.resolve(data);
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });

            return deferred.promise;
        };
    }
]);