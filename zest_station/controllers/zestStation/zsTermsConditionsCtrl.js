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


        $scope.agreeTerms = function(){
            //$scope.goToScreen(null, 'select-keys-after-checkin', true);
            console.info('goto card swipe');
            $state.go('zest_station.card_swipe');
        };
 
        var refreshScroller = function(){
        	$scope.refreshScroller('terms');
        }
		$scope.setScroller('terms');
       
        $scope.init = function(r){
                $scope.termsHeading = "";
                $scope.subHeading = "";
                $scope.subHeadingText = "";
                $scope.headingText = "Terms & Conditions";

                $scope.agreeButtonText = "I Agree";
                $scope.cancelButtonText = "Cancel";

                $scope.at = 'terms-conditions';
                
           
                var fetchHotelCompleted = function(data){
                    $scope.hotel_settings = data;
                    $scope.hotel_terms_and_conditions = $sce.trustAsHtml($scope.hotel_settings.terms_and_conditions).$$unwrapTrustedValue();
                    //fetch the idle timer settings
                    $scope.currencySymbol = $scope.hotel_settings.currency.symbol;
                    $timeout(function() {
						refreshScroller();
					}, 300);
                    $scope.$emit('hideLoader');
                };
    
                
                $scope.invokeApi(zsTabletSrv.fetchHotelSettings, {}, fetchHotelCompleted);
                
            
            
            
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