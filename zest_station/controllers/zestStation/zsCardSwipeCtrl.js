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
             var current=$state.current.name;
            if (current === 'zest_station.card_sign'){
                $state.go ('zest_station.card_swipe');
            } else if(current === 'zest_station.card_swipe'){
                $state.go ('zest_station.terms_conditions');
                
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


        $scope.submitSignature = function(){
            /*
             * this method will check the guest in after swiping a card
             */
            $scope.signatureData = JSON.stringify($("#signature").jSignature("getData", "native"));
            if ($scope.signatureData !== [] && $scope.signatureData !== null && $scope.signatureData !== '' && $scope.signatureData !== '[]'){
                $scope.checkInGuest();
            }
        };
        $scope.setCheckInMessage = function(){
            $state.go('zest_station.checking_in_guest');
        };
        $scope.roomIsAssigned = function(){
          if ($scope.selectedReservation.room && (parseInt($scope.selectedReservation.room) === 0 || parseInt($scope.selectedReservation.room) > 0)){
              return true;
          }
          return false;
        };
        $scope.checkInGuest = function(){
           // if room is not assigned, go through autoassignment
            if ($scope.roomIsAssigned()){
                var reservation_id = $scope.selectedReservation.id,
                    //payment_type = $scope.selectedReservation.payment_type,
                    signature = $scope.signatureData;

                $scope.setCheckInMessage();
                setTimeout(function(){
                    $scope.invokeApi(zsTabletSrv.checkInGuest, {
                     'reservation_id':reservation_id, 
                     "authorize_credit_card": false,
                     "do_not_cc_auth": false,
                     "is_promotions_and_email_set": false,
                     "no_post": "",
                     'signature':signature
                 }, $scope.afterGuestCheckinCallback, $scope.afterGuestCheckinCallback); 
                },500);
            } else {
                $scope.assignRoomToReseravtion();
            }
        };
        
        $scope.assignRoomToReseravtion = function(){
             var reservation_id = $scope.selectedReservation.id;
             
                    $scope.invokeApi(zsTabletSrv.assignGuestRoom, {
                     'reservation_id':reservation_id, 
                 }, $scope.roomAssignCallback, $scope.roomAssignCallback); 
        };
        $scope.roomAssignCallback = function(response){
            console.info('room assign callback: ',response);
            $scope.$emit('hideLoader');
            if (response.status && response.status === 'success'){
                $scope.selectedReservation.room = response.data.room_number;
                $scope.checkInGuest();
            } else {
                $state.go('zest_station.room_error');
            }
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
            
            $scope.guestEmailOnFile = function(){
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
            
        $scope.afterGuestCheckinCallback = function(response){
            console.info('response from guest check-in',response)
                $scope.$emit('hideLoader');
                
                var haveValidGuestEmail = $scope.guestEmailOnFile();//also sets the email to use for delivery
                var successfulCheckIn = (response.status === "success")? true : false;
                //detect if coming from email input
                if (haveValidGuestEmail && successfulCheckIn){
                        $state.go('zest_station.check_in_keys');
                    return;
                } else if (!successfulCheckIn) {
                    $scope.$emit('hideLoader');
                    $state.go('zest_station.error');
                    
                } else {//successful check-in but missing email on reservation
                    $state.go('zest_station.input_reservation_email_after_swipe');
                }
                
            };
        
        
        
        $scope.init = function(r){ 
           $scope.selectedReservation = $state.selectedReservation;
            var current=$state.current.name;
            if (current === 'zest_station.card_sign'){
                 $scope.signaturePluginOptions = {
                    height : 230,
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