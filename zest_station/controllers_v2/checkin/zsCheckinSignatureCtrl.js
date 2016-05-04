sntZestStation.controller('zsCheckinSignatureCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'zsEventConstants',
	'$controller',
	'$timeout',
	'zsCheckinSrv',
	'zsModeConstants',
	'zsGeneralSrv',
	function($scope, $stateParams, $state, zsEventConstants,$controller,$timeout, zsCheckinSrv, zsModeConstants, zsGeneralSrv) {
                

            /*
             *  Card Signature View - Used for Credit Card or Deposit via Credit Card
             */

            ///signature ----

            $scope.clearSignature = function(){
                $scope.signatureData = '';
                $("#signature").jSignature("clear");
            };
            
            $scope.submitSignature = function(){
                /*
                 * this method will check the guest in after swiping a card
                 */
                $scope.signatureData = JSON.stringify($("#signature").jSignature("getData", "native"));
                if ($scope.signatureData !== [] && $scope.signatureData !== null && $scope.signatureData !== '' && $scope.signatureData !== '[]'){
                    checkInGuest();
                }
            };

            var afterGuestCheckinCallback = function(response){
                console.info('response from guest check-in',response)
                $scope.$emit('hideLoader');       
                var haveValidGuestEmail = guestEmailOnFile();//also sets the email to use for delivery
                var successfulCheckIn = (response.status === "success")? true : false;
                console.info('successfulCheckIn: ',successfulCheckIn);
                //detect if coming from email input
                if (haveValidGuestEmail && successfulCheckIn){
                    console.info('--')
                    console.info('go make keys');
                    console.info('--')
                        $state.go('zest_station.checkinKeyDispense',{
                            "reservationId" : $stateParams.id,
                            "room": $stateParams.room_no,
                            "first_name": $stateParams.first_name
                        });
                    return;
                } else if (!successfulCheckIn) {
                    console.warn(response);
                    $scope.$emit('hideLoader');
                    $state.go('zest_station.error');
                    
                } else {//successful check-in but missing email on reservation
                    $state.go('zest_station.input_reservation_email_after_swipe');
                }
                
            };
            
            var checkInGuest = function(){
                //payment_type = $scope.selectedReservation.payment_type,
                var signature = $scope.signatureData;
                $scope.setCheckInMessage();
                var checkinParams = {
                     'reservation_id':$stateParams.id, 
                     'workstation_id':$state.workstation_id, 
                     "authorize_credit_card": false,
                     "do_not_cc_auth": false,
                     "is_promotions_and_email_set": false,
                     "no_post": "",
                     "is_kiosk":true,
                     'signature':signature
                 };
                 console.log('checkinParams: ',checkinParams)
                  afterGuestCheckinCallback({'status':'success'});// only for debugging success path
                 //setTimeout(function(){
                   //  $scope.invokeApi(zsCheckinSrv.checkInGuest, checkinParams, afterGuestCheckinCallback, afterGuestCheckinCallback); 
                 //},500);
            };
            
            var guestEmailOnFile = function(){
                console.log('$stateParams: ',$stateParams)
                    var useEmail = '';
                    if ($stateParams.guest_email !== ''){
                        useEmail = $stateParams.guest_email;
                    };

                    $scope.useEmail = useEmail;
                    if (useEmail !== '' && zsGeneralSrv.isValidEmail(useEmail) && $stateParams.guest_email_blacklisted !== 'true'){
                        return true;
                    } else {
                        return false;
                    }
            };

            $scope.setCheckInMessage = function(){
                $scope.showCheckInMessage = true;
                $scope.showSignature = false;
                if($scope.zestStationData.check_in_message_texts.not_available_message === "" ){
                    $scope.messageOverride = false;
                    $scope.headingText = 'WAIT_MOMENT';
                } else{
                    console.info('messageOverride: ',$scope.zestStationData.check_in_message_texts.not_available_message);
                    $scope.messageOverride = true;//need to turn off translate 
                    $scope.headingText = $scope.zestStationData.check_in_message_texts.not_available_message;
                }
            };

            /// X signature ---------

            
            var goToCardSign = function(){
                console.log('show signature');
                $state.go('zest_station.checkInSignature',{
                    'id':$stateParams.id,
                    'mode':$stateParams.mode,
                    'payment_type_id':$stateParams.payment_type_id,
                    'deposit_amount':$stateParams.deposit_amount,
                    'guest_email':$stateParams.guest_email,
                    'guest_email_blacklisted':$stateParams.guest_email_blacklisted
                    
                })
            };
            
        var  updateSessionCallback = function(response){
            console.info(response);
            $scope.$emit("hideLoader");

            if(response.status ==="ok"){
                MLISessionId = response.session;
                postData.session_id = MLISessionId;
                console.info('sessionId: ',postData);
                $scope.invokeApi(zsPaymentSrv.savePayment, postData, successSavePayment, failSavePayment); 
            }
            else{
                console.warn('there was a problem with the card');
            }
         };

        var successSavePayment = function(response){
            if (response.status === 'success'){
                $scope.$emit('hideLoader');
                goToCardSign();
            } else {
                failSavePayment(response);
            }
        };

        var failSavePayment = function(response){
            $scope.$emit('hideLoader');
            console.warn(response);
            $state.go('zest_station.error');
        };

                
		var init = function() {
                    console.info('init signature view');
                    $scope.showSignature = true;
                }
                console.log($stateParams)


        init();

		/**
		 * [initializeMe description]
		 */
                
		var initializeMe = function() {
                    
		}();

        /*
         * Sets variables for Credit Card Screen
         */
        var initCCNavScreen = function(){
            $scope.showDeposit = false;
            
        };


		/**
		 * [Screen navigations]
		 */
		
		var navigateToNextScreen = function(){
		   
		};

		/**
		 * when the back button clicked
		 */
		$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
			
		});

	}
]);