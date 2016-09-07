// Use only codes required for initial  setup like 
// setting hotel settins, kiosk settings and workstation settings
// back button + home button listening functions 
// clickedOnBackButton  and clickedOnCloseButton
// Move other codes to corresponding controllers
// theme based actions are in zsThemeActionsCtrl

sntZestStation.controller('zsRootCtrl', [
	'$scope',
	'zsEventConstants',
	'$state', 'zsGeneralSrv', '$rootScope', 'ngDialog', '$sce',
	'zsUtilitySrv', '$translate', 'zsHotelDetailsSrv', 'cssMappings', 'zestStationSettings', '$timeout', 'zsModeConstants', 'hotelTimeData', '$filter',
	function($scope,
		zsEventConstants,
		$state,
		zsGeneralSrv,
		$rootScope,
		ngDialog,
		$sce,
		zsUtilitySrv,
		$translate,
		zsHotelDetailsSrv,
		cssMappings,
		zestStationSettings,
		$timeout,
		zsModeConstants,
		hotelTimeData,
		$filter) {

		BaseCtrl.call(this, $scope);


		$scope.cssMappings = cssMappings;

		//in order to prevent url change or fresh url entering with states
		var routeChange = function(event, newURL) {
			event.preventDefault();
			return;
		};

		$rootScope.$on('$locationChangeStart', routeChange);
		//we are forcefully setting top url, please refer routerFile
		window.history.pushState("initial", "Showing Landing Page", "#/home");

		$scope.$on('GENERAL_ERROR', function() {
			$state.go('zest_station.speakToStaff');
		});

		$scope.trustAsHtml = function(string) {
			return $sce.trustAsHtml(string);
		};
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



		$scope.callBlurEventForIpad = function() {
			//need to check if its ipad here too as it 
			//will be called from multiple areas
			if ($scope.isIpad) {
				document.activeElement.blur();
				$("input").blur();
			} else {
				//do nothing
			};
		};
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
		//used for making keys, checking if there is text in the locale, to hide/show the key #, 
		//can be moved to other controllers if this doesnt make sense here, just see there are 3x views with the UNO_ and DOS_KEY tags
		$scope.isEmpty = function(value) {
			if (!value) {
				return true;
			}
			if ($filter('translate')(value) === '') {
				return true;
			}
			return false;
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
		 * [returnDateObjBasedOnDateFormat description]
		 * @param  {[type]} dateString [description]
		 * @return {[type]}            [description]
		 */
		$scope.returnDateObjBasedOnDateFormat = function(dateString) {
			if (typeof dateString !== 'undefined') {
				return returnUnformatedDateObj(dateString, $scope.zestStationData.hotelDateFormat);
			} else {
				return dateString;
			}
		};

		/**
		 * Other events
		 */
		$scope.$on(zsEventConstants.PUT_OOS, function(event) {
			if ($state.current.name !== 'zest_station.admin') {
				$state.go('zest_station.outOfService');
			} else {
				//do nothing
			}
		});
		$scope.goToAdmin = function() {
			$state.go('zest_station.admin');
		};

		// check if navigator is iPad
		var ipadOrIphone = function() {
			if ((navigator.userAgent.match(/iPad/i) !== null || navigator.userAgent.match(/iPhone/i) !== null) !== true) {
				return false;
			} else if (navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i)) {
				return true;
			}
		};

		var iphoneOrIpad = ipadOrIphone();

		//$scope.isIpad = (navigator.userAgent.match(/iPad/i) !== null || navigator.userAgent.match(/iPhone/i) !== null) && window.cordova;
		$scope.isIpad = (zestSntApp.cordovaLoaded && iphoneOrIpad);
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
				$rootScope.emvTimeout = !!$scope.zestStationData.hotelSettings.emv_timeout ? $scope.zestStationData.hotelSettings.emv_timeout : 60;
				$scope.zestStationData.mliMerchantId = data.mli_merchant_id;
				configureSwipeSettings();
				logStationSettings();
			};
			var options = {
				params: {},
				successCallBack: onSuccess
			};
			$scope.callAPI(zsGeneralSrv.fetchHotelSettings, options);
		};
		var configureSwipeSettings = function() {
			//(remote, websocket, local)
			//
			//local:  Infinea/Ingenico
			//remote:  Ving, Salto, Saflok
			//websocket:  Atlas / Sankyo

			$scope.zestStationData.ccReader = 'local'; //default to local
			$scope.zestStationData.keyWriter = 'local';

			var key_method = $scope.zestStationData.kiosk_key_creation_method;
			if (key_method === 'ingenico_infinea_key') {
				$scope.zestStationData.keyWriter = 'local';
			} else if (key_method === 'remote_encoding') {
				$scope.zestStationData.keyWriter = 'remote';
			} else { //sankyo_websocket
				$scope.zestStationData.keyWriter = 'websocket';
			}

			var ccReader = $scope.zestStationData.kiosk_cc_entry_method;
			if (ccReader === 'six_pay') {
				$scope.zestStationData.ccReader = 'six_pay';
			} else if (ccReader === 'ingenico_infinea') {
				$scope.zestStationData.ccReader = 'local'; //mli + local - ingenico/infinea
			} else { //sankyo_websocket
				$scope.zestStationData.ccReader = 'websocket';
			}
			changeIconsIfDemo();
		};

		var changeIconsIfDemo = function() {
			if (forDemo()) { //if we are reading locally, we'll show the ICMP icons for our SNT 
				$scope.icons.url.creditcard_icmp = $scope.iconsPath + '/demo_swiper.svg';
				$scope.icons.url.createkey_icmp = $scope.iconsPath + '/demo_keyencoder.svg';
				console.warn('using demo icons for create key and credit card reading');
				$scope.icmp = true;
			} else {
				$scope.icmp = false;
			}
		};

		var forDemo = function() {
			console.info('readLocally() : ', readLocally())
			if (readLocally() && $scope.zestStationData.theme === 'snt') {
				console.info('forDemo: !!!');
				return true;
			} else {
				console.info('not forDemo: ');
				return false;
			}
		};


		$scope.keyFromSocket = function() {
			if ($scope.zestStationData.keyWriter === 'websocket') {
				return true;
			} else {
				return false;
			}
		};
		$scope.writeLocally = function() {
			if ($scope.zestStationData.keyWriter === 'local') {
				return true;
			} else {
				return false;
			}
		};

		$scope.inDemoMode = function() {
			if ($scope.zestStationData.demoModeEnabled === 'true') {
				console.warn('in demo mode');
				return true;
			} else {
				return false;
			}
		};

		var readLocally = function() {
			if ($scope.zestStationData.ccReader === 'local') {
				return true;
			} else {
				return false;
			}
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
			$scope.callAPI(zsGeneralSrv.fetchWorkStations, options);
		};



		$scope.useNavIcons = true;

		$scope.$on('DONT_USE_NAV_ICONS', function() {
			$scope.useNavIcons = false;
		});

		$(window).resize(function() {
			//restrict keyboard if screen is resized
			//to lower height
			if (window.innerHeight < 700) {
				$scope.hideKeyboardIfUp();
				$scope.runDigestCycle();
			}
		});


		$scope.showKeyboardOnInput = function() {
			//restrict keyboard if screen is resized
			//to lower height
			if (window.innerHeight < 700) {
				return;
			}
			var frameBody = $("#booking_iframe").contents().find("body");
			frameBody.focus(function() {
				console.log('iframe focus')
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
							console.warn($(focused).getkeyboard())
						}

					}
				}
			}
		};
		$scope.showOnScreenKeyboard = function(id) {
			//restrict keyboard if screen is resized
			//to lower height
			if (window.innerHeight < 700) {
				return;
			}
			$scope.lastKeyboardId = id;
			//pull up the virtual keyboard (snt) theme... if chrome & fullscreen
			var isTouchDevice = 'ontouchstart' in document.documentElement,
				agentString = window.navigator.userAgent;
			var themeUsesKeyboard = false;
			if ($scope.theme === 'yotel' || !$scope.theme) {
				themeUsesKeyboard = true;
			}
			var shouldShowKeyboard = (typeof chrome) &&
				(agentString.toLowerCase().indexOf('window') !== -1) &&
				isTouchDevice &&
				$scope.inChromeApp && themeUsesKeyboard;
			if (shouldShowKeyboard) {
				if (id) {
					new initScreenKeyboardListener('station', id, true);
				}
			}
		};
		/**
		 * SVGs are ng-included inside HTML
		 **/

		$scope.showScreenIcons = function() { //currenly we will use this for yotel to detect if screen icons are needed
			//also attaching this to navigation, yotel has text back & cancel, instead of svg icons for back and close;
			if ($scope.zestStationData.theme === 'yotel') {
				return true;
			} else {
				return false;
			}
		};
		$scope.setSvgsToBeLoaded = function(iconsPath, commonIconsPath, useCommonIcons) {
			var iconBasePath = (!useCommonIcons ? iconsPath : commonIconsPath);

			$scope.activeScreenIcon = 'bed';
			$scope.icons = {
				url: {

					active_screen_icon: iconsPath + '/screen-' + $scope.activeScreenIcon + '.svg',

					checkin: iconBasePath + '/checkin.svg',
					checkout: iconBasePath + '/checkout.svg',
					key: iconBasePath + '/key.svg',

					oos: iconBasePath + '/oos.svg',
					back: iconBasePath + '/back.svg',
					close: iconBasePath + '/close.svg',

					date: iconBasePath + '/date.svg',
					staff: iconBasePath + '/staff.svg',
					email: iconBasePath + '/email.svg',
					pen: iconBasePath + '/pen.svg',
					creditcard: iconBasePath + '/creditcard.svg',
					keyboard: iconBasePath + '/keyboard.svg',
					noprint: iconBasePath + '/no-print.svg',
					print: iconBasePath + '/print.svg',
					confirmation: iconBasePath + '/confirmation.svg',
					moon: iconBasePath + '/moon.svg',
					qr: iconBasePath + '/qr-scan.svg',
					qr_noarrow: iconBasePath + '/qr-scan_noarrow.svg',
					createkey: iconBasePath + '/create-key.svg',
					logo: iconBasePath + '/print_logo.svg',
					watch: iconBasePath + '/watch.svg',
					qr_arrow: iconBasePath + '/qr-arrow.svg'
				}
			};
		};

		/********************************************************************************
		 *  Yotel has and icon at the top of the page which change depending on the state
		 ********************************************************************************/

		$scope.setScreenIcon = function(name) {
			if ($scope.zestStationData.theme !== 'yotel') {
				return;
			} else {
				$scope.activeScreenIcon = name;
				if ($scope.icons && $scope.icons.url) {
					$scope.icons.url.active_screen_icon = $scope.iconsPath + '/screen-' + $scope.activeScreenIcon + '.svg';
				}
			}
		};
		/**
		 * get paths for theme based Icon files
		 **/
		$scope.$on('updateIconPath', function(evt, theme) {
			var commonIconsPath = '/assets/zest_station/css/icons/default';

			if (theme === 'yotel') {
				$scope.$emit('DONT_USE_NAV_ICONS');
				$scope.theme = theme;
				$scope.iconsPath = '/assets/zest_station/css/icons/yotel';
				$scope.setSvgsToBeLoaded($scope.iconsPath, commonIconsPath, false);
			} else if (theme === 'fontainebleau') {
				//nothing else
			} else if (theme === 'conscious') {
				$scope.theme = theme;
				$scope.iconsPath = '/assets/zest_station/css/icons/conscious';
				$scope.setSvgsToBeLoaded($scope.iconsPath, commonIconsPath, true);
			} else {
				$scope.iconsPath = commonIconsPath;
			}
		});

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
				var currentState = $state.current.name;
				//the user inactivity actions need not be done when user in 
				//home screen or in admin screen or in OOS screen
				//include the states, which don't need the timeout to be handled 
				//in the below condition
				if ($scope.zestStationData.idle_timer.enabled === 'true' && !(currentState === 'zest_station.admin' || currentState === 'zest_station.home' || currentState === 'zest_station.outOfService')) {
					userInActivityTimeInSeconds = userInActivityTimeInSeconds + 1;
					//when user activity is not recorded for more than idle_timer.prompt
					//time set in admin, display inactivity popup
					if (userInActivityTimeInSeconds >= $scope.zestStationData.idle_timer.prompt) {
						if (currentState === 'zest_station.checkInSignature' || currentState === 'zest_station.checkInCardSwipe') {
							$scope.$broadcast('USER_ACTIVITY_TIMEOUT');
						} else {
							$scope.zestStationData.timeOut = true;
						}
						$scope.runDigestCycle();
						$scope.hideKeyboardIfUp();
					} else {
						//do nothing;
					}
					//when user activity is not recorded for more than idle_timer.max
					//time set in admin, got to home page
					if (userInActivityTimeInSeconds >= $scope.zestStationData.idle_timer.max && currentState !== 'zest_station.checkInSignature' && currentState !== 'zest_station.checkInCardSwipe') {
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

		/**
		 * [CheckForWorkStationStatusContinously description]
		 *  Check if admin has set back the status of the
		 *  selected workstation to in order
		 */
		var CheckForWorkStationStatusContinously = function() {
			$scope.$emit('FETCH_LATEST_WORK_STATIONS');
			$timeout(CheckForWorkStationStatusContinously, 120000);
		};
		/********************************************************************************
		 *  User activity timer
		 *  ends here
		 ********************************************************************************/


		$rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
			$scope.hideKeyboardIfUp();
			console.info("\ngoing to----->" + from.name);
			console.info("to stateparams" + toParams);
			console.info(toParams);
			console.info("going to----->" + to.name);
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

			if (!!response.RVCardReadPAN) {
				$scope.$broadcast('SWIPE_ACTION', response);
			} else if (response.Command === 'cmd_insert_key_card') {

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
				if (response.ResponseCode === 0) {
					$scope.$broadcast('DISPENSE_SUCCESS', {
						"cmd": response.Command,
						"msg": response.Message
					});
				} else if (response.ResponseCode === 14) {
					$scope.$broadcast('DISPENSE_CARD_EMPTY');
				} else {
					$scope.$broadcast('DISPENSE_FAILED');
				};
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
				$scope.zestStationData.set_workstation_id = "";
				$scope.zestStationData.key_encoder_id = "";
				$scope.zestStationData.workstationStatus = "out-of-order";
				if ($scope.zestStationData.isAdminFirstLogin && ($scope.inChromeApp || $scope.isIpad)) {
					$state.go('zest_station.admin');
				} else {
					if ($state.current.name !== 'zest_station.admin') {
						$state.go('zest_station.outOfService');
					} else {
						//do nothing
					}
				}
			} else {
				$scope.workstation = {
					'selected': station
				};
				// set work station id and status
				$scope.zestStationData.set_workstation_id = $scope.getStationIdFromName(station.name).id;
				$rootScope.workstation_id = $scope.zestStationData.set_workstation_id;
				$scope.zestStationData.key_encoder_id = $scope.getStationIdFromName(station.name).key_encoder_id;
				var previousWorkStationStatus = angular.copy($scope.zestStationData.workstationStatus);
				$scope.zestStationData.workstationStatus = station.is_out_of_order ? 'out-of-order' : 'in-order';
				var newWorkStationStatus = angular.copy($scope.zestStationData.workstationStatus);
				//if app is invoked from ipad, chrome app etc
				//don't go to OOS even if workstation status is oos
				if (!($scope.zestStationData.isAdminFirstLogin && ($scope.inChromeApp || $scope.isIpad)) && $scope.zestStationData.workstationStatus === 'out-of-order') {
					if ($state.current.name !== 'zest_station.admin') {
						$state.go('zest_station.outOfService');
					} else {
						//do nothing
					}
				} else {
					//when status is changed from admin
					if (previousWorkStationStatus === 'out-of-order' && newWorkStationStatus === 'in-order') {
						$state.go('zest_station.home');
					} else {
						//if application is launched either in chrome app or ipad go to login page
						if ($scope.zestStationData.isAdminFirstLogin && ($scope.inChromeApp || $scope.isIpad)) {
							$state.go('zest_station.admin');
						} else {
							//we want to treat other clients are normal, ie need to provide 
							//user credentials before accesing admin
							$scope.zestStationData.isAdminFirstLogin = false;
							if (previousWorkStationStatus === 'out-of-order' && newWorkStationStatus === 'in-order') {
								$state.go('zest_station.home');
							} else {
								//do nothing
							}
						}
					}
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
				failureCallBack: onFail,
				'loader': 'none'
			};
			$scope.callAPI(zsGeneralSrv.fetchWorkStations, options);
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
				if ($state.current.name !== 'zest_station.admin') {
					$state.go('zest_station.outOfService');
				} else {
					//do nothing
				}
				$scope.callAPI(zsGeneralSrv.updateWorkStationOos, options);
			} else {
				//Make work stataion back to in order
				console.info('putting station back in order');
				var options = {
					params: {
						'oo_status': false,
						'id': $scope.zestStationData.set_workstation_id
					}
				};
				$scope.callAPI(zsGeneralSrv.updateWorkStationOos, options);
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
			//maximize the chrome app in the starting
			(chromeAppId !== null && chromeAppId.length > 0) ? chrome.runtime.sendMessage(chromeAppId, "zest-station-login"): "";
		};
		var colorLogText = function(val) {
			//if using chrome, push debugging log for UI, colors only supported by chrome 24+
			try {
				if (val) {
					return 'color:#007F00';
				} else {
					return 'color:#e7390c';
				}
			} catch (err) {
				console.log('error trying color logging');
				console.log(err);
				return val;
			}
		};
		var logTextOnOff = function(val) {
			//if using chrome, push debugging log for UI, colors only supported by chrome 24+
			try {
				if (val) {
					return '[ On ]';
				} else {
					return '[ Off ]';
				}
			} catch (err) {
				console.log('error trying color logging');
				console.log(err);
				return val;
			}
		};
		var logSetting = function(txt, setting) {
			//adds colors green/red to console log, to quickly check if a setting is enabled or disabled
			console.log('%c' + txt + logTextOnOff(setting), colorLogText(setting))
		};
		/*
		 * Take a quick look at hotel + zest station settings, 
		 *  -helpful for debugging and making sure settings are what we expect
		 */
		var logStationSettings = function() {
			var setting = $scope.zestStationData;
			console.log('');
			console.log('-');
			console.log('-:-');
			//zest-station general settings
			console.log(' -:- Station Settings -:- ', setting);
			console.log('');
			logSetting('  - Hourly Hotel Mode  :  ', $scope.zestStationData.isHourlyRateOn);

			console.log('  - Payment Gateway    :  ', setting.paymentGateway);
			console.log('  - Key Writer         :  ', setting.keyWriter);
			console.log('  - CC Reader          :  ', setting.ccReader);
			logSetting('  - Idle Timer         :  ', setting.idle_timer.enabled);
			console.log('    -> Prompt  : ', (setting.idle_timer.prompt), 'sec ');
			console.log('    -> Home    : ', (setting.idle_timer.max), 'sec ');
			console.log('');
			console.log('  - Chrome App ID      :  ', setting.chrome_app_id);
			console.log('  - Bussiness Date     :  ', setting.bussinessDate);
			console.log('  - Check-in Time      :  ', setting.check_in_time.hour + ':' + setting.check_in_time.minute + ' - ' + setting.check_in_time.primetime);
			console.log('  - Check-out Time     :  ', setting.check_out_time.hour + ':' + setting.check_out_time.minute + ' - ' + setting.check_out_time.primetime);
			//check-in
			console.log('');
			console.log('  - Check-In Settings - ');
			console.log('');
			logSetting('  -  *Confirmation      :  ', setting.checkin_screen.authentication_settings.confirmation);
			logSetting('  -  *Departure Date    :  ', setting.checkin_screen.authentication_settings.departure_date);
			logSetting('  -  *Email             :  ', setting.checkin_screen.authentication_settings.email);
			logSetting('  -  *No. Nights        :  ', setting.checkin_screen.authentication_settings.number_of_nights);
			logSetting('  -  Enforce Deposit    :  ', setting.enforce_deposit);
			logSetting('  -  Early Check-In     :  ', setting.offer_early_checkin);
			logSetting('  -  On-Screen Room No  :  ', setting.show_room_number);
			logSetting('  -  Collect Nationality:  ', setting.check_in_collect_nationality);
			logSetting('  -  OWS Guest Messeges :  ', setting.is_kiosk_ows_messages_active);
			logSetting('  -  Display Terms      :  ', setting.kiosk_display_terms_and_condition);
			logSetting('  -  ByPass Prepaid CC  :  ', setting.bypass_cc_for_prepaid_reservation);
			logSetting('  -  Validate First Name:  ', setting.kiosk_validate_first_name);
			logSetting('  -  Country Sorted List:  ', setting.kiosk_enforce_country_sort);
			//check-out
			console.log('');
			console.log('  - Check-Out Settings - ');
			console.log('');
			logSetting('  -  Key Card Lookup    :  ', setting.checkout_keycard_lookup);
			console.log('');
			console.log('  - Guest Bill Delivery:  ');
			console.log('');
			logSetting('  -  Print              :  ', setting.guest_bill.print);
			logSetting('  -  Email              :  ', setting.guest_bill.email);
			//pickup key
			console.log('');
			console.log('  - Pick-Up Keys Settings - ');
			console.log('');
			logSetting('  -  QR Scanner        :  ', setting.pickup_qr_scan);
			logSetting('  -  QR FailOver       :  ', setting.pickup_qr_scan_fail_over);
			console.log('');
			console.log('  - Authentication - ');
			console.log('');
			logSetting('  - Datalogic           :  ', setting.qr_scanner_datalogic);
			logSetting('  - Samsotech           :  ', setting.qr_scanner_samsotech);
			console.log('  - Arrow Direction    :  ', setting.qr_scanner_arrow_direction);
			console.log('');
			console.log(' -:-- - - - - - - - --:- ');
			console.log('-:-');
			console.log('-');
			console.log('');
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
					console.log('hide keyboard if up');
					$scope.hideKeyboardIfUp();
				} else if (e.target.tagName == 'BUTTON' || e.target.tagName === 'DIV' || e.target.tagName === 'BTN') {
					if (e.target.className.indexOf('keyboard') != -1) {
						console.warn('button or div with keyboard el');
					} else {
						console.log('hide keyboard if up');
						$scope.hideKeyboardIfUp();
					}
				}
			}

			var el = window.document;
			el.addEventListener("touchstart", optimizeTouch, false);
			el.addEventListener("touchend", optimizeTouch, false);
			el.addEventListener("touchcancel", optimizeTouch, false);
			el.addEventListener("touchmove", optimizeTouch, false);
		}


		/***
		 * [initializeMe description]
		 * @return {[type]} [description]
		 */
		var initializeMe = function() {
			$('body').css('display', 'none'); //this will hide contents until svg logos are loaded
			//call Zest station settings API
			$scope.zestStationData = zestStationSettings;
			$scope.zestStationData.demoModeEnabled = 'false'; //demo mode for hitech, only used in snt-theme
			$scope.zestStationData.isAdminFirstLogin = true;
			CheckForWorkStationStatusContinously();
			//$scope.zestStationData.checkin_screen.authentication_settings.departure_date = true;//left from debuggin?
			setAUpIdleTimer();
			$scope.zestStationData.workstationOooReason = "";
			$scope.zestStationData.workstationStatus = "";
			$scope.zestStationData.wsIsOos = false;
			$scope.showLanguagePopup = false;
			$scope.inChromeApp ? maximizeScreen() : "";
			//create a websocket obj
			$scope.socketOperator = new webSocketOperations(socketOpenedSuccess, socketOpenedFailed, socketActions);
			fetchHotelSettings();
			getAdminWorkStations();
			$scope.zestStationData.bussinessDate = hotelTimeData.business_date;
			zestSntApp.setBrowser();
			if ($scope.inChromeApp) {
				optimizeTouchEventsForChromeApp();
			}
			//initCardReadTest(); //debugging, comment out when done

			//flag to check if default language was set or not
			$scope.zestStationData.IsDefaultLanguageSet = false;
		}();
	}
]);