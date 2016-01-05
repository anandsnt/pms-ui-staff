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
			// RVBaseWebSrvV2.postJSON(url, params).then(function(data) {
			// 	deferred.resolve(data);
			// }, function(data) {
			// 	deferred.reject(data);
			// });
			deferred.resolve([]);
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

			deferred.resolve([]);

			// RVBaseWebSrvV2.getJSON(url)
			// 	.then(function(data) {
			// 		deferred.resolve(data.results);
			// 	}, function(data) {
			// 		deferred.reject(data);
			// 	});

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

		this.fetchUnassignedRoomTasks = function(params) {
			var deferred = $q.defer(),
				url = 'api/work_assignments/unassigned_rooms';

			RVBaseWebSrvV2.postJSON(url, params)
				.then(function(data) {
					deferred.resolve(data);
				}, function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		};

		this.fetchAssignedRoomTasks = function(params) {
			var deferred = $q.defer(),
				url = 'api/work_assignments/assigned_rooms';

			RVBaseWebSrvV2.postJSON(url, params)
				.then(function(data) {
					deferred.resolve(data.results);
				}, function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		};

		this.processedPayload = function(unassignedRoomsParam, assignedRoomsParam) {
			var deferred = $q.defer(),
				promises = [];

			var allTasksResponse, unassignedRoomsResponse, assignedRoomsResponse;

			var payload;

			// fetch tasks and unassigned rooms
			promises.push( this.fetchAllTasks() );
			promises.push( this.fetchUnassignedRoomTasks(unassignedRoomsParam) );
			promises.push( this.fetchAssignedRoomTasks(assignedRoomsParam) );

			$q.all(promises).then(function(data) {
				tasksResponse           = data[0];
				unassignedRoomsResponse = data[1];
				assignedRoomsResponse   = data[2];

				payload = {
					'unassignedRoomTasks' : compileUnassignedRooms(unassignedRoomsResponse, tasksResponse),
					'assignedRoomTasks'   : compileAssignedRooms(assignedRoomsResponse, tasksResponse)
				};

				deferred.resolve( payload );
			});

			return deferred.promise;
		};

		function compileUnassignedRooms (unassignedRooms, allTasks) {
			// DESIRED STRUCTURE
			// =================
			// 
			// [{
			// 	id                 : 34,
			// 	room_no            : 3442,
			// 	current_status     : 'CLEAN',
			// 	reservation_status : 'Not Reserved',
			// 	checkout_time      : null,
			// 	room_tasks: [{
			// 		id             : 11,
			// 		is_completed   : true,
			// 		name           : 'Clean Departures',
			// 		work_type_id   : 67,
			// 		work_type_name : 'Daily Cleaning',
			// 		time_allocated : { hh: 2, mm: 15 } 
			// 	}]
			// }];

			var allTasks        = allTasks || [],
				unassignedRooms = $.extend({}, { 'rooms' : [], 'room_tasks' : [] }, unassignedRooms);

			var rooms     = unassignedRooms.rooms,
				roomTasks = unassignedRooms.room_tasks;

			var i, j, k, l;

			var compiled = [];

			var eachRoom, eachRoomId, eachRoomTypeId;

			var eachRoomTasks, eachTask;

			var thatCompliedRoom, thatAllTask;

			// 	creating a fresh array of room by copying rooms
			// 	and augmenting it with empty 'room_tasks'
			for (i = 0, j = rooms.length; i < j; i++) {
				if ( roomTasks[i]['tasks'].length ) {
					eachRoom = $.extend({}, rooms[i], {
						'room_tasks': []
					});
					compiled.push(eachRoom);
				};
			};

			// loop through roomTasks, gather much info on each tasks
			// and push it into appropriate room
			for (i = 0, j = roomTasks.length; i < j; i++) {
				eachRoomId     = roomTasks[i]['room_id'];
				eachRoomTypeId = roomTasks[i]['room_type_id'];
				eachRoomTasks  = roomTasks[i]['tasks'];

				thatCompiledRoom = _.find(compiled, { id: eachRoomId });

				for (k = 0, l = eachRoomTasks.length; k < l; k++) {
					thatAllTask = _.find(allTasks, { id: eachRoomTasks[k]['id'] });

					eachTask = $.extend({}, eachRoomTasks[k], {
						'name'           : thatAllTask.name,
						'work_type_id'   : thatAllTask.work_type_id,
         				'work_type_name' : thatAllTask.work_type_name,
						'time_allocated' : getTimeAllocated( thatAllTask, eachRoomTypeId )
					});

					thatCompiledRoom['room_tasks'].push( eachTask );
				};
			};

			// find and convert the completion time
			// and convert in into proper standards
			function getTimeAllocated (task, roomId) {
				var time = '',
					hh = 0,
					mm = 0;

				if ( task['room_types_completion_time'].hasOwnProperty(roomId) && !! task['room_types_completion_time'][roomId] ) {
					time = task['room_types_completion_time'][roomId];
				} else if ( !! task['completion_time'] ) {
					time = task['completion_time'];
				};

				if ( time.indexOf(':') > -1 ) {
					hh = time.split(':')[0];
					mm = time.split(':')[1];
				};

				return {
					hh: isNaN(parseInt(hh)) ? 0 : parseInt(hh),
					mm: isNaN(parseInt(mm)) ? 0 : parseInt(mm)
				};
			};

			return compiled;
		};

		function compileAssignedRooms () {
			// DESIRED STRUCTURE
			// =================
			// 
			// assignedRooms = [{
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

			var compiled = [];

			return compiled;
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