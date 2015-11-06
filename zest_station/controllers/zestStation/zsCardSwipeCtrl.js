sntZestStation.controller('zsCardSwipeCtrl', [
	'$scope',
	'$state',
	'zsModeConstants',
	'zsEventConstants',
	'zsTabletSrv',
	'zsUtilitySrv',
	'$stateParams',
	'$window',
	'$sce',
	function($scope, $state, zsModeConstants, zsEventConstants, zsTabletSrv, zsUtilitySrv, $stateParams, $sce, $window) {

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


        $scope.submitSignature = function(){
            /*
             * this method will check the guest in after swiping a card
             */
            $scope.signatureData = JSON.stringify($("#signature").jSignature("getData", "native"));
            $scope.checkInGuest();
        };
        
        $scope.checkInGuest = function(){
             var reservation_id = $scope.selectedReservation.id,
                    //payment_type = $scope.selectedReservation.payment_type,
                    signature = $scope.signatureData;

                $scope.invokeApi(zsTabletSrv.checkInGuest, {
                    'reservation_id':reservation_id, 
                    "authorize_credit_card": false,
                    "do_not_cc_auth": false,
                    "is_promotions_and_email_set": false,
                    "no_post": "",
                    'signature':signature
                }, $scope.afterGuestCheckinCallback, $scope.afterGuestCheckinCallback);
        };
        $scope.clearSignature = function(){
            $scope.signatureData = '';
            $("#signature").jSignature("clear");
        };
        
        $scope.goToCardSign = function(){
            $state.go('zest_station.card_sign');
        };
        
        
         
        $scope.skipEmailEntryAfterSwipe = function(){
                if ($scope.from === 'card-swipe'){
                    $scope.clearInputText();
                    $scope.from = 'input-email';
                    $scope.setLast('input-email');
                    
                    //$scope.goToScreen(null, 'select-keys-after-checkin', true, 'input-email');
                    $state.go('zest_station.input_reservation_email_after_swipe');
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
            
        $scope.afterGuestCheckinCallback = function(){
                $scope.$emit('hideLoader');
                 var guestEmailEnteredOrOnReservation = function(){
                    var useEmail = '';
                    
                    if ($scope.getLastInputEmail() !== ''){
                        useEmail = $scope.getLastInputEmail();
                    }
                    
                    if ($scope.selectedReservation.guest_details[0].email !== ''){
                        useEmail = $scope.selectedReservation.guest_details[0].email;
                        $scope.setLastInputEmail($scope.selectedReservation.guest_details[0].email);
                    };
                    
                    $scope.useEmail = useEmail;
                    if (useEmail !== '' && zsUtilitySrv.isValidEmail(useEmail)){
                        return true;
                    } else {
                        return false;
                    }
                };
                var haveValidGuestEmail = guestEmailEnteredOrOnReservation();//also sets the email to use for delivery

                //detect if coming from email input
                if (haveValidGuestEmail){
                        $state.go('zest_station.check_in_keys')
                    return;
                }
                
                //$scope.goToScreen(null, 'input-email', true, $scope.from);
                $state.go('zest_station.input_reservation_email_after_swipe');
                
                $scope.clearSignature();
            };
        
        
        
        $scope.init = function(r){ 
           $scope.selectedReservation = $state.selectedReservation;
            var current=$state.current.name;
            if (current === 'zest_station.card_sign'){
                 $scope.signaturePluginOptions = {
                    height : 130,
                    width : $(window).width() - 120,
                    lineWidth : 1
                };
                $scope.at = 'cc-sign';
            } else {
                $scope.at = 'card-swipe';
            }
            $scope.show = {
                swipecardScreen: true
            };
            $scope.headingText = 'To Complete Check-in...';
            $scope.signatureData = "";
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