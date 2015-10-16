sntRover.controller('RVValidateEmailPhoneCtrl',['$rootScope', '$scope', '$state', 'ngDialog', 'RVValidateCheckinSrv',  function($rootScope, $scope, $state, ngDialog, RVValidateCheckinSrv){
	BaseCtrl.call(this, $scope);

	$scope.showEmail = ($scope.guestCardData.contactInfo.email === '' || $scope.guestCardData.contactInfo.email === null) ? true : false;
	$scope.showPhone = ($scope.guestCardData.contactInfo.phone === '' || $scope.guestCardData.contactInfo.phone === null) ? true : false;
	$scope.saveData = {};
	$scope.saveData.email = "";
	$scope.saveData.phone = "";
	$scope.saveData.guest_id = "";
	$scope.saveData.user_id = "";
        $scope.putInQueue = false;


	//CICO-13907
	$scope.hasAnySharerCheckedin = function(){
		var isSharerCheckedin = false;
		angular.forEach($scope.reservationData.reservation_card.sharer_information, function(sharer, key){
			if(sharer.reservation_status === 'CHECKEDIN' || sharer.reservation_status === 'CHECKING_OUT'){
				isSharerCheckedin = true;
				return false;
			}
		});
		return isSharerCheckedin;
	};

	$scope.clickCancel = function(){
		ngDialog.close();
	};
        
        $scope.checkGuestInFromQueue = false;
        $scope.putGuestInQueue = false;
        if (!$rootScope.reservationQueueWatch){//alternative to $destroy, this is an init-once method
            $rootScope.reservationQueueWatch = 1;

            $rootScope.$on('putGuestInQueue',function(){
                $scope.putGuestInQueue = true;
                $rootScope.putGuestInQueue = true;
                
                $scope.checkGuestInFromQueue = false;
                $rootScope.checkGuestInFromQueue = false;
            });
            $rootScope.$on('checkGuestInFromQueue',function(){
                $scope.checkGuestInFromQueue = true;
                $rootScope.checkGuestInFromQueue = true;
                
                $scope.putGuestInQueue = false;
                $rootScope.putGuestInQueue = false;
            });
            $rootScope.$on('normalCheckInNotQueued',function(){
                $scope.checkGuestInFromQueue = false;
                $rootScope.checkGuestInFromQueue = false;
                
                $scope.putGuestInQueue = false;
                $rootScope.putGuestInQueue = false;
            });
        }
	$scope.validateEmailPhoneSuccessCallback = function(){

		if($scope.showEmail && $scope.showPhone){
			$scope.guestCardData.contactInfo.phone = $scope.saveData.phone;
			$scope.guestCardData.contactInfo.email = $scope.saveData.email;
		} else if($scope.showPhone){
			$scope.guestCardData.contactInfo.phone = $scope.saveData.phone;
		} else if($scope.showEmail){
			$scope.guestCardData.contactInfo.email = $scope.saveData.email;
		}

		$scope.$emit('hideLoader');
		ngDialog.close();
		$scope.goToNextView();
	};
        $scope.roomAssignmentNeeded = function(){
            if ($scope.reservationData.reservation_card.room_number === '' || $scope.reservationData.reservation_card.room_ready_status === 'DIRTY' || $scope.reservationData.reservation_card.room_status !== 'READY' || $scope.reservationData.reservation_card.fo_status !== 'VACANT'){
                return true;
            } else return false;
        };
        $scope.upsellNeeded = function(){
            if ($scope.reservationData.reservation_card.is_force_upsell === "true" && $scope.reservationData.reservation_card.is_upsell_available === "true"){
                return true;
            } else return false;
        };
        $scope.readyToPutInQueue = function(){
            if (($scope.putGuestInQueue || $rootScope.putGuestInQueue) && !$scope.roomAssignmentNeeded() && !$scope.upsellNeeded() && !$scope.checkGuestInFromQueue){
                return true;
            } else return false;
        };
	$scope.goToNextView = function(){
            var avoidingBillCard = false;
            
            if ((!$scope.checkGuestInFromQueue || !$rootScope.checkGuestInFromQueue) && ($scope.putGuestInQueue || $rootScope.putGuestInQueue)){
                avoidingBillCard = true;
            } else {
                 avoidingBillCard = false;
            }
            
            
            if ($scope.readyToPutInQueue() && avoidingBillCard){
                //close dialog (which is done at this point, then just upadate the queue)
                $rootScope.$emit('putInQueueAdvanced');
                $rootScope.$emit('putGuestInQueue');
                return;
            }
            
            
		if(($scope.hasAnySharerCheckedin() && !avoidingBillCard) || $scope.checkGuestInFromQueue) {//straight to signature, skip room upgrades CICO-19673
			$state.go('rover.reservation.staycard.billcard', {"reservationId": $scope.reservationData.reservation_card.reservation_id, "clickedButton": "checkinButton"});
                        
		} else if($scope.roomAssignmentNeeded()){
			//TO DO:Go to room assignemt viw
			$state.go("rover.reservation.staycard.roomassignment", {
                            "reservation_id" : $scope.reservationData.reservation_card.reservation_id, 
                            "room_type": $scope.reservationData.reservation_card.room_type_code, 
                            "clickedButton": "checkinButton"
                        });
                        if ($scope.putGuestInQueue){
                              setTimeout(function(){
                                $rootScope.$emit('putGuestInQueue');
                            },1000);
                          }
                        
		} else if ($scope.upsellNeeded() && !$scope.checkGuestInFromQueue){
			//TO DO : GO TO ROOM UPGRAFED VIEW
			  $state.go('rover.reservation.staycard.upgrades', {"reservation_id" : $scope.reservationData.reservation_card.reservation_id, "clickedButton": "checkinButton"});
                          if ($scope.putGuestInQueue){
                              setTimeout(function(){
                                $rootScope.$emit('putGuestInQueue');
                            },1000);
                          }
                          
                          
		} else{
                    if (!avoidingBillCard){
			$state.go('rover.reservation.staycard.billcard', {"reservationId": $scope.reservationData.reservation_card.reservation_id, "clickedButton": "checkinButton"});
                    } //else just close the popup
                        
		}
                
                
	};
	$scope.submitAndGoToCheckin = function(){
			$scope.saveData.guest_id = $scope.guestCardData.guestId;
	        $scope.saveData.user_id = $scope.guestCardData.userId;
	        var isValidDataExist = false;
			if($scope.showEmail && $scope.showPhone){
				$scope.saveData = $scope.saveData;
				if($scope.saveData.email !== '' || $scope.saveData.phone !== '') {
					isValidDataExist = true;
				}
			} else if($scope.showPhone){
				var unwantedKeys = ["email"]; // remove unwanted keys for API
				$scope.saveData = dclone($scope.saveData, unwantedKeys);
				if($scope.saveData.phone !== '') {
					isValidDataExist = true;
				}
			} else {
				var unwantedKeys = ["phone"]; // remove unwanted keys for API
				$scope.saveData = dclone($scope.saveData, unwantedKeys);
				if($scope.saveData.email !== '') {
					isValidDataExist = true;
				}
			}
			if(isValidDataExist){  // CICO-15079 : Validation for phone/email data being blank.
				$scope.invokeApi(RVValidateCheckinSrv.saveGuestEmailPhone, $scope.saveData, $scope.validateEmailPhoneSuccessCallback);
			}
	};
	$scope.submitAndCheckinSuccessCallback = function(){
		$scope.guestCardData.contactInfo.email = $scope.saveData.email;
		$scope.$emit('hideLoader');
		ngDialog.close();
	};
	$scope.submitAndCheckin = function(){
			$scope.saveData.guest_id = $scope.guestCardData.guestId;
	        $scope.saveData.user_id = $scope.guestCardData.userId;
			var unwantedKeys = ["phone"]; // remove unwanted keys for API
			$scope.saveData = dclone($scope.saveData, unwantedKeys);
			$scope.invokeApi(RVValidateCheckinSrv.saveGuestEmailPhone, $scope.saveData, $scope.submitAndCheckinSuccessCallback);
	};
	$scope.ignoreAndGoToCheckin = function(){
		$scope.closeDialog();
		$scope.goToNextView();
	};
        
        $scope.initAdvQueCheck = function(){
            var adv = $rootScope.advanced_queue_flow_enabled;
            var viaQueue = $scope.reservationData.check_in_via_queue;

            if (adv && viaQueue){
               $scope.putInQueue = true;
            } else {
                $scope.putInQueue = false;
            }
        };
        $scope.initAdvQueCheck();
	$scope.$emit('hideLoader');
}]);