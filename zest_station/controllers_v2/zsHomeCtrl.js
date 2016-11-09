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
		/**
		 * when we clicked on pickup key from home screen
		 */
		$scope.clickedOnPickUpKey = function() {
			clearInterval($scope.activityTimer);
			if ($scope.zestStationData.pickup_qr_scan) {
				$state.go('zest_station.qrPickupKey');
			} else {
				$state.go('zest_station.checkOutReservationSearch', {
					'mode': 'PICKUP_KEY'
				});
			}
		};

		/**
		 * when we clicked on checkin from home screen
		 */
		$scope.clickedOnCheckinButton = function() {
			clearInterval($scope.activityTimer);
			$state.go('zest_station.checkInReservationSearch');
		};

		/**
		 * when we clicked on checkout from home screen
		 */
		$scope.clickedOnCheckoutButton = function() {
			clearInterval($scope.activityTimer);
			if (!$scope.zestStationData.checkout_keycard_lookup) {
				$state.go('zest_station.checkOutReservationSearch');
			} else {
				$state.go('zest_station.checkoutSearchOptions');
			}
		};

		$scope.language = {};

		var setToDefaultLanguage = function(checkIfDefaultLanguagIsSet) {
			//assigning default language
			if ($scope.languages.length) {
				var defaultLangName = zestStationSettings.zest_lang.default_language.toLowerCase(),
					defaultLanguage = _.findWhere($scope.languages, {
						name: defaultLangName
					});
				var languageConfig = zsGeneralSrv.languageValueMappingsForUI[defaultLanguage.name],
				langShortCode = languageConfig.code;

				if( $translate.use() === langShortCode && checkIfDefaultLanguagIsSet){
					//do nothing, current language is already the default one
				}else
				{
					console.info("translating to default lanaguage after "+userInActivityTimeInHomeScreenInSeconds+" seconds");
					$scope.selectLanguage(defaultLanguage);
				}
			}
		};

		/**************************************************************************************/
		var userInActivityTimeInHomeScreenInSeconds = 0;
		var atHomeView = function(){
			return ($state.current.name === 'zest_station.home');
		};

		var setHomeScreenTimer = function() {
			//time in seconds
			var timeUntilRefreshCheck = 30,
				timeUntilLanguageResetCheck = 120;

			$scope.resetHomeScreenTimer = function() {
				userInActivityTimeInHomeScreenInSeconds = 0;
			};

			var incrementHomeScreenTimer = function() {
				//if debugging options enabled, use those values instead
				if (zestSntApp.timeDebugger){
					if (zestSntApp.refreshTimer > 0){
						timeUntilRefreshCheck = zestSntApp.refreshTimer;	
					}
					if (zestSntApp.languageResetTimer > 0){
						timeUntilLanguageResetCheck = zestSntApp.languageResetTimer;	
					}
					$scope.setTimerDebuggerOptions(timeUntilRefreshCheck, timeUntilLanguageResetCheck, userInActivityTimeInHomeScreenInSeconds);
				} else {
					timeUntilLanguageResetCheck = 120;
					timeUntilRefreshCheck = 30;
				}
				//if by some reason, the timer is running even 
				//after chaning state (we are clearing timer whenever we are
				//changing state), we need to deactivate the timer.
				var atHome = atHomeView();
				if (atHome) {
					userInActivityTimeInHomeScreenInSeconds++;
				} else {
					//if current state is not home, then 
					//deactivate the timer
					userInActivityTimeInHomeScreenInSeconds = 0;
					clearInterval($scope.activityTimer);
				}
				if (userInActivityTimeInHomeScreenInSeconds >= timeUntilRefreshCheck && atHome) {
					checkIfWorkstationRefreshRequested();
				}
				//when user activity is not recorded for more than 120 secs
				//translating to default lanaguage
				if (userInActivityTimeInHomeScreenInSeconds >= timeUntilLanguageResetCheck && atHome) {
					var checkIfDefaultLanguagIsSet = true;//this need to checked as, apart from translating we are 
					//highlighting active language buttons. We need not do that again and again , if we already have a 
					//default language set.So on timer limit(120s), we need to check if the current language is default or not.
					setToDefaultLanguage(checkIfDefaultLanguagIsSet);
					$scope.runDigestCycle();
					userInActivityTimeInHomeScreenInSeconds = 0;
				} else {
					//do nothing;
				}
			};
			$scope.activityTimer = setInterval(incrementHomeScreenTimer, 1000);
		};
		//deactivate the active activity timer on entering home page (to avoid multiple timers 
		// running at the same time, we will be start new timer)
		try{
			clearInterval($scope.activityTimer);
		}catch(e){
			//console.log("no timer running.")
		}
		setHomeScreenTimer();
		/**************************************************************************************/

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
		$scope.selectLanguage = function(language) {
			//Reset timer on language selection
			userInActivityTimeInHomeScreenInSeconds = 0;
			var languageConfig = zsGeneralSrv.languageValueMappingsForUI[language.name],
				langShortCode = languageConfig.code;
			$translate.use(langShortCode);
			$scope.selectedLanguage = language;
		};



		/********************************************************************************
		 *  User activity timer at home screen should trigger a refresh check periodically - 
		 *   -- fire events when kiosk is in-service and not in-use by guest.
		 *   --	 
		 *
		 *  Events include
		 *   *Refresh-workstation --> Triggered from Hotel Admin - interfaces - workstation > toggle (Refresh Station)
		 ********************************************************************************/
		var checkIfWorkstationRefreshRequested = function(){
				//Workstation trigger for Refresh Station is set to TRUE, --Refresh Station at next (idle) opportunity--
				var station = $scope.getWorkStationSetting($rootScope.workstation_id);
				//send back to workstation that kiosk is being/has been refreshed 
				// --assumption is that two Zest Stations will be sharing a workstation, currently S69, that is not a logical setup
				if (station.refresh_station){
					station.refresh_station = false;//only trigger once
					//update the workstation to reflect the refresh has taken place
					//call API to set workstation "station_refresh" to false, and note "last_refreshed"
					refreshInProgress(station);
					//just refreshes the browser, user should not have to re-login 
					//-- CICO-35215
					//--  this should refresh all settings and bring zest station up to the latest version
					//--  does not apply to refreshing the ChromeApp / iOS app versions... only the Zest Station content
				};
		}

		var refreshInProgress = function(station){
			console.log('Calling API to Reset (refresh_station) Flag for: ',station.name, ' - ',station.id);
			var onSuccess = function(response) {
				console.info('Successful Refresh of Station Triggered, turning off (Workstation) Trigger ');
				initRefreshStation();
			};
			var onFail = function(response) {
				console.warn('Manual Refresh Failed: ',response);
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
					'rover_device_id':station.rover_device_id,
					'id': station.id
				},
				successCallBack: onSuccess,
				failureCallBack: onFail,
				'loader': 'none'
			};
			$scope.callAPI(zsGeneralSrv.refreshWorkStationInitialized, options);
		}
	 	var initRefreshStation = function(){
	 		console.warn(':: Refreshing Station ::');
	 		try{
	 			storage.setItem(refreshedKey, 'true');
	 		} catch(err){
	 			console.log(err);
	 		}
	 		location.reload(true);
	 	};


		/**
		 * [initializeMe description]
		 */
		(function() {
			//hide back button
			$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);

			//hide close button
			$scope.$emit(zsEventConstants.HIDE_CLOSE_BUTTON);
			//flush out previous search results
			zsCheckinSrv.setSelectedCheckInReservation([]);
			zsCheckinSrv.setCheckInReservations([]);
			//eject if any key card is inserted
			$scope.$emit('EJECT_KEYCARD');
			//set this to false always on entering home screen
			$scope.zestStationData.keyCardInserted = false;

			//list of languages configured for this hotel
			var combinedList = _.partition(languages.languages, {
					position: null
				}),
				nullList = combinedList[0],
				listHavingValues = combinedList[1];
			$scope.languages = _.sortBy(listHavingValues, 'position').concat(nullList);

			$scope.languages = $scope.languages.map(function(language) {
				//merging, so that we can use more localized terms in UI
				Object.assign(language, zsGeneralSrv.languageValueMappingsForUI[language.name]);
				return language;
			});

			//assigning default language initially
			if (!zsGeneralSrv.isDefaultLanguageSet) {
				setToDefaultLanguage();
				zsGeneralSrv.isDefaultLanguageSet = true;
			} else {
				//set the active language as the selected language in the home screen
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
				$state.go('zest_station.outOfService');
			} else {
				$scope.setScreenIcon('bed');
			}
		})();


	}
]);