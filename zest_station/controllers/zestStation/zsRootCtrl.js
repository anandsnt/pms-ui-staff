sntZestStation.controller('zsRootCtrl', [
	'$scope',
	'zsEventConstants',
	'$state','zsTabletSrv','$rootScope','ngDialog', '$sce',
	'zsUtilitySrv','$translate', 'zsHotelDetailsSrv', 'cssMappings', 'zestStationSettings','$timeout',
	function($scope, zsEventConstants, $state,zsTabletSrv, $rootScope,ngDialog, $sce, zsUtilitySrv, $translate, zsHotelDetailsSrv, cssMappings, zestStationSettings,$timeout) {

	BaseCtrl.call(this, $scope);
        $scope.storageKey = 'snt_zs_workstation';
        $scope.oosKey = 'snt_zs_workstation.in_oos';
        $scope.chromeAppKey = 'snt.in_chromeapp';
        $scope.syncOOSInterval = 119;//in seconds (0-based) // currently will re-sync every 2 minutes, next release will be an admin setting per hotel
    

    /**
     * to run angular digest loop,
     * will check if it is not running
     * return - None
     */
    $scope.runDigestCycle = function() {
        if (!$scope.$$phase) {
            $scope.$digest();
        } else {
            return;
        }
    };    
        
    $translate.use('EN_snt');  
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
        //if key card was inserted we need to eject that
        if($scope.zestStationData.keyCardInserted && !$scope.zestStationData.keyCaptureDone){
            $scope.socketOperator.EjectKeyCard();
        };
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
                $scope.zestStationData.popup = false;
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

                $scope.setOOSInBrowser(true);
                $state.is_oos = true;
                $state.go('zest_station.oos');
            }
	});

	$scope.$on (zsEventConstants.OOS_OFF, function(event) {
           if ($state.is_oos){
                $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
                $scope.$emit(zsEventConstants.HIDE_CLOSE_BUTTON);
                $scope.$emit(zsEventConstants.HIDE_LOADER);

                $scope.setOOSInBrowser(false);
                //only if coming out of OOS, take to home page, otherwise on-refresh, this will interrupt workflow
                $state.go('zest_station.home');
            }
	});

        $scope.setOOSInBrowser = function(t){
             var storageKey = $scope.oosKey,
                    storage = localStorage;
            try {
               storage.setItem(storageKey, t);
            } catch(err){
                console.warn(err);
            }
            if (storage.getItem(storageKey)){
                $state.is_oos = true;
            } else {
                $state.is_oos = false;
            }
            
        };
           
        $scope.hotelThemeCB = function(response){
            //call Zest station settings API
            var options = {
                params: 		{"id":$scope.hotelid},
                successCallBack: 	function(response){
                    $scope.zestStationData.mli_merchant_id = response.mli_merchant_id;
                    $scope.zestStationData.MLImerchantId = response.mli_merchant_id;
                }
            };
            $scope.callAPI(zsHotelDetailsSrv.fetchHotelSettings, options);
            
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
                    $('body').attr('id',theme);
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
        $scope.getLangPrefix = function(lang){
            for (var i in $scope.langInfo){
                if ($scope.langInfo[i].language === lang){
                    return $scope.langInfo[i].info.prefix;
                }
            }
        };
        $scope.getActiveLangPrefix = function(){
            var lang = $scope.selectedLanguage,
                    prefix = 'EN';
            var requestedPrefix = $scope.getLangPrefix(lang);
            if (requestedPrefix !== ''){
                prefix = requestedPrefix;
            } 
            return prefix.toLowerCase()+'/'+prefix+'_';
        };
        
        $scope.loadTranslations = function(){
            if($scope.zestStationData.zest_lang.english_translations_file_updated){
                console.info('using: uploaded english translations');
                $translate.use('en');
            } else{
                $translate.use('EN_snt');
            };
        };
        
        $scope.setScreenIcon = function(name){
            $scope.activeScreenIcon = name;
            if ($scope.icons && $scope.icons.url){
                $scope.icons.url.active_screen_icon = $scope.iconsPath+'/screen-'+$scope.activeScreenIcon+'.svg';
            }
        };
        $scope.iconsPath = '/assets/zest_station/css/icons/default';
        $scope.icons = {};
        $scope.activeScreenIcon = '';
        $scope.$watch('iconsPath',function(to, from){
            if (to){
                $scope.icons = {
                    url: {
                        active_screen_icon: $scope.iconsPath+'/screen-'+$scope.activeScreenIcon+'.svg',
                        key: $scope.iconsPath+'/key.svg',
                        checkin: $scope.iconsPath+'/checkin.svg',
                        checkout: $scope.iconsPath+'/checkout.svg',
                        oos: $scope.iconsPath+'/oos.svg',
                        staff: $scope.iconsPath+'/staff.svg',
                        email: $scope.iconsPath+'/email.svg',
                        pen: $scope.iconsPath+'/pen.svg',
                        creditcard: $scope.iconsPath+'/creditcard.svg',
                        keyboard: $scope.iconsPath+'/keyboard.svg',
                        noprint: $scope.iconsPath+'/no-print.svg',
                        print: $scope.iconsPath+'/print.svg',
                        confirmation: $scope.iconsPath+'/confirmation.svg',
                        moon: $scope.iconsPath+'/moon.svg',
                        back: $scope.iconsPath+'/back.svg',
                        close: $scope.iconsPath+'/close.svg',
                        qr: $scope.iconsPath+'/qr-scan.svg',
                        qr_noarrow: $scope.iconsPath+'/qr-scan_noarrow.svg',
                        createkey: $scope.iconsPath+'/create-key.svg',
                        logo: $scope.iconsPath+'/print_logo.svg',
                        watch: $scope.iconsPath+'/watch.svg'
                    }
                };
            }
        });
        $scope.showScreenIcons = function(){//currenly we will use this for yotel to detect if screen icons are needed
            //also attaching this to navigation, yotel has text back & cancel, instead of svg icons for back and close;
            if ($scope.theme === 'yotel'){
                return true;
            } else return false;
        };
        
        $scope.getLogoSvg = function(theme){
            //need a better workaround/fix so the svg renders properly in all browsers
            //this fixes an issue not drawing properly in safari
            var zoku = angular.element('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="logo" id="zoku-logo" x="0px" y="0px" width="937.2px" height="146.3px" viewBox="0 0 937.2 146.3" enable-background="new 0 0 937.2 146.3" xml:space="preserve"><path fill="#FFFFFF" d="M336.3 145.8c-39.5 0-71.7-32.2-71.7-71.7 0-39.5 32.2-71.7 71.7-71.7 39.5 0 71.7 32.2 71.7 71.7C407.9 113.6 375.8 145.8 336.3 145.8M336.3 13.4c-33.4 0-60.7 27.2-60.7 60.7 0 33.4 27.2 60.7 60.7 60.7 33.4 0 60.7-27.2 60.7-60.7C396.9 40.6 369.7 13.4 336.3 13.4"></path><path fill="#FFFFFF" d="M534.5 146.3c-3 0-5.5-2.5-5.5-5.5V8c0-3 2.5-5.5 5.5-5.5S540 5 540 8v132.8C540 143.9 537.5 146.3 534.5 146.3"></path><path fill="#FFFFFF" d="M666.1 145.1c-1.4 0-2.8-0.5-3.9-1.6l-65.9-65.4c-1-1-1.6-2.4-1.6-3.9 0-1.5 0.6-2.9 1.6-3.9l66.6-66.2c2.2-2.1 5.7-2.1 7.8 0 2.1 2.2 2.1 5.7 0 7.8l-62.7 62.3 62 61.5c2.2 2.1 2.2 5.6 0 7.8C668.9 144.5 667.5 145.1 666.1 145.1"></path><path fill="#FFFFFF" d="M865.5 146.1c-27.6 0-44.4-13.1-53.7-24.1 -11.1-13.2-17.5-30.5-17.5-47.5v-66c0-3 2.5-5.5 5.5-5.5 3 0 5.5 2.5 5.5 5.5v66c0 14.3 5.6 29.4 14.9 40.4 7.8 9.2 21.9 20.2 45.2 20.2 23.1 0 37.4-11 45.3-20.3 9.6-11.2 15.4-26.3 15.4-40.4V8.3c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5v66.1c0 16.7-6.7 34.5-18 47.6C909.7 133 892.7 146.1 865.5 146.1"></path><path fill="#FFFFFF" d="M108 13.5H5.5C2.5 13.5 0 11 0 8c0-3 2.5-5.5 5.5-5.5H108c3 0 5.5 2.5 5.5 5.5C113.5 11 111.1 13.5 108 13.5"></path><path fill="#FFFFFF" d="M137.5 145.6H5.5c-2.2 0-4.3-1.4-5.1-3.4 -0.8-2.1-0.4-4.5 1.2-6L112 27.6c2.2-2.1 5.7-2.1 7.8 0.1 2.1 2.2 2.1 5.7-0.1 7.8L19 134.5h118.5c3 0 5.5 2.5 5.5 5.5C143 143.1 140.5 145.6 137.5 145.6"></path><path fill="#FFFFFF" d="M144.3 7.9c0 3.6-2.9 6.5-6.5 6.5 -3.6 0-6.5-2.9-6.5-6.5 0-3.6 2.9-6.5 6.5-6.5C141.3 1.4 144.3 4.3 144.3 7.9"></path><path fill="#FFFFFF" d="M137.8 15.8c-4.3 0-7.9-3.5-7.9-7.9 0-4.3 3.5-7.9 7.9-7.9s7.9 3.5 7.9 7.9C145.6 12.2 142.1 15.8 137.8 15.8M137.8 2.8c-2.8 0-5.1 2.3-5.1 5.1 0 2.8 2.3 5.1 5.1 5.1s5.1-2.3 5.1-5.1C142.9 5.1 140.6 2.8 137.8 2.8"></path></svg>');
            var fontainebleau = angular.element('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" class="logo" id="fontainebleu-logo" x="0" y="0" viewBox="-256.5 930.1 724.1 200.6" xml:space="preserve" enable-background="new -256.5 930.1 724.1 200.6"><path d="M-14.8 963.6c-0.6 0-19.5 0-20.1 0 0 0.5 0 4.2 0 4.7 0.6 0 7.3 0 7.3 0s0 26.9 0 27.5c0.5 0 5 0 5.5 0 0-0.6 0-27.5 0-27.5s6.8 0 7.3 0C-14.8 967.8-14.8 964.1-14.8 963.6L-14.8 963.6z"></path><path d="M-178.1 977.4c-0.6 0-10.9 0-10.9 0v-9.1c0 0 10.9 0 11.4 0 0-0.5 0-4.2 0-4.7 -0.6 0-16.4 0-17 0 0 0.6 0 31.6 0 32.2 0.5 0 5 0 5.5 0 0-0.6 0-13.6 0-13.6s10.3 0 10.9 0C-178.1 981.6-178.1 977.9-178.1 977.4L-178.1 977.4z"></path><path d="M-135.8 991.6c-6.8 0-12.4-5.4-12.4-12 0-6.7 5.6-12.1 12.4-12.1 6.8 0 12.4 5.4 12.4 12.1C-123.4 986.3-128.9 991.6-135.8 991.6L-135.8 991.6zM-135.8 962.8c-9.9 0-17.9 7.6-17.9 16.9 0 9.2 8 16.7 17.9 16.7s18-7.5 18-16.7C-117.8 970.4-125.9 962.8-135.8 962.8L-135.8 962.8z"></path><path d="M65.2 963.5c0 0.6 0 31.6 0 32.2 0.5 0 5 0 5.5 0 0-0.6 0-31.6 0-32.2C70.2 963.5 65.7 963.5 65.2 963.5L65.2 963.5z"></path><path d="M180.5 968.2c0-0.5 0-4.2 0-4.7 -0.6 0-17.4 0-18 0 0 0.6 0 31.6 0 32.2 0.6 0 17.4 0 18 0 0-0.5 0-4.2 0-4.7 -0.6 0-12.4 0-12.4 0v-8.8c0 0 11.3 0 11.9 0 0-0.5 0-4.2 0-4.7 -0.6 0-11.9 0-11.9 0v-9.1C168 968.2 179.9 968.2 180.5 968.2L180.5 968.2z"></path><path d="M264.6 963.5c0 0.6 0 31.6 0 32.2 0.6 0 15.7 0 16.3 0 0-0.5 0-4.2 0-4.7 -0.6 0-10.8 0-10.8 0s0-26.9 0-27.5C269.6 963.5 265.1 963.5 264.6 963.5L264.6 963.5z"></path><path d="M327.8 968.2c0-0.5 0-4.2 0-4.7 -0.6 0-17.4 0-18 0 0 0.6 0 31.6 0 32.2 0.6 0 17.4 0 18 0 0-0.5 0-4.2 0-4.7 -0.6 0-12.4 0-12.4 0v-8.8c0 0 11.3 0 11.9 0 0-0.5 0-4.2 0-4.7 -0.6 0-11.9 0-11.9 0v-9.1C315.4 968.2 327.3 968.2 327.8 968.2L327.8 968.2z"></path><path d="M436 984.1c0 0 0-20 0-20.6 -0.5 0-5 0-5.5 0 0 0.6 0 20.6 0 20.6 0 5-2.2 7.6-6.6 7.6 -4.4 0-6.6-2.5-6.6-7.6 0 0 0-20 0-20.6 -0.5 0-5.1 0-5.6 0 0 0.6 0 20.6 0 20.6 0 4.2 1.1 6.6 2.1 7.7 1.7 2.2 5.3 4.5 10.1 4.5 4.1 0 7.9-1.8 10.1-4.7C435.3 989.9 436 987.4 436 984.1L436 984.1z"></path><path d="M222.2 990.9h-4.8v-9.8h4.9c6.4 0 6.9 3.8 6.9 4.9C229.3 988.2 228.1 990.9 222.2 990.9L222.2 990.9zM217.5 968.2h4.2c5 0 5.5 2.8 5.5 4.1 0 2.7-2.1 4.1-6.1 4.1h-3.6L217.5 968.2 217.5 968.2zM234.8 986.3c0-3.9-1.9-6.4-5.7-7.7l-1.1-0.4 1.1-0.5c0.9-0.5 3.7-2 3.7-5.9 0-2.1-1.1-4.3-2.8-5.8 -2.9-2.4-6.8-2.4-10.5-2.4 0 0-6.8 0-7.4 0 0 0.6 0 31.4 0 32 0.6 0 9.9 0 9.9 0 2.7 0 6.4-0.3 8.8-1.9C232.5 992.4 234.8 990.1 234.8 986.3L234.8 986.3z"></path><path d="M369.8 970l5.4 13.5h-10.8L369.8 970 369.8 970zM377.2 988.3l3 7.4h6.2c0 0-13.5-30.4-14.3-32.2 -0.4 0-4.1 0-4.5 0 -0.2 0.3-13.9 31.4-14.2 32.2 0.8 0 6.2 0 6.2 0l3-7.4H377.2L377.2 988.3z"></path><path d="M22.3 970l5.4 13.5H16.9L22.3 970 22.3 970zM29.6 988.3l3 7.4h6.3c0 0-13.5-30.4-14.3-32.2 -0.4 0-4.1 0-4.5 0 -0.2 0.3-13.9 31.4-14.2 32.2 0.8 0 6.2 0 6.2 0l3-7.4H29.6L29.6 988.3z"></path><polygon points="-90.2 963.6 -82.9 963.6 -67.3 988.4 -67.2 988.5 -67.3 988.5 -67.2 988.4 -67.2 963.6 -61.7 963.6 -61.7 995.7 -68.7 995.7 -84.6 970.6 -84.7 970.6 -84.7 995.7 -90.2 995.7 "></polygon><polygon points="102.1 963.6 109.4 963.6 125.1 988.4 125.1 988.5 125.1 988.5 125.1 988.4 125.1 963.6 130.7 963.6 130.7 995.7 123.6 995.7 107.7 970.6 107.6 970.6 107.6 995.7 102.1 995.7 "></polygon><path d="M460.5 978.1c-3.9 0-7.1-2.9-7.1-7s3.2-7.1 7.1-7.1c4 0 7.1 3 7.1 7.1S464.5 978.1 460.5 978.1zM460.5 964.9c-3.5 0-6.2 2.5-6.2 6.2s2.7 6.2 6.2 6.2c3.6 0 6.2-2.5 6.2-6.2S464.1 964.9 460.5 964.9zM463.2 975.2l-2.6-3.6h-1.4v3.7h-0.9v-8.4h2.3c1.5 0 2.5 1.1 2.5 2.3 0 1-0.7 1.8-1.5 2.2l2.4 3.4L463.2 975.2zM460.6 967.8h-1.4v2.9h1.4c1 0 1.7-0.7 1.7-1.5C462.2 968.4 461.5 967.8 460.6 967.8z"></path><path d="M-38.1 1061.1l-1.3-16.2c-0.2-2.6-0.4-5.5-0.5-8.1H-40c-1.1 2.6-2.6 5.8-3.9 8.3l-7.9 16.2H-53l-7.9-16.2c-1.2-2.4-2.6-5.5-3.8-8.3h-0.1c-0.1 2.6-0.3 5.7-0.5 8.1l-1.3 16.2h-3l2.5-31.2h2.2l8.6 17.4c1.3 2.7 2.8 5.9 4.1 8.7h0.1c1.2-2.8 2.6-5.8 4-8.7l8.5-17.4h2.1l2.6 31.2H-38.1z"></path><path d="M-18.9 1061.1v-31.2h3.3v31.2H-18.9z"></path><path d="M22.8 1061.1l-3.6-8.7H6.1l-3.5 8.7h-3.3l12.8-31.6h1.2l12.8 31.6H22.8zM14.4 1040.1c-0.5-1.4-1.2-3.1-1.7-4.8h-0.1c-0.5 1.7-1.1 3.4-1.7 4.8l-3.8 9.6H18L14.4 1040.1z"></path><path d="M70.9 1061.1l-1.3-16.2c-0.2-2.6-0.4-5.5-0.5-8.1H69c-1.1 2.6-2.6 5.8-3.9 8.3l-7.9 16.2H56l-7.9-16.2c-1.2-2.4-2.6-5.5-3.8-8.3h-0.1c-0.1 2.6-0.3 5.7-0.5 8.1l-1.3 16.2h-3l2.5-31.2h2.2l8.6 17.4c1.3 2.7 2.8 5.9 4.1 8.7h0.1c1.2-2.8 2.6-5.8 4-8.7l8.5-17.4h2.1l2.6 31.2H70.9z"></path><path d="M90.1 1061.1v-31.2h3.3v31.2H90.1z"></path><path d="M141.3 1061.1h-9.4v-31.2h7.7c4.3 0 8.4 2.9 8.4 7.7 0 2.5-1.3 4.9-3.4 5.8 3.5 0.7 6.6 4.2 6.6 8.4C151.1 1057.7 146.3 1061.1 141.3 1061.1zM139 1032.7h-4v9.9h4.2c2.9 0 5.4-1.8 5.4-4.9C144.6 1034.4 142.1 1032.7 139 1032.7zM140.4 1045.3H135v13.1h5.7c3.8 0 7.1-2.4 7.1-6.5C147.8 1047.7 144.4 1045.3 140.4 1045.3z"></path><path d="M166.3 1061.1v-31.2h16.3v2.8h-13v11.3h10.7v2.8h-10.7v11.4h14.7v2.8L166.3 1061.1 166.3 1061.1z"></path><path d="M219.7 1061.1l-3.6-8.7H203l-3.5 8.7h-3.3l12.8-31.6h1.2l12.8 31.6H219.7zM211.3 1040.1c-0.5-1.4-1.2-3.1-1.7-4.8h-0.1c-0.5 1.7-1.1 3.4-1.7 4.8l-3.8 9.6h11L211.3 1040.1z"></path><path d="M259.9 1034.6c-1.7-1-4.8-2.1-8.1-2.1 -6.9 0-13.3 4.9-13.3 13s6.3 13 13.3 13c3.6 0 6.3-0.7 8.3-2l-0.3 3.1c-1.9 1.1-4.4 1.7-8.3 1.7 -8.3 0-16.3-6-16.3-15.9 0-9.9 8.1-15.9 16.3-15.9 3.9 0 7.1 0.9 9.1 2.1L259.9 1034.6z"></path><path d="M296.9 1061.1v-14.3H279v14.3h-3.3v-31.2h3.3v14.1h17.9v-14.1h3.3v31.2H296.9L296.9 1061.1z"></path><path d="M-240.4 972.6v150.8c0 4 3.3 7.3 7.4 7.3s7.4-3.3 7.4-7.4v-82.6c0-4-3.3-7.3-7.3-7.4l0 0 0 0h-2v2.7h1.9c2.6 0 4.6 2.1 4.6 4.7v82.6c0 2.6-2.1 4.7-4.6 4.7 -2.6 0-4.7-2.1-4.7-4.6V972.6H-240.4z"></path><path d="M-243.8 930.1c-4.8 0-8.7 3.9-8.7 8.7 0 0 0 93.3 0 94.6 -0.9 0-4 0-4 0v2.7c0 0 3.1 0 4 0 0 1.3 0 51.9 0 51.9h2.7c0 0 0-50.6 0-51.9 1.1 0 6.7 0 6.7 0v-2.7c0 0-5.6 0-6.7 0 0-1.3 0-94.6 0-94.6 0-3.3 2.7-6 6-6h0.7v-2.7H-243.8L-243.8 930.1z"></path><path d="M-213.2 1124c-1.5 0-2.8-1.1-2.8-2.8 0-1.6 1.3-2.8 2.8-2.8 1.6 0 2.8 1.2 2.8 2.8S-211.6 1124-213.2 1124zM-213.2 1118.8c-1.4 0-2.4 1-2.4 2.4 0 1.5 1 2.4 2.4 2.4s2.4-1 2.4-2.4C-210.7 1119.8-211.8 1118.8-213.2 1118.8zM-212.1 1122.9l-1-1.4h-0.6v1.5h-0.3v-3.3h0.9c0.6 0 1 0.4 1 0.9 0 0.4-0.3 0.7-0.6 0.8l0.9 1.3L-212.1 1122.9zM-213.1 1119.9h-0.5v1.2h0.5c0.4 0 0.7-0.3 0.7-0.6C-212.5 1120.2-212.7 1119.9-213.1 1119.9z"></path></svg>');
            var snt = angular.element('<svg version="1.1" class="logo" id="snt-logo" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"width="561.7px" height="120px" viewBox="0 0.1 561.7 120" enable-background="new 0 0.1 561.7 120" xml:space="preserve"><g><path fill="#6C6D70" d="M40.3,63.2c-1.4-8.3-7.9-11.4-16.1-11.4c-6.8,0-16.7,2.3-16.7,10.6c0,6.1,5.9,7.5,10.9,8.3l13.1,2.2C40,74.3,47.4,77.3,47.4,87c0,12.4-12.9,16.3-23.5,16.3C10.5,103.3,1.4,98,0,84.4h5.9c1.4,10.5,8.3,13.9,18.6,13.9c7.3,0,17.3-2.4,17.3-11.2c0-6.6-6.7-8.2-12.3-9.1l-9.7-1.5C11,75,1.8,73,1.8,62.4c0-11.4,11.7-15.6,21.8-15.6c11.6,0,20.5,4.5,22.2,16.4H40.3z"/><path fill="#6C6D70" d="M72.7,102V53H51.3v-4.8h48.9V53h-22v49H72.7z"/><path fill="#6C6D70" d="M107.5,85.4L99.7,102h-6l25.9-53.9h7l25.9,53.9h-6.4l-7.8-16.6H107.5z M123.1,52.4l-13.3,28.1h26.4L123.1,52.4z"/><path fill="#6C6D70" d="M345.9,103.3c-17.7,0-29.9-10.7-29.9-28.3c0-17.5,12.3-28.3,29.9-28.3c17.6,0,29.9,10.7,29.9,28.3C375.8,92.6,363.6,103.3,345.9,103.3z M345.9,51.8c-14.5,0-24.3,9-24.3,23.3s9.8,23.3,24.3,23.3s24.3-9,24.3-23.3S360.4,51.8,345.9,51.8z"/><path fill="#6C6D70" d="M435.9,48.1v32.4c0,6.1-0.7,12.6-5.5,17.1c-4.9,4.4-12.4,5.8-19,5.8c-7.1,0-15.4-1.6-20.3-7.1c-3.8-4.4-4.2-10.3-4.2-15.8V48.1h5.6v32.3c0,12.8,5.7,17.9,18.9,17.9c13.3,0,19-5.2,19-17.9V48.1H435.9z"/><path fill="#6C6D70" d="M503.6,81.9c-3.3,13.6-13,21.4-27.6,21.4c-17.4,0-29.1-11.5-29.1-28.2c0-16.6,11.9-28.4,29.2-28.4c13.7,0,24.6,6,27.3,19.6h-5.7c-2-10.7-11.2-14.6-21.6-14.6c-14.6,0-23.5,9.7-23.5,23.5c0,14.5,9.2,23,24,23c10.8,0,19.1-6.1,21.3-16.4L503.6,81.9L503.6,81.9z"/><path fill="#6C6D70" d="M556.2,102V75.5H519V102h-5.6V48.1h5.6v22.8h37.2V48.1h5.5V102H556.2z"/><g><g><path fill="#EE9721" d="M250.2,120.1l-38.4-47.8v47.8h-5.6V66.2h7.8l38.4,48.1V66.2h5.5v53.9H250.2z"/></g></g><g><path fill="#6C6D70" d="M172.5,74.2L152.7,48h-6.8l23.7,31v23h5.5V79.1l17.8-22.4c-1.5-1-3-2-4.4-3.1L172.5,74.2z"/><path fill="#6C6D70" d="M271.4,48.1c-1.7,1.7-3.4,3.3-5.3,4.8h20.1v49h5.5v-49h21.9v-4.8H271.4z"/></g><path fill="#EE9721" d="M229.7,49.5c-14.3,0-27.2-5.7-36.4-14.9l-0.1,0.1l-31.9-34c-1.3,0.3-2.7,0.4-4.1,0.4c-2.3,0-4.5-0.4-6.5-1l38.9,41.5l0.1-0.1c9.5,9.5,22.8,15.4,37.5,15.4c26.5,0,48.3-19.1,51.6-43.9c-0.1,0-0.2,0.1-0.3,0.1C272.8,34.1,253.2,49.5,229.7,49.5z"/></g></svg>');
            var yotel = angular.element('<svg version="1.1" class="logo" id="yotel-logo" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="239.3px" height="64.8px" viewBox="0 0 239.3 64.8" enable-background="new 0 0 239.3 64.8" xml:space="preserve"> <path fill="none" d="M86.8,14.1h-8.1c-2.7,0-5.2,2.1-5.9,5c0,0,0,0-5.4,19.8l-0.8,2.9h3c2.1,0,4.1-0.2,5.8-0.6 c2.1-0.5,4-1.2,5.7-2.2c1.8-1.1,3.4-2.5,4.6-4.1c1.3-1.7,2.3-3.8,2.9-6.2l2.3-8.6l0,0c0.4-1.6,0.1-3.1-0.8-4.2 C89.4,14.6,88.2,14.1,86.8,14.1 M51.5,40.6C51.5,40.6,51.5,40.5,51.5,40.6c-0.1,0.3-0.2,0.6-0.3,1.1c-0.8,2.4-1.6,4.2-2.7,5.8 c-1.7,2.5-3.8,4.7-6.3,6.7c-2.4,1.9-5.1,3.5-7.9,4.5c-2.8,1.1-5.7,1.6-8.5,1.6h-20c1.1-4,4.3-16.2,5-18.7h13.5 c2.2,0,4.4-0.2,6.3-0.7c2.1-0.5,4-1.2,5.7-2.2c1.8-1.1,3.4-2.4,4.6-4l0.3-0.5l2.1-3.6H26.4c-1.7,0-3.3-0.3-4.7-1 c-1.3-0.6-2.4-1.5-3.2-2.6s-1.4-2.4-1.6-3.9c0-0.2-0.1-1.5-0.1-1.8c0-1.1,0.2-2.2,0.5-3.3c0,0,2.6-9.6,3.6-13.5h11.5 c-0.7,2.5-1.7,6-1.7,6c-0.5,1.7-1.3,4.5,0.2,6.4c0.5,0.7,1.5,1.5,3.3,1.5h11.7c0,0,3.1-11.4,3.8-14c2.2,0,8.1,0,11.5,0 c-3,11-5,18.5-6.4,23.7L52,38.6L51.5,40.6 M99.3,27.7L97,36.4l-0.8,3c-0.7,2.5-1.5,5.4-3.4,8.1c-2,2.9-3.9,5-6,6.7 c-2.5,1.9-5.1,3.4-7.9,4.5c-2.8,1.1-5.7,1.6-8.5,1.6c-0.1,0-7,0-10.6-0.2c-2.8-0.3-4.4-1-5.3-2.4c-0.7-1-1-2.4-1-4.2 c0-2,0.4-4.5,1.2-7.4l0.9-3.3c0.2-0.7,6.9-25.1,6.9-25.1c0.4-1.6,0.9-3.3,2-4.9c1.1-1.6,2.5-3.1,4.2-4.3c1.6-1.2,3.4-2.2,5.2-2.9 c1.9-0.7,3.7-1,5.5-1h14.5c2.9,0,5.3,1,6.9,2.8c1.7,2,2.4,5,1.9,8.4c-0.5,2.9-1.3,5.7-2.1,8.5C100.3,24.3,99.3,27.7,99.3,27.7 M134.9,60.2h-18.7c-2.8,0-5.4-0.6-7.6-1.6c-2.2-1.1-4.1-2.6-5.5-4.5s-2.3-4.2-2.7-6.7c-0.1-0.9-0.2-1.8-0.2-2.7 c0-1.8,0.3-3.6,0.8-5.4l3.6-13c0,0,4.5-16.4,5.9-21.7h11.3c-0.8,3.1-3,11-3,11H138l-3,10.9h-19.4c0,0-1,4.6-1,4.7 c-0.1,0.7-0.1,1.3-0.1,1.8c0,0.7,0.1,1.3,0.2,2.1c0.9,4.3,5.2,6.5,12.8,6.5h12.4C138.9,45.6,135.5,57.8,134.9,60.2 M189.5,27.4 C189.5,27.4,189.5,27.3,189.5,27.4c-2.5,9.3-5.5,10-9.1,10H158c0,0-2,4.5,3.2,4.5h9.5l0,0c5.8,0,12.8,0,15.3,0 c-1.1,4-4.2,15.9-4.9,18.4h-19.9c-2.8,0-5.4-0.5-7.6-1.6c-2.2-1.1-4.1-2.6-5.5-4.5c-1.4-1.9-2.4-4.2-2.8-6.7 c-0.2-0.9-0.2-1.9-0.2-2.9c0-1.7,0.2-3.5,0.7-5.3l5.8-22.4c0.3-1.1,0.7-2.2,1.3-3.3c0.1-0.1,1-1.6,1-1.7l0,0c1-1.4,2.2-2.7,3.6-3.8 c1.4-1.1,2.9-1.9,4.5-2.5c1.7-0.6,3.5-1,5.2-1h14.5c1.8,0,3.4,0.4,4.9,1.1c1.5,0.7,2.7,1.7,3.7,2.9c1,1.3,1.6,2.7,1.9,4.3 c0.1,0.3,0.1,0.7,0.1,1.1c0,2-0.6,5.1-1,6.9C189.8,26.3,189.6,27.2,189.5,27.4 M228.3,60.2h-21.8c-2.8,0-5.4-0.6-7.6-1.6 c-2.2-1.1-4.1-2.6-5.5-4.5s-2.3-4.2-2.7-6.7c-0.1-0.9-0.2-1.8-0.2-2.7c0-1.3,0.1-2.6,0.4-3.9l0.9-3.4l0,0c1-3.6,6-21.9,6-21.9 s2.1-7.6,3-11c2.2,0,7.9,0,11.3,0C210.9,9,205.4,29,205.4,29c-0.4,1.3-0.5,2.6-0.5,3.7c0,0.8,0.1,1.5,0.2,2.1 c0.4,1.6,1.2,2.9,2.4,3.9c1.2,1,2.7,1.7,4.5,2.2c1.7,0.4,3.7,0.7,5.9,0.7h15.5C232.3,45.5,229,57.7,228.3,60.2 M176.5,13.8H170 c-2.6,0-5,0.6-6.5,2.7c-1.6,2.2-3.7,12.3-3.7,12.3s10.6,0.1,14.2-0.1c2.4-0.1,4.9-1.8,5.5-4.2c2-7.5,1.7-8,1.2-8.8 C179.6,13.9,177,13.8,176.5,13.8"/> <path fill="#53246d" d="M88.6,28.5L88.6,28.5L88.6,28.5L88.6,28.5z M86.8,14.1h-8.1c-2.7,0-5.2,2.1-5.9,5c0,0,0,0-5.4,19.8l-0.8,2.9h3 c2.1,0,4.1-0.2,5.8-0.6c2.1-0.5,4-1.2,5.7-2.2c1.8-1.1,3.4-2.5,4.6-4.1c1.3-1.7,2.3-3.8,2.9-6.2l2.3-8.6l0,0 c0.4-1.6,0.1-3.1-0.8-4.2C89.4,14.6,88.2,14.1,86.8,14.1 M86.6,18.8c0,0.2-2.3,8.5-2.3,8.5c-0.5,1.8-1.2,3.4-2.2,4.7 c-0.9,1.2-2,2.2-3.3,3c-1.3,0.8-2.8,1.3-4.4,1.7c-0.6,0.1-1.2,0.2-1.9,0.3c1.2-4.3,4.5-16.7,4.5-16.7c0.3-1,1.1-1.7,1.6-1.7h7.9 C86.6,18.6,86.6,18.7,86.6,18.8 M217.9,37.1c-1.8,0-3.5-0.2-4.8-0.5c-1.2-0.3-2.1-0.7-2.8-1.3c-0.5-0.4-0.8-0.9-1-1.5 c-0.2-0.9-0.1-2.1,0.3-3.6L217.9,0h-20.5l-2.1,7.8c-0.4-0.7-0.8-1.4-1.3-2c-1.4-1.8-3.2-3.3-5.3-4.3c-2.1-1-4.4-1.5-6.8-1.5h-14.5 c-2.3,0-4.5,0.4-6.8,1.3c-2,0.8-4,1.8-5.7,3.2c-1.8,1.4-3.3,3-4.5,4.8v0.1l-1.2,2v0.1c-0.7,1.4-1.3,2.8-1.7,4.3l-5.6,21.4h-14.2 c-1.5,0-3.1-0.1-4.6-0.4c-1.1-0.2-3-0.8-3.6-1.8c-0.4-0.6-0.4-1.4-0.4-2.1c0-0.2,0.1-1.9,0.3-1.9c3,0,19.2,0,19.2,0l5.4-19.9h-19.3 c0.9-3.1,3-11,3-11H107l-1.7,6.3c-0.4-0.7-0.8-1.3-1.3-1.9c-2.4-2.9-6-4.4-10.2-4.4H79.2c-2.3,0-4.7,0.4-7,1.3 c-2.2,0.8-4.4,2-6.3,3.5l0,0L67.2,0H46.4l-3.8,14h-8l3.7-14H17.6L13,16.9c-0.4,1.5-0.6,3.1-0.6,4.5v0.1l0.2,2.2v0.1 c0.3,2.2,1.2,4.2,2.4,5.9c1.3,1.7,2.9,3.1,4.9,4c2,0.9,4.2,1.4,6.6,1.4c0,0,5.9,0,7.1,0c-1.2,0.6-2.5,1.1-3.9,1.4 c-1.6,0.4-3.4,0.6-5.3,0.6h-17L0,64.7h25.8c3.3,0,6.7-0.6,10.1-1.9c3.2-1.2,6.3-3,9.1-5.2c1.4-1.1,2.8-2.4,4-3.7 c0.1,2.6,0.7,4.6,1.8,6.3c2.2,3.3,6,4,8.6,4.3h0.1h0.1c3.8,0.2,10.7,0.2,10.9,0.2c3.3,0,6.7-0.6,10.1-1.9c3.2-1.2,6.2-3,9.1-5.2 c2.5-2,4.7-4.3,6.9-7.6c0.6,2.4,1.6,4.7,3.1,6.7c1.9,2.5,4.3,4.5,7.2,5.9s6.1,2.1,9.6,2.1h22.1l3.6-13.1c0.6,1.8,1.5,3.6,2.7,5.1 c1.9,2.5,4.3,4.5,7.2,5.9s6.1,2.1,9.6,2.1H185l3.1-11.8c0.6,1.3,1.3,2.6,2.1,3.8c1.9,2.5,4.3,4.5,7.2,5.9s6.1,2.1,9.5,2.1h25.2 l7.5-27.6H217.9L217.9,37.1z M51.5,40.6C51.5,40.6,51.5,40.5,51.5,40.6c-0.1,0.3-0.2,0.6-0.3,1.1c-0.8,2.4-1.6,4.2-2.7,5.8 c-1.7,2.5-3.8,4.7-6.3,6.7c-2.4,1.9-5.1,3.5-7.9,4.5c-2.8,1.1-5.7,1.6-8.5,1.6h-20c1.1-4,4.3-16.2,5-18.7h13.5 c2.2,0,4.4-0.2,6.3-0.7c2.1-0.5,4-1.2,5.7-2.2c1.8-1.1,3.4-2.4,4.6-3.9l0.3-0.5l2.1-3.6H26.4c-1.7,0-3.3-0.3-4.7-1 c-1.3-0.6-2.4-1.5-3.2-2.6s-1.4-2.4-1.6-3.9c0-0.2-0.1-1.5-0.1-1.8c0-1.1,0.2-2.2,0.5-3.3c0,0,2.6-9.6,3.6-13.5h11.5 c-0.7,2.5-1.7,6-1.7,6c-0.5,1.7-1.3,4.5,0.2,6.4c0.5,0.7,1.5,1.5,3.3,1.5h11.7c0,0,3.1-11.4,3.8-14c2.2,0,8.1,0,11.5,0 c-3,11-5,18.5-6.4,23.7L52,38.6L51.5,40.6 M99.3,27.7L97,36.4l-0.8,3c-0.7,2.5-1.5,5.4-3.4,8.1c-2,2.9-3.9,5-6,6.7 c-2.5,1.9-5.1,3.4-7.9,4.5c-2.8,1.1-5.7,1.6-8.5,1.6c-0.1,0-7,0-10.6-0.2c-2.8-0.3-4.4-1-5.3-2.4c-0.7-1-1-2.4-1-4.2 c0-2,0.4-4.5,1.2-7.4l0.9-3.3c0.2-0.7,6.9-25,6.9-25c0.4-1.7,0.9-3.3,2-4.9s2.5-3.1,4.2-4.3c1.6-1.2,3.4-2.2,5.2-2.9 c1.9-0.7,3.7-1,5.5-1h14.5c2.9,0,5.3,1,6.9,2.8c1.7,2,2.4,5,1.9,8.4c-0.5,2.9-1.3,5.7-2.1,8.5C100.3,24.3,99.3,27.7,99.3,27.7 M134.9,60.2h-18.7c-2.8,0-5.4-0.6-7.6-1.6c-2.2-1.1-4.1-2.6-5.5-4.5c-1.4-2-2.3-4.2-2.7-6.7c-0.1-0.9-0.2-1.8-0.2-2.7 c0-1.8,0.3-3.6,0.8-5.4l3.5-13c0,0,4.5-16.4,5.9-21.7h11.3c-0.9,3.1-3,11-3,11H138l-3,10.9h-19.4c0,0-1,4.6-1,4.7 c-0.1,0.7-0.1,1.3-0.1,1.8c0,0.7,0.1,1.3,0.2,2.1c0.9,4.3,5.2,6.5,12.8,6.5h12.4C138.9,45.6,135.5,57.8,134.9,60.2 M189.5,27.4 C189.5,27.4,189.5,27.3,189.5,27.4c-2.5,9.3-5.5,10-9.1,10H158c0,0-2,4.5,3.2,4.5h9.5l0,0c5.8,0,12.8,0,15.3,0 c-1.1,4-4.2,15.9-4.9,18.4h-19.9c-2.8,0-5.4-0.5-7.6-1.6c-2.2-1.1-4.1-2.6-5.5-4.5c-1.4-1.9-2.4-4.2-2.8-6.7 c-0.2-0.9-0.2-1.9-0.2-2.9c0-1.7,0.2-3.5,0.7-5.3l5.8-22.4c0.3-1.1,0.7-2.2,1.3-3.3c0.1-0.1,1-1.6,1-1.7l0,0c1-1.4,2.2-2.7,3.6-3.8 c1.4-1.1,2.9-1.9,4.5-2.5c1.7-0.6,3.5-1,5.2-1h14.5c1.8,0,3.4,0.4,4.9,1.1c1.5,0.7,2.7,1.7,3.7,2.9c1,1.3,1.6,2.7,1.9,4.3 c0.1,0.3,0.1,0.7,0.1,1.1c0,2-0.6,5.1-1,6.9C189.8,26.3,189.6,27.2,189.5,27.4 M228.3,60.2h-21.8c-2.8,0-5.4-0.6-7.6-1.6 c-2.2-1.1-4.1-2.6-5.5-4.5s-2.3-4.2-2.7-6.7c-0.1-0.9-0.2-1.8-0.2-2.7c0-1.3,0.1-2.6,0.4-3.9l0.9-3.4l0,0c1-3.6,6-21.9,6-21.9 s2.1-7.6,3-11c2.2,0,7.9,0,11.3,0C210.9,9,205.4,29,205.4,29c-0.4,1.3-0.5,2.6-0.5,3.7c0,0.8,0.1,1.5,0.2,2.1 c0.4,1.6,1.2,2.9,2.4,3.9c1.2,1,2.7,1.7,4.5,2.2c1.7,0.4,3.7,0.7,5.9,0.7h15.5C232.3,45.5,229,57.7,228.3,60.2 M176.5,13.8H170 c-2.6,0-5,0.6-6.5,2.7c-1.6,2.2-3.7,12.3-3.7,12.3s10.6,0.1,14.2-0.1c2.4-0.1,4.9-1.8,5.5-4.2c2-7.5,1.7-8,1.2-8.8 C179.6,13.9,177,13.8,176.5,13.8 M175.3,23.2c-0.2,0.5-0.6,0.9-1.1,1.1c-0.1,0-0.3,0.1-0.4,0.1h-8.1c0.6-2.3,1.2-4.8,1.3-4.9 c0.2-0.6,0.9-1.1,1.5-1.1h8C176.4,18.3,175.6,22.5,175.3,23.2"/> </svg> ');
            
            if (theme && theme.toLowerCase() === 'fontainebleau'){
                return fontainebleau;
            } else if (theme && theme.toLowerCase() === 'zoku'){
                return zoku;
            } else if (theme && theme.toLowerCase() === 'yotel'){
                return yotel;
            }  else {
                return snt;
            }
        };
        $scope.getThemeName = function(theme){
             if (theme === 'Zoku'){
                return theme.toLowerCase();
            } else if (theme === 'Fontainebleau') {
                return theme.toLowerCase();
            } else if (theme === 'Yotel') {
                return theme.toLowerCase();
            } else {//default to zoku for now until other stylesheets are generated
                return 'snt';
            }
        };
        $scope.getThemeLink = function(theme){
            var link, assetPath = '../assets/zest_station/css/', ext = '.css.less';
            theme = $scope.getThemeName(theme);
            link = assetPath+theme.toLowerCase()+ext;//default to snt for now until other stylesheets are generated
            return link;
        };
        $scope.iconsPath = '/assets/zest_station/css/icons/default';
        $scope.updateIconPath = function(theme){
            if (theme === 'yotel'){
                $scope.theme = theme;
                $scope.iconsPath = '/assets/zest_station/css/icons/yotel';
            };
            $rootScope.iconsPath = $scope.iconsPath;
        };
        $scope.setThemeByName = function(theme){
            $scope.updateIconPath(theme);
            
            $('body').css('display','none'); 
            var link, logo;
            link = $scope.getThemeLink(theme);
            logo = $scope.getLogoSvg(theme);
            if (link){
                zsHotelDetailsSrv.data.theme = theme.toLowerCase();
                $state.theme = theme.toLowerCase();
              //  $('head').append('<link rel="stylesheet" type="text/css" href="'+link+'">');
                $('#logo').append(logo);
                $rootScope.$broadcast ('THEME_UPDATE', function(event) {});
            }
            setTimeout(function(){
                $('body').css('display', 'block');
            },50);
            //based upon admin settings set printer css styles
            setPrinterOptions();
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
                    if (response.is_out_of_order){
                        $scope.$emit(zsEventConstants.PUT_OOS);
                    } else {
                        $scope.$emit(zsEventConstants.OOS_OFF);
                    }
                    $state.is_oos = response.is_out_of_order;
                    $scope.startCounter(hard_reset);
                    $rootScope.$broadcast('ZS_SETTINGS_UPDATE',response);//this will tell the homeCtrl to update oos text
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
                params: {
                    id: $state.workstation_id
                },
                successCallBack: 	onSuccess,
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



        $scope.languageTimerReset = false;
        var setDefaultLanguage= function(){
            intLanguageSettings();
            $translate.use($scope.langInfo.code);
        };

        var languageCounterCompleted = function(){
            if($state.current.name ==="zest_station.home"){
                setDefaultLanguage();
            }
        };
        $scope.startLanguageCounter = function(){
            var time = 120, inMilliSec = 1000;
            $scope.languageCounter = $timeout(languageCounterCompleted, time*inMilliSec);
        };

        $scope.stopLanguageCounter = function(){
            $timeout.cancel($scope.languageCounter);
        };
        
        
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
             * //emv_terminal_id and Key_encoder will also get updated from the status update calls
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

                if (storedWorkStation === ''){
                    $scope.zestStationData.workstations = 'Select';
                    $state.hasWorkstation = false;
                } else {
                    if ($scope.zestStationData){
                        if ($scope.zestStationData.workstations && $scope.zestStationData.workstations.length > 0){
                            for (var i in $scope.zestStationData.workstations){
                                if ($scope.zestStationData.workstations[i].station_identifier === storedWorkStation){
                                     station = $scope.zestStationData.workstations[i];
                                     hasWorkstation = true;
                                     $state.hasWorkstation = true;
                                     $scope.zestStationData.printerLabel = $scope.getPrinterLabel(station.printer);
                                }
                            }
                        } else {
                            console.log('no workstation selected')
                            $scope.zestStationData.workstations = 'Select';
                            $state.hasWorkstation = false;
                        }
                    } else {
                            console.log('no workstation selected')
                        $scope.zestStationData.workstations = 'Select';
                        $state.hasWorkstation = false;
                    }

                    if (station !==  null){
                        if (station.printer){
                            sntZestStation.selectedPrinter = station.printer;//only set this if not null
                        }
                        $state.encoder = station.key_encoder_id;
                        $state.workstation_id = station.id;
                        $state.emv_terminal_id = station.emv_terminal_id;
                        $state.is_oos = station.is_out_of_order;
                    }

                    $scope.hasWorkstationAssigned = hasWorkstation;
                    if (!$scope.hasWorkstation()){
                        $state.go('zest_station.oos');
                    }
                    return station;
            }
        };
        
    $scope.getPrinterLabel = function(name){
        if (name && typeof name === typeof 'str'){
             if (name.length > 1){
                 //printer name convention has something like IPP://somename..
                 //so lets pull out that IPP:// from the display to user, so they will see its
                 //HP or other printer identifiers
                 var str = name.split('ipp://');
                 if (str[1]){
                     name = str[1];
                 }
             } else {
                name = 'Select';
             }
        } else {
            name = 'Select';
        }
        return name;
    };
        
	$scope.failureCallBack =  function(data){
            if ($state.is_oos){
                $state.go('zest_station.oos');
            } else {
                $state.go('zest_station.error_page');
            }
	};

        $scope.trustAsHtml = function(string) {
            return $sce.trustAsHtml(string);
        };
        $scope.fetchHotelSettings = function(){
            var onSuccess = function(data){
                    $scope.zestStationData.hotel_settings = data;
                    $scope.zestStationData.hotel_terms_and_conditions = data.terms_and_conditions;
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
                    $scope.timeOut = true;
                    $scope.$apply();
                }
            }

        };
        $scope.openExternalWebPage = function(){
            $scope.showExternalWebPage =true;
            console.log('listenForInputBoxClick')
            $scope.listenForInputBoxClick();
        };
        $scope.listenForInputBoxClick = function(){
            $('body').bind("click touchstart keyup keydown keypress", function(e) {
                console.log(e)
                window.parent.funcKey(e);
              });
            
            
            
        };
        $scope.closeExternalWebPage = function(){
            $scope.showExternalWebPage =false;
        }
        
        $scope.languageSelect = function(){
            $scope.stopLanguageCounter();
            $scope.showLanguagePopup = true;
            $scope.timeOut = true;
        };
        $scope.isSupported = function(lang){
            var langs = $scope.supportedLangs;
            for (var i in langs){
                if (lang === langs[i]){
                    return true;
                }
            }
            return false;
        };
        var intLanguageSettings = function(){
            $scope.selectedLanguage = 'English';
            $scope.langflag = 'flag-gb';
            $scope.language = null;
            $scope.langInfo = zsUtilitySrv.returnLanguageList();
        };

        $scope.selectLanguage = function(language){
            $scope.selectedLanguage = language.language;//set language name
            $scope.langflag = language.info.flag;// set language icon
            $translate.use(language.info.code); //set translations
            $scope.showLanguagePopup = false; // set popup flag
            $scope.timeOut = false; // set popup flag
            $scope.startLanguageCounter();
        };

        $scope.closeLangPopUp = function()
        {   $scope.startLanguageCounter();
            $scope.showLanguagePopup = false;
            $scope.timeOut = false;
        }
        
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
                ++$scope.adminTimeout;
                $scope.closePopup();
                if ($scope.at !== 'home'){ 
                    clearInterval($scope.idleTimer);
                    $scope.startIdleCounter();
                }   
            };
            
            $scope.timeOut = false;
            $scope.closePopup = function(){
                //ngDialog.hide();
                $scope.timeOut = false;
                //$scope.zestStationData.popup = false;
            };
            $scope.initQRCodeFindReservation = function(reservation_id){
                $state.qr_code = reservation_id;
                $state.go('zest_station.reservation_search_qrcode');
            };
            $scope.onChromeAppResponse = function(response){
                console.log('msg from ChromeApp: ',response);
                if (response){
                    if (response.isChromeApp){
                        $scope.inChromeApp = true;
                    } else if (response.qr_code){
                        $scope.initQRCodeFindReservation(response.reservation_id);
                    }
                }
            };
            $scope.chromeApp = new chromeApp($scope.onChromeAppResponse, zestStationSettings.chrome_app_id);
            $scope.getPromptTime = function(){
                if ($scope.idle_max>$scope.idle_prompt){
                    return $scope.idle_max-$scope.idle_prompt;
                } else return -1;
            };
            $scope.startIdleCounter = function(){
                var time = $scope.idle_max, promptTime = $scope.getPromptTime();
                
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
                if ($state.current.name !== 'zest_station.oos' && $state.current.name !== 'zest_station.admin-screen' && $state.current.name !== 'zest_station.admin'){
                    $state.go('zest_station.home');
                    
                    $scope.selectedLanguage = 'English';
                    $scope.langflag = 'flag-gb';
                    $scope.selectLanguage($scope.selectedLanguage,$scope.langflag);//set back to default language; currently just english
                } else {
                    console.info('at admin or oos, idle timer stopped');
                }
                $scope.closePopup();
            };
            
            
            $scope.showKeyboardOnInput = function(){
                var frameBody = $("#booking_iframe").contents().find("body");
                    frameBody.focus(function(){ 
                        console.log('iframe focus')
                    });
            };
            $scope.hideKeyboardIfUp = function(){
                var focused = $('#'+$scope.lastKeyboardId);
                if ($(focused)){
                    if ($(focused).getkeyboard()){
                        $(focused).getkeyboard().accept(true);
                    }
                }
            };
            $scope.showOnScreenKeyboard = function(id) {
                $scope.lastKeyboardId = id;
               //pull up the virtual keyboard (snt) theme... if chrome & fullscreen
                var isTouchDevice = 'ontouchstart' in document.documentElement;
                var shouldShowKeyboard = (typeof chrome) && 
                        (agentString.toLowerCase().indexOf('window')!==-1) && 
                        isTouchDevice && 
                        $scope.inChromeApp && $scope.theme === 'yotel';
                if (shouldShowKeyboard){
                     if (id){
                         new initScreenKeyboardListener('station', id, true);
                      }
                 } else {
                     console.info('probably not in a chromeapp');
                 }
            };
            
            $scope.$watchCollection(function(){
                return $state.current.name;
            }, function(){
                var current = $state.current.name;
                
                $scope.hideKeyboardIfUp();
                if ($scope.theme === 'yotel'){
                    $scope.setScreenIconByState(current);
                }
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
            $scope.setScreenIconByState = function(name){
               switch(name){
                   //home screen handled from homeCtrl on init, others handled here
                   case 'zest_station.early_checkin_unavailable':
                       $scope.setScreenIcon('checkin');
                       break;
                   case 'zest_station.early_checkin_nav':
                       $scope.setScreenIcon('checkin');
                       break;
                   case 'zest_station.find_by_confirmation':
                       $scope.setScreenIcon('checkin');
                       break;
                   case 'zest_station.find_by_email':
                       $scope.setScreenIcon('checkin');
                       break;
                   case 'zest_station.find_by_no_of_nights':
                       $scope.setScreenIcon('checkin');
                       break;
                   case 'zest_station.find_reservation':
                       $scope.setScreenIcon('checkin');
                       break;
                   case 'zest_station.oos':
                       $scope.setScreenIcon('settings');
                       break;
                   case 'zest_station.review_bill':
                       $scope.setScreenIcon('checkout');
                       break;
                   case 'zest_station.bill_delivery_options':
                       $scope.setScreenIcon('checkout');
                       break;
                   case 'zest_station.reservation_checked_out':
                       $scope.setScreenIcon('checkout');
                       break;
                   default: $scope.setScreenIcon('bed');
                       break;
               }
            };
        
        
        $scope.setSupportedLangList = function(langs){
            var allLangs = Object.getOwnPropertyNames(langs).sort();
           // $scope.supportedLangs = zestStationSettings.zest_lang;
            
            var supported = [];
            for (var i in allLangs){
                if (zestStationSettings.zest_lang[allLangs[i]]){
                    if (allLangs[i] === 'enabled'){
                        continue;
                    }
                    supported.push(allLangs[i]);
                }
            }
            $scope.supportedLangs = supported;
        };
    var maximizeScreen = function(){
        var chromeAppId = $scope.zestStationData.chrome_app_id; // chrome app id 
        console.info("chrome app id [ "+chromeAppId+' ]');
        //minimize the chrome app on loging out
        (chromeAppId !== null && chromeAppId.length > 0) ? chrome.runtime.sendMessage(chromeAppId,"zest-station-login"):"";
    };
    $scope.initChromeAppQRCodeScanner = function(){
        if ($scope.inChromeApp){
            var chromeAppId = $scope.zestStationData.chrome_app_id; // chrome app id 
            console.info("chrome app id [ "+chromeAppId+' ]');
            //minimize the chrome app on loging out
            new chromeApp($scope.onChromeAppResponse, zestStationSettings.chrome_app_id, true);
            console.info("::Starting QR Code Scanner::"); 
        }
    };

    var setPrinterOptions = function(){
        $scope.zestStationData.theme = $state.theme;//again a state variable!!!!
        //need to change all this codes
        // alert($scope.zestStationData.zest_printer_option)
         if ($scope.zestStationData.zest_printer_option === "STAR_TAC") {
            //add startac styles
            if($scope.theme === 'yotel'){
                 applyStylesForYotelStarTac();//zsUtils function
            }
            else{
                applyStarTacStyles();//zsUtils function
            }
           
         }
         else if($scope.zestStationData.zest_printer_option === "RECEIPT"){
            if($scope.theme === 'yotel'){
               applyStylesForYotelReceipt();//zsUtils function
            }
            else{
                //
            }
         }
         else{
            //RECEIPT and AIR_PRINT
            applyPrintMargin();//zsUtils function
         };
    };

    /*
    *  Websocket actions related to keycard lookup
    *  starts here
    */
    var socketActions = function(response) {
        var cmd = response.Command,
            msg = response.Message;
        // to delete after QA pass
        console.info("Websocket:-> uid=" + response.UID);
        console.info("Websocket: Command ->"+cmd);
        console.info("Websocket: msg ->"+msg);
        console.info("Websocket:-> response code:" + response.ResponseCode);

        if (response.Command === 'cmd_insert_key_card') {
            //check if the UID is valid
            //if so find reservation using that
            if (typeof response.UID !== "undefined" && response.UID !== null) {
                $scope.$broadcast('UID_FETCH_SUCCESS',{"uid":response.UID});
            } else {
                $scope.$broadcast('UID_FETCH_FAILED');
            };
        } else if (response.Command === 'cmd_eject_key_card') {
            //ejectkey card callback
            if (response.ResponseCode === 19) {
                // key ejection failed
                if (!$scope.zestStationData.keyCaptureDone) {
                    $state.go('zest_station.error_page');
                };
            }
            else{
                $scope.zestStationData.keyCardInserted =  false;
            }
        } else if (response.Command === 'cmd_capture_key_card') {
            if (response.ResponseCode === 0) {
                $scope.zestStationData.keyCaptureDone = true;
            }
            else{
                //capture failed
                $state.go('zest_station.error_page');
            };
        };
    };
    var socketOpenedFailed = function() {
        console.info("Websocket:-> socket connection failed");
    };
    var socketOpenedSuccess = function() {
        console.info("Websocket:-> socket connected");
        $scope.$broadcast('SOCKET_CONNECTED');
    };

    $scope.$on('CONNECT_WEBSOCKET',function(){
        $scope.socketOperator = new webSocketOperations(socketOpenedSuccess, socketOpenedFailed, socketActions);
    });

    /***
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
        
        (typeof chrome !== "undefined") ? maximizeScreen():"";
        //create a websocket obj
        $scope.socketOperator = new webSocketOperations(socketOpenedSuccess, socketOpenedFailed, socketActions);
        $scope.zestStationData.keyCardInserted =  false;
        $scope.setSupportedLangList(zestStationSettings.zest_lang);
        $scope.zestStationData.pickup_qr_scan = zestStationSettings.pickup_qr_scan;
        
        //$scope.zestStationData.pickup_qr_scan = true;//fake it till ya make it
             
        _.extend(zsHotelDetailsSrv.data, zestStationSettings);
        $scope.settings = zestStationSettings;
        $scope.setupIdleTimer();
        $scope.zestStationData.guest_bill.print = ($scope.zestStationData.guest_bill.print && $scope.zestStationData.is_standalone) ? true : false;
        $scope.fetchHotelSettings();
        $scope.getWorkStation();
        $scope.getHotelStationTheme();
        intLanguageSettings();
        //set print and email options set from hotel settings > Zest > zest station
        $scope.zestStationData.printEnabled = $scope.zestStationData.registration_card.print;
        $scope.zestStationData.auto_print = $scope.zestStationData.registration_card.auto_print;
        $scope.zestStationData.emailEnabled = $scope.zestStationData.registration_card.email;
        $scope.setScreenIcon('bed');
        
	}();
        
        
}]);

