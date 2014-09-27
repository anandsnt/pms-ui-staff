sntRover.controller('RVHKWorkTabCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'$stateParams',
	'RVHkRoomDetailsSrv',
	'$filter',
	function($scope, $rootScope, $state, $stateParams, RVHkRoomDetailsSrv, $filter) {

		BaseCtrl.call(this, $scope);

		// keep ref to room details in local scope
		var updateRoom = $scope.$parent.updateRoom;
		$scope.roomDetails = $scope.$parent.roomDetails;

		// default cleaning status
		$scope.isCleaning = false;

		// fetch maintenance reasons list
		$scope.workTypesList = [];
		var wtlCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.workTypesList = data;
		};
		$scope.invokeApi(RVHkRoomDetailsSrv.getWorkTypes, {}, wtlCallback);


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


		$scope.roomStatusChanged = function() {
			updateRoom( 'current_hk_status', $scope.roomDetails.current_hk_status );
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