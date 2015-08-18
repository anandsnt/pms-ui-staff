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
		};

		// by default they are null
		// with the type object (typeof null === 'object')
		$scope.isStarted   = null;
		$scope.isCompleted = null;
		$scope.isOpen      = null;

		var $_updateWorkStatusFlags = function() {
			$scope.isStarted   = $scope.roomDetails.work_status === $_workStatusList['inProgress'] ? true : false;
			$scope.isCompleted = $scope.roomDetails.work_status === $_workStatusList['completed']  ? true : false;
			$scope.isOpen      = $scope.roomDetails.work_status === $_workStatusList['open']       ? true : false;
		};

		// only for standalone will these get typecasted to booleans
		$scope.isStandAlone && $_updateWorkStatusFlags();



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


		// start working
		$scope.startWorking = function() {
			var callback = function() {
				$scope.$emit('hideLoader');

				// update local data
				$scope.roomDetails.work_status = $_workStatusList['inProgress'];
				$_updateWorkStatusFlags();
			};

			var params = {
				room_id: $scope.roomDetails.id,
				work_sheet_id: $scope.roomDetails.work_sheet_id
			};

			$scope.invokeApi(RVHkRoomDetailsSrv.postRecordTime, params, callback);
		};

		// done working
		$scope.doneWorking = function() {
			var callback = function() {
				$scope.$emit('hideLoader');

				// update local data
				$scope.roomDetails.work_status = $_workStatusList['completed'];
				$_updateWorkStatusFlags();

				// since this value could be empty
				if ( !!$scope.roomDetails.task_completion_status ) {
					// update 'current_hk_status' to 'task_completion_status', this should call '$scope.manualRoomStatusChanged'
					$scope.roomDetails.current_hk_status = $scope.roomDetails.task_completion_status;
				};
			};

			var params = {
				room_id: $scope.roomDetails.id,
				work_sheet_id: $scope.roomDetails.work_sheet_id,
				task_completion_status : $scope.roomDetails.task_completion_status_id
			};

			$scope.invokeApi(RVHkRoomDetailsSrv.postRecordTime, params, callback);
		};
	}
]);