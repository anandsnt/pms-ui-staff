sntZestStation.controller('zsPostCheckinCtrl', [
	'$scope',
	'$state',
	'zsModeConstants',
	'zsEventConstants',
	'zsTabletSrv',
	'zsUtilitySrv',
	'$stateParams',
	'$sce',
	function($scope, $state, zsModeConstants, zsEventConstants, zsTabletSrv, zsUtilitySrv, $stateParams, $sce) {

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
            console.info('called go back');
            //$state.go ('zest_station.home');//go back to reservation search results
            
            var current = $state.current.name;
            console.info("current: ",current)
            if (current === 'zest_station.delivery_options'){
                $scope.at = 'deliver-registration';
                $scope.selectedReservation = $state.selectedReservation;
                
            } else if (current === 'zest_station.error'){
                $scope.initErrorScreen();
            } else if (current === 'zest_station.key_error'){
                $scope.initKeyErrorScreen();
            } else if (current === 'zest_station.input_reservation_email_after_swipe'){
                $scope.at = 'input-email';
                $scope.from = 'card-swipe';
            } else if (current === 'registration_printed'){
                $scope.from = 'deliver-registration';
            }
            
	});


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
                $scope.at = 'send-registration';
                $scope.headingText = "Your Registration Has Been sent to:";
                $scope.subHeadingText = $scope.getLastInputEmail();
                $scope.at = 'last_confirm'; 
                $scope.$emit('hideLoader');
            };
            var id = $scope.selectedReservation.id;
            $scope.invokeApi(zsTabletSrv.sendRegistrationByEmail, {'id':id}, fetchHotelCompleted, $scope.generalError);    
        };
        
        
        $scope.initErrorScreen = function(){
                $scope.at = 'error';
                $scope.headingText = 'So Sorry.';
                $scope.subHeadingText = 'Something is broken.\n\
                                            Please find a staff member to help you.';
                $scope.modalBtn1 = 'Done';
        };
        $scope.initKeyErrorScreen = function(){
                $scope.at = 'key-error';
                $scope.headingText = 'We were not able to make keys.';
                $scope.subHeadingText = 'Please re-try or speak to a staff member.';
                $scope.modalBtn1 = '';
        };
        
        $scope.navToHome = function(){
		$state.go ('zest_station.home');
        };
        $scope.initStaff = function(){
            $state.go('zest_station.speak_to_staff');
        };
        
        $scope.goToNext = function(){
            if ($scope.at === 'input-email'){
                $state.input.email = $scope.input.inputTextValue;
                $state.go('zest_station.check_in_keys');
            }
                
        };
        $scope.setDeliveryParams = function(){
            $scope.at = 'deliver-registration';
            $scope.selectedReservation = $state.selectedReservation;
            $scope.headingText = "Your Registration is Ready";
            $scope.subHeadingText = "Please select how to receive your registration";
        };

        $scope.init = function(){
            var current = $state.current.name;
            if (!$scope.input){
                $scope.input = $state.input;
            }
            
            if (current === 'zest_station.delivery_options'){
                $scope.setDeliveryParams();
                
            } else if (current === 'zest_station.error'){
                $scope.initErrorScreen();
                
            } else if (current === 'zest_station.key_error'){
                $scope.initKeyErrorScreen();
                
            } else if (current === 'zest_station.input_reservation_email_after_swipe'){
                $scope.at = 'input-email';
                $scope.from = 'card-swipe';
                
            } else if (current === 'registration_printed'){
                
                $scope.printOpted = true;
                $scope.at = 'registration_printed';
                $scope.from = 'deliver-registration';
            }
            
        };
        

        $scope.clickedPrint= function(){
            // print section - if its from device call cordova.
            try{
                $window.print();
                if ( sntapp.cordovaLoaded ) {
                    var printer = (sntZestStation.selectedPrinter);
                    cordova.exec(function(success) {
                        $state.go('zest_station.registration_printed');
                    }, function(error) {
                        $state.go('zest_station.error');
                    }, 'RVCardPlugin', 'printWebView', ['filep', '1', printer]);
                };
                $scope.printOpted = true;
              

            }
            catch(e){

            }
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