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





































		this.fetchAllTasks = function() {
			var deferred = $q.defer(),
				url = 'api/tasks';

			RVBaseWebSrvV2.getJSON(url)
				.then(function(data) {
					deferred.resolve(data.results);
				}, function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		};

		this.fetchAllUnassigned = function(params) {
			var deferred = $q.defer(),
				url = 'api/work_assignments/unassigned_rooms';

			RVBaseWebSrvV2.getJSON(url, params)
				.then(function(data) {
					deferred.resolve(data.results);
				}, function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		};

		this.processedUnassignedRooms = function() {
			var deferred = $q.defer();

			deferred.resolve( compileUnassignedRooms() );

			return deferred.promise;
		};

		this.processedAssignedRooms = function() {
			var deferred = $q.defer();

			deferred.resolve( compileUnassignedRooms() );

			return deferred.promise;
		};


		function compileUnassignedRooms () {
			// DESIRED STRUCTURE
			// =================
			// 
			// this.unassignedRooms = [{
			// 	id: 34,
			// 	room_no: 3442,
			// 	current_status: 'CLEAN',
			// 	reservation_status: 'Not Reserved',
			// 	checkout_time: null,
			// 	room_tasks: [{
			// 		id: 11,
			// 		completion_time: '02:15',
			// 		is_completed: true
			// 	}, {
			// 		id: 13,
			// 		completion_time: '02:15',
			// 		is_completed: true
			// 	}]
			// }];
		};

		function compileAssignedRooms () {
			// DESIRED STRUCTURE
			// =================
			// 
			// this.assignedRooms = [{
			// 	id: 34,
			// 	name: 'Vijay Dev',
			// 	room_no: 3442,
			// 	current_status: 'CLEAN',
			// 	reservation_status: 'Not Reserved',
			// 	checkout_time: null,
			// 	room_tasks: [{
			// 		id: 11,
			// 		completion_time: '02:15',
			// 		is_completed: true
			// 	}, {
			// 		id: 13,
			// 		completion_time: '02:15',
			// 		is_completed: true
			// 	}]
			// }];
		};


		

		// ALL APIS
		// ========
		// 
		// api/tasks to get all tasks
		// api/work_assignments/unassigned_rooms to get 'rooms' & 'room_tasks'
		
		// STEPS
		// =====
		// 
		// 1. Loop through 'rooms' and grab { id, room_no, current_status, reservation_status, checkout_time } 
		//    to create each entity in 'unassignedRooms'
		// 2. Loop through 'room_tasks' and match { room_id } to unassignedRooms[n].id.
		//    Then add { task_id } to matched unassignedRooms[n].room_tasks
		// 3. Loop through unassignedRooms and match unassignedRooms[n].room_tasks[j].id to the particular task id.
		//    Then in that task grab 'completion_time' by matching its room id to unassignedRooms[n].id

		// Confused? Yeah me too.. :(

	}
]);