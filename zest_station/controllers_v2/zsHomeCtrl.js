sntZestStation.controller('zsHomeCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'zsEventConstants',
    '$translate',
    'zsCheckinSrv',
    'languages',
    'zsGeneralSrv',
    'zestStationSettings',
    function($scope, $rootScope, $state, zsEventConstants, $translate, zsCheckinSrv, languages, zsGeneralSrv, zestStationSettings) {
		/*
		 * when we clicked on pickup key from home screen
		 */
        $scope.clickedOnPickUpKey = function() {
            $scope.trackEvent('PUK', 'user_selected');
            clearInterval($scope.activityTimer);
            if ($scope.zestStationData.kiosk_key_creation_method === 'manual') {
                $state.go('zest_station.manualKeyPickup', {
                    'mode': 'PICKUP_KEY'
                });
            }
            else if ($scope.zestStationData.pickup_qr_scan) {
                $scope.setScreenIcon('key');
                $state.go('zest_station.qrPickupKey');
            } else {
                $state.go('zest_station.checkOutReservationSearch', {
                    'mode': 'PICKUP_KEY'
                });
            }
        };

		/*
		 * when we clicked on checkin from home screen
		 */
        $scope.clickedOnCheckinButton = function() {
            $scope.trackEvent('CI', 'user_selected');

            clearInterval($scope.activityTimer);

            if ($scope.isIpad && $scope.zestStationData.is_snt_id_scan_enabled && $scope.zestStationData.scan_id_to_find_reservations) {
                $state.go('zest_station.findReservationFromId');
            } else {
                $state.go('zest_station.checkInReservationSearch');
            }
        };

		/*
		 * when we clicked on checkout from home screen
		 */
        $scope.clickedOnCheckoutButton = function() {
            $scope.trackEvent('CO', 'user_selected');
            clearInterval($scope.activityTimer);
            if (!$scope.zestStationData.checkout_keycard_lookup) {
                $state.go('zest_station.checkOutReservationSearch');
            } else {
                $state.go('zest_station.checkoutSearchOptions');
            }
        };

        $scope.language = {};

        var setToDefaultLanguage = function(checkIfDefaultLanguagIsSet) {
			// assigning default language
            if ($scope.languages.length) {
                var defaultLangName = zestStationSettings.zest_lang.default_language.toLowerCase(),
                    defaultLanguage = _.findWhere($scope.languages, {
                        name: defaultLangName
                    });

                if (defaultLanguage && defaultLanguage.name) {
                    var languageConfig = zsGeneralSrv.languageValueMappingsForUI[defaultLanguage.name],
                        langShortCode = languageConfig.code;

                    if ( $translate.use() === langShortCode && checkIfDefaultLanguagIsSet ) {
                            // do nothing, current language is already the default one or no default is selected from hotel admin
                    } else {
                        console.info('translating to default lanaguage after ' + userInActivityTimeInHomeScreenInSeconds + ' seconds');
                        $scope.selectLanguage(defaultLanguage);
                    }
                }
            }
        };

		/** ************************************************************************************/
        var userInActivityTimeInHomeScreenInSeconds = 0;
        var atHomeView = function() {
            return $state.current.name === 'zest_station.home';
        };
        var atAdminView = function() {
            return $state.current.name === 'zest_station.admin';
        };

        var setHomeScreenTimer = function() {
			// time in seconds
			// when user activity is not recorded for more than 120 secs (by default)
			// translating to default lanaguage
            var timeUntilRefreshCheck = 30,
                timeUntilLanguageResetCheck = 120;

            $scope.resetHomeScreenTimer = function() {
                userInActivityTimeInHomeScreenInSeconds = 0;
            };

            var incrementHomeScreenTimer = function() {
                // pause timers when editor mode is enabled, so user doesnt get moved from the screen, 
                // reflect in diagnostics with the idleTimerPaused attribute
                if ($scope.zestStationData.editorModeEnabled === 'true') {
                    return;
                }

				// Debugging options available from the console for development and debugging purposes only
                if (zestSntApp.timeDebugger) {
					// refresh kiosk every x seconds (while idle) - at home screen
                    if (zestSntApp.refreshTimer > 0) {
                        timeUntilRefreshCheck = zestSntApp.refreshTimer;	
                    }
					// reset language every x seconds (while idle) - at home screen
                    if (zestSntApp.languageResetTimer > 0) {
                        timeUntilLanguageResetCheck = zestSntApp.languageResetTimer;	
                    }
					// call via zsRootCtrl.js, to reflect in on-screen display (in header html)
                    $scope.setTimerDebuggerOptions(timeUntilRefreshCheck, timeUntilLanguageResetCheck, 
                                                    userInActivityTimeInHomeScreenInSeconds, userInActivityTimeInHomeScreenInSeconds);
                } else {// otherwise, set back to default
                    timeUntilLanguageResetCheck = 120;
                    timeUntilRefreshCheck = 30;
                }
				// if by some reason, the timer is running even 
				// after chaning state (we are clearing timer whenever we are
				// changing state), we need to deactivate the timer.
                var atHome = atHomeView(),
                    atAdmin = atAdminView();

                if (atHome) {
                    userInActivityTimeInHomeScreenInSeconds++;
					/*
						Kiosk checks fetches the workstation data every x seconds, which should always occur approx. every 120 seconds,
						 -after the fetching of workstations, we check the specific workstation currently assigned to see if a hotel admin
						 -has requested a refresh of the workstation (hard re-set of the app), 
                            if the flag is true- we will call to reload the UI (CICO-35215)
					*/
                    if (userInActivityTimeInHomeScreenInSeconds >= timeUntilRefreshCheck) {
                        $scope.checkIfWorkstationRefreshRequested();
                    }

                    if (userInActivityTimeInHomeScreenInSeconds >= timeUntilLanguageResetCheck) {
						// highlighting active language buttons. We need not do that again and again , if we already have a 
						// default language set.So on timer limit(120s), we need to check if the current language is default or not.
                        // when Not in language Editor mode, go ahead and reset back to default language
                        console.info('translating to default lanaguage');
                        setToDefaultLanguage(true);// checkIfDefaultLanguagIsSet = true    

                        $scope.runDigestCycle();
                        userInActivityTimeInHomeScreenInSeconds = 0;
						// $state.current.name === 'zest_station.admin' - if going to hotel admin, 
                        // switch back to default language, in future we may need to find best logic for multiple languages for admin screen
						// also if user has been inactive at the (home screen) for 2 minutes, reset language the default
                    }
					/* ** When going to Admin, reset the language back to kiosk default language ** */
                } else {
					// if current state is not home, then 
					// deactivate the timer
                    userInActivityTimeInHomeScreenInSeconds = 0;
                    clearInterval($scope.activityTimer);
                    if (atAdmin) {
                        setToDefaultLanguage(true);// checkIfDefaultLanguagIsSet = true
                    }
                }
				
				
            };

            $scope.activityTimer = setInterval(incrementHomeScreenTimer, 1000);
        };
		// deactivate the active activity timer on entering home page (to avoid multiple timers 
		// running at the same time, we will be start new timer)

        try {
            clearInterval($scope.activityTimer);
        } catch (e) {
			// console.log("no timer running.")
        }
        setHomeScreenTimer();
		/** ************************************************************************************/

        $scope.openExternalWebPage = function() {

            $scope.showExternalWebPage = true;
        };

        $scope.closeExternalWebPage = function() {
            setHomeScreenTimer();
            $scope.showExternalWebPage = false;
        };


		/**
		 * to change the default language
		 * @param  {object} language
		 */

        $scope.$on('SWITCH_LANGUAGE', function(evt, lang) {
            // for debugging | testing only via developer tools or console
            // allows dev/user to switch language during-a flow, instead of just at home
            var obj;

            for (var i in $scope.languages) {
                
                obj = $scope.languages[i];
                if (obj.code === lang) {
                    $scope.selectLanguage(obj);
                    setTimeout(function() {
                        $scope.$digest();
                    }, 100);
                    return;
                }
            }
        });
        $scope.selectLanguage = function(language) {
			// Reset idle timer to 0, on language selection, otherwise counter is still going
            userInActivityTimeInHomeScreenInSeconds = 0;
            var languageConfig = zsGeneralSrv.languageValueMappingsForUI[language.name],
                langShortCode = languageConfig.code;

                // keep track of lang short code, for editor to save / update tags when needed
            $scope.languageCodeSelected(langShortCode, language.name);

            $translate.use(langShortCode);
            $scope.selectedLanguage = language;
        };

		/**
		 * [initializeMe description]
		 */
        (function() {
			// hide back button
            $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);

			// hide close button
            $scope.$emit(zsEventConstants.HIDE_CLOSE_BUTTON);
			// flush out previous search results
            zsCheckinSrv.setSelectedCheckInReservation([]);
            zsCheckinSrv.setCheckInReservations([]);
            zsCheckinSrv.setCurrentReservationIdDetails({});
			// eject if any key card is inserted
            $scope.$emit('EJECT_KEYCARD');
			// set this to false always on entering home screen
            $scope.zestStationData.keyCardInserted = false;
            $scope.zestStationData.makeTotalKeys = 0;
            $scope.zestStationData.makingAdditionalKey = false;
            $scope.zestStationData.waitingForSwipe = false;

			// list of languages configured for this hotel
            var combinedList = _.partition(languages.languages, {
                    position: null
                }),
                nullList = combinedList[0],
                listHavingValues = combinedList[1];

            $scope.languages = _.sortBy(listHavingValues, 'position').concat(nullList);

            $scope.languages = $scope.languages.map(function(language) {
				// merging, so that we can use more localized terms in UI
                Object.assign(language, zsGeneralSrv.languageValueMappingsForUI[language.name]);
                return language;
            });

			// assigning default language initially
            if (!zsGeneralSrv.isDefaultLanguageSet && $state.current.name === 'zest_station.home') {
                setToDefaultLanguage();
                zsGeneralSrv.isDefaultLanguageSet = true;
            } else {
				// set the active language as the selected language in the home screen
                var activeLanguage = _.findWhere($scope.languages, {
                    code: $translate.use()
                });

                $scope.selectedLanguage = activeLanguage;
            }

            $scope.resetHomeScreenTimer();
            if ($scope.zestStationData.workstationStatus === 'out-of-order') {
                var params = {};

                params.reason = $scope.zestStationData.workstationOooReason;
                params.status = 'out-of-order';
                $scope.$emit(zsEventConstants.UPDATE_LOCAL_STORAGE_FOR_WS, params);
                $scope.addReasonToOOSLog('WORKSTATION_OOS');
                $state.go('zest_station.outOfService');
            } else {
                $scope.setScreenIcon('bed');
            }
        })();


    }
]);