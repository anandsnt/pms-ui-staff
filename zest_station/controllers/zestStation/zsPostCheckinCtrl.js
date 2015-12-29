sntZestStation.controller('zsPostCheckinCtrl', [
	'$scope',
	'$state',
	'zsModeConstants',
	'zsEventConstants',
	'zsTabletSrv',
	'zsUtilitySrv',
	'$stateParams',
	'$sce',
	'$window',
	function($scope, $state, zsModeConstants, zsEventConstants, zsTabletSrv, zsUtilitySrv, $stateParams, $sce, $window) {

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
	$scope.$on (zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
            //$state.go ('zest_station.home');//go back to reservation search results
            
            var current = $state.current.name;
            if (current === 'zest_station.delivery_options'){
                $scope.at = 'deliver-registration';
                $scope.selectedReservation = $state.selectedReservation;
                
            } else if (current === 'zest_station.room_error'){
                $state.go('zest_station.reservation_details');
                
            } else if (current === 'zest_station.error'){
                $scope.initErrorScreen();
                
            } else if (current === 'zest_station.invalid_email_retry' && $state.from !== 'email-delivery'){
                $state.go('zest_station.input_reservation_email_after_swipe');
                
            }else if (current === 'zest_station.invalid_email_retry' && $state.from === 'email-delivery'){
               $scope.selectEmailDelivery();
                
            } else if (current === 'zest_station.key_error'){
                $scope.initKeyErrorScreen();
            } else if (current === 'zest_station.input_reservation_email_after_swipe'){
                $scope.at = 'input-email';
                $scope.from = 'card-swipe';
                $scope.headingText = 'Type in your e-mail address';
                $scope.subHeadingText = "You can receive your bill, check-out (or order a late check-out) and all sorts of other wonderful things…";
                $scope.inputTextPlaceholder = '';
                
            } else if (current === 'registration_printed'){
                $scope.from = 'deliver-registration';
                
            } else if (current === 'zest_station.edit_registration_email'){
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
            $scope.at = 'email-delivery';
        };
        
        $scope.skipEmailEntryAfterSwipe = function(){
            $state.go('zest_station.check_in_keys');
        };
        
        $scope.sendRegistration = function(){
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
            $scope.headingText = "We will send your registration to:";
            $scope.subHeadingText = $state.input.lastEmailValue;
            $scope.input.inputTextValue = $state.input.lastEmailValue;
        };
        $scope.initErrorScreen = function(){
                $scope.at = 'error';
                $scope.headingText = 'So Sorry.';
                $scope.subHeadingText = 'Something broke. \n\
                                            Our bad. Please reach out to a Sidekick.';
                $scope.modalBtn1 = 'Done';
        };
        $scope.initRoomErrorScreen = function(){
                $scope.at = 'error';
                $scope.headingText = 'Please speak to a sidekick.';
                $scope.subHeadingText = 'We can take care of your luggage until a room becomes available.';
                $scope.modalBtn1 = 'Done';
        };
        $scope.initKeyErrorScreen = function(){
                if ($state.mode === zsModeConstants.PICKUP_KEY_MODE){
                    $scope.pickupkeys = true;
                }
            
                $scope.at = 'key-error';
                $scope.headingText = 'We were not able to make keys.';
                $scope.subHeadingText = 'Oopsie. Unable to make key.';
                $scope.modalBtn1 = '';
        };
        
        $scope.skipKeys = function(){
            if ($scope.zestStationData.emailEnabled || $scope.zestStationData.printEnabled){
                $state.go('zest_station.delivery_options');
            } else {
                $state.go('zest_station.last_confirm');
            }
        };
        
        $scope.navToHome = function(){
		$state.go ('zest_station.home');
        };
        $scope.navToPrev = function(){
                $state.go('zest_station.check_in_keys');
        };
        
        $scope.reEncodeKey = function(){
            if ($state.mode === zsModeConstants.PICKUP_KEY_MODE){
                $state.go('zest_station.pickup_keys');
            } else {
		$state.go ('zest_station.check_in_keys');
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
                if (response.status === 'success'){
                    if ($scope.from === 'card-swipe' && $scope.at === 'input-email'){
                        $state.go('zest_station.check_in_keys');
                    } else {
                        $state.go('zest_station.delivery_options');
                    }
                    //$scope.selectEmailDelivery();
                } else {
                    $scope.initErrorScreen();
                }
                $scope.$emit('hideLoader');
            };
            
            var guestDetails = $state.selectedReservation.guest_details;
            var primaryGuest = $scope.getPrimaryGuest(guestDetails);
            if (primaryGuest !== null){
                primaryGuest.email = $state.input.email;
                $scope.invokeApi(zsTabletSrv.updateGuestEmail, primaryGuest, updateComplete, updateComplete);   
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
          /*  if ($state.from === 'email-delivery'){
                
            } */
            
            
            if ($scope.at === 'input-email'){
                $state.input.email = $scope.input.inputTextValue;
                
                var isValidEmail = $scope.validEmailAddress($state.input.email);
                if (isValidEmail){
                    $scope.updateGuestEmail();
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
        $scope.setDeliveryParams = function(){
            $scope.at = 'deliver-registration';
            $scope.selectedReservation = $state.selectedReservation;
            $scope.headingText = "Your registration is ready for lift-off.";
            $scope.subHeadingText = "How would you like to receive it?";
        };

        $scope.init = function(){
            var current = $state.current.name;
            $scope.emailEnabled = $scope.zestStationData.emailEnabled;
            $scope.printEnabled = $scope.zestStationData.printEnabled;
            
            if (!$scope.input){
                $scope.input = $state.input;
            }
            
            if (current === 'zest_station.delivery_options'){
                $scope.setDeliveryParams();
                
            } else if (current === 'zest_station.room_error'){
                $scope.initRoomErrorScreen();
            } else if (current === 'zest_station.last_confirm'){
                
                if (($scope.zestStationData.emailEnabled || $scope.zestStationData.printEnabled) && !$state.fromPrintSuccess){
                    $scope.headingText = "The e-mail is now living in your inbox.";
                    $scope.subHeadingText = $scope.getLastInputEmail();
                } else {
                    $scope.headingText = "Thanks for doing Zoku.";
                    $scope.subHeadingText = '';
                }
                $scope.at = 'last_confirm';   
                $scope.modalBtn1 = '';
                $scope.modalBtn2 = 'Exit';
            } else if (current === 'zest_station.error'){
                $scope.initErrorScreen();
                
            } else if (current === 'zest_station.key_error'){
                $scope.initKeyErrorScreen();
                
            } else if (current === 'zest_station.invalid_email_retry'){
                $scope.at = 'invalid-email';
                $scope.headingText = 'Oopsie.';
                $scope.subHeadingText = 'This does not appear to be a valid e-mail address.';
                if ($state.from === 'card-swipe'){
                    $scope.from = 'card-swipe';
                }
                
            } else if (current === 'zest_station.input_reservation_email_after_swipe'){
                $scope.at = 'input-email';
                $scope.from = 'card-swipe';
                $state.from = 'card-swipe';
                $scope.headingText = 'Type in your e-mail address';
                $scope.subHeadingText = "You'll be able to receive your bill, check-out (or order a late check-out) and all sorts of other wonderful things…";
                $scope.inputTextPlaceholder = '';
                
            } else if (current === 'registration_printed'){
                
                $scope.printOpted = true;
                $scope.at = 'registration_printed';
                $scope.from = 'deliver-registration';
            } else if (current === 'zest_station.edit_registration_email'){
                $scope.setupEmailEdit();
            }
            
        };
        $scope.initPrintRegistration = function(){
            $scope.printRegistrationCard();
        };
        
	// add the print orientation before printing
	var addPrintOrientation = function() {
		$( 'head' ).append( "<style id='print-orientation'>@page { size: portrait; }</style>" );
	};

	// add the print orientation after printing
	var removePrintOrientation = function() {
		$( '#print-orientation' ).remove();
	};

        $scope.onPrintError = function(error){
            $state.go('zest_station.error');
        };
        $scope.onPrintSuccess = function(success){
            console.info('print success, continue');
            $state.fromPrintSuccess = true;
            $state.go('zest_station.last_confirm');
            $scope.$emit('hideLoader');
        };

	$scope.printRegistrationCard = function() {
                $scope.isPrintRegistrationCard = true;

                $scope.$emit('hideLoader');
                $scope.errorMessage = "";

                // CICO-9569 to solve the hotel logo issue
                $("header .logo").addClass('logo-hide');
                $("header .h2").addClass('text-hide');

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
        $scope.fetchRegistrationPrintView = function(){
            var fetchPrintViewCompleted = function(data){
                $scope.$emit('hideLoader');
                // print section - if its from device call cordova.
                $scope.printRegCardData = data;
                $scope.setupPrintView();
                $scope.initPrintRegistration();
            };
            var id = $scope.selectedReservation.id;
            $scope.invokeApi(zsTabletSrv.fetchRegistrationCardPrintData, {'id':id}, fetchPrintViewCompleted, $scope.generalError);  
        };
        $scope.clickedPrint = function(){
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