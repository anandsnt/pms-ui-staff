admin.service('ADReservationToolsSrv', [
    '$q',
    'ADBaseWebSrv',
    'ADBaseWebSrvV2',
    function ( $q, ADBaseWebSrv, ADBaseWebSrvV2) {

        /**
         * Fetch all available jobs
         * @return {Array} An array of objects with 'id', 'job_name' and 'description'
         */
        this.fetchAllJobs = function() {
            var deferred = $q.defer(),
                url      = 'api/schedule_jobs';

            ADBaseWebSrvV2.getJSON(url)
                .then(function(data) {
                    deferred.resolve(data.results);
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
                url      = 'api/schedule_jobs/' + params.id;

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
         * @param  {Object} params Contains the begin/end date and job id
         * @return {Object}        An object with the job's current status
         */
        this.postScheduleJob = function(params) {
            var deferred = $q.defer(),
                url      = 'api/schedule_jobs';

            ADBaseWebSrvV2.postJSON(url, params)
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
        this.checkJobStatus = function(params) {
            var deferred = $q.defer(),
                url      = 'api/schedule_jobs/' + params.id + '/status';

            ADBaseWebSrvV2.getJSON(url)
                .then(function(data) {
                    deferred.resolve(data.job_status);
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });

            return deferred.promise;
        };

        /**
         * To Search Rates
         * @return {Object}
         */
        this.searchRates = function(params) {
            var deferred = $q.defer(),
                url      = '/api/rates/search_rates';

            ADBaseWebSrvV2.getJSON(url, params)
                .then(function(data) {
                    deferred.resolve(data);
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });

            return deferred.promise;
        };

        /**
         * To resync rate task
         * @return {Object}
         */
        this.reSyncRates = function(params) {
            var deferred = $q.defer(),
                url      = 'api/rates/' + params.id + '/sync_rate';

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