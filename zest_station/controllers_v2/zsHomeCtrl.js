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
			};
		};

		$scope.language = {};

		/**************************************************************************************/

		var setHomeScreenTimer = function() {
			var userInActivityTimeInHomeScreenInSeconds = 0;

			$scope.resetHomeScreenTimer = function() {
				userInActivityTimeInHomeScreenInSeconds = 0;
			};

			var incrementHomeScreenTimer = function() {

				userInActivityTimeInHomeScreenInSeconds++;
				//when user activity is not recorded for more than 120 secs
				//translating to default lanaguage
				if (userInActivityTimeInHomeScreenInSeconds >= 120) {
					console.info("translating to default lanaguage");
					$rootScope.$broadcast('RESET_LANGUAGE');
					userInActivityTimeInHomeScreenInSeconds = 0;
				} else {
					//do nothing;
				}
			};
			$scope.activityTimer = setInterval(incrementHomeScreenTimer, 1000);
		};
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
			var languageConfig = zsGeneralSrv.languageValueMappingsForUI[language.name],
				langShortCode = languageConfig.code;
			$translate.use(langShortCode);
			$scope.selectedLanguage = language;
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
			var combinedList = _.partition(languages.languages, { position: null }),
				nullList = combinedList[0],
				listHavingValues = combinedList[1];
			$scope.languages = _.sortBy(listHavingValues, 'position').concat(nullList);

			$scope.languages = $scope.languages.map(function(language) {
				//merging, so that we can use more localized terms in UI
				Object.assign(language, zsGeneralSrv.languageValueMappingsForUI[language.name]);
				return language;
			});

			//assigning default language
			if($scope.languages.length) {
				var defaultLangName = zestStationSettings.zest_lang.default_language.toLowerCase(),
					defaultLanguage = _.findWhere($scope.languages, { name : defaultLangName });
				$scope.selectLanguage(defaultLanguage);
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