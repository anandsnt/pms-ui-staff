admin.controller('ADDailyWorkAssignmentCtrl', [
	'$scope',
	'$rootScope',
	'ADDailyWorkAssignmentSrv',
	'$anchorScroll', '$timeout', '$location',
	function($scope, $rootScope, ADDailyWorkAssignmentSrv, $anchorScroll, $timeout, $location) {

		BaseCtrl.call(this, $scope);


		// clicked element type indicators
		$scope.workTypeClickedElement = -1;
		$scope.taskListClickedElement = -1;
		$scope.workShiftClickedElement = -1;

		// fetch work types
		var fetchWorkType = function() {
			var callback = function(data) {
				$scope.$emit('hideLoader');
				$scope.workType = data;
			};

			$scope.invokeApi(ADDailyWorkAssignmentSrv.fetchWorkType, {}, callback);
		};
		fetchWorkType();

		var resetEachWorkType = function() {
			$scope.eachWorkType = {
				name: '',
				is_active: true,
				hotel_id: $rootScope.hotelId
			};
		};
		resetEachWorkType();

		$scope.workTypeForm = 'add';

		$scope.openWorkTypeForm = function(typeIndex) {
			if (typeIndex === 'new') {
				$scope.workTypeForm = 'add';
				$scope.workTypeClickedElement = 'new';
				resetEachWorkType();
				$timeout(function() {
					$location.hash('new-form-holder-work-type');
					$anchorScroll();
				});

			} else {
				$scope.workTypeForm = 'edit';
				$scope.workTypeClickedElement = typeIndex;
				$scope.eachWorkType = {
					name: this.item.name,
					is_active: this.item.is_active,
					hotel_id: $rootScope.hotelId,
					id: this.item.id
				};
			}
		};

		$scope.closeWorkTypeForm = function() {
			$scope.workTypeClickedElement = -1;
			resetEachWorkType();
		};

		$scope.deleteWorkType = function() {
			var callback = function(data) {
				$scope.$emit('hideLoader');

				$scope.workTypeClickedElement = -1;
				resetEachWorkType();

				fetchWorkType();
			};

			$scope.invokeApi(ADDailyWorkAssignmentSrv.deleteWorkType, {
				id: this.item.id
			}, callback);
		};

		$scope.updateWorkType = function() {
			var callback = function(data) {
				$scope.$emit('hideLoader');

				$scope.workTypeClickedElement = -1;
				resetEachWorkType();

				fetchWorkType();
			};

			$scope.invokeApi(ADDailyWorkAssignmentSrv.putWorkType, $scope.eachWorkType, callback);
		};

		$scope.addWorkType = function() {
			var callback = function(data) {
				$scope.$emit('hideLoader');

				$scope.workTypeClickedElement = -1;
				resetEachWorkType();

				fetchWorkType();
			};

			$scope.invokeApi(ADDailyWorkAssignmentSrv.postWorkType, $scope.eachWorkType, callback);
		};

		$scope.toggleActive = function() {
			var callback = function(data) {
				$scope.$emit('hideLoader');

				$scope.workTypeClickedElement = -1;
				resetEachWorkType();

				fetchWorkType();
			};

			this.item.is_active = !!this.item.is_active ? false : true;

			$scope.eachWorkType.id = this.item.id;
			$scope.eachWorkType.name = this.item.name;
			$scope.eachWorkType.is_active = this.item.is_active;

			$scope.invokeApi(ADDailyWorkAssignmentSrv.putWorkType, $scope.eachWorkType, callback);
		};




























		// fetch maid work shift
		var fetchWorkShift = function() {
			var callback = function(data) {
				$scope.$emit('hideLoader');
				$scope.workShift = data;
			};

			$scope.invokeApi(ADDailyWorkAssignmentSrv.fetchWorkShift, {}, callback);
		};
		fetchWorkShift();

		var resetEachWorkShift = function() {
			$scope.eachWorkShift = {
				name: '',
				hours: '00',
				mins: '00',
				hotel_id: $rootScope.hotelId
			};
		};
		resetEachWorkShift();

		$scope.workShiftForm = 'add';

		$scope.openWorkShiftForm = function(typeIndex) {
			if (typeIndex === 'new') {
				$scope.workShiftForm = 'add';
				$scope.workShiftClickedElement = 'new';
				resetEachWorkShift();
				$timeout(function() {
					$location.hash('new-form-holder-work-shift');
					$anchorScroll();
				});
			} else {
				$scope.workShiftForm = 'edit';
				$scope.workShiftClickedElement = typeIndex;

				var time = this.item.time;
				$scope.eachWorkShift = {
					name: this.item.name,
					hours: (!!time && time !== "00:00") ? time.split(':')[0] : '00',
					mins: (!!time && time !== "00:00") ? time.split(':')[1] : '00',
					hotel_id: $rootScope.hotelId,
					id: this.item.id
				};
			}
		};

		$scope.closeWorkShiftForm = function() {
			$scope.workShiftClickedElement = -1;
			resetEachWorkShift();
		};

		$scope.deleteWorkShift = function() {
			var callback = function(data) {
				$scope.$emit('hideLoader');

				$scope.workShiftClickedElement = -1;
				resetEachWorkShift();

				fetchWorkShift();
			};

			$scope.invokeApi(ADDailyWorkAssignmentSrv.deleteWorkShift, {
				id: this.item.id
			}, callback);
		};

		$scope.addWorkShift = function() {

			var callback = function(data) {
					$scope.$emit('hideLoader');

					$scope.workShiftClickedElement = -1;
					resetEachWorkShift();

					fetchWorkShift();
				},
				onSaveFailure = function(errorMessage) {
					$scope.errorMessage = errorMessage;
					$scope.$emit('hideLoader');
				};

			var params = {
				name: $scope.eachWorkShift.name,
				time: $rootScope.businessDate + ' ' + $scope.eachWorkShift.hours + ':' + $scope.eachWorkShift.mins + ':00',
				hotel_id: $rootScope.hotelId
			};
			$scope.invokeApi(ADDailyWorkAssignmentSrv.postWorkShift, params, callback, onSaveFailure);
		};

		$scope.updateWorkShift = function() {
			var callback = function(data) {
				$scope.$emit('hideLoader');

				$scope.workShiftClickedElement = -1;
				resetEachWorkShift();

				fetchWorkShift();
			};

			var params = {
				name: $scope.eachWorkShift.name,
				time: $rootScope.businessDate + ' ' + $scope.eachWorkShift.hours + ':' + $scope.eachWorkShift.mins + ':00',
				hotel_id: $rootScope.hotelId,
				id: $scope.eachWorkShift.id
			};

			$scope.invokeApi(ADDailyWorkAssignmentSrv.putWorkShift, params, callback);
		};





































		// fetch task list
		var fetchTaskList = function() {
			var callback = function(data) {
				$scope.$emit('hideLoader');
				$scope.taskList = data;
			};

			$scope.invokeApi(ADDailyWorkAssignmentSrv.fetchTaskList, {}, callback);
		};
		fetchTaskList();

		// fetch these additional API to show them in drop downs
		var additionalAPIs = function() {
			var rtCallback = function(data) {
				$scope.$emit('hideLoader');
				$scope.roomTypesList = data;
			};
			$scope.invokeApi(ADDailyWorkAssignmentSrv.fetchRoomTypes, {}, rtCallback);

			var resHkCallback = function(data) {
				$scope.$emit('hideLoader');
				$scope.resHkStatusList = data;
			};
			$scope.invokeApi(ADDailyWorkAssignmentSrv.fetchResHkStatues, {}, resHkCallback);

			var foCallback = function(data) {
				$scope.$emit('hideLoader');
				$scope.foStatusList = data;
			};
			$scope.invokeApi(ADDailyWorkAssignmentSrv.fetchFoStatues, {}, foCallback);

			var hksCallback = function(data) {
				$scope.$emit('hideLoader');
				$scope.HkStatusList = data;
			};
			$scope.invokeApi(ADDailyWorkAssignmentSrv.fetchHkStatues, {}, hksCallback);
		};
		additionalAPIs();

		var initateRoomTaskTimes = function(time, tasktimes) {
			var initialTime = {};
			_.each($scope.roomTypesList, function(room) {
				if (tasktimes && tasktimes[room.id] === null) {
					initialTime[room.id] = {
						hours: '',
						mins: ''
					}
				} else {
					var currTime = tasktimes && tasktimes[room.id] || time;
					initialTime[room.id] = {
						hours: !!currTime ? currTime.split(':')[0] : '',
						mins: !!currTime ? currTime.split(':')[1] : ''
					};
				}
			})
			return initialTime;
		}

		var getRoomTaskTimes = function() {
			var times = {};
			_.each($scope.roomTypesList, function(room, index) {
				if ( !!$scope.eachTaskList.room_type_ids[index] ) {
					if (!!$scope.eachTaskList.rooms_task_completion[room.id].mins && !!$scope.eachTaskList.rooms_task_completion[room.id].hours) {
						times[room.id] = $rootScope.businessDate + ' ' + $scope.eachTaskList.rooms_task_completion[room.id].hours + ':' + $scope.eachTaskList.rooms_task_completion[room.id].mins + ':00';
					} else {
						times[room.id] = '';
					}
				}
			});
			return times;
		}

		var resetEachTaskList = function() {
			$scope.eachTaskList = {
				name                         : '',
				work_type_id                 : '',
				room_type_ids                : [],
				front_office_status_ids      : [],
				reservation_statuses_ids     : [],
				is_occupied                  : '',
				is_vacant                    : '',
				hours                        : '',
				mins                         : '',
				task_completion_hk_status_id : '',
				rooms_task_completion        : initateRoomTaskTimes()
			};
		};
		resetEachTaskList();

		$scope.taskListForm = 'add';

		$scope.updateIndividualTimes = function() {
			_.each($scope.roomTypesList, function(room) {
				if ($scope.eachTaskList.rooms_task_completion[room.id].hours === '') {
					$scope.eachTaskList.rooms_task_completion[room.id].hours = $scope.eachTaskList.hours;
				}
				if ($scope.eachTaskList.rooms_task_completion[room.id].mins === '') {
					$scope.eachTaskList.rooms_task_completion[room.id].mins = $scope.eachTaskList.mins;
				}
			})
		};

		var applyIds = function(source, entry) {
			var model = [];
			var match;
			_.each(source, function(item, index) {
				model[index] = false;

				match = _.find(entry, function(id) {
					return id === item.id;
				});

				if ( !!match ) {
					model[index] = true;
				};
			});
			return angular.copy( model );
		};

		var traceBackIds = function(source, model) {
			var idAry = [];
			_.each(source, function(item, index) {
				if ( model[index] ) {
					idAry.push(item.id);
				};
			});
			return idAry;
		};

		$scope.openTaskListForm = function(typeIndex) {
			if (typeIndex === 'new') {
				$scope.taskListForm = 'add';
				$scope.taskListClickedElement = 'new';
				resetEachTaskList();
				$timeout(function() {
					$location.hash('new-form-holder-task-list');
					$anchorScroll();
				});
			} else {
				$scope.taskListForm = 'edit';
				$scope.taskListClickedElement = typeIndex;
				var time = this.item.completion_time;
				$scope.eachTaskList = {
					name                         : this.item.name,
					work_type_id                 : this.item.work_type_id,
					room_type_ids                : applyIds( $scope.roomTypesList, this.item.room_type_ids ),
					front_office_status_ids      : applyIds( $scope.foStatusList, this.item.front_office_status_ids ),
					reservation_statuses_ids     : applyIds( $scope.resHkStatusList, this.item.reservation_statuses_ids ),
					is_occupied                  : this.item.is_occupied,
					is_vacant                    : this.item.is_vacant,
					hours                        : !!time ? time.split(':')[0] : '',
					mins                         : !!time ? time.split(':')[1] : '',
					task_completion_hk_status_id : this.item.task_completion_hk_status_id,
					id                           : this.item.id,
					rooms_task_completion        : initateRoomTaskTimes(time, this.item.room_types_completion_time)
				};
			}
		};

		$scope.closeTaskListForm = function() {
			$scope.taskListClickedElement = -1;
			resetEachTaskList();
		};

		$scope.deleteTaskListItem = function() {
			var callback = function(data) {
				$scope.$emit('hideLoader');

				$scope.taskListClickedElement = -1;
				resetEachTaskList();

				fetchTaskList();
			};

			$scope.invokeApi(ADDailyWorkAssignmentSrv.deleteTaskListItem, {
				id: this.item.id
			}, callback);
		};

		$scope.addTaskListItem = function() {
			var callback = function(data) {
				$scope.$emit('hideLoader');

				$scope.taskListClickedElement = -1;
				resetEachTaskList();

				fetchTaskList();
			};

			var params = {
				name                         : $scope.eachTaskList.name,
				work_type_id                 : $scope.eachTaskList.work_type_id,
				room_type_ids                : traceBackIds( $scope.roomTypesList, $scope.eachTaskList.room_type_ids ),
				front_office_status_ids      : traceBackIds( $scope.foStatusList, $scope.eachTaskList.front_office_status_ids ),
				reservation_statuses_ids     : traceBackIds( $scope.resHkStatusList, $scope.eachTaskList.reservation_statuses_ids ),
				is_occupied                  : $scope.eachTaskList.front_office_status_ids.indexOf(2) > -1,
				is_vacant                    : $scope.eachTaskList.front_office_status_ids.indexOf(1) > -1,
				completion_time              : $rootScope.businessDate + ' ' + $scope.eachTaskList.hours + ':' + $scope.eachTaskList.mins + ':00',
				task_completion_hk_status_id : $scope.eachTaskList.task_completion_hk_status_id,
				rooms_task_completion        : getRoomTaskTimes()
			};

			$scope.invokeApi(ADDailyWorkAssignmentSrv.postTaskListItem, params, callback);
		};

		$scope.updateTaskListItem = function() {
			var callback = function(data) {
				$scope.$emit('hideLoader');
				$scope.taskListClickedElement = -1;
				resetEachTaskList();

				fetchTaskList();
			};

			var params = {
				name                         : $scope.eachTaskList.name,
				work_type_id                 : $scope.eachTaskList.work_type_id,
				room_type_ids                : traceBackIds( $scope.roomTypesList, $scope.eachTaskList.room_type_ids ),
				front_office_status_ids      : traceBackIds( $scope.foStatusList, $scope.eachTaskList.front_office_status_ids ),
				reservation_statuses_ids     : traceBackIds( $scope.resHkStatusList, $scope.eachTaskList.reservation_statuses_ids ),
				is_occupied                  : $scope.eachTaskList.front_office_status_ids.indexOf(2) > -1,
				is_vacant                    : $scope.eachTaskList.front_office_status_ids.indexOf(1) > -1,
				completion_time              : $rootScope.businessDate + ' ' + $scope.eachTaskList.hours + ':' + $scope.eachTaskList.mins + ':00',
				task_completion_hk_status_id : $scope.eachTaskList.task_completion_hk_status_id,
				id                           : $scope.eachTaskList.id,
				rooms_task_completion        : getRoomTaskTimes()
			};

			$scope.invokeApi(ADDailyWorkAssignmentSrv.putTaskListItem, params, callback);
		};

		$scope.anySelected = function(bool) {
			return function(item) {
				return item === bool;
			};
		};

		$scope.checkCopyBtnShow = function(id) {
			var room = $scope.eachTaskList.rooms_task_completion[id];
			return !!room.hours && !!room.mins ? true : false;
		};

		$scope.copyNpaste = function(id) {
			var room  = $scope.eachTaskList.rooms_task_completion[id];
			var hours = angular.copy( room.hours );
			var mins  = angular.copy( room.mins );

			_.each($scope.eachTaskList.rooms_task_completion, function(room) {
				room.hours = hours;
				room.mins = mins;
			});
		};
	}
]);