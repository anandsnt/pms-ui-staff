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
    	this.fetchTaskType = function() {
    	    var deferred = $q.defer(),
    	        url      = '';

    	    // ADBaseWebSrvV2.getJSON(url, params)
    	    //     .then(function(data) {
    	    //         deferred.resolve(data);
    	    //     }, function(errorMessage) {
    	    //         deferred.reject(errorMessage);
    	    //     });

			// temp, delete later
			this.taskType = [{
				name: 'Daily Cleaning',
				is_system_defined: true,
				activated: true
			}];
			deferred.resolve(this.taskType);
			// temp, delete later

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

    	    // ADBaseWebSrvV2.getJSON(url, params)
    	    //     .then(function(data) {
    	    //         deferred.resolve(data);
    	    //     }, function(errorMessage) {
    	    //         deferred.reject(errorMessage);
    	    //     });

			// temp, delete later
            console.log( this.taskType );
			this.taskType.push(item);
            console.log( this.taskType );
			deferred.resolve(this.taskType);
			// temp, delete later

    	    return deferred.promise;
    	};



    	/*
    	* To fetch task types
    	* 
    	* @param {object}
    	* @return {object} defer promise
    	*/  
    	this.fetchTaskList = function() {
    	    var deferred = $q.defer(),
    	        url      = '';

    	    // ADBaseWebSrvV2.getJSON(url, params)
    	    //     .then(function(data) {
    	    //         deferred.resolve(data);
    	    //     }, function(errorMessage) {
    	    //         deferred.reject(errorMessage);
    	    //     });

			// temp, delete later
			this.taskList = [{
				name: 'Clean Departures',
				task_type: 'Daily Cleaning',
				room_type: 'ALL',
				resv_status: 'ALL',
				fo_status: 'ALL',
				task_completion_time: '03:30',
				task_completion_hk_status: '',
				is_system_defined: true,
			}, {
				name: 'Clean Stayovers',
				task_type: 'Daily Cleaning',
				room_type: 'ALL',
				resv_status: 'ALL',
				fo_status: 'ALL',
				task_completion_time: '03:30',
				task_completion_hk_status: '',
				is_system_defined: true,
			}];
			deferred.resolve(this.taskList);
			// temp, delete later

    	    return deferred.promise;
    	};



    	/*
    	* To fetch task types
    	* 
    	* @param {object}
    	* @return {object} defer promise
    	*/  
    	this.fetchMaidShift = function() {
    	    var deferred = $q.defer(),
    	        url      = '';

    	    // ADBaseWebSrvV2.getJSON(url, params)
    	    //     .then(function(data) {
    	    //         deferred.resolve(data);
    	    //     }, function(errorMessage) {
    	    //         deferred.reject(errorMessage);
    	    //     });

			// temp, delete later
			this.maidShift = [{
				name: 'Full Shift',
				is_system_defined: true,
				duration: '05:30'
			}, {
				name: 'Half Shift',
				is_system_defined: true,
				duration: '03:00'
			}];
			deferred.resolve(this.maidShift);
			// temp, delete later

    	    return deferred.promise;
    	};
	}
]);