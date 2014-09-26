admin.service('ADDailyWorkAssignmentSrv', [
    '$q',
    'ADBaseWebSrvV2',
    function($q, ADBaseWebSrvV2) {

    	this.taskType = [];
    	this.taskList = [];
    	this.maidShift = [];

    	/*
    	* To fetch task types
    	* 
    	* @param {object}
    	* @return {object} defer promise
    	*/  
    	this.fetchWorkType = function() {
    	    var deferred = $q.defer(),
    	        url      = 'api/work_types';

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
    	* @param {object}
    	* @return {object} defer promise
    	*/  
    	this.addTaskType = function(item) {
    	    var deferred = $q.defer(),
    	        url      = '';

    	    ADBaseWebSrvV2.getJSON(url, params)
    	        .then(function(data) {
    	            deferred.resolve(data);
    	        }, function(errorMessage) {
    	            deferred.reject(errorMessage);
    	        });

			// temp, delete later
            console.log( this.taskType );
			this.taskType.push(item);
            console.log( this.taskType );
			deferred.resolve(this.taskType);
			// temp, delete later

    	    return deferred.promise;
    	};

        /*
        * To delete a work type
        * 
        * @param {object}
        * @return {object} defer promise
        */  
        this.deleteWorkType = function(params) {
            var deferred = $q.defer(),
                url      = 'api/work_types/' + params.id;

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
        * @param {object}
        * @return {object} defer promise
        */  
        this.putWorkType = function(params) {
            var deferred = $q.defer(),
                url      = 'api/work_types/' + params.id,
                params   = _.omit(params, 'id');

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
        * @param {object}
        * @return {object} defer promise
        */  
        this.postWorkType = function(params) {
            var deferred = $q.defer(),
                url      = 'api/work_types/',
                params   = _.omit(params, 'id');

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
        * @param {object}
        * @return {object} defer promise
        */  
        this.fetchWorkShift = function() {
            var deferred = $q.defer(),
                url      = 'api/shifts/';

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
        * @param {object}
        * @return {object} defer promise
        */  
        this.deleteWorkShift = function(params) {
            var deferred = $q.defer(),
                url      = 'api/shifts/' + params.id;

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
        * @param {object}
        * @return {object} defer promise
        */  
        this.postWorkShift = function(params) {
            var deferred = $q.defer(),
                url      = 'api/shifts/',
                params   = _.omit(params, 'id');

            ADBaseWebSrvV2.postJSON(url, params)
                .then(function(data) {
                    deferred.resolve(data);
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });

            return deferred.promise;
        };







	}
]);