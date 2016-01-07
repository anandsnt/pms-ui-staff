sntRover.service('RVWorkManagementSrv', ['$q', 'rvBaseWebSrvV2',
	function($q, RVBaseWebSrvV2) {
		//Meta Data for Work Management
		// 1. Maids
		// 2. WorkTypes
		// 3. Shifts

		var srv = this;

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


































		this.fetchHKStaffs = function() {
			var deferred = $q.defer();
			var url = 'api/work_statistics/employees_list';

			var processData = function(data) {
				var results = [],
					emp_ids = [];

				_.each(data.results, function(emp) {
					emp_ids
						.push( emp.id );

					results =  $.extend(
							{},
							emp,
							{ ticked: false },
							{ checkboxDisabled: false }
						);
				});

				return {
					'results' : results,
					'emp_ids' : emp_ids
				};
			};

			RVBaseWebSrvV2.getJSON(url).then(function(data) {
				deferred.resolve( processData(data) );
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
					deferred.resolve(data);
				}, function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		};

		this.processedPayload = function(unassignedRoomsParam, assignedRoomsParam) {
			var deferred = $q.defer(),
				promises = [],
				unassignedRoomsResponse,
				tasksResponse;

			var allTasksResponse, unassignedRoomsResponse, assignedRoomsResponse;

			var payload;

			// fetch tasks and unassigned rooms
			promises.push( this.fetchAllTasks() );
			promises.push( this.fetchUnassignedRoomTasks(unassignedRoomsParam) );
			promises.push( this.fetchAssignedRoomTasks(assignedRoomsParam) );

			$q.all(promises)
				.then(function(data) {
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
			var allTasks        = allTasks || [],
				unassignedRooms = $.extend({}, { 'rooms' : [], 'room_tasks' : [] }, unassignedRooms);

			var rooms     = unassignedRooms.rooms,
				roomTasks = unassignedRooms.room_tasks;

			var i, j, k, l;

			var compiled = [];

			var copyRoom, eachRoomId, eachRoomTypeId;

			var copyTask, eachRoomTasks;

			var thatCompliedRoom, thatAllTask;

			// 	creating a fresh array of room by copying rooms
			// 	and augmenting it with empty 'room_tasks'
			for (i = 0, j = rooms.length; i < j; i++) {
				if ( roomTasks[i]['tasks'].length ) {
					copyRoom = $.extend(
							{}, 
							rooms[i],
							{ 'room_tasks': [] }
						);
					/**
					 * copyRoom
					 * ========
					 * {
					 *   ...room_details
					 *   room_tasks: []
					 * }
					 */
					
					compiled.push(copyRoom);
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

					copyTask = $.extend(
							{},
							eachRoomTasks[k],
							{
								'name'           : thatAllTask.name,
								'work_type_id'   : thatAllTask.work_type_id,
								'work_type_name' : thatAllTask.work_type_name,
								'time_allocated' : getTimeAllocated( thatAllTask, eachRoomTypeId )
							}
						);
					/**
					 * copyTask
					 * ========
					 * {
					 *   id: 1,
				     *   completed: false,
					 *   ...additional_tasks_details
					 * }
					 */

					thatCompiledRoom
						.room_tasks
						.push( copyTask );
				};
			};

			return compiled;
		};

		function compileAssignedRooms (assignedRooms, allTasks) {
			var allTasks      = allTasks || [],
				assignedRooms = $.extend({}, { 'employees' : [], 'rooms' : [] }, assignedRooms);

			var employees = assignedRooms.employees,
				rooms     = assignedRooms.rooms;

			var i, j, k, l, m, n;

			var compiled = [];

			var copyEmployee, roomTasksInit, copyRoom, tasksInIt, thatAllTask, copyTask;

			for (i = 0, j = employees.length; i < j; i++) {
				copyEmployee = $.extend(
						{},
						{ 'id' : employees[i].id, 'name' : employees[i].name },
						{ 'rooms' : [] },
						{ 'touched_work_types': [] }
					);
				/**
				 * copyEmployee
				 * ============
				 * {
				 *   id: 1,
				 *   name: 'Vijay',
				 *   rooms: [],
				 *   touched_work_types: []
				 * }
				 */

				roomTasksInit = employees[i]['room_tasks'];

				for (k = 0, l = roomTasksInit.length; k < l; k++) {
					copyRoom = $.extend(
							{},
							_.find(rooms, { id: roomTasksInit[k].room_id }),
							{ 'room_tasks': [] }
						);
					/**
					 * copyRoom
					 * ========
					 * {
					 *   ...room details,
					 *   room_tasks: []
					 * }
					 */

					copyEmployee
						.rooms
						.push( copyRoom );
					/**
					 * copyEmployee
					 * ============
					 * {
					 *   id: 1,
					 *   name: 'Vijay',
					 *   rooms: [{
					 *   	...room details,
					 *      room_tasks: []
					 *   }],
					 *   touched_work_types: []
					 * }
					 */

					tasksInIt = roomTasksInit[k]['tasks'];

					for (m = 0, n = tasksInIt.length; m < n; m++) {
						thatAllTask = _.find(allTasks, { id: tasksInIt[m]['id'] });

						copyTask = $.extend(
								{},
								tasksInIt[m],
								{
									'name'           : thatAllTask.name,
									'work_type_id'   : thatAllTask.work_type_id,
									'work_type_name' : thatAllTask.work_type_name,
									'time_allocated' : getTimeAllocated( thatAllTask, copyRoom.room_type )
								}
							);
						/**
						 * copyTask
						 * ========
						 * {
						 *   id: 1,
						 *   completed: false,
						 *   ...additional_tasks_details
						 * }
						 */
						
						// keeping a top ref of all work_types_touched
						// pushing new arrays, will flatten & uniq it just before 
						// pushing to complied
						copyEmployee
							.touched_work_types
							.push( [copyTask.work_type_id] );
						
						copyEmployee
							.rooms[k]			// wonder why its k?
							.room_tasks
							.push( copyTask );
						/**
						 * copyEmployee
						 * ============
						 * {
						 *   id: 1,
						 *   name: 'Vijay',
						 *   rooms: [{
						 *   	...room details,
						 *      room_tasks: [{
						 *         id: 1,
						 *         completed: false,
						 *         ...additional_tasks_details
						 *      }]
						 *   }],
						 *   touched_work_types: [ [1], [2] ]
						 * }
						 */
					};
				};

				// flatten and remove duplicates
				copyEmployee.touched_work_types = _.uniq( _.flatten(copyEmployee.touched_work_types) );

				compiled.push(copyEmployee);
			};

			return compiled;
		};

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