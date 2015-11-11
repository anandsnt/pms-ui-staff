sntZestStation.controller('zsRootCtrl', [
	'$scope',
	'zsEventConstants',
	'$state','zsTabletSrv','$rootScope','ngDialog', '$sce',
	function($scope, zsEventConstants, $state,zsTabletSrv, $rootScope,ngDialog,$sce) {

	BaseCtrl.call(this, $scope);
	/**
	 * [navToPrev description]
	 * @return {[type]} [description]
	 */
	$scope.clickedOnBackButton = function() {
		$scope.$broadcast (zsEventConstants.CLICKED_ON_BACK_BUTTON);
	};

	/**
	 * [clickedOnCloseButton description]
	 * @return {[type]} [description]
	 */
	$scope.clickedOnCloseButton = function() {
		$state.go ('zest_station.home');
	};

	/**
	 * [clickedOnAdmin description]
	 * @return {[type]} [description]
	 */
	$scope.goToAdmin = function() {
		$state.go ('zest_station.admin');
	};

	/**
	 * [ngDialog closse description]
	 * @return {[type]} [description]
	 */
	$scope.closeDialog = function() {
		ngDialog.close();
	};

	/**
	 * event for child controllers to show loader
	 * @return {undefined}
	 */
        $scope.$on(zsEventConstants.SHOW_LOADER,function(){
            $scope.hasLoader = true;
        });

	/**
	 * event for child controllers to hide loader
	 * @return {undefined}
	 */
        $scope.$on(zsEventConstants.HIDE_LOADER,function(){
            $scope.hasLoader = false;
        });

	/**
	 * event for showing the back button
	 * @param  {[type]} event
	 * @return {[type]} 
	 */
	$scope.$on (zsEventConstants.SHOW_BACK_BUTTON, function(event) {
		$scope.hideBackButton = false;
	});

	/**
	 * event for hiding the back button
	 * @param  {[type]} event
	 * @return {[type]}
	 */
	$scope.$on (zsEventConstants.HIDE_BACK_BUTTON, function(event) {
		$scope.hideBackButton = true;
	});

	/**
	 * event for showing the close button
	 * @param  {[type]} event
	 * @return {[type]}
	 */
	$scope.$on (zsEventConstants.SHOW_CLOSE_BUTTON, function(event) {
		$scope.hideCloseButton = false;
	});

	/**
	 * event for hiding the close button
	 * @param  {[type]} event
	 * @return {[type]}
	 */
	$scope.$on (zsEventConstants.HIDE_CLOSE_BUTTON, function(event) {
		$scope.hideCloseButton = true;
	});


	var routeChange = function(event, newURL) {
      event.preventDefault();
      return;
    };

    $rootScope.$on('$locationChangeStart', routeChange);
    window.history.pushState("initial", "Showing Dashboard", "#/zest_station/home");

	/**
	 * Set zest admin settings data.
	 */
	var fetchCompleted =  function(data){
		$scope.$emit('hideLoader');
		$scope.zestStationData = data;
		$scope.zestStationData.guest_bill.print = ($scope.zestStationData.guest_bill.print && $scope.zestStationData.is_standalone) ? true : false;
                $scope.fetchHotelSettings();
                $scope.fetchKeyEncoderList();
	};
	$scope.failureCallBack =  function(data){
		$state.go('zest_station.error_page');
	};
        $scope.fetchKeyEncoderList = function(){
            console.log('fetching key encoders')
            var onSuccess = function(data){
                console.info('got key encoders: ',data.results)
                    $scope.zestStationData.key_encoders = data.results;
                    $scope.$emit('hideLoader');
            };
            
            var options = {
                params:                 {},
                successCallBack: 	    onSuccess,
                failureCallBack:        $scope.failureCallBack
            };
            $scope.callAPI(zsTabletSrv.fetchEncoders, options);
        };
        $scope.fetchHotelSettings = function(){
            var onSuccess = function(data){
                    $scope.zestStationData.hotel_settings = data;
                    $scope.zestStationData.hotel_terms_and_conditions = $sce.trustAsHtml(data.terms_and_conditions).$$unwrapTrustedValue();
                    //fetch the idle timer settings
                    $scope.zestStationData.currencySymbol = data.currency.symbol;
                    $scope.zestStationData.isHourlyRateOn = data.is_hourly_rate_on;
                    $scope.$emit('hideLoader');
            };
            
            
		var options = {
                    params:                 {},
                    successCallBack: 	    onSuccess,
                    failureCallBack:        $scope.failureCallBack
                };
		$scope.callAPI(zsTabletSrv.fetchHotelSettings, options);
        };
	/**
	 * [initializeMe description]
	 * @return {[type]} [description]
	 */
	var initializeMe = function() {
		//for back button
		$scope.hideBackButton = true;

		//for close button
		$scope.hideCloseButton = true;

		//to show loader
		$scope.hasLoader = false;

		//call Zest station settings API
		var options = {
                    params: 			{},
                    successCallBack: 	fetchCompleted,
                    failureCallBack:    $scope.failureCallBack
                };
		$scope.callAPI(zsTabletSrv.fetchSettings, options);
	}();
}]);