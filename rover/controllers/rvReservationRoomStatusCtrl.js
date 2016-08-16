angular.module('sntRover').controller('reservationRoomStatus',
    [ '$state',
    '$rootScope',
    '$scope',
    'ngDialog',
    '$stateParams',
    'RVKeyPopupSrv',
    'RVReservationCardSrv',
    'rvPermissionSrv',
    'RVReservationSummarySrv',
    '$timeout',
	function($state, $rootScope, $scope, ngDialog, $stateParams, RVKeyPopupSrv, RVReservationCardSrv,rvPermissionSrv, RVReservationSummarySrv, $timeout){
	BaseCtrl.call(this, $scope);
	$scope.encoderTypes = [];


    $timeout(function() { $scope.$apply(); }, 3000);
    //CICO- 6086 - New class for lock
	$scope.getRoomClass = function(reservationStatus, cannotMoveRoom){
		var reservationRoomClass = '';
		if(reservationStatus === 'CANCELED'){
			reservationRoomClass ='overlay';
		} else if (cannotMoveRoom && $scope.reservationData.reservation_card.room_number !== ""){
            reservationRoomClass = 'has-lock hover-hand';
        }
		else if( !$rootScope.isStandAlone && reservationStatus !== 'NOSHOW' && reservationStatus !== 'CHECKEDOUT' && reservationStatus !== 'CANCELED' && reservationStatus !== 'CHECKEDIN' && reservationStatus !== 'CHECKING_OUT'){
			reservationRoomClass = 'has-arrow hover-hand';
		}
		else if($rootScope.isStandAlone && reservationStatus !== 'NOSHOW' && reservationStatus !== 'CHECKEDOUT' && reservationStatus !== 'CANCELED'){
			reservationRoomClass = 'has-arrow hover-hand';
		}
		return reservationRoomClass;
	};

	$scope.getRoomStatusClass = function(reservationStatus, roomStatus, foStatus, roomReadyStatus, checkinInspectedOnly){

		var reservationRoomStatusClass = "";
		if(reservationStatus === 'CHECKING_IN'){

			if(roomReadyStatus!==''){
				if(foStatus === 'VACANT'){
					switch(roomReadyStatus) {

						case "INSPECTED":
							reservationRoomStatusClass = ' room-green';
							break;
						case "CLEAN":
							if (checkinInspectedOnly === "true") {
								reservationRoomStatusClass = ' room-orange';
								break;
							} else {
								reservationRoomStatusClass = ' room-green';
								break;
							}
							break;
						case "PICKUP":
							reservationRoomStatusClass = " room-orange";
							break;

						case "DIRTY":
							reservationRoomStatusClass = " room-red";
							break;

		        }

				} else {
					reservationRoomStatusClass = "room-red";
				}

			}
		}
		return reservationRoomStatusClass;
	};

	$scope.showUpgradeButton = function(reservationStatus,  isUpsellAvailable){
		var showUpgrade = false;
		if($scope.hasAnySharerCheckedin()){
			return false;
		}
		if((isUpsellAvailable === 'true') && $scope.isFutureReservation(reservationStatus)){
			showUpgrade = true;
		}
		return showUpgrade;
	};
	$scope.isFutureReservation = function(reservationStatus){
		return (reservationStatus === 'RESERVED' || reservationStatus === 'CHECKING_IN');
	};


	$scope.showKeysButton = function(reservationStatus){
		var showKey = false;
		if((reservationStatus === 'CHECKING_IN' && $scope.reservationData.reservation_card.room_number !== '')|| reservationStatus === 'CHECKING_OUT' || reservationStatus === 'CHECKEDIN'){
			showKey = true;
		}
                //then check if the current user has permission
                if (!$scope.hasPermissionToCreateKeys()){
                    showKey = false;
                }
		return showKey;
	};
        $scope.hasPermissionToCreateKeys = function() {
                return rvPermissionSrv.getPermissionValue('CREATE_KEY');
        };
	$scope.addHasButtonClass = function(reservationStatus,  isUpsellAvailable){
		var hasButton = "";
		if($scope.showKeysButton(reservationStatus) && $scope.showUpgradeButton(reservationStatus,  isUpsellAvailable)){
			hasButton = "has-buttons";
		}
		else if($scope.showKeysButton(reservationStatus) || $scope.showUpgradeButton(reservationStatus,  isUpsellAvailable)){
			hasButton = "has-button";
		}
		return hasButton;
	};

        $scope.$on('clickedIconKeyFromQueue',function(){
            $scope.clickedIconKey();//one less thing for user to do
        });
	// To handle click of key icon.
	$scope.clickedIconKey = function(){
		var keySettings = $scope.reservationData.reservation_card.key_settings;
		$scope.viewFromBillScreen = false;
		if(keySettings === "email"){
                    ngDialog.open({
                        template: '/assets/partials/keys/rvKeyEmailPopup.html',
                        controller: 'RVKeyEmailPopupController',
                        className: '',
                        scope: $scope
                    });
		} else if ($scope.reservationData.reservation_card.reservation_status !== 'CHECKING_IN'){
                    ngDialog.open({
                        template: '/assets/partials/keys/rvKeyPopupNewDuplicate.html',
                        controller: 'RVKeyQRCodePopupController',
                        className: '',
                        scope: $scope
                    });
                } else if ($scope.reservationData.reservation_card.reservation_status === 'CHECKING_IN'){
                    $scope.newKeyInit();
                }
	};

        $scope.keyInitPopup = function(){

		var keySettings = $scope.reservationData.reservation_card.key_settings;
		 if(keySettings === "qr_code_tablet"){

                    //Fetch and show the QR code in a popup
                    var	reservationId = $scope.reservationData.reservation_card.reservation_id;

                    var successCallback = function(data){
                            $scope.$emit('hideLoader');
                            $scope.data = data;

                        ///put NEW / Duplicate here
                            ngDialog.open({
                                     template: '/assets/partials/keys/rvKeyQrcodePopup.html',
                                     controller: 'RVKeyQRCodePopupController',
                                     className: '',
                                     scope: $scope
                            });
                    };

                    $scope.invokeApi(RVKeyPopupSrv.fetchKeyQRCodeData,{ "reservationId": reservationId }, successCallback);
		}

		//Display the key encoder popup
		else if(keySettings === "encode" || keySettings === "mobile_key_encode"){
            if($scope.reservationData.reservation_card.is_remote_encoder_enabled && $scope.encoderTypes !== undefined && $scope.encoderTypes.length <= 0){
                fetchEncoderTypes();
            } else {
                openKeyEncodePopup();
            }
		}
        };

        $scope.duplicateKeyInit = function(){
            $scope.keyType = 'Duplicate';
            $scope.keyInitPopup();
            $rootScope.$broadcast('MAKE_KEY_TYPE',{type:'Duplicate'});
        };

        $scope.newKeyInit = function(){
            $scope.keyType = 'New';
            $scope.keyInitPopup();
            $rootScope.$broadcast('MAKE_KEY_TYPE',{type:'New'});
        };

	var openKeyEncodePopup = function(){
		ngDialog.open({
		    template: '/assets/partials/keys/rvKeyEncodePopup.html',
		    controller: 'RVKeyEncodePopupCtrl',
		    className: '',
		    scope: $scope
		});
	};

	//Fetch encoder types for if remote encoding enabled
	var fetchEncoderTypes = function(){

		var encoderFetchSuccess = function(data){
			$scope.$emit('hideLoader');
			$scope.encoderTypes = data;
			openKeyEncodePopup();
		};

	    $scope.invokeApi(RVKeyPopupSrv.fetchActiveEncoders, {}, encoderFetchSuccess);
	};

	/**
	* function for close activity indicator.
	*/
	$scope.closeActivityIndication = function(){
		$scope.$emit('hideLoader');
	};

	$scope.goToRoomUpgrades = function(){
		$state.go("rover.reservation.staycard.upgrades", {reservation_id:$scope.reservationData.reservation_card.reservation_id, "clickedButton": "upgradeButton"});
	};

	/**
	 * utility method used to redirect to diary in edit mode
	 * @return undefined
	 */
	var gotToDiaryInEditMode = function(){
		RVReservationCardSrv.checkinDateForDiary = $scope.reservationData.reservation_card.arrival_date.replace(/-/g, '/');
		$state.go('rover.diary', {
			reservation_id: $scope.reservationData.reservation_card.reservation_id,
			checkin_date: $scope.reservationData.reservation_card.arrival_date
		});
	};
	/**
	* function to trigger room assignment.
	*/
	$scope.goToroomAssignment = function(){

		//CICO-13907 Do not allow to go to room assignment screen if the resevation  any of its shred reservation is checked in.
		if($scope.hasAnySharerCheckedin() || ($scope.reservationData.reservation_card.cannot_move_room && !rvPermissionSrv.getPermissionValue('DO_NOT_MOVE_RESERVATION'))){
			return false;
		}
		//check if roomupgrade is available
		var reservationStatus = $scope.reservationData.reservation_card.reservation_status;
        var isUpgradeAvaiable = $scope.reservationData.reservation_card.is_upsell_available === "true" && (reservationStatus === 'RESERVED' || reservationStatus === 'CHECKING_IN'),
            cannotMoveState   =  $scope.reservationData.reservation_card.cannot_move_room && $scope.reservationData.reservation_card.room_no;
		if($scope.reservationData.reservation_card.is_hourly_reservation){
			gotToDiaryInEditMode ();
		} else if($scope.isFutureReservation($scope.reservationData.reservation_card.reservation_status)){

			$state.go("rover.reservation.staycard.roomassignment", {reservation_id:$scope.reservationData.reservation_card.reservation_id, room_type:$scope.reservationData.reservation_card.room_type_code, "clickedButton": "roomButton","upgrade_available" : isUpgradeAvaiable, "cannot_move_room": cannotMoveState});
		}else if($scope.reservationData.reservation_card.reservation_status==="CHECKEDIN" && $rootScope.isStandAlone){ // As part of CICO-27631 added Check for overlay hotels
			$state.go("rover.reservation.staycard.roomassignment", {reservation_id:$scope.reservationData.reservation_card.reservation_id, room_type:$scope.reservationData.reservation_card.room_type_code, "clickedButton": "roomButton","upgrade_available" : isUpgradeAvaiable, "cannot_move_room": cannotMoveState});
		}

	};
    var successCallBackOfSaveReservation = function(){
        $scope.reservationData.reservation_card.cannot_move_room = !$scope.reservationData.reservation_card.cannot_move_room;
    };
    /*
     * Do not move - lock/unlock room
     *
     */
    $scope.toggleDoNotMove= function(){

        var updateParams = {
            "no_room_move": !$scope.reservationData.reservation_card.cannot_move_room,
            "reservationId": $scope.reservationData.reservation_card.reservation_id
        }

        var options = {
            params:             updateParams,
            successCallBack:    successCallBackOfSaveReservation
        };
        $scope.callAPI(RVReservationSummarySrv.updateReservation, options);
    }

    $scope.showDoNotMoveToggleButton = function(){
        var shouldShowDNMToggleButton = true,
            reservationStatus = $scope.reservationData.reservation_card.reservation_status;

        if( reservationStatus === 'NOSHOW' || reservationStatus === 'CHECKEDOUT' || reservationStatus === 'CANCELED' || $scope.reservationData.reservation_card.room_number === ""){
            shouldShowDNMToggleButton = false;
        }

        return shouldShowDNMToggleButton;
    };

    var keySettings = $scope.reservationData.reservation_card.key_settings;
    $scope.showPopupsOnlineOfflineRoomMove = function(){
        setTimeout(function(){
            if(keySettings === "email"){
                    ngDialog.open({
                        template: '/assets/partials/keys/rvKeyEmailPopup.html',
                        controller: 'RVKeyEmailPopupController',
                        className: '',
                        scope: $scope
                    });
            } else {
                $scope.keyInitPopup();
            }

        }, 700)
    };



    if($rootScope.isStandAlone && !$rootScope.isHourlyRateOn){
        if((($stateParams.isOnlineRoomMove == null && $stateParams.isKeySystemAvailable) || $stateParams.isOnlineRoomMove == "false"
            || ($stateParams.isOnlineRoomMove == "true" && (keySettings === "email" || keySettings === "qr_code_tablet")))
            && ($scope.showKeysButton($scope.reservationData.reservation_card.reservation_status)
            && $scope.reservationData.reservation_card.reservation_status === "CHECKEDIN")){

                $scope.showPopupsOnlineOfflineRoomMove();
        }

    }


    $scope.$watch('reservationData.reservation_card.room_number',function(){
       if ($rootScope.viaSharerPopup){
            $rootScope.$broadcast('SETPREV_RESERVATION',$rootScope.viaSharerName);
            $rootScope.viaSharerPopup = false;
       }
    });

    $rootScope.$on('VIA_SHARER_ON',function(fullname){
        $scope.reservationData.viaSharerName = fullname;
        $rootScope.viaSharerPopup = true;
    });


}]);