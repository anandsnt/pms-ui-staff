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
    'clickTouch',
    'sntPay',
    'sntPayConfig',
    'sntActivityIndicator'
]);


// adding shared http interceptor, which is handling our webservice errors & in future our authentication if needed
sntZestStation.config(function($httpProvider, $translateProvider, $locationProvider) {
    $httpProvider.interceptors.push('sharedHttpInterceptor');
    $translateProvider.useStaticFilesLoader({
        prefix: '/assets/zest_station/zsLocales/',
        suffix: '.json'
    });
    // $translateProvider.fallbackLanguage('EN_snt');

    $locationProvider.html5Mode(true);
});

sntZestStation.run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.cls = {
        'editor': 'false'
    };

    $rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
        $rootScope.previousState = from.name;
        $rootScope.previousStateParam = fromParams.menu;
        // on state changes hide the keyboard always in case of iPad
        document.activeElement.blur();
        $('input').blur();
    });
}]);

var GlobalZestStationApp = function() {

    /*
     * the below is copied from rover rvSntApp.js
     * to support sixpay / mli payments from zest station
     */

    var that = this;

    this.browser = 'other';
    this.cordovaLoaded = false;
    this.cardReader = null;
    this.iBeaconLinker = null;
    this.enableURLChange = true;
    try {
        this.desktopCardReader = new DesktopCardOperations();
        this.MLIOperator = new MLIOperation();
    } catch (er) {
        console.warn(er);
    }

    this.setBrowser = function(browser) {
        var url = "/assets/shared/cordova.js";
        //  var url = "/ui/show?haml_file=cordova/cordova_ipad_ios&json_input=cordova/cordova.json&is_hash_map=true&is_partial=true";
        
        if (typeof browser === 'undefined' || browser === '') {
            that.browser = "other";
        } else if (browser === 'rv_native_android') {
            that.browser = 'rv_native';
            that.cordovaLoaded = true;
        } else {
            that.browser = browser;
        }

        if (browser === 'rv_native' && !that.cordovaLoaded) {
           that.loadScript(url);
        }

    };

    this.loadScript = function(url) {
            /* Using XHR instead of $HTTP service, to avoid angular dependency, as this will be invoked from
             * webview of iOS / Android.
             */
            var xhr = new XMLHttpRequest(); // LATER: IE support?

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                      that.fetchCompletedOfCordovaPlugins(xhr.responseText);
                } else {
                    that.fetchFailedOfCordovaPlugins();
                }
            };
            xhr.open("GET", url, true);

            xhr.send(); // LATER: Loading indicator
    };

    this.loadCordovaWithVersion = function(version) {
        var script_node = document.createElement('script');

        script_node.setAttribute('src', '/assets/shared/cordova/' + version + '/cordova.js');
        script_node.setAttribute('type', 'application/javascript');
        document.body.appendChild(script_node);
        document.addEventListener('deviceready', function(){
            that.cardReader = new CardOperation();
        }, false);
    };


    // success function of coddova plugin's appending
    this.fetchCompletedOfCordovaPlugins = function(data) {
        that.cordovaLoaded = true;       

        var script_node = document.createElement('script');

        script_node.innerHTML = data;

        document.body.appendChild(script_node);
    };

    // success function of coddova plugin's appending
    this.fetchFailedOfCordovaPlugins = function() {
        that.cordovaLoaded = false;
    };

    this.DEBUG = true;

    this.logout = function() {
        // just log out
        window.location.href = '/station_logout';
    };

    this.setStationProperty = function(p, v) {
        angular.element('#header').scope().$parent.zestStationData[p] = v;
    };

    this.getStationProperty = function(p) {
        return angular.element('#header').scope().$parent.zestStationData[p];
    };

    this.toggleDemoModeOnOff = function(enableFakeReservation) {
        var el = angular.element('#header');

        if (el) {
            var demoModeEnabled = el.scope().$parent.zestStationData.demoModeEnabled;

            if (demoModeEnabled === 'true') {
                if (enableFakeReservation === 'enableFakeReservation') {
                    if (that.getStationProperty('fakeReservation') === 'false') {
                        that.setStationProperty('fakeReservation', 'true');

                    } else {
                        that.setStationProperty('fakeReservation', 'false');
                    }
                } else {
                    // fake reservation should only be used with demo mode
                    that.setStationProperty('demoModeEnabled', 'false');
                    that.setStationProperty('fakeReservation', 'false');
                }
            } else {
                if (enableFakeReservation === 'enableFakeReservation') {
                    that.setStationProperty('fakeReservation', 'true');
                }
                that.setStationProperty('demoModeEnabled', 'true');
            }
            angular.element('#header').scope()
                .$apply();

        }
    };

    this.toggleDemoFlowModeOnOff = function() {
        that.toggleDemoModeOnOff('enableFakeReservation');
    };

    this.runDigest = function() {
        try {
            setTimeout(function() {
                angular.element('#header').scope().$parent.$digest();
                angular.element('#header').scope().$parent.$digest();
            }, 800);

        } catch (err) {
            console.warn('unable to run digest ', err);
        }
    };
    this.debugTimers = function(workstationFetchTimer, languageResetTimer, refreshTimer, idlePopupTimer, backToHomeTimer) {
        if (arguments.length === 0 || workstationFetchTimer === false) { // ie. debugTimers(false) or debugTimers() will turn off timer debugging
            console.info('Please pass the timer values as an argument, ie. debugTimers(', 'workstationFetchTimer,',
                'languageResetTimer,',
                'refreshTimer,',
                'idlePopupTimer,',
                'backToHomeTimer )');
            console.info('Passing null, or empty string will assume default setting');
            console.info(':: turning off timer debugger ::');
            that.timeDebugger = false;
            setTimeout(function() {
                that.runDigest();
            }, 200);

        } else {
            var isValidArg = function(a) {
                return typeof a === typeof 123 && a > 0;
            };

            if (typeof _ !== typeof undefined) {
                if (workstationFetchTimer === true) {
                    // only (true), when being called to only debug timers, 
                    // all other args will be ignored
                    if (typeof that.timeDebugger !== typeof undefined) {
                        that.timeDebugger = !that.timeDebugger;
                        that.runDigest();
                    } else {
                        that.timeDebugger = true;
                        that.runDigest();
                    }

                }
                if (isValidArg(workstationFetchTimer)) {
                    that.workstationFetchTimer = workstationFetchTimer;
                    that.timeDebugger = true;
                }
                if (isValidArg(languageResetTimer)) {
                    that.languageResetTimer = languageResetTimer;
                    that.timeDebugger = true;
                }
                if (isValidArg(refreshTimer)) {
                    that.refreshTimer = refreshTimer;
                    that.timeDebugger = true;
                }
                if (isValidArg(idlePopupTimer)) {
                    that.idlePopupTimer = idlePopupTimer;
                    that.timeDebugger = true;
                }
                if (isValidArg(backToHomeTimer)) {
                    that.backToHomeTimer = backToHomeTimer;
                    that.timeDebugger = true;
                }
                console.info('Timers Set: (', ' [ workstationFetchTimer:', that.workstationFetchTimer,
                    '] [ languageResetTimer,', that.languageResetTimer,
                    '] [ refreshTimer: ', that.refreshTimer,
                    '] [ idlePopupTimer: ', that.idlePopupTimer,
                    '] [ backToHomeTimer: ', that.backToHomeTimer, '] )');
                setTimeout(function() {
                    that.runDigest();
                }, 200);

            } else {
                console.warn(':: debugger out of date ::');
            }
        }
        return;
    };
    this.callRootMethod = function(m, args) { // m == method to call
        angular.element('#header').scope().$parent[m](args);

    };
    this.debugTheme = function(theme) {
        // thats right, quick-switching of themes...
        that.callRootMethod('quickSetHotelTheme', theme);
        that.runDigest();
    };

    this.getStateList = function() {
        // will fetch and pass back a list of all $states that can be 'jumped to'
        // for use with octopus | testing | development of certain areas
        // without having to go through normal check-in methods

        var viewList = angular.element('#header').scope().$parent.$state.get(),
            jumperStates = [],
            jumperStateLabels = [];

        for (var state in viewList) {

            if (viewList[state].jumper) {
                // push label with state name
                jumperStates.push({
                    'label': viewList[state].label,
                    'name': viewList[state].name,
                    'modes': viewList[state].modes,
                    'tags': viewList[state].tags,
                    'description': viewList[state].description,
                    'icon': viewList[state].icon,
                    'sntOnly': viewList[state].sntOnly,
                    'placeholderData': viewList[state].placeholderData
                });
                // create list of just labels for UI to show
                jumperStateLabels.push(viewList[state].label);
            }
        }

        that.callRootMethod('toggleJumpList', jumperStates);
        that.runDigest();
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
        console.warn('cardSwipeDebug: ', that.cardSwipeDebug);
    };

    this.showingTags = false;

    this.toggleEditorMode = function() {
        that.toggleFun('editorModeEnabled', true);

    };


    this.toggleLanguageTags = function() {
        that.showingTags = !that.showingTags;
        that.callRootMethod('toggleLanguageTags');
        that.runDigest();
    };

    this.setLanguage = function(langCode) {
        console.log('select language requested: ', langCode);
        that.callRootMethod('switchLanguage', langCode);
        that.runDigest();
    };


    this.toggleNoCheckIns = function() {
        that.toggleFun('noCheckInsDebugger');
        that.runDigest();
    };

    this.toggleFun = function(prop, editor) {
        var el = angular.element('#header');

        if (el) {
            var enabled = el.scope().$parent.zestStationData[prop];

            if (enabled === 'true') {
                angular.element('#header').scope().$parent.zestStationData[prop] = 'false';
                if (editor) {
                    angular.element('body').scope().cls = { editor: 'false' };
                }
            } else {
                angular.element('#header').scope().$parent.zestStationData[prop] = 'true';
                if (editor) {
                    angular.element('body').scope().cls = { editor: 'true' };
                }
            }
            angular.element('#header').scope()
                .$apply();

        }
        that.runDigest();
    };


};

if (jQuery && $) {
    // for zest station text editor and jquery keyboard plugin, we'll need to get the cursor position
    // to replace spacing (spacebar) requests from the jquery keyboard to insert where the user cursor current is at. 
    // this is a good cross browser solution as of may/2017, verified in firefox, chrome, and chromium
    (function($) {
        $.fn.getCursorPosition = function() {
            var input = this.get(0);

            if (!input) {
                return;
            } // No (input) element found
            if ('selectionStart' in input) {
                // Standard-compliant browsers
                return input.selectionStart;
            } else if (document.selection) {
                // IE
                input.focus();
                var sel = document.selection.createRange();
                var selLen = document.selection.createRange().text.length;

                sel.moveStart('character', -input.value.length);
                return sel.text.length - selLen;
            }
        };
    })(jQuery);
}


zestSntApp = new GlobalZestStationApp();
sntapp = zestSntApp;

sntZestStation.controller('rootController', ['$scope',
    function($scope) {

    }
]);
