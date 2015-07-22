admin.service('ADReservationToolsSrv', [
    '$q',
    'ADBaseWebSrv',
    'ADBaseWebSrvV2',
    function ( $q, ADBaseWebSrv, ADBaseWebSrvV2) {

        /**
         * All API urls
         * @type {Object}
         */
        this.apis = {
            'ALL_JOBS'     : 'api/schedule_jobs',
            'JOB_DETAILS'  : 'api/schedule_job/',
            'SCHEDULE_JOB' : 'api/schedule_job',
            'JOB_STATUS'   : 'api/schedule_job/status/'
        };

        /**
         * Fetch all available jobs
         * @return {Array} An array of objects with 'id', 'job_name' and 'description'
         */
        this.fetchAllJobs = function() {
            var deferred = $q.defer(),
                url      = this.apis['ALL_JOBS'];

            ADBaseWebSrvV2.getJSON(url)
                .then(function(data) {
                    deferred.resolve(data);
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });

            return deferred.promise;
        };

        /**
         * Fetch the details of one particular job (id)
         * @param  {Object} params Contains the id of the job to be requested
         * @return {Object}        An object with 'job_name', 'description' & 'filters'
         */
        this.fetchJobDetails = function(params) {
            var deferred = $q.defer(),
                url      = this.apis['JOB_DETAILS'] + params.id;

            ADBaseWebSrvV2.getJSON(url)
                .then(function(data) {
                    deferred.resolve(data);
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });

            return deferred.promise;
        };

        /**
         * Post a schedule job
         * @param  {Object} params Contains the begin date 
         * @return {Object}        An object with the job status
         */
        this.postScheduleJob = function(params) {
            var deferred = $q.defer(),
                url      = this.apis['SCHEDULE_JOB'] + params.id;

            ADBaseWebSrvV2.postJSON(url)
                .then(function(data) {
                    deferred.resolve(data);
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });

            return deferred.promise;
        };

        /**
         * Check the current status of job
         * @return {Object} Only the current status of the job
         */
        this.postCheckJobStatus = function() {
            var deferred = $q.defer(),
                url      = this.apis['JOB_STATUS'] + params.id;

            ADBaseWebSrvV2.postJSON(url)
                .then(function(data) {
                    deferred.resolve(data);
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });

            return deferred.promise;
        };
    }
]);