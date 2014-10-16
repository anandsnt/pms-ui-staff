sntRover.controller('RVHkRoomDetailsCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'$stateParams',
	'RVHkRoomDetailsSrv',
	'RVHkRoomStatusSrv',
	'roomDetailsData',
	'$filter',
	function($scope, $rootScope, $state, $stateParams, RVHkRoomDetailsSrv, RVHkRoomStatusSrv, roomDetailsData, $filter) {

		BaseCtrl.call(this, $scope);

		// set the previous state
		$rootScope.setPrevState = {
		    title: $filter('translate')('ROOM_STATUS'),
		    name: 'rover.housekeeping.roomStatus',
		    param: {}
		}

		$scope.setTitle( $filter('translate')('ROOM_DETAILS') );
		$scope.heading = $filter('translate')('ROOM_DETAILS');
	    $scope.$emit("updateRoverLeftMenu", "roomStatus");

		$scope.updateHKStatus = function(){	
			$scope.$emit('showLoader');	
			RVHkRoomDetailsSrv.updateHKStatus($scope.data.room_details.current_room_no, $scope.currentHKStatus.id).then(function(data) {
				$scope.$emit('hideLoader');
				$scope.data.room_details.current_hk_status = $scope.currentHKStatus.value;
				$scope.calculateColorCodes();

				RVHkRoomStatusSrv.updateHKStatus( $scope.data.room_details );
			}, function(){
				$scope.$emit('hideLoader');
			});
		};


		// stop bounce effect only on the room-details
		var roomDetailsEl = document.getElementById( '#room-details' );
		angular.element( roomDetailsEl )
			.bind( 'ontouchmove', function(e) {
				e.stopPropagation();
			});








		$scope.roomDetails = roomDetailsData;


		$scope.getHeaderColor = function() {
			// if room is out
			if ( $scope.roomDetails.room_reservation_hk_status != 1 ) {
				return 'out';
			};

			// if the room is clean
			if ( $scope.roomDetails.current_hk_status == 'CLEAN' ) {
				return 'clean';
			};

			// if the room is dirty
			if ( $scope.roomDetails.current_hk_status == 'DIRTY' ) {
				return 'dirty';
			};

			// if the room is pickup
			if ( $scope.roomDetails.current_hk_status == 'PICKUP' ) {
				return 'pickup';
			};

			// if the room is inspected
			if ( $scope.roomDetails.current_hk_status == 'INSPECTED' ) {
				return 'inspected';
			};
		};


		// default open tab
		// connected default to 'Work'
		// stanAlone and maintainceStaff default to 'Work'
		if ( !$rootScope.isStandAlone || ($rootScope.isStandAlone && $rootScope.isMaintenanceStaff) ) {
			$scope.openTab = 'Work';
		} else {
			$scope.openTab = 'Guest';
		}


		// methods to switch tab
		$scope.tabSwitch = function(tab) {
			if ( !!tab ) {
				$scope.openTab = tab;
			};
		};

		$scope.updateRoomDetails = function(prop, value) {
			if ( $scope.roomDetails.hasOwnProperty(prop) ) {
				$scope.roomDetails[prop] = value;
				$scope.getHeaderColor();
			} else {
				console.info( 'RVHkRoomDetailsCtrl: No prop "' + prop + '" found on $scope.roomDetails' );
			}
		};
	}
]);