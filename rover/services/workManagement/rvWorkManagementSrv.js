sntRover.service('RVWorkManagementSrv', ['$q', 'rvBaseWebSrvV2',
	function($q, RVBaseWebSrvV2) {
		//Meta Data for Work Management
		// 1. Maids
		// 2. WorkTypes
		// 3. Shifts



		this.fetchMaids = function() {
			var deferred = $q.defer();
			var url = 'api/work_statistics/employees_list';
			RVBaseWebSrvV2.getJSON(url).then(function(data) {
				_.each(data.results, function(d) {
					d.ticked = false;
					d.checkboxDisabled = false;
				});
				deferred.resolve(data.results);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		this.fetchWorkTypes = function() {
			var deferred = $q.defer();
			var url = 'api/work_types';
			RVBaseWebSrvV2.getJSON(url).then(function(data) {
				deferred.resolve(data.results);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		this.fetchShifts = function() {
			var deferred = $q.defer();
			var url = 'api/shifts';
			RVBaseWebSrvV2.getJSON(url).then(function(data) {
				_.each(data.results, function(shift) {
					shift.display_name = shift.name + "(" + shift.time + ")";
				});
				deferred.resolve(data.results);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};


		/**
		 * CICO-8605
		 * Method used to fetch the statistics to populate the Work Management Landing Screen
		 * @return Object The statistics returned from API call
		 */
		this.fetchStatistics = function(params) {
			var deferred = $q.defer(),
				url = '/api/work_statistics?date=' + params.date + '&work_type_id=' + params.work_type_id;
			RVBaseWebSrvV2.getJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		this.createWorkSheet = function(params) {
			var deferred = $q.defer();
			var url = 'api/work_sheets';
			RVBaseWebSrvV2.postJSON(url, params).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		this.fetchWorkSheet = function(params) {
			var deferred = $q.defer();
			var url = 'api/work_sheets/' + params.id;
			RVBaseWebSrvV2.getJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		this.deleteWorkSheet = function(params) {
			var deferred = $q.defer();
			var url = 'api/work_sheets/' + params.id;
			RVBaseWebSrvV2.deleteJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		this.fetchWorkSheetDetails = function(params) {
			var deferred = $q.defer();
			var url = 'api/work_assignments';
			RVBaseWebSrvV2.postJSON(url, params).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		this.saveWorkSheet = function(params) {
			var deferred = $q.defer();
			var url = 'api/work_assignments/assign';
			RVBaseWebSrvV2.postJSON(url, params).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		/**
		 * Method to search Employees from the Work Management Landing page
		 * @param  Object params
		 * @return Object
		 */
		this.searchEmployees = function(params) {
			var deferred = $q.defer(),
				/**
				 * SAMPLE API CALL
				 * /api/work_statistics/employee?query=nic&date=2014-06-30&work_type_id=1
				 */
				url = '/api/work_statistics/employee?query=' + params.key + '&date=' + params.date;

			if (params.workType) {
				url += '&work_type_id=' + params.workType;
			}

			RVBaseWebSrvV2.getJSON(url).then(function(data) {
				deferred.resolve(data.results);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		/**
		 * Method to search Employees from the Work Management Landing page
		 * @param  Object params
		 * @return Object
		 */
		this.searchRooms = function(params) {
			var deferred = $q.defer(),
				url = '/house/search.json?query=' + params.key + '&date=' + params.date;
			RVBaseWebSrvV2.getJSON(url).then(function(data) {
				deferred.resolve(data.data.rooms);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		// method to fetch all unassigned rooms for a given date
		this.fetchAllUnassigned = function(params) {
			var deferred = $q.defer(),
				url = 'api/work_assignments/unassigned_rooms?date=' + params.date;

			RVBaseWebSrvV2.getJSON(url)
				.then(function(data) {
					deferred.resolve(data.results);
				}, function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		};
	}
]);