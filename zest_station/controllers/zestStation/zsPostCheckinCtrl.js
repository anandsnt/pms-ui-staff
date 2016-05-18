sntZestStation.controller('zsPostCheckinCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'zsModeConstants',
	'zsEventConstants',
	'zsTabletSrv',
	'zsUtilitySrv',
	'$stateParams',
	'$sce',
	'$window',
    '$filter',
	function($scope, $rootScope, $state, zsModeConstants, zsEventConstants, zsTabletSrv, zsUtilitySrv, $stateParams, $sce, $window,$filter) {

	BaseCtrl.call(this, $scope);
        sntZestStation.filter('unsafe', function($sce) {
                return function(val) {
                    return $sce.trustAsHtml(val);
                };
            });
        $scope.emailOptional = true;
	/**
	 * when the back button clicked
	 * @param  {[type]} event
	 * @return {[type]} 
	 */
        
        var hideNavButtons = function(){
            $scope.$emit (zsEventConstants.HIDE_BACK_BUTTON);
            $scope.$emit (zsEventConstants.HIDE_CLOSE_BUTTON);
	};
	var showNavButtons = function(){
		$scope.$emit (zsEventConstants.SHOW_BACK_BUTTON);
		$scope.$emit (zsEventConstants.SHOW_CLOSE_BUTTON);
	};
        
        
	$scope.$on (zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
            //$state.go ('zest_station.home');//go back to reservation search results
            
            var current = $state.current.name;
            if (current === 'zest_station.delivery_options'){
                $scope.at = 'deliver-registration';
                $scope.selectedReservation = $state.selectedReservation;
                hideNavButtons();
            } 
            else if (current === 'zest_station.room_error'){
                $state.go('zest_station.reservation_details');
                
            } 
            else if (current === 'zest_station.swipe_pay_error'){
                $state.go('zest_station.card_swipe');
            } 
            
            else if (current === 'zest_station.error'){
                if ($state.from === 'card-swipe'){
                    $state.go('zest_station.card_swipe');
                } if ($state.from === 'deliver-registration'){
                    $state.go('zest_station.delivery_options');
                } else {
                    $scope.initErrorScreen();
                }
                
            } else if (current === 'zest_station.invalid_email_retry' && $state.from !== 'email-delivery'){
                $state.go('zest_station.input_reservation_email_after_swipe');
                
            } else if (current === 'zest_station.invalid_email_retry' && $state.from === 'email-delivery'){
               $scope.selectEmailDelivery();
                
            } else if (current === 'zest_station.key_error'){
                $scope.initKeyErrorScreen();
            } else if (current === 'zest_station.input_reservation_email_after_swipe'){
                $scope.at = 'input-email';
                $scope.from = 'card-swipe';
                $scope.headingText = 'TYPE_EMAIL_IN';
                $scope.subHeadingText = "TYPE_EMAIL_IN_SUB";
                $scope.inputTextPlaceholder = '';
                
            } else if (current === 'registration_printed'){
                $scope.from = 'deliver-registration';
                
            } else if (current === 'zest_station.edit_registration_email'){
                   // $scope.selectEmailDelivery();
                    $state.go('zest_station.delivery_options');
                    
            }
            
           
            
	});

            $scope.isValidEmail = function(email){
                if (!email){return false;}
                email = email.replace(/\s+/g, '');
                if ($scope.ValidateEmail(email)){
                    return false;
                } else return true;
                
            };
            
            $scope.ValidateEmail = function(email) {
               // EMAIL_REGEX = /\A([^@\s]+)@((?:[-a-zA-Z0-9]+\.)+[a-zA-Z]{2,})\Z/;
                //if (EMAIL_REGEX.test(email)){
                if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
                    return false;
                } else return true;
            };

            
            $scope.clearInputText = function(){
                $scope.input.inputTextValue = '';
            };

	/**
	 * [isInCheckinMode description]
	 * @return {Boolean} [description]
	 */
	$scope.isInCheckinMode = function() {
		return ($stateParams.mode === zsModeConstants.CHECKIN_MODE);
	};

	/**
	 * [isInCheckinMode description]
	 * @return {Boolean} [description]
	 */
	$scope.isInCheckoutMode = function() {
		return ($stateParams.mode === zsModeConstants.CHECKOUT_MODE);
	};

	/**
	 * [isInCheckinMode description]
	 * @return {Boolean} [description]
	 */
	$scope.isInPickupKeyMode = function() {
		return ($stateParams.mode === zsModeConstants.PICKUP_KEY_MODE);
	};
        
         $scope.generalError = function(response){
            $scope.$emit('GENERAL_ERROR',response);
        };
        
        

        $scope.selectEmailDelivery = function(){
           // $state.selectedReservation.printed = false;
            $state.selectedReservation.printSuccess = true;
            
            if ($state.skipCheckinEmail){
                $scope.editEmailAddress();
            } else {
                $scope.at = 'email-delivery';
                $scope.headingText = "SEND_REGISTRATION_TO";
                if ($scope.zestStationData.printEnabled || $scope.zestStationData.emailEnabled){
                    showNavButtons();
                } else {
                    hideNavButtons();
                }
                
                 if ((!$state.input.lastEmailValue || $state.input.lastEmailValue === '') && $state.input.email !== ''){
                    $state.input.lastEmailValue = $state.input.email;
                }
                $scope.subHeadingText = $state.input.lastEmailValue;
            }
        };
        
        $scope.skipEmailEntryAfterSwipe = function(){
            $state.skipCheckinEmail = true;
            $state.go('zest_station.check_in_keys',{'mode':zsModeConstants.CHECKIN_MODE});
        };
        
        $scope.send = function(){
            var fetchHotelCompleted = function(response){
                $state.go('zest_station.last_confirm');
                $scope.$emit('hideLoader');
            };
            var data = { 'id' : $scope.selectedReservation.id , 'application':'ZEST_STATION'} ;

            $scope.invokeApi(zsTabletSrv.sendRegistrationByEmail, data, fetchHotelCompleted, $scope.generalError);    
        };
        $scope.editEmailAddress = function(){
            $state.from = 'email-delivery';
            $state.go('zest_station.edit_registration_email');
            
        };
        $scope.setupEmailEdit = function(){
            $scope.at = 'email-delivery';
            $scope.headingText = "SEND_REGISTRATION_TO";
            if ((!$state.input.lastEmailValue || $state.input.lastEmailValue === '') && $state.input.email !== ''){
                $state.input.lastEmailValue = $state.input.email;
            }
            $scope.subHeadingText = $state.input.lastEmailValue;
            $scope.input.inputTextValue = $state.input.lastEmailValue;
        };
        $scope.initErrorScreen = function(){
                $scope.at = 'error';
                
                if($scope.zestStationData.zest_station_message_texts.speak_to_crew_mod_message2 !== ""){//speak to staff override message
                    $scope.subHeadingText = $scope.zestStationData.zest_station_message_texts.speak_to_crew_mod_message2;
                }
                
                $scope.headingText = 'BROKE_HEADER';
                $scope.modalBtn1 = 'DONE_BTN';
        };
        $scope.initRoomErrorScreen = function(){
                $scope.at = 'error';
                $scope.headingText = 'TALK_TO_STAFF';
                $scope.subHeadingText = 'ROOM_NOT_AVAIL_MSG';
                $scope.modalBtn1 = 'DONE_BTN';
                
            if($scope.zestStationData.check_in_message_texts.speak_to_crew_mod_message1 === "" ){
                $scope.messageOverride = false;
                $scope.headingText = 'TALK_TO_STAFF';
            } else {
                $scope.messageOverride = true;//need to turn off translate 
                $scope.headingText = $scope.zestStationData.check_in_message_texts.speak_to_crew_mod_message1;
            }
            
        };
        $scope.initKeyErrorScreen = function(){
                hideNavButtons();
                if ($state.mode === zsModeConstants.PICKUP_KEY_MODE){
                    $scope.pickupkeys = true;
                }
            
                $scope.at = 'key-error';
                $scope.headingText = 'NO_KEYS_MADE';
                $scope.subHeadingText = 'NO_KEYS_MADE_SUB';
                $scope.modalBtn1 = '';
        };
        
        $scope.skipKeys = function(){
            
            if ($scope.zestStationData.emailEnabled || $scope.zestStationData.printEnabled){
                $state.go('zest_station.delivery_options');
            } else {
                $state.go('zest_station.last_confirm');
            }
        };
        
        var goToOOSWithReason = function(){
             $scope.zestStationData.workstationOooReason = angular.copy($scope.zestStationData.wsFailedReason);
                $scope.$emit(zsEventConstants.UPDATE_LOCAL_STORAGE_FOR_WS,{
                    'status':'out-of-order',
                    'reason':$scope.zestStationData.workstationOooReason
                });
                $state.go('zest_station.oos');
        };
        
        $scope.navToHome = function(){
           //update workstation station. I cant find anyother suitable place
            //the above codes needs to refactored
            if($scope.zestStationData.wsIsOos){
                //update work station status
               goToOOSWithReason();
            } else{
                $state.go ('zest_station.home');
            };
		  
        };
        $scope.navToPrev = function(){
                $state.go('zest_station.check_in_keys',{'mode':zsModeConstants.CHECKIN_MODE});
        };
        
        $scope.reEncodeKey = function(){
            if ($state.mode === zsModeConstants.PICKUP_KEY_MODE){
                $state.go('zest_station.pickup_keys');
            } else {
		$state.go ('zest_station.check_in_keys',{'mode':zsModeConstants.CHECKIN_MODE});
            }
        };
        
        $scope.initStaff = function(){
            $state.go('zest_station.speak_to_staff');
        };
        $scope.getPrimaryGuest = function(guestDetails){
            var primaryGuest = null;
            for (var i in guestDetails){
                if (guestDetails[i]){
                    if (guestDetails[i].is_primary){
                        primaryGuest = guestDetails[i];
                    }
                }
            }
            return primaryGuest;
        };
        $scope.updateGuestEmail = function(){
            
            var updateComplete = function(response){
                    $state.selectedReservation.guest_details.email = $state.input.email;
                    $state.input.lastEmailValue = $state.input.email;
                    if ($scope.from === 'card-swipe' && $scope.at === 'input-email'){
                        $state.go('zest_station.check_in_keys',{'mode':zsModeConstants.CHECKIN_MODE});
                    } else {//at the end of check-in and now updating email address
                        showNavButtons();
                        $state.from = 'deliver-registration';
                        $state.skipCheckinEmail = false;
                        //if skipped email before
                        $state.updatedEmail = true;
                        $state.go('zest_station.delivery_options');
                    }
                $scope.$emit('hideLoader');
                    //$scope.selectEmailDelivery();
            };

            var updateGuestEmailFailed = function(){
                $scope.initErrorScreen();
                $scope.$emit('hideLoader');
            }
            
            var guestDetails = $state.selectedReservation.guest_details;
            var primaryGuest = $scope.getPrimaryGuest(guestDetails);
            if (primaryGuest !== null){
                primaryGuest.email = $state.input.email;
                $scope.invokeApi(zsTabletSrv.updateGuestEmail, primaryGuest, updateComplete, updateGuestEmailFailed);
            }  
        };
        $scope.validEmailAddress = function(useEmail){
            if (useEmail !== '' && $scope.isValidEmail(useEmail)){
                return true;
            } else {
                return false;
            }
        };
        $scope.goToNext = function(){
            $scope.hideKeyboardIfUp();
          /*  if ($state.from === 'email-delivery'){
                
            } */
            
            
            if ($scope.at === 'input-email'){
                $state.input.email = $scope.input.inputTextValue;
                
                var isValidEmail = $scope.validEmailAddress($state.input.email);
                if (isValidEmail){
                    $scope.updateGuestEmail();
                    $state.skipCheckinEmail = false;
                    
                    
                } else {
                    $state.go('zest_station.invalid_email_retry');
                }
                
            } if ($scope.at === 'invalid-email'){
                $state.input.email = $scope.input.inputTextValue;
                
                var isValidEmail = $scope.validEmailAddress($state.input.email);
                if (isValidEmail){
                    $scope.updateGuestEmail();
                } else {
                    $state.go('zest_station.invalid_email_retry');
                }
                
            } else if ($scope.at === 'email-delivery'){
                $state.input.email = $scope.input.inputTextValue;
                $state.input.lastEmailValue = $scope.input.inputTextValue;
                var isValidEmail = $scope.validEmailAddress($state.input.email);
                if (isValidEmail){
                    $scope.updateGuestEmail();//redirects to delivery_options
                } else {
                    $state.go('zest_station.invalid_email_retry');
                }
            }
                
        };
        
        $scope.speakToStaff = function(){
            $state.go('zest_station.talk_to_staff');
        };
        $scope.reSignCC = function(){
            $state.go('zest_station.card_sign');
        };
        $scope.setDeliveryParams = function(){
            $scope.at = 'deliver-registration';
            $scope.selectedReservation = $state.selectedReservation;
            $scope.headingText = "REGISTRATION_READY_HEADER";
            $scope.subHeadingText = "REGISTRATION_READY_HEADER_SUB";
            hideNavButtons();
        };
        
        $scope.reTryCardSwipe = function(){
            $state.go('zest_station.card_swipe');
        };
        
        $scope.$on('SIXPAY_DEBUG',function(){
            $state.go('zest_station.card_sign');
        });

        $scope.init = function(){
            var current = $state.current.name;
            $scope.theme = $state.theme;
            $scope.emailEnabled = $scope.zestStationData.emailEnabled;
            $scope.printEnabled = $scope.zestStationData.printEnabled;
            if ($scope.zestStationData.auto_print && !$state.hasAutoPrinted){
                $scope.printEnabled = false;
            }
            
            if (!$scope.input){
                $scope.input = $state.input;
            }
            
            
            if (current === 'zest_station.delivery_options'){
                console.log('$scope.zestStationData.auto_print: ',$scope.zestStationData.auto_print);
                if ($scope.zestStationData.auto_print && !$state.hasAutoPrinted){
                    $scope.zestStationData.printEnabled = false;
                    setTimeout(function(){
                        $state.hasAutoPrinted = true;
                        $scope.clickedPrint();
                    },3000);
                };
                $scope.setDeliveryParams();
                if ($state.updatedEmail){
                    showNavButtons();
                    $scope.selectEmailDelivery();
                }
            } else if (current === 'zest_station.swipe_pay_error'){
                $scope.at = 'swipe-pay-error';
                $scope.headingText = 'SWIPE_ERR_HEADER';
                
                $scope.subHeadingText = '';
            } else if (current === 'zest_station.tab-kiosk-reservation-signature-time-out'){
                $scope.at = 'cc-sign-time-out';
                
            } else if (current === 'zest_station.room_error'){
                $scope.initRoomErrorScreen();
               // $scope.initRoomErrorScreen();
                
            } else if (current === 'zest_station.last_confirm'){
                //As part of CICO-24944 ,Customized subheading text for yotel
                $scope.updateSubHeadingTextForLastConfirmPage();
                if (($scope.zestStationData.emailEnabled || $scope.zestStationData.printEnabled) && !$state.fromPrintSuccess){
                    $scope.headingText = "EMAIL_SENT_MSG";
                    $scope.subHeadingText = $scope.getLastInputEmail();
                } else {
                    if ($scope.theme === 'zoku'){
                        $scope.headingText = "END_THANKS";
                        $scope.subHeadingText = '';
                    } else if ($scope.theme === 'fontainebleau'){
                        $scope.headingText = "END_THANKS";
                        $scope.subHeadingText = '';
                    } else {
                        $scope.headingText = 'END_THANKS';
                    }
                }
                $scope.at = 'last_confirm';   
                $scope.modalBtn1 = '';
                $scope.modalBtn2 = 'Exit';
                hideNavButtons();
                
            } else if (current === 'zest_station.error'){
                $scope.initErrorScreen();
                
            } else if (current === 'zest_station.key_error'){
                $scope.initKeyErrorScreen();
                
            } else if (current === 'zest_station.invalid_email_retry'){
                $scope.at = 'invalid-email';
                
                $scope.headingText = 'EMAIL_ERR_HEADER';//INVALID_EMAIL_ENTERED
                $scope.subHeadingText = 'EMAIL_ERR_HEADER_SUB';//INVALID_EMAIL_ENTERED SUB
                if ($state.from === 'card-swipe'){
                    $scope.from = 'card-swipe';
                }
                
            } else if (current === 'zest_station.input_reservation_email_after_swipe'){
                $scope.at = 'input-email';
                $scope.from = 'card-swipe';
                $state.from = 'card-swipe';
                $scope.headingText = 'TYPE_EMAIL_IN';
                $scope.subHeadingText = "TYPE_EMAIL_IN_SUB";
                $scope.inputTextPlaceholder = '';
                
            } else if (current === 'registration_printed'){
                
                $scope.printOpted = true;
                $scope.at = 'registration_printed';
                $scope.from = 'deliver-registration';
            } else if (current === 'zest_station.edit_registration_email'){
                $scope.setupEmailEdit();
            }
        };
        $scope.updateSubHeadingTextForLastConfirmPage = function(){
            var printSuccess = $state.selectedReservation.printSuccess === true,
                    keySuccess = $state.selectedReservation.keySuccess === true,
                    /*
                    keyPrintSuccessMsg = $scope.zestStationData.check_in_message_texts.key_success_print_success_message,
                    keyFailPrintSuccessMsg = $scope.zestStationData.check_in_message_texts.key_fail_print_success_message,
                    //bad day for kiosk.
                    superFail = $scope.zestStationData.check_in_message_texts.key_fail_print_fail_message,
                      */      
             
                    keyPrintSuccessMsg = $filter('translate')('PRINTED_BELOW'),     //success + success
                    keyPrintFailMsg = $filter('translate')('PRINTED_NOKEYS'),     //success + fail
                    keyFailPrintSuccessMsg = $filter('translate')('PRINTED_NO'),//fail + success
                    //bad day for kiosk.
                    superFail = $filter('translate')('PRINTED_FAIL'),               //fail + fail
                            failure = false;
            
            var msg;
            if(keySuccess && printSuccess){//success + success = :D
                    msg = keyPrintSuccessMsg;
                    //if check-in without hardware failure, this should be set back to admin reason,
                    //if station is placed out of service without hardare failure, its due to admin manually placing oos or network failure
                    $scope.zestStationData.wsFailedReason =  $filter('translate')('ADMIN_OR_NETWORK_OOS');
                    
                    
            } else if(keySuccess && !printSuccess){//success + fail = :/
                    msg = keyPrintFailMsg;
                    //if check-in without hardware failure, this should be set back to admin reason,
                    //if station is placed out of service without hardare failure, its due to admin manually placing oos or network failure
                    $scope.zestStationData.wsFailedReason =  $filter('translate')('CHECKIN_KEY_SUCCESS_PRINT_FAIL');
                    
                    
            } else if (!keySuccess && printSuccess) {//fail + success = :/
                    msg = keyFailPrintSuccessMsg;
                    
                    failure = true;
                    $scope.zestStationData.wsFailedReason =  $filter('translate')('CHECKIN_KEY_FAIL_PRINT_SUCCESS');
                    
                    
            } else if (!keySuccess && !printSuccess){// fail + fail = :(
                    msg = superFail;
                    
                    failure = true;
                    $scope.zestStationData.wsFailedReason =  $filter('translate')('CHECKIN_KEY_FAIL_PRINT_FAIL');
                    
            }
            
            if (failure){
                $scope.zestStationData.wsIsOos = true;
            }
            console.info(msg);
            $scope.subHeadingText = msg;
        };
        /*
         * placeholder for updating these values, need to add two scenarios, where print is not selected
         * just show something like => key_success_no_print, or key_failure_no_print
         * 
         *  $scope.updateSubHeadingTextForLastConfirmPage = function(){
            
            if($state.selectedReservation.printSuccess === true && $state.selectedReservation.printed){
                if($state.selectedReservation.keySuccess)
                {
                    if ($state.selectedReservation.printed){
                        $scope.subHeadingText=$scope.zestStationData.check_in_message_texts.key_success_print_success_message;
                    } else {
                        $scope.subHeadingText=$scope.zestStationData.check_in_message_texts.key_success_message;
                    }
                    
                }else{
                    $scope.subHeadingText=$scope.zestStationData.check_in_message_texts.key_fail_print_success_message;
                }
            }else{
                if($state.selectedReservation.keySuccess)
                {
                    if ($state.selectedReservation.printed){
                        $scope.subHeadingText=$scope.zestStationData.check_in_message_texts.key_success_print_fail_message;
                    } else {
                        $scope.subHeadingText=$scope.zestStationData.check_in_message_texts.key_success_message;
                    }
                    
                }else{
                    // $scope.zestStationData.workstationOooReason = $filter('translate')('CHECKIN_KEY_AND_PRINT_FAIL');
                     $scope.zestStationData.wsIsOos = true;
                     $scope.zestStationData.wsFailedReason =  $filter('translate')('CHECKIN_KEY_AND_PRINT_FAIL');
                    // $scope.$emit(zsEventConstants.UPDATE_LOCAL_STORAGE_FOR_WS,{'status':false,'reason':$scope.zestStationData.workstationOooReason});
                    if ($state.selectedReservation.printed){
                        $scope.subHeadingText=$scope.zestStationData.check_in_message_texts.key_fail_print_fail_message;
                    } else {
                        $scope.subHeadingText=$scope.zestStationData.check_in_message_texts.key_fail_message;
                    }
                    
                }
            };
        };
         * 
         */
        
        
        
        
        $scope.initPrintRegistration = function(){
            $scope.printRegistrationCard();
        };
	// add the print orientation before printing
	var addPrintOrientation = function() {
		$( 'head' ).append( "<style id='print-orientation'>@page { size: portrait; }</style>" );
		$( 'body' ).append( "<style>@page { margin: 0px; }</style>" );
	};

	// add the print orientation after printing
	var removePrintOrientation = function() {
		$( '#print-orientation' ).remove();
	};

        $scope.onPrintError = function(error){
            if (!$scope.zestStationData.auto_print){
                $state.go('zest_station.error');
            } else {
                $state.selectedReservation.printSuccess = false;
            }
            $scope.zestStationData.wsIsOos = true;
            $scope.zestStationData.wsFailedReason = $filter('translate')('CHECKIN_PRINT_FAIL');
            //$scope.$emit(zsEventConstants.UPDATE_LOCAL_STORAGE_FOR_WS,{'status':false,'reason':$scope.zestStationData.workstationOooReason});
        };
        $scope.onPrintSuccess = function(success){
            if (!$scope.zestStationData.auto_print){//when auto-printing do nothing, email success will take guest to next screen
                $state.fromPrintSuccess = true;
                $state.selectedReservation.printSuccess = true;
                $state.go('zest_station.last_confirm');
                $scope.$emit('hideLoader');
            } else {
                $state.selectedReservation.printSuccess = true;
            }
        };

	$scope.printRegistrationCard = function() {
                $scope.isPrintRegistrationCard = true;

                $scope.$emit('hideLoader');
                $scope.errorMessage = "";

                // CICO-9569 to solve the hotel logo issue
                $("header .logo").addClass('logo-hide');
                $("header .h2").addClass('text-hide');
                
                $('.popup').hide();//hide timeout elements
                $('.invis').hide();//hide timeout elements
                $('#popup-overlay').hide();//hide timeout elements

                // add the orientation
                addPrintOrientation();

                /*
                *	======[ READY TO PRINT ]======
                */
                // this will show the popup with full bill
               setTimeout(function() {
                    var printer = (sntZestStation.selectedPrinter);
                    $window.print();
                    if ( sntapp.cordovaLoaded ) {
                            cordova.exec(
                                $scope.onPrintSuccess(), //print complete, should go to final screen
                                $scope.onPrintError(), //if print error, inform guest there was an error
                            'RVCardPlugin', 'printWebView', ['filep', '1', printer]);
                    };
                }, 100);

                /*
                *	======[ PRINTING COMPLETE. JS EXECUTION WILL UNPAUSE ]======
                */
               setTimeout(function() {
                    $scope.isPrintRegistrationCard = false;
                            
                            // CICO-9569 to solve the hotel logo issue
                            $("header .logo").removeClass('logo-hide');
                            $("header .h2").addClass('text-hide');

                            // remove the orientation after similar delay
                    removePrintOrientation();
                    $scope.onPrintSuccess();
                }, 100);
            };

        
        
        
        $scope.setupPrintView = function(){
            $scope.isPrintRegistrationCard = true;
            $scope.$emit('hideLoader');
            $scope.errorMessage = "";
        };
        $scope.getTermsPrintable = function(terms){
          sntZestStation.filter('unsafe', function($sce) {
                return function(terms) {
                    return $sce.trustAsHtml(terms);
                };
            });  
        };
        $scope.currentDateTime;
        $scope.fetchRegistrationPrintView = function(){
            
            var fetchPrintViewCompleted = function(data){
                var d = new Date();
                $scope.currentDateTime = d.getTime();
                $scope.$emit('hideLoader');
                // print section - if its from device call cordova.
                $scope.printRegCardData = data;
                $scope.departDate = $scope.printRegCardData.dep_date;
                var dep = $scope.departDate.split('-');
                var dY = dep[2],dM=(dep[1]-1),dD=dep[0];
                var depart = new Date(dY,dM,dD);
                $scope.departDate = depart.getTime();
                $scope.printRegCardData.terms_conditions_html = $scope.getTermsPrintable($scope.printRegCardData.terms_conditions);
                $scope.setupPrintView();
                $scope.initPrintRegistration();
            };
            var id = $scope.selectedReservation.id; 
            $scope.invokeApi(zsTabletSrv.fetchRegistrationCardPrintData, {'id':id}, fetchPrintViewCompleted, $scope.generalError);  
        };
        $scope.clickedPrint = function(){
           // $state.selectedReservation.printed = true;
            $scope.fetchRegistrationPrintView();
        };  

        $scope.getLastInputEmail = function(){
            if ($state.input && $state.input.lastEmailValue){
                return $state.input.lastEmailValue;
            } else return '';
        };
        $scope.setLastInputEmail = function(str){
            if (!$state.input){
                $state.input = {
                    'lastEmailValue':str
                };
            } else {
                $state.input.lastEmailValue = str;
            }
        };



	/**
	 * [initializeMe description]
	 * @return {[type]} [description]
	 */
	var initializeMe = function() {
		//show back button
		$scope.$emit (zsEventConstants.SHOW_BACK_BUTTON);

		//show close button
		$scope.$emit (zsEventConstants.SHOW_CLOSE_BUTTON);
        $scope.init();
	}();
        
        

}]);