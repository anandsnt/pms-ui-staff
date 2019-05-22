// Use only codes required for initial  setup like 
// setting hotel settins, kiosk settings and workstation settings
// back button + home button listening functions 
// clickedOnBackButton  and clickedOnCloseButton
// Move other codes to corresponding controllers
// theme based actions are in zsThemeActionsCtrl

sntZestStation.controller('zsRootCtrl', [
    '$scope',
    'zsEventConstants',
    '$state', 'zsGeneralSrv', 'zsPaymentSrv', '$rootScope', 'ngDialog', '$sce',
    'zsUtilitySrv', '$translate', 'zsHotelDetailsSrv', 'cssMappings', 'hotelTranslations', 'configurableImagesData', 
    'zestStationSettings', '$timeout', 'zsModeConstants', 'hotelTimeData', 'hotelLanguages', '$filter', '$log', '$window', 'languages', 'defaultTranslations', '$controller', 'sntActivity', 'sntIDCollectionUtilsSrv',
    function($scope,
		zsEventConstants,
		$state,
		zsGeneralSrv,
        zsPaymentSrv,
		$rootScope,
		ngDialog,
		$sce,
		zsUtilitySrv,
		$translate,
		zsHotelDetailsSrv,
		cssMappings,
        hotelTranslations,
        configurableImagesData,
		zestStationSettings,
		$timeout,
		zsModeConstants,
		hotelTimeData,
        hotelLanguages,
		$filter,
        $log,
        $window,
        languages,
        defaultTranslations,
        $controller,
        sntActivity,
        sntIDCollectionUtilsSrv
        ) {

        // in order to prevent url change or fresh url entering with states
        BaseCtrl.call(this, $scope);

        $scope.zestImages = configurableImagesData.configurable_images || {};
        // set degfault as ''
        _.each(Object.keys($scope.zestImages), function(key) {
            if (!$scope.zestImages[key]) {
                $scope.zestImages[key] = '';
            }
        });

        $scope.cssMappings = cssMappings;
        $scope.inElectron = false;

        $scope.$on('GENERAL_ERROR', function() {
            // resolve an issue where (if no workstation assigned, or the workstation was deleted, 
            //   instead of staying at OOS, its going to speak to staff page)
            if ($state.current.name !== 'zest_station.outOfService') {
                $state.go('zest_station.speakToStaff');    
            }
            
        });

        $scope.trustAsHtml = function(string) {
            return $sce.trustAsHtml(string);
        };
		/**
		 * events for showing/hiding the back button and close button
		 * @param  {[type]} event
		 * @return {[type]} 
		 */
        $scope.$on(zsEventConstants.SHOW_BACK_BUTTON, function() {
            $scope.hideBackButton = false;
        });
        $scope.$on(zsEventConstants.HIDE_BACK_BUTTON, function() {
            $scope.hideBackButton = true;
        });
        $scope.$on(zsEventConstants.SHOW_CLOSE_BUTTON, function() {
            $scope.hideCloseButton = false;
        });
        $scope.$on(zsEventConstants.HIDE_CLOSE_BUTTON, function() {
            $scope.hideCloseButton = true;
        });

		/**
		 * event for child controllers to show/hide loader
		 * @return {undefined}
		 */
        $scope.$on(zsEventConstants.SHOW_LOADER, function() {
            $rootScope.hasLoader = true;
        });
        $scope.$on(zsEventConstants.HIDE_LOADER, function() {
            $rootScope.hasLoader = false;
        });

        $scope.startActivity = function (activity) {
            sntActivity.start(activity);
        };

        $scope.stopActivity = function (activity) {
            sntActivity.stop(activity);
        };


        $scope.callBlurEventForIpad = function() {
			// need to check if its ipad here too as it 
			// will be called from multiple areas
            if ($scope.isIpad) {
                document.activeElement.blur();
                $('input').blur();
            }
        };
		/*
		 * to run angular digest loop,
		 * will check if it is not running
		 * return - None
		 */
        $scope.runDigestCycle = function() {
            if (!$scope.$$phase) {
                $scope.$digest();
            }
        };
		// used for making keys, checking if there is text in the locale, to hide/show the key #, 
		// can be moved to other controllers if this doesnt make sense here, just see there are 3x views with the UNO_ and DOS_KEY tags
        $scope.isEmpty = function(value) {
            if (!value) {
                return true;
            }
            return $filter('translate')(value) === '';
        };

        var setupLanguageTranslations = function() {

            if (hotelLanguages.languages.length > 0) {
                var codeForLang, locales = zsGeneralSrv.refToLatestPulledTranslations;

                $scope.tagInEdit = {
                    language: {}// each lang code will return have tags with values
                };

                for (var i in languages.languages) {
                    codeForLang = languages.languages[i].code;
                    if (locales[codeForLang]) {
                        $scope.tagInEdit.language[codeForLang] = locales[codeForLang];
                    }
                }
            }
        };

        $scope.getTagValue = function(tag) {
            var currentLanguageCode = $scope.currentLanguageCode;

            // check if the tag is present in the translation file,
            // if not present use the default text in the master translation file.
            if ($scope.tagInEdit.language[currentLanguageCode] && !_.isUndefined($scope.tagInEdit.language[currentLanguageCode][tag])) {
                return $scope.tagInEdit.language[currentLanguageCode][tag];
            } 
            // return defaultTranslations[tag];
            // Showing default tags are causing issues like when some one edits any tags
            // in admin leaving other tags are empty. So will revert this logic to what it was before.
            return '';
        };

		/**
		 * [navToPrev and close button description]
		 * @return {[type]} [description]
		 */
        $scope.clickedOnBackButton = function() {
            var currentState = $state.current.name;
            
            $scope.trackEvent(currentState, 'clicked_back_button');
            $scope.$broadcast(zsEventConstants.CLICKED_ON_BACK_BUTTON);
        };
        $scope.clickedOnCloseButton = function() {
            var currentState = $state.current.name;

            $scope.trackEvent(currentState, 'clicked_close_button');
            $scope.$broadcast('CLICKED_ON_CANCEL_BUTTON');
            $state.go('zest_station.home');
            if ($scope.zestStationData.paymentGateway === 'MLI' && $scope.zestStationData.ccReader === 'local') {
                $scope.$emit('STOP_OBSERVE_FOR_SWIPE');
            }
        };
        $scope.talkToStaff = function() {
            var currentState = $state.current.name;

            $scope.trackEvent(currentState, 'clicked_talk_to_staff');
            $state.go('zest_station.speakToStaff');
        };

		/**
		 * [returnDateObjBasedOnDateFormat description]
		 * @param  {[type]} dateString [description]
		 * @return {[type]}            [description]
		 */
        $scope.returnDateObjBasedOnDateFormat = function(dateString) {
            if (typeof dateString !== 'undefined') {
                return returnUnformatedDateObj(dateString, $scope.zestStationData.hotelDateFormat);
            } 
            return dateString;
            
        };

		/**
		 * Other events
		 */
        $scope.$on(zsEventConstants.PUT_OOS, function() {
            if ($state.current.name !== 'zest_station.admin') {
                $scope.hideKeyboardIfUp();
                $state.go('zest_station.outOfService');
            }
        });

        $scope.softResetCount = 0;
        $scope.manual_refresh_requested = false;
        
        $scope.softReset = function() {
            // when user is at the admin screen, if they tap the Logo 5x times quickly, it 
            // initiates a soft-reset, this will be helpful in quickly testing or getting new settings to the device(s)
            var currentState = $state.current.name;
          
            $scope.softResetCount++;
            if (currentState === 'zest_station.admin') {
                
                if ($scope.softResetCount >= 5) {
                    if (!$scope.manual_refresh_requested) {
                        // get a more accurate count of refresh requests
                        $scope.trackEvent(currentState, 'manual_refresh_requested');    
                        $scope.manual_refresh_requested = true;

                        $scope.hasLoader = true;
                        // quick loading animation so user can see request to refresh was made
                        $timeout(function() {
                            location.reload(true);
                        }, 500);
                        
                    }
                }  
            }

            if ($scope.softResetCount == 2) {
                $timeout(function() {
                    if ($scope.softResetCount == 2) {
                        // when in a local testing environment, we should be able to test all hotel themes
                        // a bit faster, to help with this~
                        // *activate themeSwitcher (showTemplateList) on Ipad by double-tapping the logo @ admin,
                        // then, at any screen swipe the icon up or down to change the hotel theme
                        // !! IMPORTANT !! -> ONLY ALLOW IN DEVELOPMENT ENVIRONMENT, NOT for production
                        if (!$scope.inProd()) { // ONLY IN DEVELOPMENT ENVIRONMENT !! IMPORTANT !!
                            initThemeTemplateList();
                        }

                    }
                }, 750);
            } else if ($scope.softResetCount == 3) {
                $timeout(function() {
                    if ($scope.softResetCount == 3) {
                        // when in a local testing environment, we should be able to test all hotel themes
                        // a bit faster, to help with this~
                        // *activate themeSwitcher (showTemplateList) on Ipad by double-tapping the logo @ admin,
                        // then, at any screen swipe the icon up or down to change the hotel theme
                        // !! IMPORTANT !! -> ONLY ALLOW IN DEVELOPMENT ENVIRONMENT, NOT for production
                        if (!$scope.inProd()) { // ONLY IN DEVELOPMENT ENVIRONMENT !! IMPORTANT !!
                            zestSntApp.getStateList();// toggle jump list
                        }

                    }
                }, 750);
            }

            $timeout(function() {
                $scope.softResetCount = 0;
            }, 2200);
        };
        $scope.themeTemplateList = [];
        var initThemeTemplateList = function() {
            $scope.themeTemplateList = [];
            for (var propertyName in $scope.cssMappings) {
                $scope.themeTemplateList.push({
                    'name': propertyName
                });
            }
            // sorted list to find themes easier
            $scope.themeTemplateList.sort(function(a, b) {
                var nameA = a.name.toLowerCase(), 
                    nameB = b.name.toLowerCase();

                if (nameA < nameB) // sort string ascending
                    {return -1;} 
                if (nameA > nameB)
                    {return 1;}
                return 0; // default return value (no sorting)
            });


            $scope.zestStationData.showTemplateList = true;
        };

        $scope.sonicTestTemplatesCount = 0;
        $scope.selectThemeFromTemplateList = function(theme, sonicTesting, themeToTest) {
            var totalTemplates = $scope.themeTemplateList.length;
            /*
                Sonic Testing: loop through all the themes for the current page,
                good for verifying changes applied to all themes without having to 
                press/switch each theme manually
             */
            if (theme === 'sonic' && $scope.softResetCount === 0) {

                $scope.zestStationData.showTemplateList = false;
                if (!sonicTesting) {
                    $scope.sonicTestTemplatesCount = 0;    
                }
                if ($scope.sonicTestTemplatesCount < totalTemplates) {
                   
                    
                    $scope.resetTime();
                    $timeout(function() {
                        themeToTest = $scope.themeTemplateList[$scope.sonicTestTemplatesCount].name;
                        $scope.sonicTestTemplatesCount++;
                        $scope.selectThemeFromTemplateList('sonic', true, themeToTest);
                        $scope.quickSetHotelTheme(themeToTest);
                    }, 2500);
                }


            } else {
                $scope.zestStationData.showTemplateList = false;
                $scope.quickSetHotelTheme(theme);
            }


        }; 


        $scope.adminBtnPress = 0;
        $scope.goToAdmin = function() {
            if ($state.current.name === 'zest_station.admin' && !$scope.inProd()) {
                $scope.adminBtnPress++;
                $timeout(function() {
                    $scope.adminBtnPress = 0;
                }, 2000);
            } else {
                $scope.adminBtnPress = 0;
                $scope.zestStationData.fromAdminButton = true;
                $state.go('zest_station.admin');                
            }
        };

		// check if navigator is iPad
        var ipadOrIphone = function() {
            if ((navigator.userAgent.match(/iPad/i) !== null || navigator.userAgent.match(/iPhone/i) !== null ||
                navigator.userAgent.match(/Android/i) !== null) !== true) {
                return false;
            } else if (navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/Android/i)) {
                return true;
            }
        };

        var iphoneOrIpad = ipadOrIphone();

		// $scope.isIpad = (navigator.userAgent.match(/iPad/i) !== null || navigator.userAgent.match(/iPhone/i) !== null) && window.cordova;
        $scope.isIpad = iphoneOrIpad;
		/**
		 * This is workaround till we find how to detect if app
		 *  is invoked from chrome app, we will be hidding this tag from chrome app and
		 *  checking that to distinguish if app was launched using chrome app or not 
		 * */
         // CheckIfItsChromeApp

        (function() {
            $scope.inChromeApp = $('#hideFromChromeApp').css('visibility') === 'hidden';
            if (!$scope.inChromeApp) {
                try {   
                    $scope.inChromeApp = localStorage['roverInApp'] === 'true';
                } catch (err) {
                    $log.warn(err);
                }   
            }
                
            $log.info(':: is in chrome app ->' + $scope.inChromeApp);
        }());
		/**
		 * This fetches hotel admin settings
		 * */
        var fetchHotelSettings = function() {
            var onSuccess = function(data) {
                $scope.zestStationData.hotelSettings = data;
                $scope.zestStationData.hotelTermsAndConditions = data.terms_and_conditions;
                $scope.zestStationData.currencySymbol = data.currency.symbol;
                $scope.zestStationData.isHourlyRateOn = data.is_hourly_rate_on;
                $scope.zestStationData.paymentGateway = data.payment_gateway;
                $scope.zestStationData.mliEmvEnabled = data.mli_emv_enabled || false;
                $scope.zestStationData.hotelDateFormat = data.date_format ? data.date_format.value : 'DD-MM-YYYY';
                $rootScope.emvTimeout = $scope.zestStationData.hotelSettings.emv_timeout ? $scope.zestStationData.hotelSettings.emv_timeout : 60;
                $scope.zestStationData.mliMerchantId = data.mli_merchant_id;
                $scope.zestStationData.wsCCSwipeUrl = data.cc_swipe_listening_url;
                $scope.zestStationData.wsCCSwipePort = data.cc_swipe_listening_port;
                configureSwipeSettings();
                getAdminWorkStations();
                // create a websocket obj
                $scope.socketOperator = new webSocketOperations(socketOpenedSuccess, socketOpenedFailed, socketActions, $scope.zestStationData.wsCCSwipeUrl, $scope.zestStationData.wsCCSwipePort);
            };
            var onFailure = function() {
                $log.log('unable to fetch hotel settings');
                $scope.addReasonToOOSLog('GET_CONFIGURATION_FAILED');
                $scope.$emit(zsEventConstants.PUT_OOS);
            };
            var options = {
                params: {},
                successCallBack: onSuccess,
                failureCallBack: onFailure
            };

            $scope.callAPI(zsGeneralSrv.fetchHotelSettings, options);
        };
        var configureSwipeSettings = function() {
			// (remote, websocket, local)
			//
			// local:  Infinea/Ingenico
			// remote:  Ving, Salto, Saflok
			// websocket:  Atlas / Sankyo

            $scope.zestStationData.ccReader = 'local'; // default to local
            $scope.zestStationData.keyWriter = 'local';

            var key_method = $scope.zestStationData.kiosk_key_creation_method;

            if (key_method === 'ingenico_infinea_key') {
                $scope.zestStationData.keyWriter = 'local';
            } else if (key_method === 'remote_encoding') {
                $scope.zestStationData.keyWriter = 'remote';
            } else { // sankyo_websocket
                $scope.zestStationData.keyWriter = 'websocket';
            }

            var ccReader = $scope.zestStationData.kiosk_cc_entry_method;

            if (ccReader === 'six_pay') {
                $scope.zestStationData.ccReader = 'six_pay';
            } else if (ccReader === 'ingenico_infinea') {
                $scope.zestStationData.ccReader = 'local'; // mli + local - ingenico/infinea
            } else { // sankyo_websocket
                $scope.zestStationData.ccReader = 'websocket';
            }
            $scope.$broadcast('changeIconsBasedOnHotelSetting');
        };

        $scope.writeLocally = function() {
            return $scope.zestStationData.keyWriter === 'local';
        };

        $scope.inDemoMode = function() {
            return $scope.zestStationData.demoModeEnabled === 'true';
        };

        $scope.usingFakeReservation = function() {
            if ($scope.zestStationData.fakeReservation === 'true') {
                $log.warn('using demo reservation');
                return true;
            }
            return false;
        };

        var resetJumpGallerySettings = function() {
            $scope.jumperData.invalidGalleryImages = [];// need to clear this for screen jumper to work properly with theme switching
            $scope.jumpGalleryOn = false;
        };

        $scope.useNavIcons = true;

        $scope.$on('DONT_USE_NAV_ICONS', function() {
            $scope.useNavIcons = false;
        });

        $(window).resize(function() {
			// restrict keyboard if screen is resized
			// to lower height
            if (window.innerHeight < 700) {
                $scope.hideKeyboardIfUp();
                $scope.runDigestCycle();
            }
        });


        $scope.showKeyboardOnInput = function() {
			// restrict keyboard if screen is resized
			// to lower height
            if (window.innerHeight < 700) {
                return;
            }
            var frameBody = $('#booking_iframe').contents().find('body');

            frameBody.focus(function() {
                $log.log('iframe focus');
            });
        };
        $scope.hideKeyboardIfUp = function() {
            var focused = $('#' + $scope.lastKeyboardId);

            if ($(focused)) {
                if ($(focused).getkeyboard()) {
                    if ($(focused).getkeyboard().isOpen) {
                        try {
                            $(focused).getkeyboard().accept(true);
                            
                        } catch (err) {
                            $log.warn($(focused).getkeyboard());
                        }

                    }
                }
                scrollContentsDown();
            }
        };
        $scope.showOnScreenKeyboard = function(id, scrollUp) {
            // in console, allow debugging to test out keyboard in any browser
            if (zestSntApp.virtualKeyBoardEnabled && id) {
                $scope.lastKeyboardId = id;
                scrollContentsUpIfNeeded(scrollUp);
                new initScreenKeyboardListener('station', id, true, $scope.resetTime); // on change event fire reset time
            } else {
                // restrict keyboard if screen is resized
                // to lower height
                if (window.innerHeight < 700) {
                    return;
                }
                $scope.lastKeyboardId = id;
                // pull up the virtual keyboard (snt) theme... if chrome & fullscreen
                var isTouchDevice = 'ontouchstart' in window,
                    onWindowsDevice = window.navigator.userAgent.toLowerCase().indexOf('window') !== -1,
                    themeUsesKeyboard = $scope.theme === 'yotel' || !$scope.theme;

                var shouldShowKeyboard = ($scope.inChromeApp || $scope.inElectron) && onWindowsDevice && isTouchDevice && themeUsesKeyboard;
            
                if (shouldShowKeyboard && id) {
                    scrollContentsUpIfNeeded(scrollUp);
                    new initScreenKeyboardListener('station', id, true, $scope.resetTime);
                }
            }
        };

        $scope.jumperData = {
            'viewJumpFilter': '',
            'invalidGalleryImages': []
        };

        $scope.galleryIconInvalid = function(icon) {
            if ($scope.jumperData.invalidGalleryImages.indexOf(icon) !== -1) {
                return true;
            }
            return false;
        };

        $scope.showJumperItem = function(view) {
            var viewJumpFilter = $scope.jumperData.viewJumpFilter.toLowerCase(),
                description = view.description ? view.description.toLowerCase() : '',
                label = view.label ? view.label.toLowerCase() : '';

            // to restrict some jumper views until functionality is completed
            if (view.sntOnly && $scope.zestStationData.theme !== 'snt') {
                return false;
            }

            if (viewJumpFilter === '' || label.indexOf(viewJumpFilter) !== -1 || description.indexOf(viewJumpFilter) !== -1) {
                return true;
            }
            // if the view object has any Tags (like meta tags) check those
            if (view.tags) {
                for (var i in view.tags) {
                    if (view.tags[i].toLowerCase().indexOf(viewJumpFilter) !== -1) {
                        return true;
                    }
                }
            }

            // If one of its Modes are showing, show the 'category header'
            // ie. if showing (Pickup Keys) Key 1 of 2 Success..then show the header, Pickup Keys
            if (view.modes) {
                for (var m in view.modes) {
                    if ($scope.showJumperItem(view.modes[m])) {
                        return true;
                    }
                }
            }

            return false;
        };

        $scope.jumpTo = function(state, isMode, selectedMode) {
            if (state.modes && !isMode && !state.placeholderData) {// do nothing if isMode==false, this is a header
                return;
            }
            var params = {};

            if (isMode || state.placeholderData) {
                params = {
                    'isQuickJump': true, 
                    'quickJumpMode': selectedMode
                };
            }
            $state.go(state.name, params);
        };

        $scope.quickSetHotelTheme = function(theme) {
            $scope.$broadcast('QUICK_SET_HOTEL_THEME', theme);
            resetJumpGallerySettings();
        };
        // allows to toggle language tags via console/chrome extension
        $scope.toggleLanguageTags = function() {
            $scope.$broadcast('TOGGLE_LANGUAGE_TAGS');
        };
        $scope.showJumpList = false;
        $scope.toggleJumperMin = function() {
            // minimize / maximize the jumper using an on-screen handle
            $scope.zestStationData.jumperMinimized = !$scope.zestStationData.jumperMinimized;
        };
        
        $scope.jumpList = [];

        $scope.toggleJumpList = function(list) {
            $scope.jumperData.viewJumpFilter = '';
            $scope.showJumpList = !$scope.showJumpList;
            $scope.jumpList = list;
            if ($scope.showJumpList) {
                $scope.zestStationData.jumperMinimized = false;
                // on-showing of the jump list, focus for key input and listen for ESC key to close the window
                $timeout(function() {
                    $('#jumperFilter').focus();
                    $('#jumperFilter').on('keydown', function(event) {
                        if (event.keyCode === 27) { // escape key
                            $scope.showJumpList = false;
                            $scope.runDigestCycle();
                            $( '#jumperFilter').unbind( 'keydown' );
                        } 
                    });
                }, 500);
                
            }
            $scope.runDigestCycle();
        };
        $scope.jumpGalleryOn = false;
        $scope.jumpGalleryIconPath = '';
        $scope.toggleJumpListGallery = function() {
            $scope.jumpGalleryOn = !$scope.jumpGalleryOn;
        };

        // for chrome extension or console switching of languages
        $scope.switchLanguage = function(langCode) {
            $scope.languageCodeSelected(langCode);// keep this here for switching languages while editing text in editor mode

            if ($state.current.name === 'zest_station.home') {
                $scope.$broadcast('SWITCH_LANGUAGE', langCode);
            } else {
                $translate.use(langCode);
                $timeout(function() {
                    $scope.$digest();
                }, 100);
            }
        };

        $scope.languageCodeSelected = function(langCode) {
            $scope.currentLanguageCode = langCode;

        };


        $scope.saveLanguageEditorChanges = function(tag, newValueForText, skipSaving, keepShowingTag) {
            var langCode = $scope.currentLanguageCode;

            var langObj = {}, // zsGeneralSrv.languageJSONs[langCode],
                langName = zsGeneralSrv.langName[langCode];

            // save Just the (tag + value), for fastest Api call
            langObj[tag] = newValueForText;
                
            var encoded = 'data:application/json;base64,' + window.btoa(unescape(encodeURIComponent(JSON.stringify(langObj))));

            var onSuccess = function() {
                $scope.$emit('hideLoader');
                $log.info('Success Save Language text update ');
                
            };
            var onFail = function(response) {
                $scope.$emit('hideLoader');
                $log.warn('Failure, Save Language text update failed: ', response);
                // TODO: need to somehow alert user save failed, ie. alert('Saving failed, please try again later'), or other popup
            };
            var options = {
                params: {
                    'kiosk': {
                        'hotel_id': $scope.zestStationData.hotel_id,
                        'zest_lang': {}
                    },
                    // these params (below) get removed by service controller before api call
                    'langCode': langCode,
                    'newValueForText': newValueForText,
                    'tag': tag,
                    'keepShowingTag': keepShowingTag ? keepShowingTag : false

                },
                successCallBack: onSuccess,
                failureCallBack: onFail,
                'loader': 'none'
            };

            if (skipSaving) {
                // locale sync of Locale
                zsGeneralSrv.syncTranslationText(langCode, newValueForText, tag);

            } else {
                // use the currently selected language for saving the language text
                options.params.kiosk.zest_lang[langName + '_translations_file'] = encoded;
                options.params.kiosk.zest_lang[langName + '_translations_file_updated'] = true;

                $scope.callAPI(zsGeneralSrv.updateLanguageTranslationText, options);
            }


        };
		/**
		 * SVGs are ng-included inside HTML
		 **/

        $scope.showScreenIcons = function() { // currenly we will use this for yotel to detect if screen icons are needed
			// also attaching this to navigation, yotel has text back & cancel, instead of svg icons for back and close;
            if ($scope.zestStationData.theme === 'yotel') {
                return true;
            }
            return false;
        };

        $scope.$on('RUN_APPLY', function() {
            $scope.$apply();
            $scope.$digest();
        });

        var reconnectToWebSocket = function() {
            $log.log(':: attempting websocket re-connect ::');
            var socketReady = $scope.socketOperator.returnWebSocketObject().readyState === 1;

            if (!socketReady) {
                $scope.connectToWebSocket();
            }
        };

		/** ******************************************************************************
		 *  User activity timer
		 *  starts here
		 ********************************************************************************/
        var setAUpIdleTimer = function() {
            var userInActivityTimeInSeconds = 0,
                workstationTimer = 0;

            $scope.zestStationData.timeOut = false;

            $scope.resetTime = function() {
                userInActivityTimeInSeconds = 0;
                $scope.zestStationData.timeOut = false;
            };
            $scope.setTimerDebuggerOptions = function(timeUntilRefreshCheck, timeUntilLanguageResetCheck, userInActivityTimeInHomeScreenInSeconds, refreshStationTimer) {
                $scope.zestStationData.timeUntilRefreshCheck = timeUntilRefreshCheck;
                $scope.zestStationData.timeUntilLanguageResetCheck = timeUntilLanguageResetCheck;
                $scope.zestStationData.userInActivityTimeInHomeScreenInSeconds = userInActivityTimeInHomeScreenInSeconds;
                $scope.zestStationData.refreshStationTimer = refreshStationTimer;

                $scope.runDigestCycle();
            };

            // return true/false if user is in the process of dispensing key
            // -CICO-36896- if user is dispensing key, the API may take some time depending
            // on network / key-server conditions, we will rely on the API timeout to fail out
            // if taking too long
            var isDispensingKey = function() {
                return $scope.zestStationData.makingKeyInProgress;
            };

            function increment() {
                // pause timers when editor mode is enabled, so user doesnt get moved from the screen, 
                // reflect in diagnostics with the editorModeEnabled attribute
                if ($scope.zestStationData.editorModeEnabled === 'true') {

                    if (zestSntApp.timeDebugger) {
                        $scope.zestStationData.timeDebugger = 'true';
                    } else {
                        $scope.zestStationData.timeDebugger = 'false';
                    }

                    return;
                }

                var currentState = $state.current.name,
                    idlePopupTime = $scope.zestStationData.idle_timer.prompt,
                    idleToHomeTime = $scope.zestStationData.idle_timer.max,
                    idleTimerEnabled = $scope.zestStationData.idle_timer.enabled,
                    getWorkstationsAtTime = 120; // refresh workstation data every 120seconds
                    // timeUntilRefreshCheck = 30; // check if workstation requires refresh, default every 30s

				/**
				 * [CheckForWorkStationStatusContinously description]
				 *  Check if admin has set back the status of the
				 *  selected workstation to in order
				 */
                if ($scope.workstationTimerWhenOffline) {
                    // set the workstation time to count down with the settings 
                    // from hotel admin > station > general > Offline Re-Connect Settings
                    workstationTimer = getWorkstationsAtTime - $scope.zestStationData.kiosk_offline_reconnect_time;
                    $scope.workstationTimerWhenOffline = false;
                }
                
                workstationTimer = workstationTimer + 1;
				// Use Debugger Time If Enabled
                if (zestSntApp.timeDebugger) {
                    $scope.zestStationData.timeDebugger = 'true';
                    if (zestSntApp.workstationFetchTimer > 0) {
                        getWorkstationsAtTime = zestSntApp.workstationFetchTimer;
                    }
                    if (zestSntApp.idlePopupTimer > 0) {
                        idlePopupTime = zestSntApp.idlePopupTimer;
                    }
                    if (zestSntApp.backToHomeTimer > 0) {
                        idleToHomeTime = zestSntApp.backToHomeTimer;
                    }
                    $scope.zestStationData.idleToHomeTime = idleToHomeTime;
                    $scope.zestStationData.idlePopupTime = idlePopupTime;
                    $scope.zestStationData.userInActivityTimeInSeconds = userInActivityTimeInSeconds;
                    $scope.zestStationData.getWorkstationsAtTime = getWorkstationsAtTime;
                    if (zestSntApp.timeDebugger) {
                        // workstation fetch triggered from the user (via console or diagnostics menu) reset time
                        if ($scope.zestStationData.workstationTimerManualTrigger) {
                            workstationTimer = $scope.zestStationData.getWorkstationsAtTime;
                            $scope.zestStationData.workstationTimerManualTrigger = false;
                        } 
                        $scope.zestStationData.workstationTimer = workstationTimer;    
                        
                    }
                    $scope.runDigestCycle();
                } else {
                    getWorkstationsAtTime = 120;
                    $scope.zestStationData.timeDebugger = 'false';
                }

                if (workstationTimer >= getWorkstationsAtTime) {
                    $scope.trackEvent('health_check', 'status_update', currentState, currentState);
                    getAdminWorkStations(); // fetch workstations with latest status details
                    if ($scope.inChromeApp) {
                        reconnectToWebSocket();// if disconnected, will attempt to re-connect to the websocket
                    }
                    workstationTimer = 0;
                    // $scope.trackEvent('health_check', 'status_update', currentState, currentState);
                    // track once a minute initially
                    
                }

				// the user inactivity actions do Not need be done when user is in 
				// home screen, admin screen, or OOS screen
				// include the states, which don't need the timeout to be handled 
				// in the below condition
                var ignoreTimeoutOnStates = ['zest_station.admin', 'zest_station.home', 'zest_station.outOfService'],
                    inAnIgnoreState = ignoreTimeoutOnStates.indexOf(currentState) !== -1;

                // If Editor Mode is enabled, the idle timer is disabled
                if (inAnIgnoreState) {
                    // in case station goes OOS or home During encoding due to User or other Error
                    $scope.zestStationData.makingKeyInProgress = false;
                }

                var currentlyDispensingKey = isDispensingKey();// see isDispensingKey() comments

                if (idleTimerEnabled === 'true' && !inAnIgnoreState && !currentlyDispensingKey) {
                    userInActivityTimeInSeconds = userInActivityTimeInSeconds + 1;

                    var creditCardUsingStates = ['zest_station.checkInSignature',
                        'zest_station.checkInCardSwipe',
                        'zest_station.payment',
                        'zest_station.pickUpKeyReservationSearch'
                    ];

					// when user activity is not recorded for more than idle_timer.prompt
					// time set in admin, display inactivity popup
                    if (userInActivityTimeInSeconds >= idlePopupTime) {
                        if (creditCardUsingStates.indexOf(currentState) > -1) {
                            $scope.$broadcast('USER_ACTIVITY_TIMEOUT');
                        } else {
                            // opens timeout popup w/ ng-class/css
                            $scope.zestStationData.timeOut = true;
                        }
                        $scope.runDigestCycle();
                        $scope.hideKeyboardIfUp();
                    }
					// when user activity is not recorded for more than idle_timer.max
					// time set in admin, got to home page
                    if (userInActivityTimeInSeconds >= idleToHomeTime && currentState !== 'zest_station.checkInSignature' && currentState !== 'zest_station.checkInCardSwipe') {
                        $scope.hideKeyboardIfUp();

                        $scope.trackEvent(currentState, 'timeout_to_home');

                        $state.go('zest_station.home');
                        $scope.runDigestCycle();
                    }
                }
                // else do nothing
                return;
            }

            setInterval(increment, 1000);
        };


		/** ******************************************************************************
		 *  User activity timer at home screen should trigger a refresh check periodically - 
		 *   -- fire events when kiosk is in-service and not in-use by guest.
		 *
		 *  Events include
		 *   *Refresh-workstation --> Triggered from Hotel Admin - interfaces - workstation > toggle (Refresh Station)
		 ********************************************************************************/
        $scope.checkIfWorkstationRefreshRequested = function() {
			// Workstation trigger for Refresh Station is set to TRUE, --Refresh Station at next (idle) opportunity--
            var station = $scope.getWorkStationSetting($rootScope.workstation_id);
			// send back to workstation that kiosk is being/has been refreshed 
			// --assumption is that two Zest Stations will be sharing a workstation, currently S69, that is not a logical setup

            if (station.refresh_station) {
                station.refresh_station = false; // only trigger once
				// update the workstation to reflect the refresh has taken place
				// call API to set workstation "station_refresh" to false, and note "last_refreshed"
                refreshInProgress(station);
				// -- CICO-35215 -just refreshes the browser, user should not have to re-login 
				//
				// --  this should refresh all settings and bring zest station up to the latest version
				// --  does not apply to refreshing the ChromeApp / iOS app versions... only the Zest Station content
            }
        };

        var refreshInProgress = function(station) {
            $log.log('Calling API to Reset (refresh_station) Flag for: ', station.name, ' - ', station.id);
            var onSuccess = function(response) {
                $log.info('Successful Refresh of Station Triggered, turning off (Workstation) Trigger ');
                initRefreshStation();
            };
            var onFail = function(response) {
                $log.warn('Manual Refresh Failed: ', response);
            };
            var options = {
                params: {
                    'out_of_order_msg': station.out_of_order_msg,
                    'emv_terminal_id': station.emv_terminal_id,
                    'default_key_encoder_id': station.key_encoder_id,
                    'refresh_station': false,
                    'is_out_of_order': station.is_out_of_order,
                    'identifier': station.station_identifier,
                    'name': station.name,
                    'rover_device_id': station.rover_device_id,
                    'id': station.id
                },
                successCallBack: onSuccess,
                failureCallBack: onFail,
                'loader': 'none'
            };

            $scope.callAPI(zsGeneralSrv.refreshWorkStationInitialized, options);
        };
        var initRefreshStation = function() {
            $log.warn(':: Refreshing Station ::');
            try {
                storage.setItem(refreshedKey, 'true');
            } catch (err) {
                $log.log(err);
            }
            location.reload(true);
        };
		/*
		 * [CheckForWorkStationStatusContinously description]
		 *  Check if admin has set back the status of the
		 *  selected workstation to in order
		 */
        var CheckForWorkStationStatusContinously = function() {
            $scope.$emit('FETCH_LATEST_WORK_STATIONS');
            $timeout(CheckForWorkStationStatusContinously, 120000);
        };
		/** ******************************************************************************
		 *  User activity timer
		 *  ends here
		 ********************************************************************************/


        $rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from) {// event, to, toParams, from, fromParams
            $scope.$broadcast('TOGGLE_LANGUAGE_TAGS', 'off');// fixes an issue where tags cannot be changed back after changing screens
            $scope.hideKeyboardIfUp();
            $log.info('\ngoing from----->' + from.name);
            $log.info('--with stateparams--');
            $log.info(toParams);
            $log.info('---');
            if (to.name === 'zest_station.home' || to.name === 'zest_station.outOfService') {
                $scope.resetTrackers();
                // turn OFF lights on state change and if turned ON
                if ($scope.zestStationData.kiosk_is_hue_active &&
                    $scope.socketOperator.returnWebSocketObject() &&
                    $scope.socketOperator.returnWebSocketObject().readyState === 1) {
                    $scope.turnOffLight();
                }
                if ($scope.trackEvent) {
                    $scope.trackEvent('health_check', 'status_update', from.name, to.name);
                }
                
            }
            $log.info('going to----->' + to.name);
            $scope.resetTime();
            // In some states the APIs are resloved in router, so till API is finshed the loader is to be shown
            // and on state change the loader is to be hidden
            $scope.$emit('hideLoader');
        });

        var fetchDeviceDetails = function(deviceId) {
            var options = {

                params: {
                    device_uid: deviceId,
                    service_application_name: 'Zest station handler'
                },
                successCallBack: function(response) {
                    if (response && response.is_logging_enabled) {
                        $scope.socketOperator.enableDeviceLogging();
                    }
                },
                failureCallBack: function () {
                  // Do nothing (Common API failure callback redirects station to the out of order state)
                },
                loader: 'none'
            };

            $scope.callAPI(zsGeneralSrv.getDeviceDetails, options);
        };


		/** ******************************************************************************
		 *   Websocket actions related to keycard lookup
		 *  starts here
		 ********************************************************************************/

        var printerErrorMapping = {
            23: 'PRINTER_ERROR_PRINTER_IS_OFFLINE',
            24: 'PRINTER_ERROR_PAPER_ROLL_IS_NEAR_EMPTY',
            25: 'PRINTER_ERROR_PRINTER_OUT_OF_ORDER',
            26: 'PRINTER_ERROR_PRINTER_ERROR',
            27: 'PRINTER_ERROR_UNABLE_TO_GET_PRINTER_STATUS',
            28: 'PRINTER_ERROR_UNABLE_TO_WRITE_TO_PRINTER_PORT',
            29: 'PRINTER_ERROR_PRINT_ERROR'
        };

        var socketActions = function(response) {
            var cmd = response.Command,
                msg = response.Message;
			// to delete after QA pass

            $log.info('Websocket:-> uid=' + response.UID + '--' + 'Websocket:-> response code:' + response.ResponseCode);
            $log.info('Websocket: msg ->' + msg + '--' + 'Websocket: Command ->' + cmd);

            if (response.RVCardReadPAN) {
                $scope.$broadcast('SWIPE_ACTION', response);
            } else if (response.Command === 'cmd_insert_key_card') {

				// check if the UID is valid
				// if so find reservation using that
                if (typeof response.UID !== 'undefined' && response.UID !== null) {
                    $scope.$broadcast('UID_FETCH_SUCCESS', {
                        'uid': response.UID,
                        'KeyCardData': response.KeyCardData
                    });
                } else {
                    $scope.$broadcast('UID_FETCH_FAILED');
                }
            } else if (response.Command === 'cmd_eject_key_card') {
				// ejectkey card callback
                if (response.ResponseCode === 19) {
					// key ejection failed
                    if (!$scope.zestStationData.keyCaptureDone) {
                        $state.go('zest_station.speakToStaff');
                    }
                } else {
                    $scope.zestStationData.keyCardInserted = false;
                }
            } else if (response.Command === 'cmd_capture_key_card') {
                if (response.ResponseCode === 0) {
                    $scope.zestStationData.keyCaptureDone = true;
                    $scope.zestStationData.keyCardInserted = false;
                } else {
					// capture failed
                    $state.go('zest_station.speakToStaff');
                }
            } else if (response.Command === 'cmd_dispense_key_card') {
                if (response.ResponseCode === 0) {
                    $scope.$broadcast('DISPENSE_SUCCESS', {
                        'cmd': response.Command,
                        'msg': response.Message
                    });
                } else if (response.ResponseCode === 14) {
                    $scope.$broadcast('DISPENSE_CARD_EMPTY');
                } else if (response.ResponseCode === 22) {
                    $scope.$broadcast('DISPENSE_FAILED_AS_GATE_IS_NOT_FREE');
                } else {
                    $scope.$broadcast('DISPENSE_FAILED');
                }
            } else if (response.Command === 'cmd_print_bill') {

                if (response.ResponseCode === 0) {
                    $scope.$broadcast('WS_PRINT_SUCCESS');
                } else {
                    var errorData = {
                        'error_message': printerErrorMapping[response.ResponseCode]
                    };

                    $scope.$broadcast('WS_PRINT_FAILED', errorData);
                }
            } 
            else if (response.Command === 'cmd_scan_passport' || response.Command === 'cmd_samsotech_scan_passport') {

                if (response.ResponseCode === 0) {
                    $scope.$broadcast('PASSPORT_SCAN_SUCCESS', response);
                } else {
                    $scope.$broadcast('PASSPORT_SCAN_FAILURE', response.ResponseCode);

                }
            }
            else if (response.Command === 'cmd_scan_qr_datalogic') {
                $scope.zestStationData.qrCodeScanning = false;
                // Ren-US$1349209--Websocket: Command ->cmd_scan_qr_datalogic
                $log.warn('got response');
                var str = msg;

                if (str.length > 0 && str.indexOf('$') !== -1) {
                    var res_id_arr = str.split('$');

                    $log.info(res_id_arr);
                    var reservation_id = res_id_arr[1];

                    $log.info('');
                    $log.info('[ ' + reservation_id + ' ]');
                    $log.info('');

                    $scope.$broadcast('QR_SCAN_SUCCESS', {
                        'reservation_id': reservation_id
                    });
                } else {
                    if (response.ResponseCode === 30) {
                        $log.info('code 30 - timeout, retry scan');
                        // ignore timeout, continue trying to scan
                        $scope.$broadcast('QR_SCAN_REATTEMPT');  
                    } else {
                        $log.warn('QR Code Invalid');
                        $scope.$broadcast('QR_SCAN_FAILED');   
                    }

                }
            } else if (response.Command === 'cmd_device_uid' && response.ResponseCode === 0 && response.Message) {
                fetchDeviceDetails(response.Message);
            }
        };

        var socketOpenedFailed = function() {
            $log.info('Websocket:-> socket connection failed');
            $scope.zestStationData.stationHandlerConnectedStatus = 'Not-Connected';
            $scope.$broadcast('SOCKET_FAILED');
            $scope.runDigestCycle();
            
        };

        var socketOpenedSuccess = function() {
            $log.info('Websocket:-> socket connected');
            $scope.zestStationData.stationHandlerConnectedStatus = 'Connected';
            $scope.runDigestCycle();
            $scope.socketOperator.fetchDeviceId();
            $scope.$broadcast('SOCKET_CONNECTED');
            if ($state.current.name === 'zest_station.home' || $state.current.name === 'zest_station.outOfService') {
                $timeout(function() {
                    $scope.turnOffLight();// turn off the light if it was previous turned ON..ie. device restarts after the light was turned on
                }, 500);
                

            }
        };

        $scope.connectToWebSocket = function() {
            if ($scope.zestStationData.stationHandlerConnectedStatus === 'Connecting...') {
                // if already connecting, do nothing (ie. if user double-clicks the refresh button, just handle once)
                return;
            }
            if ($scope.socketOperator) {
                // if socketOperator is already defined, it may have an open connection, close that first before reconnect
                $scope.socketOperator.closeWebSocket();
            }
            $timeout(function() {
                // show user activity 'connecting..' on admin screen
                $scope.zestStationData.stationHandlerConnectedStatus = 'Connecting...';
                $scope.runDigestCycle();
            }, 75);

            $timeout(function() {
                // give some time for old socket to close, show activity of re-connecting and visible UI transition to 'connected' status
                $scope.socketOperator = new webSocketOperations(socketOpenedSuccess, socketOpenedFailed, socketActions, $scope.zestStationData.wsCCSwipeUrl, $scope.zestStationData.wsCCSwipePort);
            }, 400);
        };

        $scope.$on('CONNECT_WEBSOCKET', function() {
            if (!$scope.isIpad) {
                $scope.connectToWebSocket();
            }

        });

        $scope.$on('EJECT_KEYCARD', function() {
            if ($scope.zestStationData.keyCardInserted) {
                $scope.socketOperator.EjectKeyCard();
            }
        });

        $scope.$on('CAPTURE_KEY_CARD', function() {
            if ($scope.zestStationData.keyCardInserted) {
                $scope.socketOperator.CaptureKeyCard();
            }
        });
		/** ******************************************************************************
		 *  Websocket actions related to keycard lookup
		 *  ends here
		 ********************************************************************************/

		/** ******************************************************************************
		 *  Chrome App Communication code 
		 *  ends here
		 ********************************************************************************/
        var onChromeAppResponse = function(response) {
            $log.log('msg from ChromeApp: ', response);

            if (response && response.qr_code) {
                $scope.$broadcast('QR_SCAN_SUCCESS', {
                    'reservation_id': response.reservation_id
                });
            }
        };

        $scope.chromeApp = new chromeApp(onChromeAppResponse, zestStationSettings.chrome_app_id);
        $scope.chromeExtensionListener = new chromeExtensionListener();
		/** ******************************************************************************
		 *  Chrome App Communication code  
		 *  ends here
		 ********************************************************************************/
		//
		// $scope.focusInputField is to set focus to an input field which will auto-prompt keyboard on chromeapp
		//
        $scope.focusInputField = function(elementId) {
            $timeout(function() {
                if (!$scope.isIpad) {
                    if (document.getElementById(elementId)) {// fixes an error that occurs from user clicking too early while screen initializing
                        document.getElementById(elementId).click();    
                    }
                } else {
                    $scope.callBlurEventForIpad();
                    if ($scope.zestStationData.autoIpadKeyboardEnabled) {
                        $timeout(function() {
                            document.getElementById(elementId).click(); 
                        }, 500);   
                    }
                    

                }
            }, 300);

        };

        $scope.navToHome = function() {
            $timeout(function() {
                $state.go('zest_station.home');
            }, 250); // use delay so user doesnt immediately click check-in/out icons on touchscreen devices
        };
		/** ******************************************************************************
		 *  Work station code  
		 *  starts here
		 ********************************************************************************/


        var getSavedWorkStationObj = function(stored_station_id) {
            var station;

            if ($scope.zestStationData.workstations && $scope.zestStationData.workstations.length > 0) {
                station = _.find($scope.zestStationData.workstations, function(station) {
                    return station.station_identifier === stored_station_id;
                });
                return station;
            }
            return null;
        };

        $scope.getStationIdFromName = function(name) {
            return name === '' ? null : _.find($scope.zestStationData.workstations, function(station) {
                return station.name === name;
            });
        };
        $scope.printer = {
            'name': ''
        };

        var getLocalWorkStation = function(id) {
            try {
                storedWorkStation = storage.getItem(workStationstorageKey);
            } catch (err) {
                $log.warn(err);
            }
			// find workstation with the local storage data or from last fetched
            var station;

            if (id) {
                station = $scope.getWorkStationSetting(id);
            } else {
                station = getSavedWorkStationObj(storedWorkStation);
            }

            if (typeof station !== typeof undefined) {
                return station;
            }
            return null;
        };

        var getSelectedPrinterFromLocalStorage = function() {
            var storedPrinter;

            try {
                storedPrinter = storage.getItem('snt_zs_printer');
            } catch (err) {
                $log.warn(err);
            }        
            if (storedPrinter) {
                $scope.zestStationData.defaultPrinter = storedPrinter;
            }
        };

        $scope.getWorkStationSetting = function(id) {
            if (zsGeneralSrv.last_workstation_set.work_stations) {
                for (var i in zsGeneralSrv.last_workstation_set.work_stations) {
                    if (zsGeneralSrv.last_workstation_set.work_stations[i].id === id) {
                        return zsGeneralSrv.last_workstation_set.work_stations[i];
                    }
                }
            }
            return {};
        };

        var workStationstorageKey = 'snt_zs_workstation',
            oosStorageKey = 'snt_zs_workstation.in_oos',
            oosStorageHistKey = 'snt_zs_workstation.oos_history',
            oosReasonKey = 'snt_zs_workstation.oos_reason',
            refreshedKey = 'snt_zs_workstation.recent_refresh',
            storage = localStorage,
            storedWorkStation = '',
            recently_refreshed,
            // remove (guest_id_scan_version, v1GuestIDScanning) refs after 3.0 release if v1 samsotech logic not needed
            guest_id_scan_version = 'guest_id_scan_version',
            v1GuestIDScanning;

        try {
            recently_refreshed = storage.getItem(refreshedKey);
            if (recently_refreshed == 'true') {
                recently_refreshed = true;
            } else {
                recently_refreshed = false;
            }

        } catch (err) {
            recently_refreshed = false;
            $log.log(err);
        }
        storage.setItem(refreshedKey, 'false');

        var cancelEmvActions = function() {
            if (($scope.zestStationData.paymentGateway === 'MLI' && $scope.zestStationData.mliEmvEnabled) ||
                $scope.zestStationData.paymentGateway === 'sixpayments') {
                var options = {
                    params: {
                        'hotel_id': $scope.zestStationData.hotel_id
                    },
                    'loader': 'none',
                    'failureCallBack': function() {
                        // do nothing
                    }
                };

                $scope.callAPI(zsPaymentSrv.cancelEMVActions, options);
            }
        };
        $scope.$on('CANCEL_EMV_ACTIONS', cancelEmvActions);
		/**
		 * [setWorkStationForAdmin description]
		 *  The workstation, status and oos reason are stored in
		 *  localstorage
		 */
        var setWorkStationForAdmin = function() {
			// work station , oos status, reason  etc are saved in local storage

			// find workstation with the local storage data
            var station = getLocalWorkStation();

            if (station === null) {
                $scope.zestStationData.set_workstation_id = '';
                $scope.zestStationData.key_encoder_id = '';
                $scope.zestStationData.workstationStatus = 'out-of-order';
                $scope.zestStationData.workstationOooReason = $filter('translate')('WORK_STATION_NOT_SELECTED');
                $scope.addReasonToOOSLog('WORK_STATION_NOT_SELECTED');
                // if no workstation is selected, go to admin directly
                $state.go('zest_station.admin');
            } else {
                $scope.workstation = {
                    'selected': station
                };
                getSelectedPrinterFromLocalStorage();
				// set work station id and status
                $scope.zestStationData.workstationName = station.name;
                $scope.zestStationData.set_workstation_id = $scope.getStationIdFromName(station.name).id;
                $rootScope.workstation_id = $scope.zestStationData.set_workstation_id;
                $scope.zestStationData.key_encoder_id = $scope.getStationIdFromName(station.name).key_encoder_id;
                var previousWorkStationStatus = angular.copy($scope.zestStationData.workstationStatus);
                
                $scope.zestStationData.workstationStatus = station.is_out_of_order ? 'out-of-order' : 'in-order';
                var newWorkStationStatus = angular.copy($scope.zestStationData.workstationStatus);
                
                // set the selected Workststaion's light ID
                $scope.zestStationData.selected_light_id = station.hue_light_id;
                $scope.setEncoderDiagnosticInfo();
                try {
                    $scope.zestStationData.workstationOooReason = storage.getItem(oosReasonKey);
                } catch (err) {
                    $log.warn(err);
                }

                if ($scope.zestStationData.isAdminFirstLogin) {
                    if (newWorkStationStatus === 'in-order') {
                        $scope.zestStationData.isAdminFirstLogin = false;
                        $state.go('zest_station.home');
                    } else {
                        // if the selected workstation status is out of order for first login, go to admin page
                        $state.go('zest_station.admin');
                    }
                } else if (previousWorkStationStatus === 'out-of-order' && newWorkStationStatus === 'in-order' && $state.current.name !== 'zest_station.admin' && $state.current.name === 'zest_station.outOfService') {
                    // if the selected workstation status changed to in order, go to home page
                    // had to add $state.current.name === 'zest_station.outOfService' , because this was forcing user to .home
                    // //when they were still going through the check-in flow when the workstations refreshed
                    // if the selected workstation status changed to in order, go to home page
                    $state.go('zest_station.home');
                } else if (newWorkStationStatus === 'out-of-order' && $state.current.name !== 'zest_station.admin') {
                    // if the selected workstation status is out of order and user is not in admin page
                    $state.go('zest_station.outOfService');
                } else if ($state.current.name === 'zest_station.outOfService' && newWorkStationStatus === 'in-order') {
                    $state.go('zest_station.home');
                } else {
                    return;
                }
                cancelEmvActions();
            }
        };
		/**
		 * [getAdminWorkStations description]
		 * @return {[type]} [description]
		 */
        $scope.workstationTimerWhenOffline = false;
        var getAdminWorkStations = function(workstationTimer) {
            var onSuccess = function(response) {
                $scope.zestStationData.workstations = response.work_stations;
                setWorkStationForAdmin();
                if ($state.current.name === 'zest_station.outOfService') {
					// when out of service, keep checking for updates to the workstation, but not as often (120s here vs 30s @ home screen)
                    $scope.checkIfWorkstationRefreshRequested();
                }
            };
            var onFail = function(response) {
                $log.warn('fetching workstation list failed:', response);
                if ($state.current.name === 'zest_station.home') {
                    $scope.$emit(zsEventConstants.PUT_OOS);
                }
                $scope.addReasonToOOSLog('GET_WORKSTATION_FAILED');

                // if (offline) / not connected to the internet, then fetch every 15s
                // by fast-forwarding the fetch timer to 105s (120 - 15)
                $scope.workstationTimerWhenOffline = true;
            };
            var options = {

                params: {
                    page: 1,
                    per_page: 100,
                    query: '',
                    sort_dir: true,
                    sort_field: 'name'
                },
                successCallBack: onSuccess,
                failureCallBack: onFail,
                'loader': 'none'
            };

            $scope.callAPI(zsGeneralSrv.fetchWorkStations, options);
        };

        $scope.keyEncoderInfo = [];
        var getKeyEncoderInfo = function() {
            var onSuccess = function(response) {
                if (response) {
                    $scope.keyEncoderInfo = response.results;
                    $scope.setEncoderDiagnosticInfo();
                }
            };
            var onFail = function(response) {
                $log.warn('failed to get key encoder info:', response);
                // dont go oos, the response data is currently used for info/debugging/testing purposes
            };

            var options = {
                params: {},
                successCallBack: onSuccess,
                failureCallBack: onFail,
                'loader': 'none'
            };

            $scope.callAPI(zsGeneralSrv.getKeyEncoderInfo, options);
        };

        $scope.setEncoderDiagnosticInfo = function(workstationName, key_encoder_id) {
            // when this method is called from adminctrl, it will pass the name + encoder id
            // when called without arguments, assume the zestStationData is set (ie. info is pulled from localstorage)
            if ($scope.zestStationData.workstationName || workstationName) {
                $scope.zestStationData.key_encoder_name = '';
                $scope.zestStationData.encoder_id = '';
                $scope.zestStationData.encoder_location = '';

                for (var i in $scope.keyEncoderInfo) {
                    // key_encoder_id passed from adminctrl when user is changing workstations and wants to see which encoder
                    // is being selected
                    if ($scope.keyEncoderInfo[i].id === $scope.zestStationData.key_encoder_id && typeof key_encoder_id === 'undefined' || key_encoder_id === $scope.keyEncoderInfo[i].id) {
                        $scope.zestStationData.key_encoder_name = $scope.keyEncoderInfo[i].description;
                        $scope.zestStationData.encoder_location = $scope.keyEncoderInfo[i].location;
                        $scope.zestStationData.encoder_id = $scope.keyEncoderInfo[i].encoder_id;
                    }
                }
            }
        };

		// store workstation status in localstorage
        var updateLocalStorage = function(oosReason, workstationStatus) {
            var selectedWorkStation = _.find($scope.zestStationData.workstations, function(workstation) {
                return workstation.id === $scope.zestStationData.set_workstation_id;
            });

            try {
				// set workstation in localstorage
                $log.log('set work station :--->' + selectedWorkStation.station_identifier);
                storage.setItem(workStationstorageKey, selectedWorkStation.station_identifier);
				// set workstation status in localstorage
                $log.info('set oos status :--->' + workstationStatus);
                storage.setItem(oosStorageKey, workstationStatus);
				// set workstation oos reason in localstorage
                $log.log('set workstation oos reason :--->' + oosReason);
                oosReason ? storage.setItem(oosReasonKey, oosReason) : '';
            } catch (err) {
                $log.warn(err);
            }
        };

        $scope.$on('PUSH_OOS_REASON', function(event, reason) {
            // 
            // push all logs available to localstorage
            // 
            var separator = '||';
            var reasonString = JSON.stringify(reason) + separator;

            try {
                var oosStorageHist = storage.getItem(oosStorageHistKey);

                oosStorageHist = (oosStorageHist) ? oosStorageHist += reasonString : reasonString;

                // keep in localstorage in case 
                // the station is offline and we need logs from when the device is offline or not reporting
                $scope.zestStationData.historicalOosReason = oosStorageHist;

                storage.setItem(oosStorageHistKey, oosStorageHist);

            } catch (err) {
                $log.warn(err);
            }

        });


		/** 
		 * work station status change event 
		 * This will be invoke everytime some actions
		 * like key card lookup, print etc fails
		 **/
        $scope.$on(zsEventConstants.UPDATE_LOCAL_STORAGE_FOR_WS, function(event, params) {

            var oosReason = params.reason;
            var workstationStatus = params.status;

            $log.info('update to:  ', workstationStatus);

            $scope.zestStationData.workstationStatus = workstationStatus;
			// update local storage
            updateLocalStorage(oosReason, workstationStatus);

			// update workstation status with oos reason
            if ($scope.zestStationData.workstationStatus === 'out-of-order') {
                var options = {
                    params: {
                        'oo_status': true,
                        'oo_reason': oosReason,
                        'id': $scope.zestStationData.set_workstation_id
                    }
                };

                if ($state.current.name !== 'zest_station.admin') {
                    $state.go('zest_station.outOfService');
                }
                $scope.callAPI(zsGeneralSrv.updateWorkStationOos, options);
            } else {
				// Make work stataion back to in order
                var options = {
                    params: {
                        'oo_status': false,
                        'id': $scope.zestStationData.set_workstation_id
                    }
                };

                $scope.callAPI(zsGeneralSrv.updateWorkStationOos, options);
				// update local storage
                try {
					// set workstation status in localstorage
                    storage.setItem(oosStorageKey, 'in-order');
					// set workstation oos reason in localstorage
                    storage.setItem(oosReasonKey, '');
                } catch (err) {
                    $log.warn(err);
                }
            }

        });

		/** ******************************************************************************
		 *  Work station code  
		 *  ends here
		 ********************************************************************************/
        var maximizeScreen = function() {
            var chromeAppId = $scope.zestStationData.chrome_app_id; // chrome app id 

            $log.info('chrome app id [ ' + chromeAppId + ' ]');
			// maximize the chrome app in the starting
            chromeAppId !== null && chromeAppId.length > 0 ? chrome.runtime.sendMessage(chromeAppId, 'zest-station-login') : '';
        };

        var cardwriter = new CardOperation();
        var initCardReadTest = function() {
            if ($scope.isIpad) {
                setTimeout(function() {
                    var options = {
                        'successCallBack': function(data) {
                            return data;
                        },
                        'failureCallBack': function(reason) {
                            return reason;
                        }
                    };

                    cardwriter.retrieveCardInfo(options);
                }, 3000);
            }
        };

        var optimizeTouchEventsForChromeApp = function() {
            var optimizeTouch = function(e) {

                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'SPAN' && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'DIV') {
                    $log.log('hide keyboard if up');
                    $scope.hideKeyboardIfUp();
                } else if (e.target.tagName === 'BUTTON' || e.target.tagName === 'DIV' || e.target.tagName === 'BTN') {
                    if (e.target.className.indexOf('keyboard') !== -1) {
                        $log.warn('button or div with keyboard el');
                    } else {
                        $log.log('hide keyboard if up');
                        $scope.hideKeyboardIfUp();
                    }
                }
            };

            var el = window.document;

            el.addEventListener('touchstart', optimizeTouch, false);
            el.addEventListener('touchend', optimizeTouch, false);
            el.addEventListener('touchcancel', optimizeTouch, false);
            el.addEventListener('touchmove', optimizeTouch, false);
        };

        $scope.selectedWorkstationLightId = '';
        
        $scope.turnOnLight = function(selected_light_id) {
            if ($scope.zestStationData.kiosk_is_hue_active) {
                var lightId = selected_light_id ? selected_light_id : $scope.zestStationData.selected_light_id;
                var json = {
                    'Command': 'cmd_hue_light_change',
                    'Data': $scope.zestStationData.hue_bridge_ip,
                    'hueLightAppkey': $scope.zestStationData.hue_user_name,
                    'shouldLight': '1',
                    'lightColor': $scope.zestStationData.hue_light_color_hex,
                    'lightList': [lightId],
                    'brightness': $scope.zestStationData.hue_brightness,
                    'blink': $scope.zestStationData.hue_blinking_effect
                };
                var jsonstring = JSON.stringify(json);

                $scope.socketOperator.toggleLight(jsonstring);
            }
        };

        /**
         * [turnOffLight Yotel needs lights to be in white color in inactive state]
         * @param  {[type]} selected_light_id [description]
         * @return {[type]}                   [description]
         */
        $scope.turnOffLight = function(selected_light_id) {
            if ($scope.zestStationData.kiosk_is_hue_active) {
                var lightId = selected_light_id ? selected_light_id : $scope.zestStationData.selected_light_id;
                var json = {
                    'Command': 'cmd_hue_light_change',
                    'Data': $scope.zestStationData.hue_bridge_ip,
                    'hueLightAppkey': $scope.zestStationData.hue_user_name,
                    'shouldLight': '1',
                    'lightList': [lightId],
                    'blink': 0,
                    'lightColor': '#ffffff',
                    'brightness': $scope.zestStationData.hue_brightness || 254
                };
                var jsonstring = JSON.stringify(json);

                $scope.socketOperator.toggleLight(jsonstring);
            }
        };

        var setHistoricalOOSReasons = function() {

            try {
                var oosStorageHist = storage.getItem(oosStorageHistKey);

                oosStorageHist = (oosStorageHist) ? oosStorageHist : [];

                // fetch from localstorage in case device was restarted
                // we need logs from when the device is offline or not reporting
                $scope.zestStationData.historicalOosReason = oosStorageHist;

            } catch (err) {
                $log.warn(err);
            }
        };

        $scope.reportGoingOffline = function(fromLogOut) {
            if (fromLogOut) {
                $scope.addReasonToOOSLog('STAFF_LOGGED_OFF');
                $scope.trackSessionActivity('STATION_LOGOUT', 'LOGGED_OFF', '', '', true);    
            }

            $scope.trackSessionActivity('EXIT_APP', 'APP_CLOSE_EVT', 'GOING_OFFLINE', 'GOING_OFFLINE', true);
        };

        $scope.retrieveTranslations = function() {
            var selecteLanguage = _.find($scope.zestStationData.hotelLanguages, function(language) {
                return language.language === $translate.use();
            });
            var languageId = selecteLanguage ? selecteLanguage.id : '';
            var propertyTranslations = _.find($scope.zestStationData.hotelTranslations, function(translation) {
                return translation.language_id === languageId;
            });
            return propertyTranslations ? propertyTranslations.translations : [];
        };


        $scope.$on('PRINT_CURRENT_PAGE', function() {
            // if zest station is loaded in Electron App, proceed with silent printing
            // using electron App (Communicate asynchronously from a renderer process to the main process.)
            if (navigator.userAgent.indexOf('Electron') !== -1 && window.ipcRenderer) {
                window.ipcRenderer.send('printCurrentPage');
            } else {
                $window.print();
            }
        });


        var bellSound = new Audio('/assets/zest_station/zsSounds/Doorbell.mp3');

        $scope.$on('PLAY_BELL_SOUND', function () {
            bellSound.play();
        });

        $scope.$on('STOP_OBSERVE_FOR_SWIPE', function() {
            $scope.cardReader.stopReader({
                'successCallBack': function() {},
                'failureCallBack': function() {}
            });
        });

        var checkForExternalCameras = function() {

            var cameraCount = 0;

            $scope.zestStationData.connectedCameras = [];
            $scope.zestStationData.useExtCamera = false;

            // for non mobile devices, check if cameras are present, if yes show options to scan based
            // settings
            if (!sntIDCollectionUtilsSrv.isInMobile() && navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
                navigator.mediaDevices.enumerateDevices().then(function gotDevices(deviceInfos) {

                    angular.forEach(deviceInfos, function(device) {
                        if (device.kind == 'videoinput') {
                            $scope.zestStationData.connectedCameras.push({
                                'id': device.deviceId,
                                'label': device.label || 'camera ' + (cameraCount + 1)
                            });
                            cameraCount++;
                        }
                    });
                    $scope.zestStationData.useExtCamera = $scope.zestStationData.connectedCameras.length > 0;
                });
            }
        };

        $scope.$on('CHECK_FOR_EXTERNAL_CAMERAS', checkForExternalCameras);

		/** *
		 * [initializeMe description]
		 * @return {[type]} [description]
		 */
        
        (function() {// initializeMe
            $('body').css('display', 'none'); // this will hide contents until svg logos are loaded
			// call Zest station settings API
            $scope.zestStationData = zestStationSettings;
            $controller('zsThemeActionsCtrl', {
                $scope: $scope
            });
            $scope.zestStationData.hotelLanguages = hotelLanguages.languages;
            $scope.zestStationData.hotelTranslations = hotelTranslations;
            if (hotelLanguages) {
                setupLanguageTranslations();
            }
            $rootScope.isStandAlone = zestStationSettings.is_standalone;
            $scope.zestStationData.check_in_collect_passport = zestStationSettings.scan_guest_id;// && zestStationSettings.view_scanned_guest_id;// _active is to View from StayCard       
            $scope.zestStationData.v1GuestIDScanning =  $scope.zestStationData.scanner_use_v1_lib ? 'true' : false;

            $scope.zestStationData.showTemplateList = false; // Only for ipad in dev environment, switch themes fast like in chrome (dashboard view)
            $scope.zestStationData.makingKeyInProgress = false;
            $scope.zestStationData.doubleSidedScan = true;// by default scan 2 sides, user can elect to Skip the 2nd side. TODO: //link to a setting
            $scope.zestStationData.qrCodeScanning = false;
            $scope.zestStationData.demoModeEnabled = 'false'; // demo mode for hitech, only used in snt-theme
            $scope.zestStationData.noCheckInsDebugger = 'false';
            $scope.zestStationData.isAdminFirstLogin = true;
            $scope.zestStationData.showMoreDebugInfo = false;
            $scope.zestStationData.themeUsesLighterSubHeader = false;
            $scope.zestStationData.jumperMinimized = false;
            $scope.zestStationData.sessionOosReason = [];
            $scope.zestStationData.historicalOosReason = [];
            $scope.zestStationData.sessionActivity = [];
            setHistoricalOOSReasons();

			// $scope.zestStationData.checkin_screen.authentication_settings.departure_date = true;//left from debuggin?
            setAUpIdleTimer();
            $scope.zestStationData.workstationOooReason = '';
            $scope.zestStationData.workstationStatus = '';
            $scope.zestStationData.wsIsOos = false;
            $scope.showLanguagePopup = false;
            $scope.zestStationData.waitingForSwipe = false;
            $scope.zestStationData.session_conf = '';
            $scope.$filter = $filter;
            // moved web socket creation code to fetchHotelSettings
            fetchHotelSettings();
            getKeyEncoderInfo();
            // getAdminWorkStations();
            $scope.zestStationData.bussinessDate = hotelTimeData.business_date;

            $scope.inElectron = $scope.inChromeApp && (typeof chrome === 'undefined' || typeof chrome.runtime === 'undefined');

            if ($scope.inChromeApp) {
                
                if (!$scope.inElectron) {
                    maximizeScreen();
                } else {
                    $log.info(':: Running in Electron ::');
                }

                optimizeTouchEventsForChromeApp();
                // disable right click options for chromeapp to restrict user from escaping the app
                document.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                });
            }

			// initCardReadTest(); //debugging, comment out when done

			// flag to check if default language was set or not
            $scope.zestStationData.IsDefaultLanguageSet = false;

            $scope.zestStationData.editorModeEnabled = 'false';
            
            // if ooo treshold is not set or not active, set th treshold as 1
            if (!$scope.zestStationData.kiosk_out_of_order_treshold_is_active || _.isNaN(parseInt($scope.zestStationData.kiosk_out_of_order_treshold_value))) {
                $scope.zestStationData.kioskOutOfOrderTreshold = 1;
            } else {
                $scope.zestStationData.kioskOutOfOrderTreshold = parseInt($scope.zestStationData.kiosk_out_of_order_treshold_value);
            }

            if (!$scope.zestStationData.kiosk_offline_reconnect_time || _.isNaN(parseInt($scope.zestStationData.kiosk_offline_reconnect_time))) {
                $scope.zestStationData.kiosk_offline_reconnect_time = 10; // default (in seconds) if the settings value is blank
            } else {
                $scope.zestStationData.kiosk_offline_reconnect_time = parseInt($scope.zestStationData.kiosk_offline_reconnect_time);
            }
            // Scan settings
            // TODO - remove the old settings related code later
             
            // Manual ID verification
            $scope.zestStationData.kiosk_manual_id_scan = $scope.zestStationData.kiosk_manual_id_scan ||
                ($scope.zestStationData.kiosk_scan_enabled &&
                    $scope.zestStationData.kiosk_scan_mode === 'staff_id_verification');

            // ID verification using samsotech scanner
            $scope.zestStationData.check_in_collect_passport = $scope.zestStationData.check_in_collect_passport ||
                ($scope.zestStationData.kiosk_scan_enabled &&
                    $scope.zestStationData.kiosk_scan_mode === 'id_scan_with_samsotech');

            // ID verification using Acuant Webservices
            $scope.zestStationData.id_scan_enabled = $scope.zestStationData.kiosk_scan_enabled &&
                ($scope.zestStationData.kiosk_scan_mode === 'id_scan' ||
                    $scope.zestStationData.kiosk_scan_mode === 'id_scan_with_staff_verification' ||
                    $scope.zestStationData.kiosk_scan_mode === 'id_scan_with_facial_verification');

            if ($scope.isIpad &&
                $scope.zestStationData.kiosk_walk_in_enabled &&
                $scope.zestStationData.kiosk_scan_mode === 'id_scan_with_facial_verification') {
                // TODO: following style fix is a workaround, will be fixed by designers in next sprint
                $('head').append('<style type="text/css">#options.large-icons li { margin: 0 10px !important;}</style>');
                $scope.zestStationData.showWalkinReservationOption = true;
            }
            if ($scope.zestStationData.id_scan_enabled) {
                checkForExternalCameras();
            }

            // CICO-36953 - moves nationality collection to after res. details, using this flag to make optional
            // and may move to an admin in a future story 
            $scope.zestStationData.consecutiveKeyFailure = 0;
            $scope.zestStationData.consecutivePrintFailure = 0;
            $scope.cardReader = new CardOperation();
            
            // reset number of keys to be made
            $scope.zestStationData.makeTotalKeys = 0;
            $scope.zestStationData.makingAdditionalKey = false;
            $scope.zestStationData.autoIpadKeyboardEnabled = false;
            $scope.zestStationData.appVersion = null;
            $scope.zestStationData.connectedDeviceDetails = {};
            $scope.zestStationData.iOSCameraEnabled = false;
            $scope.zestStationData.featuresSupportedInIosApp = [];

            if (typeof cordova !== "undefined") {
                cordova.exec(function(response) {
                        if (response && response.features) {
                            $scope.zestStationData.featuresSupportedInIosApp = response.features;
                        }
                    },
                    function() {
                        // do nothing
                    }, 'RVDevicePlugin', 'featureList', ['should_show_details']);
            }
            
            if ($scope.isIpad && typeof cordova !== typeof undefined) {
                try {
                    // check for the method getAppInfo via rvcardplugin, if it does not exist,
                    // leave app_version null and autoIpadKeyboardEnabled to false
                    $timeout(function() {
                        
                        cordova.exec(function(response) {
                            if (response && response.AppVersion) {
                                $scope.zestStationData.appVersion = response.AppVersion;
                                // if the app version is accessible, then also the cordova configuration has been updated
                                // as of 1.3.4.3, the config for auto-prompt keyboard is enabled
                                $scope.zestStationData.autoIpadKeyboardEnabled = true;


                                $scope.zestStationData.iOSCameraEnabled = response.AppVersion && response.AppVersion >= "1.5.1.15";
                            }

                        }, function() {
                            $scope.zestStationData.autoIpadKeyboardEnabled = false;

                        }, 'RVCardPlugin', 'getAppInfo', []);

                    }, 1500);

                } catch (err) {
                    $log.log(err);
                }
            }
        }());

        $scope.onExitApplication = function() {
            // In the event the application is exited (browser exit or other app close request)
            // 
            // 1: turn off hue lights of they were ON
            // 2: report app exit activity
            $scope.turnOffLight();
            $scope.reportGoingOffline();
        };

        $window.onbeforeunload = $scope.onExitApplication;


        // To Mock MLI swipe - 
        // Once payment screen is loaded, 
        // In browser console call document.dispatchEvent(new Event('MOCK_MLI_SWIPE')) 

        document.addEventListener('MOCK_MLI_SWIPE', function() {
            $scope.$emit('showLoader');
            $scope.$broadcast('ON_MOCK_CC_SWIPE');
        });
    }
]);
