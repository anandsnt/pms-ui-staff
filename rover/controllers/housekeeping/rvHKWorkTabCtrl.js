angular.module('sntRover').controller('RVHKWorkTabCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'$stateParams',
	'RVHkRoomDetailsSrv',
	'RVHkRoomStatusSrv',
	'$filter',
	'$timeout',
	function($scope, $rootScope, $state, $stateParams, RVHkRoomDetailsSrv, RVHkRoomStatusSrv, $filter, $timeout) {

		BaseCtrl.call(this, $scope);

		// must create a copy since this scope is an inner scope
		$scope.isStandAlone = $rootScope.isStandAlone;

		// set the scroller
		$scope.setScroller('room-status-content');

		$timeout(function() {$scope.refreshScroller('room-status-content');}, 1500);

		$scope.isTaskPresent = function () {
			return $scope.roomDetails.task_details.length != 0;
		};

		// keep ref to room details in local scope
		var $_updateRoomDetails = $scope.$parent.updateRoomDetails;
		$scope.roomDetails = $scope.$parent.roomDetails;

		$scope.taskDetails = $scope.roomDetails.task_details;
		if($scope.isTaskPresent()) { 
			$scope.currentTask = $scope.taskDetails[0];
			$scope.currentTaskID = $scope.currentTask.id;
		}



		// default cleaning status
		// [ OPEN, IN_PROGRESS, COMPLETED ]
		var $_workStatusList = {
			open: 'OPEN',
			inProgress: 'IN_PROGRESS',
			completed: 'COMPLETED'
		};

		// by default they are false
		$scope.isStarted   = false;
		$scope.isCompleted = false;
		$scope.isOpen      = false;

		$scope.disableDone  = false;
		$scope.disableStart = false;

		var $_updateWorkStatusFlags = function() {
			$scope.isStarted   = $scope.currentTask.work_status === $_workStatusList['inProgress'] ? true : false;
			$scope.isCompleted = $scope.currentTask.work_status === $_workStatusList['completed']  ? true : false;
			$scope.isOpen      = $scope.currentTask.work_status === $_workStatusList['open']       ? true : false;

			if ( $scope.currentTask.assigned_maid_id !== $rootScope.userId ) {
				$scope.disableDone  = true;
				$scope.disableStart = true;
			} else {
				$scope.disableDone  = false;
				$scope.disableStart = false;
			}
		};

		// only for standalone will these get typecasted to booleans
		$scope.taskDetails.length && $scope.isStandAlone && $_updateWorkStatusFlags();



		// default room HK status
		// will be changed only for connected
		if ( !$scope.isStandAlone ) {
			if ( $scope.roomDetails.hk_status_list[0].value === 'OS' ) {
				$scope.ooOsTitle = 'Out Of Service';
			} else if ( $scope.roomDetails.hk_status_list[0].value === 'OO' ) {
 				$scope.ooOsTitle = 'Out Of Order';
			} else {
				$scope.ooOsTitle = false;
			}
		} else {
			$scope.ooOsTitle = false;
		}

		$scope.checkShow = function(from) {
			if ( from === 'clean' && ($scope.roomDetails.current_hk_status === 'CLEAN' || $scope.roomDetails.current_hk_status === 'INSPECTED') ) {
				return true;
			};

			if ( from === 'dirty' && $scope.roomDetails.current_hk_status === 'DIRTY' ) {
				return true;
			};

			if ( from === 'pickup' && $scope.roomDetails.current_hk_status === 'PICKUP' ) {
				return true;
			};

			return false;
		};

		$scope.manualRoomStatusChanged = function() {
			var callback = function(data){
				$scope.$emit('hideLoader');
				$scope.refreshScroller('room-status-content');
				$_updateRoomDetails( 'current_hk_status', $scope.roomDetails.current_hk_status );
			};

			var hkStatusItem = _.find($scope.roomDetails.hk_status_list, function(item) {
				return item.value === $scope.roomDetails.current_hk_status;
			});

			var data = {
				'room_no': $scope.roomDetails.current_room_no,
				'hkstatus_id': hkStatusItem.id
			};

			$scope.invokeApi(RVHkRoomDetailsSrv.updateHKStatus, data, callback);
		};

		// action for task cahnge 

		$scope.changedTask = function(currentTaskID) {

			$scope.currentTask = _.find($scope.taskDetails, function(item) {
				return item.id === currentTaskID;
			});
			$_updateWorkStatusFlags();
			runDigestCycle();
		};

		/**
		 * to run angular digest loop,
		 * will check if it is not running
		 * return - None
		 */
		var runDigestCycle = function() {
			if (!$scope.$$phase) {
				$scope.$digest();
			}
		};

		// start working
		$scope.startWorking = function() {
			var callback = function() {
				$scope.$emit('hideLoader');

				// update local data
				$scope.refreshScroller('room-status-content');
				$scope.currentTask.work_status = $_workStatusList['inProgress'];
				$_updateWorkStatusFlags();
			};

			var params = {
				room_id: $scope.roomDetails.id,
				work_sheet_id: $scope.currentTask.work_sheet_id,
				task_id : $scope.currentTask.id
			};

			$scope.invokeApi(RVHkRoomDetailsSrv.postRecordTime, params, callback);
		};

		// done working
		$scope.doneWorking = function() {
			var callback = function() {
				$scope.$emit('hideLoader');

				// update local data
				$scope.refreshScroller('room-status-content');
				$scope.currentTask.work_status = $_workStatusList['completed'];
				$_updateWorkStatusFlags();

				// since this value could be empty
				if ( !!$scope.currentTask.task_completion_status ) {
					// update 'current_hk_status' to 'task_completion_status', this should call '$scope.manualRoomStatusChanged'
					$scope.roomDetails.current_hk_status = $scope.currentTask.task_completion_status;
				};
			};

			var params = {
				room_id: $scope.roomDetails.id,
				work_sheet_id: $scope.currentTask.work_sheet_id,
				task_completion_status : $scope.currentTask.task_completion_status_id,
				task_id : $scope.currentTask.id
			};

			$scope.invokeApi(RVHkRoomDetailsSrv.postRecordTime, params, callback);
		};

		$scope.$on('reloadPage', function (data) {
			$scope.roomDetails = data;
		});
	}
]);