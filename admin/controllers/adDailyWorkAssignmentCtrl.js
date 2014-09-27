admin.controller('ADDailyWorkAssignmentCtrl', [
	'$scope',
	'$rootScope',
	'ADDailyWorkAssignmentSrv',
	function($scope, $rootScope, ADDailyWorkAssignmentSrv) {

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

		$scope.eachWorkType = {
			name: '',
			is_active: true,
			hotel_id: $rootScope.hotelId
		}

		$scope.workTypeForm = 'add';

		$scope.openWorkTypeForm = function(typeIndex) {
			if ( typeIndex == 'new' ) {
				$scope.workTypeForm = 'add';
				$scope.workTypeClickedElement = 'new';
				$scope.eachWorkType.name = '';
			} else {
				$scope.workTypeForm = 'edit';
				$scope.workTypeClickedElement = typeIndex;
				$scope.eachWorkType = {
					name: this.item.name,
					is_active: this.item.is_active,
					hotel_id: $rootScope.hotelId,
					id: this.item.id
				}
			}
		};

		$scope.closeWorkTypeForm = function() {
			$scope.workTypeClickedElement = -1;
			$scope.eachWorkType = {
				name: '',
				is_active: true,
				hotel_id: $rootScope.hotelId
			}
		};

		$scope.deleteWorkType = function() {
			var callback = function(data) {
				$scope.$emit('hideLoader');
				
				$scope.workTypeClickedElement = -1;
				$scope.eachWorkType = {
					name: '',
					is_active: true,
					hotel_id: $rootScope.hotelId
				}

				fetchWorkType();
			};

			$scope.invokeApi(ADDailyWorkAssignmentSrv.deleteWorkType, {id: this.item.id}, callback);
		};

		$scope.updateWorkType = function() {
			var callback = function(data) {
				$scope.$emit('hideLoader');
				
				$scope.workTypeClickedElement = -1;
				$scope.eachWorkType = {
					name: '',
					is_active: true,
					hotel_id: $rootScope.hotelId
				}

				fetchWorkType();
			};

			$scope.invokeApi(ADDailyWorkAssignmentSrv.putWorkType, $scope.eachWorkType, callback);
		};

		$scope.addWorkType = function() {
			var callback = function(data) {
				$scope.$emit('hideLoader');
				
				$scope.workTypeClickedElement = -1;
				$scope.eachWorkType = {
					name: '',
					is_active: true,
					hotel_id: $rootScope.hotelId
				}

				fetchWorkType();
			};

			$scope.invokeApi(ADDailyWorkAssignmentSrv.postWorkType, $scope.eachWorkType, callback);
		};

		$scope.toggleActive = function() {
			var callback = function(data) {
				$scope.$emit('hideLoader');
				
				$scope.workTypeClickedElement = -1;
				$scope.eachWorkType = {
					name: '',
					is_active: true,
					hotel_id: $rootScope.hotelId
				}

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

		$scope.eachWorkShift = {
			name: '',
			hours: '',
			mins: '',
			hotel_id: $rootScope.hotelId
		}

		$scope.workShiftForm = 'add';

		$scope.openWorkShiftForm = function(typeIndex) {
			if ( typeIndex == 'new' ) {
				$scope.workShiftForm = 'add';
				$scope.workShiftClickedElement = 'new';
				$scope.eachWorkShift.name = '';
				$scope.eachWorkShift.hours = '';
				$scope.eachWorkShift.mins = '';
			} else {
				$scope.workShiftForm = 'edit';
				$scope.workShiftClickedElement = typeIndex;

				var time = this.item.time;
				$scope.eachWorkShift = {
					name: this.item.name,
					hour: time.split(':')[0],
					mins: time.split(':')[1],
					hotel_id: $rootScope.hotelId,
					id: this.item.id
				}
			}
		};

		$scope.closeWorkShiftForm = function() {
			$scope.workShiftClickedElement = -1;
			$scope.eachWorkShift = {
				name: '',
				hours: '',
				mins: '',
				hotel_id: $rootScope.hotelId
			}
		};

		$scope.deleteWorkShift = function() {
			var callback = function(data) {
				$scope.$emit('hideLoader');
				
				$scope.workShiftClickedElement = -1;
				$scope.eachWorkShift = {
					name: '',
					hours: '',
					mins: '',
					hotel_id: $rootScope.hotelId
				}

				fetchWorkShift();
			};

			$scope.invokeApi(ADDailyWorkAssignmentSrv.deleteWorkShift, {id: this.item.id}, callback);
		};

		$scope.addWorkShift = function() {
			var callback = function(data) {
				$scope.$emit('hideLoader');
				
				$scope.workShiftClickedElement = -1;
				$scope.eachWorkShift = {
					name: '',
					hours: '',
					mins: '',
					hotel_id: $rootScope.hotelId
				}

				fetchWorkShift();
			};

			var params = {
				name: $scope.eachWorkShift.name,
				time: $scope.eachWorkShift.hours + ':' + $scope.eachWorkShift.mins,
				hotel_id: $rootScope.hotelId
			}

			$scope.invokeApi(ADDailyWorkAssignmentSrv.postWorkShift, params, callback);
		};

		$scope.updateWorkShift = function() {
			var callback = function(data) {
				$scope.$emit('hideLoader');
				
				$scope.workShiftClickedElement = -1;
				$scope.eachWorkShift = {
					name: '',
					hours: '',
					mins: '',
					hotel_id: $rootScope.hotelId
				}

				fetchWorkShift();
			};

			var params = {
				name: $scope.eachWorkShift.name,
				time: $scope.eachWorkShift.hours + ':' + $scope.eachWorkShift.mins,
				hotel_id: $rootScope.hotelId,
				id: $scope.eachWorkShift.id
			}

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

		var additionalAPIs = function() {
			var rtCallback = function(data) {
				$scope.$emit('hideLoader');
				$scope.roomTypesList = data;
			};
			$scope.invokeApi(ADDailyWorkAssignmentSrv.fetchRoomTypes, {}, rtCallback);

			var resHkCallback = function(data) {
				$scope.$emit('hideLoader');
				$scope.resHkStatusList = data;
				console.log( $scope.resHkStatusList )
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

		$scope.eachTaskList = {
			name: '',
			work_type_id: '',
			room_type_id: '',
			reservation_status: '',
			fo_status: '',
			hours: '',
			mins: '',
			ref_housekeeping_status_id: ''
		}

		$scope.taskListForm = 'add';

		$scope.openTaskListForm = function(typeIndex) {
			if ( typeIndex == 'new' ) {
				$scope.taskListForm = 'add';
				$scope.taskListClickedElement = 'new';
				$scope.eachTaskList = {
					name: '',
					work_type_id: '',
					room_type_id: '',
					reservation_status: '',
					fo_status: '',
					hours: '',
					mins: '',
					ref_housekeeping_status_id: ''
				}
			} else {
				$scope.taskListForm = 'edit';
				$scope.taskListClickedElement = typeIndex;

				var time = this.item.completion_time;
				var resStatus = this.item.is_occupied ? 3 : '';
				var foStatus   = this.item.is_vacant ? 1 : 2;
				$scope.eachTaskList = {
					name: this.item.name,
					work_type_id: this.item.name,
					room_type_id: this.item.name,
					reservation_status: resStatus,
					fo_status: foStatus,
					hour: time.split(':')[0],
					mins: time.split(':')[1],
					ref_housekeeping_status_id: this.item.ref_housekeeping_status_id,
					id: this.item.id
				}
			}
		};

		$scope.closeTaskListForm = function() {
			$scope.taskListClickedElement = -1;
			$scope.eachTaskList = {
				name: '',
				work_type_id: '',
				room_type_id: '',
				reservation_status: '',
				fo_status: '',
				hours: '',
				mins: '',
				ref_housekeeping_status_id: ''
			}
		};

		$scope.deleteTaskListItem = function() {
			var callback = function(data) {
				$scope.$emit('hideLoader');
				
				$scope.taskListClickedElement = -1;
				$scope.eachTaskList = {
					name: '',
					work_type_id: '',
					room_type_id: '',
					reservation_status: '',
					fo_status: '',
					hours: '',
					mins: '',
					ref_housekeeping_status_id: ''
				}

				fetchTaskList();
			};

			$scope.invokeApi(ADDailyWorkAssignmentSrv.deleteTaskListItem, {id: this.item.id}, callback);
		};

		$scope.addTaskListItem = function() {
			var callback = function(data) {
				$scope.$emit('hideLoader');
				
				$scope.taskListClickedElement = -1;
				$scope.eachTaskList = {
					name: '',
					work_type_id: '',
					room_type_id: '',
					reservation_status: '',
					fo_status: '',
					hours: '',
					mins: '',
					ref_housekeeping_status_id: ''
				}

				fetchTaskList();
			};

			var isOccupied = $scope.eachTaskList.reservation_status == 3 || $scope.eachTaskList.reservation_status == 4 ? true : false;
			var isVacant   = $scope.eachTaskList.fo_status == 1 ? true : false;
			var params = {
			    name: $scope.eachTaskList.name,
			    work_type_id: $scope.eachTaskList.work_type_id,
			    room_type_id: $scope.eachTaskList.room_type_id,
			    is_occupied: isOccupied,
			    is_vacant: isVacant,
			    completion_time: $scope.eachTaskList.hours + ':' + $scope.eachTaskList.mins,
			    ref_housekeeping_status_id: $scope.eachTaskList.ref_housekeeping_status_id,
			}

			console.log( params );	

			$scope.invokeApi(ADDailyWorkAssignmentSrv.postTaskListItem, params, callback);
		};

		$scope.updateTaskListItem = function() {
			var callback = function(data) {
				$scope.$emit('hideLoader');
				$scope.taskListClickedElement = -1;
				$scope.eachTaskList = {
					name: '',
					work_type_id: '',
					room_type_id: '',
					reservation_status: '',
					fo_status: '',
					hours: '',
					mins: '',
					ref_housekeeping_status_id: ''
				}

				fetchTaskList();
			};

			var isOccupied = $scope.eachTaskList.reservation_status == 3 || $scope.eachTaskList.reservation_status == 4 ? true : false;
			var isVacant   = $scope.eachTaskList.fo_status == 1 ? true : false;
			var params = {
			    name: $scope.eachTaskList.name,
			    work_type_id: $scope.eachTaskList.work_type_id,
			    room_type_id: $scope.eachTaskList.room_type_id,
			    is_occupied: isOccupied,
			    is_vacant: isVacant,
			    completion_time: $scope.eachTaskList.hours + ':' + $scope.eachTaskList.mins,
			    ref_housekeeping_status_id: $scope.eachTaskList.ref_housekeeping_status_id,
			    id: $scope.eachTaskList.id
			}

			console.log( params );
			$scope.invokeApi(ADDailyWorkAssignmentSrv.putTaskListItem, params, callback);
		}
	}
]);