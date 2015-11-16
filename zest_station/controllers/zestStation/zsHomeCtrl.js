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
            $state.mode = zsModeConstants.PICKUP_KEY_MODE;
            $state.go('zest_station.reservation_search', {
                mode: zsModeConstants.PICKUP_KEY_MODE
            });
	};

	/**
	 * when we clicked on checkin from home screen
	 */
	$scope.clickedOnCheckinButton = function() {
            $state.mode = zsModeConstants.CHECKIN_MODE;
            $state.go('zest_station.find_reservation_input_last', {
                mode: zsModeConstants.CHECKIN_MODE
            });
	};

	/**
	 * when we clicked on checkout from home screen
	 */
	$scope.clickedOnCheckoutButton = function() {
            $state.mode = zsModeConstants.CHECKOUT_MODE;
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
              //  className: 'ngdialog-theme-default',
                scope: $scope,
                closeByDocument: false,
                closeByEscape: false
            });
            setTimeout(function(){
                $('.ngdialog-close').hide();
            },50);
        };

    ($stateParams.isadmin == "true") ? openAdminPopup() : "";


    $scope.cancelAdminSettings = function(){
    	$scope.closeDialog();
    };

    $scope.updateSettings = function(value){
    	$scope.zestStationData.idle_timer.enabled = (value === 'true') ? true:false;
    };
    

        $scope.openPrinterMenu = function(){
            var onSuccess = function(success){
                alert(JSON.stringify(success));
            };
            var onFail = function(err){
                alert(JSON.stringify(err));
            };
            if (typeof cordova !== typeof undefined){
                //cordova.exec(onSuccess, onFail, 'RVCardPlugin', 'selectPrinter', [1024, 50])
            cordova.exec(
                    function(success){
                        //sntZestStation.selectedPrinter = JSON.stringify(success);
                        sntZestStation.selectedPrinter = success;
                        
                    }, function(error) {
                        alert('printer selection failed');
                    }, 'RVCardPlugin', 'selectPrinter'
                );
            }
        };
        
    $scope.saveAdminSettings = function(){
    	var saveCompleted = function(){
    		$scope.$emit('hideLoader');
    		$scope.closeDialog();
    	};
    	var params = {
            'kiosk': {
                'idle_timer':$scope.zestStationData.idle_timer,
                'work_station':$scope.zestStationData.selectedWorkStation
            }
        };

        var options = {
    		params: 			params,
    		successCallBack: 	saveCompleted
        };
		$scope.callAPI(zsTabletSrv.saveSettings, options);
    };

}]);