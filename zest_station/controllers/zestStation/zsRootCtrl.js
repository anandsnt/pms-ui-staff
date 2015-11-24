sntZestStation.controller('zsRootCtrl', [
	'$scope',
	'zsEventConstants',
	'$state','zsTabletSrv','$rootScope','ngDialog', '$sce',
	function($scope, zsEventConstants, $state,zsTabletSrv, $rootScope,ngDialog,$sce) {

	BaseCtrl.call(this, $scope);
         $scope.storageKey = 'snt_zs_workstation';
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
		//disabling for now
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
        $scope.setLastErrorReceived = function(response){
            console.warn(response);
            if (response && response[0]){
                $state.errorReceived = response[0];
            } else {
                $state.errorReceived = null;
            }
        };
        $scope.$on('GENERAL_ERROR',function(evt, response){
            $scope.setLastErrorReceived(response);
            $scope.$emit('hideLoader');
            $state.go('zest_station.error');
        });
        
        $scope.$on('MAKE_KEY_ERROR',function(evt, response){
            $scope.setLastErrorReceived(response);
            $scope.$emit('hideLoader');
            $state.go('zest_station.key_error');
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
                $scope.getWorkStation();
                //$scope.fetchKeyEncoderList(); //using workstations instead
	};
        
        $scope.getWorkStation = function(){
            var onSuccess = function(response){
                if (response){
                    $scope.zestStationData.workstations = response.work_stations;
                    $scope.setWorkStation();
                }
            };
            var onFail = function(response){
                console.warn('fetching workstation list failed:',response);
            };
            var options = {
                
                params:                 {
                    page: 1,
                    per_page: 100,
                    query:'',
                    sort_dir: true,
                    sort_field: 'name'
                },
                successCallBack: 	    onSuccess,
                failureCallBack:        onFail
            };
            $scope.callAPI(zsTabletSrv.fetchWorkStations, options);
        };  
        $scope.setWorkStation = function(){
            /*
             * This method will get the device's last saved workstation, and from the last fetched list of workstations
             * will set the workstation for the UI, which is also used in determining the device's default printer
             */
             var storageKey = $scope.storageKey,
                    storage = localStorage,
                    storedWorkStation = '',
                    station = null;
            console.log('storageKey: ',storageKey)
            try {
               storedWorkStation = storage.getItem(storageKey);
            } catch(err){
                console.warn(err);
            }
            if ($scope.zestStationData){
                if ($scope.zestStationData.workstations && $scope.zestStationData.workstations.length > 0){
                    for (var i in $scope.zestStationData.workstations){
                        if ($scope.zestStationData.workstations[i].station_identifier === storedWorkStation){
                            station = $scope.zestStationData.workstations[i];
                        }
                    }
                }
            }
                console.log('station', station)
            if (station !==  null){
                $scope.zestStationData.encoder = station.key_encoder_id;
                sntZestStation.selectedPrinter = station.printer;
                console.info('workstation found!: ',station.name);
                }
            return station;
        };
	$scope.failureCallBack =  function(data){
		$state.go('zest_station.error_page');
	};
        /*
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
        };*/
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