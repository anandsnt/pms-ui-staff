var sntZestStation = angular.module('sntZestStation', [
    'ui.router',
    'ui.utils',
    'ng-iscroll',
    'ngDialog',
    'ngAnimate',
    'ngSanitize',
    'pascalprecht.translate',
    'ui.date',
    'ui.calendar',
    'documentTouchMovePrevent',
    'divTouchMoveStopPropogate',
    'sharedHttpInterceptor',
    'orientationInputBlurModule',
    'iscrollStopPropagation',
    'touchPress',
    'enterPress',
    'clickTouch'
]);


//adding shared http interceptor, which is handling our webservice errors & in future our authentication if needed
sntZestStation.config(function($httpProvider, $translateProvider) {
    $httpProvider.interceptors.push('sharedHttpInterceptor');
    $translateProvider.useStaticFilesLoader({
        prefix: '/assets/zest_station/zsLocales/',
        suffix: '.json'
    });
    //$translateProvider.fallbackLanguage('EN_snt');
});

sntZestStation.run(['$rootScope', '$state', '$stateParams', '$location', function($rootScope, $state, $stateParams, $location) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
        $rootScope.previousState = from.name;
        $rootScope.previousStateParam = fromParams.menu;
    });
}]);

var GlobalZestStationApp = function() {

    /*
     * the below is copied from rover rvSntApp.js
     * to support sixpay / mli payments from zest station
     */

    var that = this;
    this.browser = "other";
    this.cordovaLoaded = false;
    this.cardReader = null;
    this.iBeaconLinker = null;
    this.enableURLChange = true;
    try {
        this.desktopCardReader = new DesktopCardOperations();
        this.MLIOperator = new MLIOperation();
    } catch (er) {};


    this.DEBUG = true;

    this.setBrowser = function(browser) {
        if (typeof browser === 'undefined' || browser === '') {
            that.browser = "other";
        } else {
            that.browser = browser;
        }
        if (browser === 'rv_native' && !that.cordovaLoaded) {
            //TODO: check URL
            var url = "/assets/shared/cordova.js";

            /* Using XHR instead of $HTTP service, to avoid angular dependency, as this will be invoked from
             * webview of iOS / Android.
             */
            var xhr = new XMLHttpRequest(); //TODO: IE support?

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    that.fetchCompletedOfCordovaPlugins(xhr.responseText);
                } else {
                    that.fetchFailedOfCordovaPlugins();
                }
            };
            xhr.open("GET", url, true);

            xhr.send(); //TODO: Loading indicator

        }

    }; 

    // success function of coddova plugin's appending
    this.fetchCompletedOfCordovaPlugins = function(data) {
        that.cordovaLoaded = true;
        try {
            that.cardReader = new CardOperation();
        } catch (er) {
            console.info('failed get card op');
        };
        try {
            that.iBeaconLinker = new iBeaconOperation();
        } catch (er) {};

    };
    this.fetchCompletedOfCordovaPlugins();

    // success function of coddova plugin's appending
    this.fetchFailedOfCordovaPlugins = function(errorMessage) {
        that.cordovaLoaded = false;
    };

    this.demoMode = function(){
        var el = angular.element('#header');
        if (el){
            var demoModeEnabled = el.scope().$parent.zestStationData.demoModeEnabled;
            if (demoModeEnabled === 'true'){
                angular.element('#header').scope().$parent.zestStationData.demoModeEnabled = 'false';
            } else {
                angular.element('#header').scope().$parent.zestStationData.demoModeEnabled = 'true';
            }
            angular.element('#header').scope().$apply();
        }
    }
    this.debugTimers = function(workstationFetchTimer, languageResetTimer, refreshTimer, idlePopupTimer, backToHomeTimer){
            if (arguments.length === 0 || workstationFetchTimer === false){//ie. debugTimers(false) or debugTimers() will turn off timer debugging
                console.info('Please pass the timer values as an argument, ie. debugTimers(','workstationFetchTimer,', 
                'languageResetTimer,', 
                'refreshTimer,', 
                'idlePopupTimer,', 
                'backToHomeTimer )');  
                console.info('Passing null, or empty string will assume default setting');
                console.info(':: turning off timer debugger ::');
                that.timeDebugger = false;
                try {
                    setTimeout(function(){
                        //angular.element('#header').scope().$parent.runDigestCycle();
                        angular.element('#header').scope().$parent.$digest();
                    },500);

                } catch (err){
                    console.warn('unable to run digest ',err);
                }
                
            } else {    
                var isValidArg = function(a){
                    return (typeof a === typeof 123 && a > 0);
                }
                if (typeof _ !== typeof undefined){
                    if (isValidArg(workstationFetchTimer)){
                        that.workstationFetchTimer = workstationFetchTimer;
                        that.timeDebugger = true;
                    }
                    if (isValidArg(languageResetTimer)){
                        that.languageResetTimer = languageResetTimer;
                        that.timeDebugger = true;
                    }
                    if (isValidArg(refreshTimer)){
                        that.refreshTimer = refreshTimer;
                        that.timeDebugger = true;
                    }
                    if (isValidArg(idlePopupTimer)){
                        that.idlePopupTimer = idlePopupTimer;
                        that.timeDebugger = true;
                    }
                    if (isValidArg(backToHomeTimer)){
                        that.backToHomeTimer = backToHomeTimer;
                        that.timeDebugger = true;
                    }
                    console.info('Timers Set: (',' [ workstationFetchTimer:', that.workstationFetchTimer,
                        '] [ languageResetTimer,', that.languageResetTimer,
                        '] [ refreshTimer: ', that.refreshTimer,
                        '] [ idlePopupTimer: ', that.idlePopupTimer,
                        '] [ backToHomeTimer: ',that.backToHomeTimer,'] )');
                } else {
                    console.warn(':: debugger out of date ::');
                }
            }
        return;
    }
    this.debugTheme = function(theme){
        //thats right, quick-switching of themes...
        angular.element('#header').scope().$parent.quickSetHotelTheme(theme);
    };
    this.virtualKeyBoardEnabled = false;

    this.enableCardSwipeDebug = function(toggle) {
        console.log('pass true to enable, false or no arg to disable cardSwipeDebug');
        if (toggle) {
            console.log('turning ON card swipe debugging');
            that.cardSwipeDebug = true; // Mark it as true to debug cardSwipe opertations
            that.cardReader = new CardOperation();
        } else {
            console.log('no argument passed, turning OFF card swipe debugging');
            that.cardSwipeDebug = false; // Mark it as false to disable debug cardSwipe opertations
        }
        console.warn('cardSwipeDebug: ', that.cardSwipeDebug)
    };
};

zestSntApp = new GlobalZestStationApp();

sntZestStation.controller('rootController', ['$scope',
    function($scope) {

    }
]);