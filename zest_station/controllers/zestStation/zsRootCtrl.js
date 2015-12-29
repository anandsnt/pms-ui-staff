sntZestStation.controller('zsRootCtrl', [
	'$scope',
	'zsEventConstants',
	'$state','zsTabletSrv','$rootScope','ngDialog', '$sce',
	'zsUtilitySrv',
	function($scope, zsEventConstants, $state,zsTabletSrv, $rootScope,ngDialog, $sce, zsUtilitySrv) {

	BaseCtrl.call(this, $scope);
         $scope.storageKey = 'snt_zs_workstation';
         $scope.oosKey = 'snt_zs_workstation.in_oos';
	/**
	 * [navToPrev description]
	 * @return {[type]} [description]
	 */
	$scope.clickedOnBackButton = function() {
		$scope.$broadcast (zsEventConstants.CLICKED_ON_BACK_BUTTON);
	};
        $state.debugSixpay = false;
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
        
        //OOS to be turned on in Sprint44+
	/*$scope.$on (zsEventConstants.PUT_OOS, function(event) {//not used yet
            $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
            $scope.$emit(zsEventConstants.HIDE_CLOSE_BUTTON);
            $scope.$emit(zsEventConstants.HIDE_LOADER);

            $scope.disableTimeout();
           // $scope.setOOSInBrowser(true);
            $state.go('zest_station.oos');
	});
            
        
	$scope.$on (zsEventConstants.OOS_OFF, function(event) {
            $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
            $scope.$emit(zsEventConstants.HIDE_CLOSE_BUTTON);
            $scope.$emit(zsEventConstants.HIDE_LOADER);

            $scope.disableTimeout();
          //  $scope.setOOSInBrowser(false);
            $state.go('zest_station.oos');
	});
            
            
            
            
        $scope.setOOSInBrowser = function(t){
             var storageKey = $scope.oosKey,
                    storage = localStorage;
                console.log('storageKey: ',storageKey);
            try {
               storage.setItem(storageKey, t);
            } catch(err){
                console.warn(err);
            }
            console.info(storage.getItem(storageKey));
        };
            */
           
           
           
           
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
                //set print and email options set from hotel settings > Zest > zest station
                $scope.zestStationData.printEnabled = $scope.zestStationData.guest_bill.print;
                $scope.zestStationData.emailEnabled = $scope.zestStationData.guest_bill.email;
	};
        
    $scope.toggleOOS = function(){
        if ($state.isOOS){
            $rootScope.$emit(zsEventConstants.OOS_OFF);
        } else {
            $rootScope.$emit(zsEventConstants.OOS_OFF);
        }
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
//                $scope.$emit(zsEventConstants.PUT_OOS);
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
                            $state.emv_terminal_id = station.emv_terminal_id;
                        }
                    }
                } else {
                    $scope.zestStationData.workstations = 'Select';
                }
            } else {
                $scope.zestStationData.workstations = 'Select';
            }
                console.log('station', station)
            if (station !==  null){
                    sntZestStation.selectedPrinter = station.printer;
                    sntZestStation.encoder = station.key_encoder_id;
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
                    $scope.zestStationData.payment_gateway = $scope.zestStationData.hotel_settings.payment_gateway;
                    console.info('Payment Gateway: ',$scope.zestStationData.hotel_settings.payment_gateway);
                    console.info('zestStationData,',$scope.zestStationData)
                    $scope.$emit('hideLoader');
            };
            
            
		var options = {
                    params:                 {},
                    successCallBack: 	    onSuccess,
                    failureCallBack:        $scope.failureCallBack
                };
		$scope.callAPI(zsTabletSrv.fetchHotelSettings, options);
        };
        /*
        $scope.disableTimeout = function(){
            zsTimeoutEnabled = false;
        };
        $scope.enableTimeout = function(){
            zsTimeoutEnabled = true;
        };
        
        
        
        
            $scope.idlePopup = function() {
                if ($scope.at === 'cc-sign'){
                    //$scope.goToScreen({},'timeout',true, 'idle');
                    $scope.goToScreen(null, 'cc-sign-time-out', true, 'cc-sign');
                    $scope.$apply();
                } else {
                    if ($scope.at !== 'home' && $scope.at !== 'cc-sign' && $scope.at !== 'cc-sign-time-out'){
                        ngDialog.open({
                                template: '/assets/partials/zestStation/rvTabletIdlePopup.html',
                                className: 'ngdialog-theme-default',
                                scope: $scope,
                                closeByDocument: false,
                                closeByEscape: false
                        });
                    }
                }
                    
            };

            $scope.settingsTimerToggle = function(){
                if ($scope.settings){
                    if ($scope.settings.idle_timer.enabled){
                        $scope.settings.idle_timer.enabled = !$scope.settings.idle_timer.enabled;
                    }
                }
            };
            
            
            $scope.setupIdleTimer = function(){
                if ($scope.settings){
                    var settings = $scope.settings.idle_timer;
                    if (settings){
                        if (typeof settings.prompt !== typeof undefined && typeof settings.enabled !== typeof undefined) {
                            if (settings.prompt !== null && settings.enabled !== null){
                                $scope.idle_prompt = settings.prompt;
                                $scope.idle_timer_enabled = settings.enabled;
                                $scope.idle_max = settings.max;
                                

                                $scope.adminIdleTimeEnabled = settings.enabled;
                                $scope.adminIdleTimePrompt = settings.prompt;
                                $scope.adminIdleTimeMax = settings.max;

                                $scope.settings.adminIdleTimeEnabled = settings.enabled;
                                $scope.settings.adminIdleTimePrompt = settings.prompt;
                                $scope.settings.adminIdleTimeMax = settings.max;
                                
                                
                            } else {
                                $scope.idle_timer_enabled = false;
                            }
                        } else {
                            $scope.idle_timer_enabled = false;
                        }
                    }
                }
                    if ($scope.at !== 'home'){
                        $scope.resetTime();
                    }
            };
            
            $scope.resetCounter = function(){
               clearInterval($scope.idleTimer);
            };
            $scope.resetTime = function(){
                $scope.closePopup();
                if ($scope.at !== 'home'){ 
                    clearInterval($scope.idleTimer);
                    $scope.startCounter();
                }   
            };
            
            $scope.startCounter = function(){
                var time = $scope.idle_max, promptTime = $scope.idle_prompt;
                
                    var timer = time, minutes, seconds;
                    var timerInt = setInterval(function () {
                        if ($scope.idle_timer_enabled && $scope.at !== 'home'){
                                
                                minutes = parseInt(timer / 60, 10);
                                seconds = parseInt(timer % 60, 10);

                                minutes = minutes < 10 ? "0" + minutes : minutes;
                                seconds = seconds < 10 ? "0" + seconds : seconds;
                                
                                if (timer === promptTime){
                                    $scope.idlePopup();
                                }
                                
                                if (--timer < 0) {
                                    setTimeout(function(){
                                        //setup a timeout @ logic depending on which screen you are, you may get a "Are you still there" different look
                                        //like re-swipe card, etc.;
                                        $scope.handleIdleTimeout();
                                    },1000);
                                    
                                    clearInterval(timerInt);
                                    return;
                                    //timer = duration;
                                }
                        }
                    }, 1000);
                    $scope.idleTimer = timerInt;
            };
            
            $scope.handleIdleTimeout = function(){
                $scope.navToHome();
            };
            
        
        
        */
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
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