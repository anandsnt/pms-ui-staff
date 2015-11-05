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
	/**
	 * when the back button clicked
	 * @param  {[type]} event
	 * @return {[type]} 
	 */
	$scope.$on (zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
            console.info('called go back')	
            //$state.go ('zest_station.home');//go back to reservation search results
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
            $scope.$emit('hideLoader');
            console.log(arguments);
            if (response && response[0]){
                $state.errorReceived = response[0];
            } else {
                $state.errorReceived = null;
            }
            $state.go('zest_station.error');
        };
        
        

        $scope.selectEmailDelivery = function(){
            $scope.at = 'email-delivery';
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
        
        $scope.navToHome = function(){
		$state.go ('zest_station.home');
        };

        $scope.init = function(){
            var current = $state.current.name;
            if (!$scope.input){
                $scope.input = $state.input;
            }
            
            if (current === 'zest_station.delivery_options'){
                $scope.at = 'deliver-registration';
                $scope.selectedReservation = $state.selectedReservation;
            } else if (current === 'zest_station.error'){
                $scope.initErrorScreen();
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