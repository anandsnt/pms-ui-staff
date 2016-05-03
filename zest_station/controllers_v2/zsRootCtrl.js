// Use only codes required for initial  setup like 
// setting hotel settins, kiosk settings and workstation settings
// back button + home button listening functions 
// clickedOnBackButton  and clickedOnCloseButton
// Move other codes to corresponding controllers
// theme based actions are in zsThemeActionsCtrl

sntZestStation.controller('zsRootCtrl', [
	'$scope',
	'zsEventConstants',
	'$state', 'zsTabletSrv', '$rootScope', 'ngDialog', '$sce',
	'zsUtilitySrv', '$translate', 'zsHotelDetailsSrv', 'cssMappings', 'zestStationSettings', '$timeout', 'zsModeConstants',
	function($scope,
		zsEventConstants,
		$state,
		zsTabletSrv,
		$rootScope,
		ngDialog,
		$sce,
		zsUtilitySrv,
		$translate,
		zsHotelDetailsSrv,
		cssMappings,
		zestStationSettings,
		$timeout,
		zsModeConstants) {

		BaseCtrl.call(this, $scope);

		$translate.use('EN_snt'); // for now. need to do translations later
		$scope.cssMappings = cssMappings;

		//in order to prevent url change or fresh url entering with states
		var routeChange = function(event, newURL) {
			event.preventDefault();
			return;
		};

		$rootScope.$on('$locationChangeStart', routeChange);
		//we are forcefully setting top url, please refer routerFile
		window.history.pushState("initial", "Showing Landing Page", "#/home");

		/**
		 * events for showing/hiding the back button and close button
		 * @param  {[type]} event
		 * @return {[type]} 
		 */
		$scope.$on(zsEventConstants.SHOW_BACK_BUTTON, function(event) {
			$scope.hideBackButton = false;
		});
		$scope.$on(zsEventConstants.HIDE_BACK_BUTTON, function(event) {
			$scope.hideBackButton = true;
		});
		$scope.$on(zsEventConstants.SHOW_CLOSE_BUTTON, function(event) {
			$scope.hideCloseButton = false;
		});
		$scope.$on(zsEventConstants.HIDE_CLOSE_BUTTON, function(event) {
			$scope.hideCloseButton = true;
		});

		/**
		 * event for child controllers to show/hide loader
		 * @return {undefined}
		 */
		$scope.$on(zsEventConstants.SHOW_LOADER, function() {
			$scope.hasLoader = true;
		});
		$scope.$on(zsEventConstants.HIDE_LOADER, function() {
			$scope.hasLoader = false;
		});


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


		/**
		 * [navToPrev and close button description]
		 * @return {[type]} [description]
		 */
		$scope.clickedOnBackButton = function() {
			$scope.$broadcast(zsEventConstants.CLICKED_ON_BACK_BUTTON);
		};
		$scope.clickedOnCloseButton = function() {
			$state.go('zest_station.home');
		};
		$scope.talkToStaff = function() {
			$state.go('zest_station.speakToStaff');
		};

		/**
		 * Other events
		 */
		$scope.$on(zsEventConstants.PUT_OOS, function(event) {
			$state.go('zest_station.outOfService');
		});
		$scope.goToAdmin = function() {
			$state.go('zest_station.admin');
		};

		// check if navigator is iPad
		$scope.isIpad = (navigator.userAgent.match(/iPad/i) !== null || navigator.userAgent.match(/iPhone/i) !== null) && window.cordova;
		/**
		 * This is workaround till we find how to detect if app
		 *  is invoked from chrome app, we will be hidding this tag from chrome app and
		 *  checking that to distinguish if app was launched using chrome app or not 
		 * */
		var CheckIfItsChromeApp = function() {
			$scope.inChromeApp = $("#hideFromChromeApp").css("visibility") === 'hidden';
			console.info(":: is in chrome app ->" + $scope.inChromeApp);
		}();
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
				$scope.zestStationData.hotelDateFormat = !!data.date_format ? data.date_format.value : "DD-MM-YYYY";
				$scope.zestStationData.mliMerchantId = data.mli_merchant_id;
			};
			var options = {
				params: {},
				successCallBack: onSuccess
			};
			$scope.callAPI(zsTabletSrv.fetchHotelSettings, options);
		};
		/**
		 * This fetches hotel admin workstation settings
		 * */
		var getWorkStation = function() {
			var onSuccess = function(response) {
				$scope.zestStationData.workstations = response.work_stations;
				//setWorkStation();// to do
				//refreshSettings();// to do
			};
			var onFail = function(response) {
				console.warn('fetching workstation list failed:', response);
				$scope.$emit(zsEventConstants.PUT_OOS);
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
				failureCallBack: onFail
			};
			$scope.callAPI(zsTabletSrv.fetchWorkStations, options);
		};
		/********************************************************************************
		 *  User activity timer
		 *  starts here
		 ********************************************************************************/
		var setAUpIdleTimer = function() {
			var userInActivityTimeInSeconds = 0;
			$scope.zestStationData.timeOut = false;

			$scope.resetTime = function() {
				userInActivityTimeInSeconds = 0;
				$scope.zestStationData.timeOut = false;
			};

			function increment() {
				if ($scope.zestStationData.idle_timer.enabled ==='true' && !($state.current.name === 'zest_station.admin' || $state.current.name === 'zest_station.home')) {
					userInActivityTimeInSeconds = userInActivityTimeInSeconds + 1;
					//when user activity is not recorded for more than a minute
					if (userInActivityTimeInSeconds >= $scope.zestStationData.idle_timer.prompt) {
						$scope.zestStationData.timeOut = true;
						$scope.runDigestCycle();
					} else {
						//do nothing;
					}
					if (userInActivityTimeInSeconds >= $scope.zestStationData.idle_timer.max) {
						$state.go('zest_station.home');
						$scope.runDigestCycle();
					} else {
						//do nothing;
					}
				} else {
					return;
				}
			}
			setInterval(increment, 1000);
		};
		/********************************************************************************
		 *  User activity timer
		 *  ends here
		 ********************************************************************************/


		$rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
			$scope.resetTime();
		});



		/********************************************************************************
		 *   Websocket actions related to keycard lookup
		 *  starts here
		 ********************************************************************************/

		var socketActions = function(response) {
			var cmd = response.Command,
				msg = response.Message;
			// to delete after QA pass
			console.info("Websocket:-> uid=" + response.UID + "--" + "Websocket:-> response code:" + response.ResponseCode);
			console.info("Websocket: msg ->" + msg + "--" + "Websocket: Command ->" + cmd);

			if (response.Command === 'cmd_insert_key_card') {
				//check if the UID is valid
				//if so find reservation using that
				if (typeof response.UID !== "undefined" && response.UID !== null) {
					$scope.$broadcast('UID_FETCH_SUCCESS', {
						"uid": response.UID
					});
				} else {
					$scope.$broadcast('UID_FETCH_FAILED');
				};
			} else if (response.Command === 'cmd_eject_key_card') {
				//ejectkey card callback
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
					//capture failed
					$state.go('zest_station.speakToStaff');
				};
			} else if (response.Command === 'cmd_dispense_key_card') {
				$scope.$broadcast('DISPENSE_SUCCESS', {
					"cmd": response.Command,
					"msg": response.Message
				});
			}
		};
		var socketOpenedFailed = function() {
			console.info("Websocket:-> socket connection failed");
			$scope.$broadcast('SOCKET_FAILED');
		};
		var socketOpenedSuccess = function() {
			console.info("Websocket:-> socket connected");
			$scope.$broadcast('SOCKET_CONNECTED');
		};
		$scope.$on('CONNECT_WEBSOCKET', function() {
			$scope.socketOperator = new webSocketOperations(socketOpenedSuccess, socketOpenedFailed, socketActions);
		});

		$scope.$on('EJECT_KEYCARD', function() {
			if ($scope.zestStationData.keyCardInserted) {
				$scope.socketOperator.EjectKeyCard();
			} else {
				//do nothing
			};
		});
		/********************************************************************************
		 *  Websocket actions related to keycard lookup
		 *  ends here
		 ********************************************************************************/

		/********************************************************************************
		 *  Chrome App Communication code 
		 *  ends here
		 ********************************************************************************/
		var onChromeAppResponse = function(response) {
			console.log('msg from ChromeApp: ', response);
			if (!!response && response.qr_code) {
				$scope.$broadcast('QR_SCAN_SUCCESS', {
					"reservation_id": response.reservation_id
				});
			} else {
				//do nothing now
			}
		};
		$scope.chromeApp = new chromeApp(onChromeAppResponse, zestStationSettings.chrome_app_id);
		/********************************************************************************
		 *  Chrome App Communication code  
		 *  ends here
		 ********************************************************************************/



		/********************************************************************************
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
			} else {
				return null;
			}
		};

		$scope.getStationIdFromName = function(name) {
			return name === '' ? null : _.find($scope.zestStationData.workstations, function(station) {
				return station.name === name;
			});
		};
		$scope.printer = {
			'name': ''
		};

		var workStationstorageKey = 'snt_zs_workstation',
			oosStorageKey = 'snt_zs_workstation.in_oos',
			oosReasonKey = 'snt_zs_workstation.oos_reason',
			storage = localStorage,
			storedWorkStation = '',
			station;
		/**
		 * [setWorkStationForAdmin description]
		 *  The workstation, status and oos reason are stored in
		 *  localstorage
		 */
		var setWorkStationForAdmin = function() {
			//work station , oos status, reason  etc are saved in local storage

			try {
				storedWorkStation = storage.getItem(workStationstorageKey);
			} catch (err) {
				console.warn(err);
			}
			//find workstation with the local storage data
			var station = getSavedWorkStationObj(storedWorkStation);
			if (typeof station === typeof undefined) {
				return null;
			} else {
				$scope.workstation = {
					'selected': station
				};
				// set work station id and status
				$scope.zestStationData.set_workstation_id = $scope.getStationIdFromName(station.name).id;
				$scope.zestStationData.workstationStatus = station.is_out_of_order ? 'out-of-order' : 'in-order';
				if ($scope.zestStationData.workstationStatus === 'out-of-order') {
					$state.go('zest_station.outOfService');
				} else {
					$state.go('zest_station.home');
				}
				// set oos reason from local storage
				try {
					$scope.zestStationData.workstationOooReason = storage.getItem(oosReasonKey);
				} catch (err) {
					console.warn(err);
				}
			}
		};
		/**
		 * [getAdminWorkStations description]
		 * @return {[type]} [description]
		 */
		var getAdminWorkStations = function() {
			var onSuccess = function(response) {
				$scope.zestStationData.workstations = response.work_stations;
				setWorkStationForAdmin();
			};
			var onFail = function(response) {
				if ($scope.timeStopped) {
					return;
				}
				console.warn('fetching workstation list failed:', response);
				$scope.$emit(zsEventConstants.PUT_OOS);
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
				failureCallBack: onFail
			};
			$scope.callAPI(zsTabletSrv.fetchWorkStations, options);
		};
		/**
		 *   When workstation is in OOS fetch status continously 
		 *   to check if status has changed
		 */
		$scope.$on('FETCH_LATEST_WORK_STATIONS', function() {
			getAdminWorkStations();
		});


		//store workstation status in localstorage
		var updateLocalStorage = function(oosReason, workstationStatus) {
			var selectedWorkStation = _.find($scope.zestStationData.workstations, function(workstation) {
				return workstation.id == $scope.zestStationData.set_workstation_id;
			});

			try {
				//set workstation in localstorage
				console.log('set work station :--->' + selectedWorkStation.station_identifier);
				storage.setItem(workStationstorageKey, selectedWorkStation.station_identifier);
				//set workstation status in localstorage
				console.info('set oos status :--->' + workstationStatus);
				storage.setItem(oosStorageKey, workstationStatus);
				//set workstation oos reason in localstorage
				console.log('set works station :--->' + oosReason);
				(!!oosReason) ? storage.setItem(oosReasonKey, oosReason): '';
			} catch (err) {
				console.warn(err);
			}
		};

		/** 
		 * work station status change event 
		 * This will be invoke everytime some actions
		 * like key card lookup, print etc fails
		 **/
		$scope.$on(zsEventConstants.UPDATE_LOCAL_STORAGE_FOR_WS, function(event, params) {

			var oosReason = params.reason;
			var workstationStatus = params.status;

			console.info('update to:  ', workstationStatus);

			$scope.zestStationData.workstationStatus = workstationStatus;
			//update local storage
			updateLocalStorage(oosReason, workstationStatus);

			//update workstation status with oos reason
			if ($scope.zestStationData.workstationStatus === 'out-of-order') {
				console.info('placing station out of order');
				var options = {
					params: {
						'oo_status': true,
						'oo_reason': oosReason,
						'id': $scope.zestStationData.set_workstation_id
					}
				};
				$state.go('zest_station.outOfService');
				$scope.callAPI(zsTabletSrv.updateWorkStationOos, options);
			} else {
				//Make work stataion back to in order
				console.info('putting station back in order');
				var options = {
					params: {
						'oo_status': false,
						'id': $scope.zestStationData.set_workstation_id
					}
				};
				$scope.callAPI(zsTabletSrv.updateWorkStationOos, options);
				//update local storage
				try {
					//set workstation status in localstorage
					console.info('set oos status :--->' + 'in-order');
					storage.setItem(oosStorageKey, 'in-order');
					//set workstation oos reason in localstorage
					console.log('set works station :--->' + '');
					storage.setItem(oosReasonKey, '');
				} catch (err) {
					console.warn(err);
				}
			}

		});

		/********************************************************************************
		 *  Work station code  
		 *  ends here
		 ********************************************************************************/
		var maximizeScreen = function() {
			var chromeAppId = $scope.zestStationData.chrome_app_id; // chrome app id 
			console.info("chrome app id [ " + chromeAppId + ' ]');
			//minimize the chrome app on loging out
			(chromeAppId !== null && chromeAppId.length > 0) ? chrome.runtime.sendMessage(chromeAppId, "zest-station-login"): "";
		};
		/***
		 * [initializeMe description]
		 * @return {[type]} [description]
		 */
		var initializeMe = function() {
			$('body').css('display', 'none'); //this will hide contents until svg logos are loaded
			//call Zest station settings API
			$scope.zestStationData = zestStationSettings;
			$scope.zestStationData.checkin_screen.authentication_settings.departure_date = true;
			setAUpIdleTimer();
			$scope.zestStationData.workstationOooReason = "";
			$scope.zestStationData.workstationStatus = "";
			$scope.zestStationData.isAdminFirstLogin = true;
			$scope.zestStationData.wsIsOos = false;
			$scope.showLanguagePopup = false;
			$scope.inChromeApp ? maximizeScreen() : "";
			//create a websocket obj
			$scope.socketOperator = new webSocketOperations(socketOpenedSuccess, socketOpenedFailed, socketActions);
			fetchHotelSettings();
			getAdminWorkStations();
		}();
	}
]);