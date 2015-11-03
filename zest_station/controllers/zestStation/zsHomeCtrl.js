sntZestStation.controller('zsHomeCtrl', [
	'$scope',
	'$state',
	'zsModeConstants',
	'zsEventConstants','$stateParams','ngDialog','zsTabletSrv',
	function($scope, $state, zsModeConstants, zsEventConstants,$stateParams,ngDialog,zsTabletSrv) {

	/**
	 * when we clicked on pickup key from home screen
	 */
	$scope.clickedOnPickUpKey = function() {
            $state.go('zest_station.reservation_search', {
                mode: zsModeConstants.PICKUP_KEY_MODE
            });
	};

	/**
	 * when we clicked on checkin from home screen
	 */
	$scope.clickedOnCheckinButton = function() {
            $state.go('zest_station.find_reservation_input_last', {
                mode: zsModeConstants.CHECKIN_MODE
            });
	};

	/**
	 * when we clicked on checkout from home screen
	 */
	$scope.clickedOnCheckoutButton = function() {
            $state.go('zest_station.reservation_search', {
                mode: zsModeConstants.CHECKOUT_MODE
            });
	};

	/**
	 * [initializeMe description]
	 */
	var initializeMe = function() {
		//show back button
		$scope.$emit (zsEventConstants.HIDE_BACK_BUTTON);

		//show close button
		$scope.$emit (zsEventConstants.HIDE_CLOSE_BUTTON);
	}();

	/**
	 * admin popup actions starts here
	 */
	var openAdminPopup = function() {
        $scope.idle_timer_enabled = false;
        ngDialog.open({
            template: '/assets/partials/rvTabletAdminPopup.html',
            className: 'ngdialog-theme-default',
            scope: $scope,
            closeByDocument: false,
            closeByEscape: false
        });
    };

    ($stateParams.isadmin == "true") ? openAdminPopup() : "";


    $scope.cancelAdminSettings = function(){
    	$scope.closeDialog();
    };

    $scope.updateSettings = function(value){
    	$scope.zestStationData.idle_timer.enabled = (value === 'true') ? true:false;
    };

    $scope.saveAdminSettings = function(){
    	var saveCompleted = function(){
    		$scope.$emit('hideLoader');
    		$scope.closeDialog();
    	}
    	var params = {
                        'kiosk': {
                            'idle_timer':$scope.zestStationData.idle_timer
                        }
                	};

        var options = {
    		params: 			params,
    		successCallBack: 	saveCompleted
        };
		$scope.callAPI(zsTabletSrv.saveSettings, options);
    };

}]);