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
		//Have to change when default task is assigned for all work types.
		$scope.defaultData = {};
		$scope.defaultData.defaultTask = 0;


		// Task management

		$scope.setTaskManagementShowInHKMenu = function () {
			var callback = function(data) {
				$scope.$emit('hideLoader');
			};
			var param = {};
			$scope.is_show_task_management_in_hk_menu = $scope.is_show_task_management_in_hk_menu ? false : true;
			param.is_show_task_management_in_hk_menu = $scope.is_show_task_management_in_hk_menu;
			$scope.invokeApi(ADDailyWorkAssignmentSrv.setTaskManagementShowInHK,param,callback);

		};


		var SCROLL_POS_KEY = 'rooms_task_management_scroll';
		/**/
		var $dailyWorkAssign = document.getElementById( 'daily-work-assignment' );
		/**/
		var setScrollPos = function() {
			localStorage.setItem( SCROLL_POS_KEY, $dailyWorkAssign.scrollTop );
		};
		/**/
		var getScrollPos = function() {
			var pos = parseInt( localStorage.getItem(SCROLL_POS_KEY) );
			return isNaN(pos) ? 0 : pos;
		};
		/**/
		var scrollToPos = function() {
			var toPos = getScrollPos();

			$timeout(function() {
				$dailyWorkAssign.scrollTop = toPos;
				localStorage.removeItem( SCROLL_POS_KEY );
			}, 100);
		};


		// fetch work types
		var fetchWorkType = function() {
			var callback = function(data) {
				$scope.is_show_task_management_in_hk_menu = data.is_show_task_management_in_hk_menu;
				$scope.$emit('hideLoader');
				$scope.workType = data.results;
				angular.forEach($scope.workType,function(item, index) {
		            if(item.is_default === true){
		            	angular.forEach(item.tasks,function(taskItem, taskIndex) {
		            		$scope.defaultData.defaultTask = taskItem.id;
		            	});
		            }

		        });

			};

			$scope.invokeApi(ADDailyWorkAssignmentSrv.fetchWorkType, {}, callback);
		};
		fetchWorkType();

		var resetEachWorkType = function() {
			$scope.eachWorkType = {
				name: '',
				is_active: true,
				hotel_id: $rootScope.hotelId,
				is_show_on_stay_card: false
			};
		};
		resetEachWorkType();

		$scope.workTypeForm = 'add';

		$scope.openWorkTypeForm = function(typeIndex, isSystemDefined) {
			if(!isSystemDefined)
			{
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
			} else {
				return false;
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
			$scope.eachWorkType.is_show_on_stay_card = this.item.is_show_on_stay_card;

			$scope.invokeApi(ADDailyWorkAssignmentSrv.putWorkType, $scope.eachWorkType, callback);
		};

		$scope.setShowOnStayCard= function() {
			var callback = function(data) {
				$scope.$emit('hideLoader');
				$scope.workTypeClickedElement = -1;
				fetchWorkType();
			};
			var isShowOnStayCard = this.item.is_show_on_stay_card = !this.item.is_show_on_stay_card;
			this.item.hotel_id = $rootScope.hotelId;
			this.item.default_task_id = $scope.defaultData.defaultTask;
			var workTypeId = this.item.id
			$scope.eachWorkType = this.item;
			angular.forEach($scope.taskList,function(itemTask, index) {
				if(itemTask.work_type_id === workTypeId){
					itemTask.is_show_on_stay_card = isShowOnStayCard;
				}
	        });
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


//=========== task list ================

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

				angular.forEach(data,function(item, index) {
		           item.is_disabled = false;// Added for CICO-12563
		        });
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
					};
				} else {
					var currTime = tasktimes && tasktimes[room.id] || time;
					initialTime[room.id] = {
						hours: !!currTime ? currTime.split(':')[0] : '',
						mins: !!currTime ? currTime.split(':')[1] : ''
					};
				}
			});
			return initialTime;
		};

		var getRoomTaskTimes = function() {
			var times = {};
			_.each($scope.roomTypesList, function(room, index) {
				if ( !!$scope.eachTaskList.room_type_ids[index] ) {
					if (!!$scope.eachTaskList.rooms_task_completion[room.id].mins || !!$scope.eachTaskList.rooms_task_completion[room.id].hours) {
						//CICO-27994
						console.log("reached here")
						if(!!$scope.eachTaskList.rooms_task_completion[room.id].mins && !!$scope.eachTaskList.rooms_task_completion[room.id].hours)
							times[room.id] = $rootScope.businessDate + ' ' + $scope.eachTaskList.rooms_task_completion[room.id].hours + ':' + $scope.eachTaskList.rooms_task_completion[room.id].mins + ':00';
						else if(!!$scope.eachTaskList.rooms_task_completion[room.id].hours)
							times[room.id] = $rootScope.businessDate + ' ' + $scope.eachTaskList.rooms_task_completion[room.id].hours + ':00:00';
						else if(!!$scope.eachTaskList.rooms_task_completion[room.id].mins)
							times[room.id] = $rootScope.businessDate + ' ' + '00:'+ $scope.eachTaskList.rooms_task_completion[room.id].mins +':00';
					} else {
						times[room.id] = '';
					}
				}
			});
			return times;
		};

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
				rooms_task_completion        : initateRoomTaskTimes(),
				is_pickup					 : false,
				is_clean			 	 	 : false,
				is_dirty					 : false
			};

			var frequencyParams = {};
			frequencyParams.monday = false;
			frequencyParams.tuesday = false;
			frequencyParams.wednesday = false;
			frequencyParams.thursday = false;
			frequencyParams.friday = false;
			frequencyParams.saturday = false;
			frequencyParams.sunday = false;
			$scope.eachTaskList.frequency = frequencyParams;
			$scope.eachTaskList.frequency.days = 0;
		};
		resetEachTaskList();

		$scope.taskListForm = 'add';

		$scope.updateIndividualTimes = function() {
			_.each($scope.roomTypesList, function(room) {
				if ($scope.eachTaskList.rooms_task_completion[room.id].hours === '' || $scope.eachTaskList.rooms_task_completion[room.id].hours === '00' || $scope.eachTaskList.rooms_task_completion[room.id].hours === '0') {
					$scope.eachTaskList.rooms_task_completion[room.id].hours = $scope.eachTaskList.hours;
				}
				if ($scope.eachTaskList.rooms_task_completion[room.id].mins === '' || $scope.eachTaskList.rooms_task_completion[room.id].mins === '00' || $scope.eachTaskList.rooms_task_completion[room.id].hours === '0') {
					$scope.eachTaskList.rooms_task_completion[room.id].mins = $scope.eachTaskList.mins;
				}
			});
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

		var mapRoomShowflag = function(task) {
			$scope.roomTypesList.forEach(function(item, index) {
				item.show = task.room_type_ids[index];
			});
		};

		var checkForFrequencyType = function(frequencyObj){
			var isCustom = false, isWeekDay = false, isWeekEnd = false, isByWeekDay = false, isByStayDay = false;
			if(frequencyObj.days !== null && frequencyObj.days!== 0){
				isCustom = true;
				isByStayDay = true;
				isByWeekDay = false;
			} else if(frequencyObj.sunday === true && frequencyObj.monday === true
				&& frequencyObj.tuesday === true && frequencyObj.wednesday === true
				&& frequencyObj.thursday === true && frequencyObj.friday === true
				&& frequencyObj.saturday === true){
					isWeekDay = true;
					isWeekEnd = true;
			} else if(frequencyObj.sunday === true && frequencyObj.saturday === true){
					isWeekEnd = true;
			} else if(frequencyObj.monday === true
				&& frequencyObj.tuesday === true && frequencyObj.wednesday === true
				&& frequencyObj.thursday === true && frequencyObj.friday === true){
					isWeekDay = true;
			} else {
				isCustom = true;
				isByWeekDay = true;
				isByStayDay = false;
			}

			var returnObj = {
				"isCustom": isCustom,
				"isWeekDay": isWeekDay,
				"isWeekEnd" : isWeekEnd,
				"isByWeekDay": isByWeekDay,
				"isByStayDay" : isByStayDay
			}
			return returnObj;
		};

		var resetShowFlags = function() {
			// reset flag
			_.map($scope.roomTypesList, function(roomType) {
				roomType.show = false;
				return roomType
			});
		};

		$scope.openTaskListForm = function(typeIndex, isSystemDefined) {
			var item = this.item;

			setScrollPos();

			$timeout(function() {
				openTaskListForm(item, typeIndex, isSystemDefined);
			}, 100);
		};

		function openTaskListForm (item, typeIndex, isSystemDefined) {
			if(!isSystemDefined)
			{
				if (typeIndex === 'new') {
					$scope.taskListForm = 'add';
					$scope.taskListClickedElement = 'new';
					resetEachTaskList();
					resetShowFlags();
					$timeout(function() {
						$location.hash('new-form-holder-task-list');
						$anchorScroll();
					});
				} else {
					$scope.taskListForm = 'edit';
					var frequencyType = checkForFrequencyType(item.frequency);
					$scope.taskListClickedElement = typeIndex;
					var time = item.completion_time;

					$scope.eachTaskList = {
						name                         : item.name,
						work_type_id                 : item.work_type_id,
						room_type_ids                : applyIds( $scope.roomTypesList, item.room_type_ids ),
						front_office_status_ids      : applyIds( $scope.foStatusList, item.front_office_status_ids ),
						reservation_statuses_ids     : applyIds( $scope.resHkStatusList, item.reservation_statuses_ids ),
						is_occupied                  : item.is_occupied,
						is_vacant                    : item.is_vacant,
						hours                        : !!time ? time.split(':')[0] : '',
						mins                         : !!time ? time.split(':')[1] : '',
						task_completion_hk_status_id : item.task_completion_hk_status_id,
						id                           : item.id,
						rooms_task_completion        : initateRoomTaskTimes(time, item.room_types_completion_time),
						isWeekDay                    :frequencyType.isWeekDay,
						isWeekEnd                    :frequencyType.isWeekEnd,
						isCustom                     :frequencyType.isCustom,
						frequency 					 : item.frequency,
						is_active					 : item.is_active,
						is_dirty					 : item.is_dirty,
						is_clean 					 : item.is_clean,
						is_pickup					 : item.is_pickup
					};
					mapRoomShowflag($scope.eachTaskList);
					if(frequencyType.isCustom === true){
					//	$scope.eachTaskList.isByWeekDay = frequencyType.isByWeekDay;
					//	$scope.eachTaskList.isByStayDay = frequencyType.isByStayDay;
						$scope.eachTaskList.customBy = (frequencyType.isByWeekDay === true) ? "weekday" : "stayday";
					}
				}
			}
		};

		$scope.closeTaskListForm = function() {
			$scope.taskListClickedElement = -1;
			resetEachTaskList();

			scrollToPos();
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
				rooms_task_completion        : getRoomTaskTimes(),
				is_active   			     : true,
				is_dirty					 : $scope.eachTaskList.is_dirty,
				is_clean 					 : $scope.eachTaskList.is_clean,
				is_pickup					 : $scope.eachTaskList.is_pickup

			};

			var frequencyParams = {};
			frequencyParams.monday = false;
			frequencyParams.tuesday = false;
			frequencyParams.wednesday = false;
			frequencyParams.thursday = false;
			frequencyParams.friday = false;
			frequencyParams.saturday = false;
			frequencyParams.sunday = false;
			params.frequency = frequencyParams;
			params.frequency.days = 0;
			if($scope.eachTaskList.isCustom === false){

				if($scope.eachTaskList.isWeekDay === true){
					frequencyParams.monday = true;
					frequencyParams.tuesday = true;
					frequencyParams.wednesday = true;
					frequencyParams.thursday = true;
					frequencyParams.friday = true;
				}
				if($scope.eachTaskList.isWeekEnd === true){
					frequencyParams.saturday = true;
					frequencyParams.sunday = true;
				}
				params.frequency = frequencyParams;
				params.frequency.days = 0;
			} else {
				if($scope.eachTaskList.customBy === "weekday"){
					params.frequency = $scope.eachTaskList.frequency;
					params.frequency.days = 0;
				} else {
					params.frequency = frequencyParams;
					params.frequency.days = $scope.eachTaskList.frequency.days;
				}

			}

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
				is_occupied                  : $scope.eachTaskList.front_office_status_ids[1],
				is_vacant                    : $scope.eachTaskList.front_office_status_ids[0],
				completion_time              : $rootScope.businessDate + ' ' + $scope.eachTaskList.hours + ':' + $scope.eachTaskList.mins + ':00',
				task_completion_hk_status_id : $scope.eachTaskList.task_completion_hk_status_id,
				id                           : $scope.eachTaskList.id,
				rooms_task_completion        : getRoomTaskTimes(),
				is_active					 : $scope.eachTaskList.is_active,
				is_clean					 : $scope.eachTaskList.is_clean,
				is_dirty 					 : $scope.eachTaskList.is_dirty,
				is_pickup					 : $scope.eachTaskList.is_pickup
			};
			var frequencyParams = {};
			frequencyParams.monday = false;
			frequencyParams.tuesday = false;
			frequencyParams.wednesday = false;
			frequencyParams.thursday = false;
			frequencyParams.friday = false;
			frequencyParams.saturday = false;
			frequencyParams.sunday = false;
			if($scope.eachTaskList.isCustom === false){

				if($scope.eachTaskList.isWeekDay === true){
					frequencyParams.monday = true;
					frequencyParams.tuesday = true;
					frequencyParams.wednesday = true;
					frequencyParams.thursday = true;
					frequencyParams.friday = true;
				}
				if($scope.eachTaskList.isWeekEnd === true){
					frequencyParams.saturday = true;
					frequencyParams.sunday = true;
				}
				params.frequency = frequencyParams;
				params.frequency.days = 0;
			} else {
				if($scope.eachTaskList.customBy === "weekday"){
					params.frequency = $scope.eachTaskList.frequency;
					params.frequency.days = 0;
				} else {
					params.frequency = frequencyParams;
					params.frequency.days = $scope.eachTaskList.frequency.days;
				}

			}

			$scope.invokeApi(ADDailyWorkAssignmentSrv.putTaskListItem, params, callback);
		};
		$scope.handleFrequencySetting = function(type){
			setTimeout(function(){
				if(type === "custom"){
					$scope.eachTaskList.isWeekDay = $scope.eachTaskList.isWeekEnd = !$scope.eachTaskList.isCustom;
				}
				if(type === "weekday" || type == "weekend"){
					$scope.eachTaskList.isCustom = false;
				}
				$scope.$apply();

			},100)

		};
		$scope.anySelected = function(bool) {
			return function(item) {
				return item === bool;
			};
		};

		$scope.checkCopyBtnShow = function(id) {
			var room = $scope.eachTaskList.rooms_task_completion[id];
			return !!room.hours || !!room.mins ? true : false;
		};

		$scope.changedSelectedRooms = function (item, index) {
			item.show = $scope.eachTaskList.room_type_ids[index];
		};

		$scope.selectedRoomsFilter = function(item) {
        	return item.show;
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
		$scope.toggleActiveInactiveTask = function(){
			var params = {};
			this.item.is_active = !this.item.is_active;
			angular.copy(this.item , params);
			params.completion_time = $rootScope.businessDate + ' ' + this.item.completion_time;
			$scope.invokeApi(ADDailyWorkAssignmentSrv.putTaskListItem, params);
		};

		$scope.clickedDefaultTaskChekbox = function (task){

			angular.forEach($scope.taskList,function(item, index) {
				if(item.work_type_id === task.work_type_id){
					if(item.id === task.id){
						item.is_default = !item.is_default;
					} else {
						item.is_default = false;
					}
				}


	        });

			var dataToSrv =
			{
				"id" : task.id,
				"work_type_id"    :task.work_type_id
			};
			$scope.invokeApi(ADDailyWorkAssignmentSrv.postDefaultTask, dataToSrv, successUpdateTask);

		};
		var successUpdateTask = function(){
			$scope.$emit('hideLoader');
		};

		$scope.updateDefaultTask = function(){
			var dataToSrv =
			{
				"id" : $scope.defaultData.defaultTask
			};
			$scope.invokeApi(ADDailyWorkAssignmentSrv.postDefaultTask, dataToSrv, successUpdateTask);
		};

		$scope.onChangeWorkType = function(){

			//$scope.resHkStatusList
			var selectedWorkType = "";
			angular.forEach($scope.workType,function(item, index) {
	            if(item.value === "DEPARTURE_CLEAN" && item.id === $scope.eachTaskList.work_type_id){
	            	selectedWorkType = "DEPARTURE_CLEAN";
	            } else if(item.value === "STAYOVER_CLEAN" && item.id === $scope.eachTaskList.work_type_id){
	            	selectedWorkType = "STAYOVER_CLEAN";
	            } else if(item.value === "LINEN_CHANGE" && item.id === $scope.eachTaskList.work_type_id){
	            	selectedWorkType = "LINEN_CHANGE";
	            } else if(item.value === "TURNDOWN" && item.id === $scope.eachTaskList.work_type_id){
	            	selectedWorkType = "TURNDOWN";
	            }

	        });

			var reservation_statuses_ids_array = [];
			if(selectedWorkType === "DEPARTURE_CLEAN"){
				angular.forEach($scope.resHkStatusList,function(item, index) {
		            if(item.value === "DUEOUT" || item.value === "DEPARTED"){
		            	item.is_disabled = false;
		            	reservation_statuses_ids_array.push(item.id);
		            } else {
		            	item.is_disabled = true;
		            }

		        });
			} else if(selectedWorkType === "STAYOVER_CLEAN" || selectedWorkType === "LINEN_CHANGE"){
				angular.forEach($scope.resHkStatusList,function(item, index) {
		            if(item.value === "STAYOVER"){
		            	item.is_disabled = false;
		            	reservation_statuses_ids_array.push(item.id);
		            } else {
		            	item.is_disabled = true;
		            }

		        });
			} else if(selectedWorkType === "TURNDOWN"){
				angular.forEach($scope.resHkStatusList,function(item, index) {
		            if(item.value === "STAYOVER" || item.value === "ARRIVALS" || item.value === "ARRIVED"){
		            	item.is_disabled = false;
		            	reservation_statuses_ids_array.push(item.id);
		            } else {
		            	item.is_disabled = true;
		            }

		        });
			} else {
				angular.forEach($scope.resHkStatusList,function(item, index) {
		            item.is_disabled = false;
		        });
			}

	        $scope.eachTaskList.reservation_statuses_ids    = applyIds( $scope.resHkStatusList, reservation_statuses_ids_array);

		};
	}
]);