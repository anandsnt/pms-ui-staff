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

		// keep ref to room details in local scope
		$scope.roomDetails = $scope.$parent.roomDetails;

		// default cleaning status
		$scope.isCleaning = false;

		// must create a copy since this scope is an inner scope
		$scope.isStandAlone = $rootScope.isStandAlone;

		// default room HK status
		// will be changed only for connected
		if ( !$rootScope.isStandAlone ) {
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
		if ( $rootScope.isStandAlone ) {
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


		$scope.standaloneRoomStatusChanged = function() {
			// nothing yet
		};

		$scope.connectedRoomStatusChanged = function() {
			var callback = function(data){
				$scope.$emit('hideLoader');
				RVHkRoomStatusSrv.updateHKStatus({
					id: $scope.roomDetails.id,
					current_hk_status: $scope.roomDetails.current_hk_status
				})
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

				$scope.isCleaning = false;
			
				// update the 'cuurent_hk_status' to 'CLEAN'
				updateRoom( 'current_hk_status', 'CLEAN' );
			};

			var params = {
				room_id: $scope.roomDetails.id,
				work_sheet_id: $scope.roomDetails.work_sheet_id
			}

			$scope.invokeApi(RVHkRoomDetailsSrv.postRecordTime, params, callback);
		};
	}
]);