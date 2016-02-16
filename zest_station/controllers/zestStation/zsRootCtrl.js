sntZestStation.controller('zsRootCtrl', [
	'$scope',
	'zsEventConstants',
	'$state','zsTabletSrv','$rootScope','ngDialog', '$sce',
	'zsUtilitySrv','$translate', 'zsHotelDetailsSrv', 'cssMappings', 'zestStationSettings',
	function($scope, zsEventConstants, $state,zsTabletSrv, $rootScope,ngDialog, $sce, zsUtilitySrv, $translate, hotelDetailsSrv, cssMappings, zestStationSettings) {

	BaseCtrl.call(this, $scope);
        $scope.storageKey = 'snt_zs_workstation';
        $scope.oosKey = 'snt_zs_workstation.in_oos';
        $scope.syncOOSInterval = 119;//in seconds (0-based) // currently will re-sync every 2 minutes, next release will be an admin setting per hotel
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
           // $state.go('zest_station.home-admin',{'isadmin':true});//for debugging quickly
	};

	/**
	 * [ngDialog closse description]
	 * @return {[type]} [description]
	 */
	$scope.closeDialog = function() {
		ngDialog.hide();
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
	$scope.$on (zsEventConstants.PUT_OOS, function(event) {//not used yet
            if ($state.current.name !== 'zest_station.admin'){
                $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
                $scope.$emit(zsEventConstants.HIDE_CLOSE_BUTTON);
                $scope.$emit(zsEventConstants.HIDE_LOADER);

                $scope.disableTimeout();
                $scope.setOOSInBrowser(true);
                $scope.zestStationData.is_oos = true;
                $state.go('zest_station.oos');
            }
	});
            
        
	$scope.$on (zsEventConstants.OOS_OFF, function(event) {
           if ($scope.zestStationData.is_oos){
                $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
                $scope.$emit(zsEventConstants.HIDE_CLOSE_BUTTON);
                $scope.$emit(zsEventConstants.HIDE_LOADER);

                $scope.disableTimeout();
                $scope.setOOSInBrowser(false);
                //only if coming out of OOS, take to home page, otherwise on-refresh, this will interrupt workflow
                $state.go('zest_station.home');
            }
	});
            
        
            
            
        $scope.isOOS = true;
        $scope.setOOSInBrowser = function(t){
             var storageKey = $scope.oosKey,
                    storage = localStorage;
            try {
               storage.setItem(storageKey, t);
            } catch(err){
                console.warn(err);
            }
            if (storage.getItem(storageKey)){
                $scope.isOOS = true;
            } else {
                $scope.isOOS = false;
            }
            
        };
           
        $scope.hotelThemeCB = function(response){
            var theme = null;
            /*
             * This will identify the theme attached to the hotel
             * then set by name (will do this for now, since there are only 2 customers)
             * but will need to move out to more automated method
             */
            if (response && response.existing_email_templates && response.themes){
                var hotelDetails = _.findWhere(response.themes, {id: response.existing_email_template_theme});
                theme = hotelDetails && hotelDetails.name;
  
            }
            theme = $scope.getThemeName(theme);//from here we can change the default theme(to stayntouch, or other hotel)
            $state.theme = theme;
            if (theme !== null){
                var loadStyleSheets = function(filename){
                    var fileref = document.createElement("link");
                    fileref.setAttribute("rel", "stylesheet");
                    fileref.setAttribute("type", "text/css");
                    fileref.setAttribute("href", filename);
                    $('body').append(fileref);
                };
                var url = cssMappings[theme.toLowerCase()];
                loadStyleSheets(url);
                
                $scope.setThemeByName(theme);
            }
            
            $scope.language = theme;
            
            $scope.loadTranslations(theme);
            $scope.$emit('hideLoader');
        };
        $scope.language = null;
        $scope.loadTranslations = function(theme){
            if ($scope.language) {
                
              $translate.use('EN_'+theme.toLowerCase());
            //  $translate.fallbackLanguage('EN');
              /* For reason unclear, the fallback translation does not trigger
               * unless a translation is requested explicitly, for second screen
               * onwards.
               * TODO: Fix this bug in ng-translate and implement in this here.
               */
              setTimeout(function() {
                $translate('NA');
              }, 1000); //Word around.
            } else {
              $translate.use('EN_zoku');
            };
        };
        
        $scope.getLogoSvg = function(theme){
            //need a better workaround/fix so the svg renders properly in all browsers
            //this fixes an issue not drawing properly in safari
            var zoku = angular.element('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="logo" id="zoku-logo" x="0px" y="0px" width="937.2px" height="146.3px" viewBox="0 0 937.2 146.3" enable-background="new 0 0 937.2 146.3" xml:space="preserve"><path fill="#FFFFFF" d="M336.3 145.8c-39.5 0-71.7-32.2-71.7-71.7 0-39.5 32.2-71.7 71.7-71.7 39.5 0 71.7 32.2 71.7 71.7C407.9 113.6 375.8 145.8 336.3 145.8M336.3 13.4c-33.4 0-60.7 27.2-60.7 60.7 0 33.4 27.2 60.7 60.7 60.7 33.4 0 60.7-27.2 60.7-60.7C396.9 40.6 369.7 13.4 336.3 13.4"></path><path fill="#FFFFFF" d="M534.5 146.3c-3 0-5.5-2.5-5.5-5.5V8c0-3 2.5-5.5 5.5-5.5S540 5 540 8v132.8C540 143.9 537.5 146.3 534.5 146.3"></path><path fill="#FFFFFF" d="M666.1 145.1c-1.4 0-2.8-0.5-3.9-1.6l-65.9-65.4c-1-1-1.6-2.4-1.6-3.9 0-1.5 0.6-2.9 1.6-3.9l66.6-66.2c2.2-2.1 5.7-2.1 7.8 0 2.1 2.2 2.1 5.7 0 7.8l-62.7 62.3 62 61.5c2.2 2.1 2.2 5.6 0 7.8C668.9 144.5 667.5 145.1 666.1 145.1"></path><path fill="#FFFFFF" d="M865.5 146.1c-27.6 0-44.4-13.1-53.7-24.1 -11.1-13.2-17.5-30.5-17.5-47.5v-66c0-3 2.5-5.5 5.5-5.5 3 0 5.5 2.5 5.5 5.5v66c0 14.3 5.6 29.4 14.9 40.4 7.8 9.2 21.9 20.2 45.2 20.2 23.1 0 37.4-11 45.3-20.3 9.6-11.2 15.4-26.3 15.4-40.4V8.3c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5v66.1c0 16.7-6.7 34.5-18 47.6C909.7 133 892.7 146.1 865.5 146.1"></path><path fill="#FFFFFF" d="M108 13.5H5.5C2.5 13.5 0 11 0 8c0-3 2.5-5.5 5.5-5.5H108c3 0 5.5 2.5 5.5 5.5C113.5 11 111.1 13.5 108 13.5"></path><path fill="#FFFFFF" d="M137.5 145.6H5.5c-2.2 0-4.3-1.4-5.1-3.4 -0.8-2.1-0.4-4.5 1.2-6L112 27.6c2.2-2.1 5.7-2.1 7.8 0.1 2.1 2.2 2.1 5.7-0.1 7.8L19 134.5h118.5c3 0 5.5 2.5 5.5 5.5C143 143.1 140.5 145.6 137.5 145.6"></path><path fill="#FFFFFF" d="M144.3 7.9c0 3.6-2.9 6.5-6.5 6.5 -3.6 0-6.5-2.9-6.5-6.5 0-3.6 2.9-6.5 6.5-6.5C141.3 1.4 144.3 4.3 144.3 7.9"></path><path fill="#FFFFFF" d="M137.8 15.8c-4.3 0-7.9-3.5-7.9-7.9 0-4.3 3.5-7.9 7.9-7.9s7.9 3.5 7.9 7.9C145.6 12.2 142.1 15.8 137.8 15.8M137.8 2.8c-2.8 0-5.1 2.3-5.1 5.1 0 2.8 2.3 5.1 5.1 5.1s5.1-2.3 5.1-5.1C142.9 5.1 140.6 2.8 137.8 2.8"></path></svg>');
            var fontainebleau = angular.element('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" class="logo" id="fontainebleu-logo" x="0" y="0" viewBox="-256.5 930.1 724.1 200.6" xml:space="preserve" enable-background="new -256.5 930.1 724.1 200.6"><path d="M-14.8 963.6c-0.6 0-19.5 0-20.1 0 0 0.5 0 4.2 0 4.7 0.6 0 7.3 0 7.3 0s0 26.9 0 27.5c0.5 0 5 0 5.5 0 0-0.6 0-27.5 0-27.5s6.8 0 7.3 0C-14.8 967.8-14.8 964.1-14.8 963.6L-14.8 963.6z"></path><path d="M-178.1 977.4c-0.6 0-10.9 0-10.9 0v-9.1c0 0 10.9 0 11.4 0 0-0.5 0-4.2 0-4.7 -0.6 0-16.4 0-17 0 0 0.6 0 31.6 0 32.2 0.5 0 5 0 5.5 0 0-0.6 0-13.6 0-13.6s10.3 0 10.9 0C-178.1 981.6-178.1 977.9-178.1 977.4L-178.1 977.4z"></path><path d="M-135.8 991.6c-6.8 0-12.4-5.4-12.4-12 0-6.7 5.6-12.1 12.4-12.1 6.8 0 12.4 5.4 12.4 12.1C-123.4 986.3-128.9 991.6-135.8 991.6L-135.8 991.6zM-135.8 962.8c-9.9 0-17.9 7.6-17.9 16.9 0 9.2 8 16.7 17.9 16.7s18-7.5 18-16.7C-117.8 970.4-125.9 962.8-135.8 962.8L-135.8 962.8z"></path><path d="M65.2 963.5c0 0.6 0 31.6 0 32.2 0.5 0 5 0 5.5 0 0-0.6 0-31.6 0-32.2C70.2 963.5 65.7 963.5 65.2 963.5L65.2 963.5z"></path><path d="M180.5 968.2c0-0.5 0-4.2 0-4.7 -0.6 0-17.4 0-18 0 0 0.6 0 31.6 0 32.2 0.6 0 17.4 0 18 0 0-0.5 0-4.2 0-4.7 -0.6 0-12.4 0-12.4 0v-8.8c0 0 11.3 0 11.9 0 0-0.5 0-4.2 0-4.7 -0.6 0-11.9 0-11.9 0v-9.1C168 968.2 179.9 968.2 180.5 968.2L180.5 968.2z"></path><path d="M264.6 963.5c0 0.6 0 31.6 0 32.2 0.6 0 15.7 0 16.3 0 0-0.5 0-4.2 0-4.7 -0.6 0-10.8 0-10.8 0s0-26.9 0-27.5C269.6 963.5 265.1 963.5 264.6 963.5L264.6 963.5z"></path><path d="M327.8 968.2c0-0.5 0-4.2 0-4.7 -0.6 0-17.4 0-18 0 0 0.6 0 31.6 0 32.2 0.6 0 17.4 0 18 0 0-0.5 0-4.2 0-4.7 -0.6 0-12.4 0-12.4 0v-8.8c0 0 11.3 0 11.9 0 0-0.5 0-4.2 0-4.7 -0.6 0-11.9 0-11.9 0v-9.1C315.4 968.2 327.3 968.2 327.8 968.2L327.8 968.2z"></path><path d="M436 984.1c0 0 0-20 0-20.6 -0.5 0-5 0-5.5 0 0 0.6 0 20.6 0 20.6 0 5-2.2 7.6-6.6 7.6 -4.4 0-6.6-2.5-6.6-7.6 0 0 0-20 0-20.6 -0.5 0-5.1 0-5.6 0 0 0.6 0 20.6 0 20.6 0 4.2 1.1 6.6 2.1 7.7 1.7 2.2 5.3 4.5 10.1 4.5 4.1 0 7.9-1.8 10.1-4.7C435.3 989.9 436 987.4 436 984.1L436 984.1z"></path><path d="M222.2 990.9h-4.8v-9.8h4.9c6.4 0 6.9 3.8 6.9 4.9C229.3 988.2 228.1 990.9 222.2 990.9L222.2 990.9zM217.5 968.2h4.2c5 0 5.5 2.8 5.5 4.1 0 2.7-2.1 4.1-6.1 4.1h-3.6L217.5 968.2 217.5 968.2zM234.8 986.3c0-3.9-1.9-6.4-5.7-7.7l-1.1-0.4 1.1-0.5c0.9-0.5 3.7-2 3.7-5.9 0-2.1-1.1-4.3-2.8-5.8 -2.9-2.4-6.8-2.4-10.5-2.4 0 0-6.8 0-7.4 0 0 0.6 0 31.4 0 32 0.6 0 9.9 0 9.9 0 2.7 0 6.4-0.3 8.8-1.9C232.5 992.4 234.8 990.1 234.8 986.3L234.8 986.3z"></path><path d="M369.8 970l5.4 13.5h-10.8L369.8 970 369.8 970zM377.2 988.3l3 7.4h6.2c0 0-13.5-30.4-14.3-32.2 -0.4 0-4.1 0-4.5 0 -0.2 0.3-13.9 31.4-14.2 32.2 0.8 0 6.2 0 6.2 0l3-7.4H377.2L377.2 988.3z"></path><path d="M22.3 970l5.4 13.5H16.9L22.3 970 22.3 970zM29.6 988.3l3 7.4h6.3c0 0-13.5-30.4-14.3-32.2 -0.4 0-4.1 0-4.5 0 -0.2 0.3-13.9 31.4-14.2 32.2 0.8 0 6.2 0 6.2 0l3-7.4H29.6L29.6 988.3z"></path><polygon points="-90.2 963.6 -82.9 963.6 -67.3 988.4 -67.2 988.5 -67.3 988.5 -67.2 988.4 -67.2 963.6 -61.7 963.6 -61.7 995.7 -68.7 995.7 -84.6 970.6 -84.7 970.6 -84.7 995.7 -90.2 995.7 "></polygon><polygon points="102.1 963.6 109.4 963.6 125.1 988.4 125.1 988.5 125.1 988.5 125.1 988.4 125.1 963.6 130.7 963.6 130.7 995.7 123.6 995.7 107.7 970.6 107.6 970.6 107.6 995.7 102.1 995.7 "></polygon><path d="M460.5 978.1c-3.9 0-7.1-2.9-7.1-7s3.2-7.1 7.1-7.1c4 0 7.1 3 7.1 7.1S464.5 978.1 460.5 978.1zM460.5 964.9c-3.5 0-6.2 2.5-6.2 6.2s2.7 6.2 6.2 6.2c3.6 0 6.2-2.5 6.2-6.2S464.1 964.9 460.5 964.9zM463.2 975.2l-2.6-3.6h-1.4v3.7h-0.9v-8.4h2.3c1.5 0 2.5 1.1 2.5 2.3 0 1-0.7 1.8-1.5 2.2l2.4 3.4L463.2 975.2zM460.6 967.8h-1.4v2.9h1.4c1 0 1.7-0.7 1.7-1.5C462.2 968.4 461.5 967.8 460.6 967.8z"></path><path d="M-38.1 1061.1l-1.3-16.2c-0.2-2.6-0.4-5.5-0.5-8.1H-40c-1.1 2.6-2.6 5.8-3.9 8.3l-7.9 16.2H-53l-7.9-16.2c-1.2-2.4-2.6-5.5-3.8-8.3h-0.1c-0.1 2.6-0.3 5.7-0.5 8.1l-1.3 16.2h-3l2.5-31.2h2.2l8.6 17.4c1.3 2.7 2.8 5.9 4.1 8.7h0.1c1.2-2.8 2.6-5.8 4-8.7l8.5-17.4h2.1l2.6 31.2H-38.1z"></path><path d="M-18.9 1061.1v-31.2h3.3v31.2H-18.9z"></path><path d="M22.8 1061.1l-3.6-8.7H6.1l-3.5 8.7h-3.3l12.8-31.6h1.2l12.8 31.6H22.8zM14.4 1040.1c-0.5-1.4-1.2-3.1-1.7-4.8h-0.1c-0.5 1.7-1.1 3.4-1.7 4.8l-3.8 9.6H18L14.4 1040.1z"></path><path d="M70.9 1061.1l-1.3-16.2c-0.2-2.6-0.4-5.5-0.5-8.1H69c-1.1 2.6-2.6 5.8-3.9 8.3l-7.9 16.2H56l-7.9-16.2c-1.2-2.4-2.6-5.5-3.8-8.3h-0.1c-0.1 2.6-0.3 5.7-0.5 8.1l-1.3 16.2h-3l2.5-31.2h2.2l8.6 17.4c1.3 2.7 2.8 5.9 4.1 8.7h0.1c1.2-2.8 2.6-5.8 4-8.7l8.5-17.4h2.1l2.6 31.2H70.9z"></path><path d="M90.1 1061.1v-31.2h3.3v31.2H90.1z"></path><path d="M141.3 1061.1h-9.4v-31.2h7.7c4.3 0 8.4 2.9 8.4 7.7 0 2.5-1.3 4.9-3.4 5.8 3.5 0.7 6.6 4.2 6.6 8.4C151.1 1057.7 146.3 1061.1 141.3 1061.1zM139 1032.7h-4v9.9h4.2c2.9 0 5.4-1.8 5.4-4.9C144.6 1034.4 142.1 1032.7 139 1032.7zM140.4 1045.3H135v13.1h5.7c3.8 0 7.1-2.4 7.1-6.5C147.8 1047.7 144.4 1045.3 140.4 1045.3z"></path><path d="M166.3 1061.1v-31.2h16.3v2.8h-13v11.3h10.7v2.8h-10.7v11.4h14.7v2.8L166.3 1061.1 166.3 1061.1z"></path><path d="M219.7 1061.1l-3.6-8.7H203l-3.5 8.7h-3.3l12.8-31.6h1.2l12.8 31.6H219.7zM211.3 1040.1c-0.5-1.4-1.2-3.1-1.7-4.8h-0.1c-0.5 1.7-1.1 3.4-1.7 4.8l-3.8 9.6h11L211.3 1040.1z"></path><path d="M259.9 1034.6c-1.7-1-4.8-2.1-8.1-2.1 -6.9 0-13.3 4.9-13.3 13s6.3 13 13.3 13c3.6 0 6.3-0.7 8.3-2l-0.3 3.1c-1.9 1.1-4.4 1.7-8.3 1.7 -8.3 0-16.3-6-16.3-15.9 0-9.9 8.1-15.9 16.3-15.9 3.9 0 7.1 0.9 9.1 2.1L259.9 1034.6z"></path><path d="M296.9 1061.1v-14.3H279v14.3h-3.3v-31.2h3.3v14.1h17.9v-14.1h3.3v31.2H296.9L296.9 1061.1z"></path><path d="M-240.4 972.6v150.8c0 4 3.3 7.3 7.4 7.3s7.4-3.3 7.4-7.4v-82.6c0-4-3.3-7.3-7.3-7.4l0 0 0 0h-2v2.7h1.9c2.6 0 4.6 2.1 4.6 4.7v82.6c0 2.6-2.1 4.7-4.6 4.7 -2.6 0-4.7-2.1-4.7-4.6V972.6H-240.4z"></path><path d="M-243.8 930.1c-4.8 0-8.7 3.9-8.7 8.7 0 0 0 93.3 0 94.6 -0.9 0-4 0-4 0v2.7c0 0 3.1 0 4 0 0 1.3 0 51.9 0 51.9h2.7c0 0 0-50.6 0-51.9 1.1 0 6.7 0 6.7 0v-2.7c0 0-5.6 0-6.7 0 0-1.3 0-94.6 0-94.6 0-3.3 2.7-6 6-6h0.7v-2.7H-243.8L-243.8 930.1z"></path><path d="M-213.2 1124c-1.5 0-2.8-1.1-2.8-2.8 0-1.6 1.3-2.8 2.8-2.8 1.6 0 2.8 1.2 2.8 2.8S-211.6 1124-213.2 1124zM-213.2 1118.8c-1.4 0-2.4 1-2.4 2.4 0 1.5 1 2.4 2.4 2.4s2.4-1 2.4-2.4C-210.7 1119.8-211.8 1118.8-213.2 1118.8zM-212.1 1122.9l-1-1.4h-0.6v1.5h-0.3v-3.3h0.9c0.6 0 1 0.4 1 0.9 0 0.4-0.3 0.7-0.6 0.8l0.9 1.3L-212.1 1122.9zM-213.1 1119.9h-0.5v1.2h0.5c0.4 0 0.7-0.3 0.7-0.6C-212.5 1120.2-212.7 1119.9-213.1 1119.9z"></path></svg>');
            
            if (theme && theme.toLowerCase() === 'fontainebleau'){
                return fontainebleau;
            } else if (theme && theme.toLowerCase() === 'zoku'){
                return zoku;
            } else {
                return zoku;
            }
        };
        $scope.getThemeName = function(theme){
             if (theme === 'Zoku'){
                return theme.toLowerCase();
            } else if (theme === 'Fontainebleau') {
                return theme.toLowerCase();
            } else {//default to zoku for now until other stylesheets are generated
                return 'zoku';
            }
        };
        $scope.getThemeLink = function(theme){
            var link, assetPath = '../assets/zest_station/css/', ext = '.css.less';
            theme = $scope.getThemeName(theme);
            link = assetPath+theme.toLowerCase()+ext;//default to zoku for now until other stylesheets are generated
            return link;
        };
        
        $scope.setThemeByName = function(theme){
            $('body').css('display','none'); 
            var link, logo;
            link = $scope.getThemeLink(theme);
            logo = $scope.getLogoSvg(theme);
            if (link){
                hotelDetailsSrv.data.theme = theme.toLowerCase();
                $state.theme = theme.toLowerCase();
              //  $('head').append('<link rel="stylesheet" type="text/css" href="'+link+'">');
                $('#logo').append(logo);
                $rootScope.$broadcast ('THEME_UPDATE', function(event) {});
            }
            setTimeout(function(){
                $('body').css('display', 'block');
            },50);
        };
        
        $scope.getHotelStationTheme = function(){
            //api/email_templates/list.json?hotel_id=97
            $scope.hotelid = $scope.zestStationData.hotel_id;
            //call Zest station settings API
            var options = {
                params: 		{"id":$scope.hotelid},
                successCallBack: 	$scope.hotelThemeCB
            };
            $scope.callAPI(zsTabletSrv.fetchHotelTheme, options);
        };
           
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

    $scope.toggleOOS = function(){
        if ($state.isOOS){
            $rootScope.$emit(zsEventConstants.OOS_OFF);
        } else {
            $rootScope.$emit(zsEventConstants.OOS_OFF);
        }
    };
        $scope.getWorkStation = function(){
            var onSuccess = function(response){
                if ($scope.timeStopped){
                    return;
                }
                if (response){
                    $scope.zestStationData.workstations = response.work_stations;
                    $scope.setWorkStation();
                    $scope.refreshSettings();
                }
            };
            var onFail = function(response){
                if ($scope.timeStopped){
                    return;
                }
                console.warn('fetching workstation list failed:',response);
                $scope.$emit(zsEventConstants.PUT_OOS);
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
            if (!$scope.timeStopped){
                $scope.callAPI(zsTabletSrv.fetchWorkStations, options);
            }
        };  
        $scope.$on('STOP_TIMERS',function(){
            $scope.timeStopped = true;
            $scope.timerRunning = false;
        });
        $scope.timerRunning = false;
        $scope.$on('START_TIMERS',function(){
            $scope.timeStopped = false;
            if (!$scope.timerRunning){
                $scope.refreshSettings();
            }
        });
        $scope.getWorkStationStatus = function(hard_reset){
            var onSuccess = function(response){
                $scope.failedDetected = false;
                if ($scope.timeStopped){
                    return;
                }
                if (response){
                    $scope.zestStationData.oos_message_value = response.out_of_order_msg;
                    if (response.is_out_of_order){
                        $scope.$emit(zsEventConstants.PUT_OOS);
                    } else {
                        $scope.$emit(zsEventConstants.OOS_OFF);
                    }
                    $scope.zestStationData.is_oos = response.is_out_of_order;
                    $scope.startCounter(hard_reset);
                    $state.is_oos = $scope.zestStationData.is_oos;
                    setTimeout(function(){
                        $rootScope.$broadcast('ZS_SETTINGS_UPDATE');//this will tell the homeCtrl to update oos text
                    },50);
                }
            };
            var onFail = function(response){
                if ($scope.failedDetected){
                    $scope.startCounter();//the timer should continue to try and re-connect, upon reconnection, it will go back to in-service depending on workstation setting
                }
                
                $scope.failedDetected = true;
                
                if ($scope.timeStopped){
                    return;
                }
                $scope.$emit(zsEventConstants.PUT_OOS);
            };
            var options = {
                params:                 {
                    id: $state.workstation_id
                },
                successCallBack: 	    onSuccess,
                failureCallBack:        onFail
            };
            options["loader"] = 'false';//disable the loader for this service call
            if (!$scope.timeStopped && typeof $state.workstation_id === typeof 123){
                $scope.callAPI(zsTabletSrv.fetchWorkStationStatus, options);
            }
        };  
        $scope.failedDetected = false;
        $scope.$on('REFRESH_SETTINGS',function(evt, params){
            if (params){
                if (params.restart){
                    //flag to force restart timer, this is needed if canceling out of admin settings without making a change, ie- going home
                    //because the refresh-settings timer is force-stopped when in the admin screen, only the idle-timer continues;                
                    if (params.from_cancel){
                        $scope.timeStopped = false;
                    }
                    $scope.startCounter();
                }
            } else {
                $scope.refreshSettings(true);
                
            }
        });
        $scope.refreshSettings = function(hard_reset){
          $scope.getWorkStationStatus(hard_reset);
        };
        $scope.$on('RESET_TIMEOUT',function(evt, params){
            $scope.resetCounter();
        });
        $scope.timeStopped = false;
        $scope.startCounter = function(hard_reset){
            var time = $scope.syncOOSInterval;

                var timer = time, minutes, seconds, timeInMilliSec = 1000;
                var timerInt = setInterval(function () {
                    //if ($scope.idle_timer_enabled){
                            minutes = parseInt(timer / 60, 10);
                            seconds = parseInt(timer % 60, 10);

                            minutes = minutes < 10 ? "0" + minutes : minutes;
                            seconds = seconds < 10 ? "0" + seconds : seconds;

                            if (--timer < 0) {
                                setTimeout(function(){
                                    //fetch latest settings
                                    if (!hard_reset){
                                        if (!$scope.timeStopped){
                                            $scope.handleSettingsTimeout();
                                        }
                                    }
                                },timeInMilliSec);

                                clearInterval(timerInt);
                                return;
                            }
                 //   }
                }, timeInMilliSec);
        };
            
            $scope.handleSettingsTimeout = function(){
                $scope.refreshSettings();
            };
        
        $scope.$on('UPDATE_WORKSTATION',function(evt, params){
            var id = params.id;
            var storageKey = $scope.storageKey,
                storage = localStorage;
                storage.setItem(storageKey, id);
                $scope.setWorkStation();
        });
        $scope.hasWorkstationAssigned = false;
        $scope.hasWorkstation = function(){
          //returns true/false if a workstation is currently assigned;
          // if no workstation assigned or if workstation status fetch fails, device should go OOS;
          if (!$scope.zestStationData || $scope.zestStationData.workstations === 'Select'){
              if ($scope.zestStationData.workstations === 'Select'){
                  console.info('at least 1 workstation must be configured');
              }
              return false;//there are no workstations assigned, at least 1 workstation must be available
          }
          return $scope.hasWorkstationAssigned;
        };
        $scope.setWorkStation = function(){
            /*
             * This method will get the device's last saved workstation, and from the last fetched list of workstations
             * will set the workstation for the UI, which is also used in determining the device's default printer
             */
             var storageKey = $scope.storageKey,
                    storage = localStorage,
                    storedWorkStation = '',
                    hasWorkstation = false,
                    station = null;
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
                             hasWorkstation = true;
                             $state.hasWorkstation = true;
                        }
                    }
                } else {
                    $scope.zestStationData.workstations = 'Select';
                    $state.hasWorkstation = false;
                }
            } else {
                $scope.zestStationData.workstations = 'Select';
                $state.hasWorkstation = false;
            }
            if (station !==  null){
                if (station.printer){
                    sntZestStation.selectedPrinter = station.printer;//only set this if not null
                }
                sntZestStation.encoder = station.key_encoder_id;
                $state.workstation_id = station.id;
                $state.emv_terminal_id = station.emv_terminal_id;
                
                $scope.zestStationData.oos_message_value = station.out_of_order_msg;
                $scope.zestStationData.is_oos = station.is_out_of_order;
            }
            
            $scope.hasWorkstationAssigned = hasWorkstation;
            if (!$scope.hasWorkstation()){
                $state.go('zest_station.oos');
            }
            return station;
        };
        
	$scope.failureCallBack =  function(data){
            if ($scope.isOOS){
                $state.go('zest_station.oos');
            } else {
                $state.go('zest_station.error_page');
            }
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
                    $scope.$emit('hideLoader');
            };
            
            
		var options = {
                    params:                 {},
                    successCallBack: 	    onSuccess,
                    failureCallBack:        $scope.failureCallBack
                };
		$scope.callAPI(zsTabletSrv.fetchHotelSettings, options);
        };
        $scope.disableTimeout = function(){
          //  console.info('timeout Disabled');
            zsTimeoutEnabled = false;
        };
        $scope.enableTimeout = function(){
            //console.info('timeout Enabled');
            zsTimeoutEnabled = true;
        };
        $scope.idlePopup = function() {
            var current = $state.current.name;
            if (current === 'zest_station.admin-screen' || current === 'zest_station.oos' || current === 'zest_station.card_swipe'){//card swipe will go to separate re-try
                $scope.resetTime();
                return;
            }

            if (current === 'zest_station.card_sign'){
                $state.go('zest_station.tab-kiosk-reservation-signature-time-out');
            } else {
                if (current !== 'zest_station.home' && current !== 'zest_station.oos' && current !== 'zest_station.admin' && current !== 'zest_station.card_sign' && current !== 'zest_station.tab-kiosk-reservation-signature-time-out'){
                    /*
                     * this is a workaround for the ipad popups, the css is not allowing left; 50% to work properly, and is pushed too far to the right (not an issue in desktop browsers)
                     */
                    ngDialog.open({
                            template: '/assets/partials/rvTabletIdlePopup.html',
                            scope: $scope,
                            closeByDocument: false,
                            closeByEscape: false
                    });
                }
            }

        };
            $scope.idleTimerSettings = {};
            $scope.$on('UPDATE_IDLE_TIMER',function(evt, params){
                //updates the idle timer settings here from what was successfully saved in zest station admin
                $scope.settings.idle_timer = params.kiosk.idle_timer;
                $scope.setupIdleTimer();
            });
            
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
            };
            
            $scope.resetCounter = function(){
               clearInterval($scope.idleTimer);
            };
            $scope.resetTime = function(){
                $scope.closePopup();
                if ($scope.at !== 'home'){ 
                    clearInterval($scope.idleTimer);
                    $scope.startIdleCounter();
                }   
            };
            $scope.closePopup = function(){
		ngDialog.closeAll();
            };
            
            
            $scope.isFromChromeApp = function(){
                console.log(chrome.app);
                console.log(localStorage);
                return true;
            };
            $scope.startIdleCounter = function(){
                //console.info('isFromChromeApp: ', $scope.isFromChromeApp());
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
               $state.go('zest_station.home');
               $scope.closePopup();
            };
            
            $scope.$watchCollection(function(){
                return $state.current.name;
            }, function(){
                var current = $state.current.name;
                if (current === 'zest_station.home'){
                    $scope.resetCounter();
                    $scope.idle_timer_enabled = false;
                } else {
                    if ($scope.adminIdleTimeEnabled){
                        $scope.resetCounter();
                        $scope.idle_timer_enabled = true;
                        $scope.startIdleCounter();
                    }
                }
            });
        
        
        
        
        
	/**
	 * [initializeMe description]
	 * @return {[type]} [description]
	 */
	var initializeMe = function() {
                $('body').css('display','none'); //this will hide contents until svg logos are loaded
		//for back button
		$scope.hideBackButton = true;

		//for close button
		$scope.hideCloseButton = true;

		//to show loader
		$scope.hasLoader = false;

		//call Zest station settings API
        $scope.zestStationData = zestStationSettings;
             
        _.extend(hotelDetailsSrv.data, zestStationSettings);
        $scope.settings = zestStationSettings;
        $scope.setupIdleTimer();
        $scope.zestStationData.guest_bill.print = ($scope.zestStationData.guest_bill.print && $scope.zestStationData.is_standalone) ? true : false;
        $scope.fetchHotelSettings();
        $scope.getWorkStation();
        $scope.getHotelStationTheme();
        //set print and email options set from hotel settings > Zest > zest station
        $scope.zestStationData.printEnabled = $scope.zestStationData.registration_card.print;
        $scope.zestStationData.emailEnabled = $scope.zestStationData.registration_card.email;
	}();
        
        
        
        
        
        
        
}]);