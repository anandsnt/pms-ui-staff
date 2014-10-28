sntRover.controller('RVHKWorkTabCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'$stateParams',
	'RVHkRoomDetailsSrv',
	'RVHkRoomStatusSrv',
	'$filter',
	function($scope, $rootScope, $state, $stateParams, RVHkRoomDetailsSrv, RVHkRoomStatusSrv, $filter) {

		BaseCtrl.call(this, $scope);

		// must create a copy since this scope is an inner scope
		$scope.isStandAlone = $rootScope.isStandAlone;

		// keep ref to room details in local scope
		var $_updateRoomDetails = $scope.$parent.updateRoomDetails;
		$scope.roomDetails = $scope.$parent.roomDetails;

		// default cleaning status
		// [ OPEN, IN_PROGRESS, COMPLETED ]
		var $_workStatusList = {
			open: 'OPEN',
			inProgress: 'IN_PROGRESS',
			completed: 'COMPLETED'
		}
		$scope.isCleaning = $scope.roomDetails.work_status == $_workStatusList['inProgress'] ? true : false;

		// the task completion status
		// when the user click start button and done button the status here must be used as the done status
		$scope.task_completion_status = $scope.roomDetails.task_completion_status;

		// default room HK status
		// will be changed only for connected
		if ( !$scope.isStandAlone ) {
			if ( $scope.roomDetails.hk_status_list[0].value == 'OS' ) {
				$scope.ooOsTitle = 'Out Of Service';
			} else if ( $scope.roomDetails.hk_status_list[0].value == 'OO' ) {
 				$scope.ooOsTitle = 'Out Of Order';
			} else {
				$scope.ooOsTitle = false;
			}
		} else {
			$scope.ooOsTitle = false;
		}

		// fetch maintenance reasons list
		if ( $scope.isStandAlone ) {
			$scope.workTypesList = [];
			var wtlCallback = function(data) {
				$scope.$emit('hideLoader');
				$scope.workTypesList = data;
			};
			$scope.invokeApi(RVHkRoomDetailsSrv.getWorkTypes, {}, wtlCallback);
		}

		$scope.checkShow = function(from) {
			if ( from == 'clean' && ($scope.roomDetails.current_hk_status == 'CLEAN' || $scope.roomDetails.current_hk_status == 'INSPECTED') ) {
				return true;
			};

			if ( from == 'dirty' && $scope.roomDetails.current_hk_status == 'DIRTY' ) {
				return true;
			};

			if ( from == 'pickup' && $scope.roomDetails.current_hk_status == 'PICKUP' ) {
				return true;
			};

			return false;
		};

		$scope.manualRoomStatusChanged = function() {
			var callback = function(data){
				$scope.$emit('hideLoader');
				$_updateRoomDetails( 'current_hk_status', $scope.roomDetails.current_hk_status );
				RVHkRoomStatusSrv.updateHKStatus({
					id: $scope.roomDetails.id,
					current_hk_status: $scope.roomDetails.current_hk_status
				});
			}

			var hkStatusItem = _.find($scope.roomDetails.hk_status_list, function(item) {
				return item.value == $scope.roomDetails.current_hk_status;
			});

			var data = {
				'room_no': $scope.roomDetails.current_room_no, 
				'hkstatus_id': hkStatusItem.id
			}

			$scope.invokeApi(RVHkRoomDetailsSrv.updateHKStatus, data, callback);
		};


		// start cleaning 
		$scope.startCleaning = function() {
			var callback = function() {
				$scope.$emit('hideLoader');

				// update local data
				$scope.roomDetails.work_status = $_workStatusList['inProgress'];
				$scope.isCleaning = true;
			};

			var params = {
				room_id: $scope.roomDetails.id,
				work_sheet_id: $scope.roomDetails.work_sheet_id
			}

			$scope.invokeApi(RVHkRoomDetailsSrv.postRecordTime, params, callback);
		};

		// done cleaning
		$scope.doneCleaning = function() {
			var callback = function() {
				$scope.$emit('hideLoader');

				// update local data
				$scope.roomDetails.work_status = $_workStatusList['completed'];
				$scope.isCleaning = false;
			
				// update 'current_hk_status' to 'task_completion_status'
				$_updateRoomDetails( 'current_hk_status', $scope.task_completion_status || "CLEAN" );
			};

			var params = {
				room_id: $scope.roomDetails.id,
				work_sheet_id: $scope.roomDetails.work_sheet_id,
				task_completion_status : $scope.roomDetails.task_completion_status_id
			}

			$scope.invokeApi(RVHkRoomDetailsSrv.postRecordTime, params, callback);
		};
	}
]);