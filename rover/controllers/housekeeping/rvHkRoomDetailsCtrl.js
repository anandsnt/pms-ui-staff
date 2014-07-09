sntRover.controller('RVHkRoomDetailsCtrl', [
	'$scope',
	'$state',
	'$stateParams',
	'RVHkRoomDetailsSrv',
	'RVHkRoomStatusSrv',
	'roomDetailsData',
	function($scope, $state, $stateParams, RVHkRoomDetailsSrv, RVHkRoomStatusSrv, roomDetailsData) {

		BaseCtrl.call(this, $scope);

		/** Method for getting the guest status icon class
		  @return the guest status icon class  
		*/
		var getGuestStatusMapped = function(reservationStatus, isLateCheckout){
		    var viewStatus = "";

		    //If the guest is opted for late checkout
		    if(isLateCheckout == "true"){
		        return "late-check-out";
		    }

		    //Determine the guest status class based on the reservation status
		    if("RESERVED" == reservationStatus){
		        viewStatus = "arrival";
		    }else if("CHECKING_IN" == reservationStatus){
		        viewStatus = "check-in";
		    }else if("CHECKEDIN" == reservationStatus){
		        viewStatus = "inhouse";
		    }else if("CHECKEDOUT" == reservationStatus){
		        viewStatus = "departed";
		    }else if("CHECKING_OUT" == reservationStatus){
		        viewStatus = "check-out";
		    }else if("CANCELED" == reservationStatus){
		        viewStatus = "cancel";
		    }else if(("NOSHOW" == reservationStatus)||("NOSHOW_CURRENT" == reservationStatus)){
		        viewStatus = "no-show";
		    }

		    return viewStatus;
		}

		$scope.initColorCodes = function(){
			$scope.isGreen = false;
			$scope.isRed = false;
			$scope.isOutOfService = false;
			$scope.isOrange = false;
			$scope.isDefaultRoomColor = false;
			$scope.isRoomOccupied = false;
		};

		$scope.initColorCodes();
		$scope.guestViewStatus = "";

		$scope.data = roomDetailsData;

		$scope.shouldDisable = function() {
			var stat = $scope.data.room_details.current_hk_status;
			return stat === 'OO' || stat === 'OS' ? true : false;
		};

		_.each($scope.data.room_details.hk_status_list, function(hkStatusDict) { 
		    if(hkStatusDict.value == $scope.data.room_details.current_hk_status){
		    	$scope.currentHKStatus = hkStatusDict;
		    }
		});

		$scope.calculateColorCodes = function() {
			$scope.initColorCodes();

			if($scope.data.room_details.checkin_inspected_only == "true"){
				if($scope.data.room_details.current_hk_status == "INSPECTED" && $scope.data.room_details.is_occupied == "false"){
					$scope.isGreen = true;
				}else if(($scope.data.room_details.current_hk_status == "CLEAN" || $scope.data.room_details.current_hk_status == "PICKUP")
					&& $scope.data.room_details.is_occupied == "false"){
	 				$scope.isOrange = true;
				}

			} else {
				if(($scope.data.room_details.current_hk_status == "CLEAN" || $scope.data.room_details.current_hk_status == "INSPECTED")
					&& $scope.data.room_details.is_occupied == "false"){
					$scope.isGreen = true;
				}else if($scope.data.room_details.current_hk_status == "PICKUP"
					&& $scope.data.room_details.is_occupied == "false"){
	 				$scope.isOrange = true;
				}
			}

			if($scope.data.room_details.current_hk_status == "DIRTY"
	 			&& $scope.data.room_details.is_occupied == "false") {
	 			$scope.isRed = true;
	 		}else if(($scope.data.room_details.current_hk_status == "OO") ||
	    		($scope.data.room_details.current_hk_status == "OS")) {
	 			$scope.isOutOfService = true;
	 		}else {
	 			$scope.isDefaultRoomColor = true;
	 		}
		}

		$scope.calculateColorCodes();		
		$scope.guestViewStatus = getGuestStatusMapped($scope.data.room_details.reservation_status, $scope.data.room_details.is_late_checkout);

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
	}
]);