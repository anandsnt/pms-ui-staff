sntZestStation.controller('zsTermsConditionsCtrl', [
	'$scope',
	'$state',
	'zsModeConstants',
	'zsEventConstants',
	'zsTabletSrv',
	'zsUtilitySrv',
	'$stateParams',
	'$sce','$timeout',
	function($scope, $state, zsModeConstants, zsEventConstants, zsTabletSrv, zsUtilitySrv, $stateParams, $sce,$timeout) {

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
            $state.go('zest_station.reservation_details');
            //$state.go ('zest_station.home');//go back to reservation search results
	});

        $scope.navToPrev = function(){
            $scope.$emit(zsEventConstants.CLICKED_ON_BACK_BUTTON);
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

        $scope.agreeTerms = function(){
            var depositAmt, depositRemaining = 0, enforceDeposit = $scope.hotel_settings.enforce_deposit;
            if ($state.selectedReservation && $state.selectedReservation.reservation_details){
                    depositAmt = $state.selectedReservation.reservation_details.data.reservation_card.deposit_amount;
            }
            depositRemaining = parseInt(depositAmt);
           
            var showDeposit = false;
            if (depositRemaining > 0 && enforceDeposit){
                showDeposit = true;
            }
            $state.showDeposit = showDeposit;
            if (!showDeposit){
                $state.go('zest_station.card_swipe'); 
            } else {
                $state.go('zest_station.deposit_agree'); 
            }
        };
 		$scope.setScroller('terms');

 		var setTermsConditionsHeight = function(){
 			if($('#textual').length) {
		        var $contentHeight = ($('#content').outerHeight()),
		            $h1Height = $('#content h1').length ? $('#content h1').outerHeight(true) : 0,
		            $h2Height = $('#content h2').length ? $('#content h2').outerHeight(true) : 0,
		            $h3Height = $('#content h3').length ? $('#content h3').outerHeight(true) : 0,
		            $headingsHeight = parseFloat($h1Height + $h2Height + $h3Height),
		            $textualHeight = parseFloat($contentHeight-$headingsHeight);		
		       		$('#textual').css('max-height', $textualHeight + 'px');
   		 	}
 		};
        var refreshScroller = function(){
        	$scope.refreshScroller('terms');
        }
		
       
        $scope.init = function(r){
                $scope.termsHeading = "";
                $scope.subHeading = "";
                $scope.subHeadingText = "";
                $scope.headingText = "TERMS_CONDITIONS_HEADER";

                $scope.agreeButtonText = "TERMS_CONDITIONS_ACCEPT";
                $scope.cancelButtonText = "TERMS_CONDITIONS_CANCEL";

                $scope.at = 'terms-conditions';
                
                $scope.hotel_settings = $scope.zestStationData;
                $scope.hotel_terms_and_conditions = $scope.zestStationData.hotel_terms_and_conditions;
                //fetch the idle timer settings
                $scope.currencySymbol = $scope.zestStationData.currencySymbol;
                
                setTermsConditionsHeight();
                $timeout(function() {
                            refreshScroller();
                }, 600);
            
            
            
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