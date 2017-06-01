admin.controller('adZestStationHueSettingsCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'ADZestStationSrv', 'kioskSettings', '$log',
	function($scope, $state, $rootScope, $stateParams, ADZestStationSrv, kioskSettings, $log) {

		BaseCtrl.call(this, $scope);
		$scope.$emit('changedSelectedMenu', 10);
		$scope.errorMessage = '';
		$scope.successMessage = '';
		$scope.hueSettings = kioskSettings;
		$scope.availableBridges = []; // Have to manulay discover bridges
		$scope.availableLights = []; // Have to manulay discover lights

		var hue = jsHue(),
			bridge,
			user;

		var runDigestCycle = function() {
			if (!$scope.$$phase) {
				$scope.$digest();
			}
		};
		
		var scrollTop = function() {
			$(".content-scroll").scrollTop(0);
			$scope.$emit('hideLoader');
			runDigestCycle();
		};

		$scope.saveSettings = function() {
			$scope.invokeApi(ADZestStationSrv.save, {
				'kiosk': $scope.hueSettings
			}, function() {
				$scope.successMessage = 'Success';
				$scope.$emit('hideLoader');
				scrollTop();
			});
		};

		$scope.discoverBridges = function() {
			hue.discover().then(function(bridges) {
				if (bridges.length === 0) {
					$scope.errorMessage = ['No bridges found.'];
					scrollTop();
				} else {
					$scope.availableBridges = bridges;
				}
				runDigestCycle();
			})
			.catch(function(e) {
				$scope.errorMessage = ['Error finding bridges'];
				$log.error(e);
				scrollTop();
				return;
			});
		};

		var createBridge = function() {
			try {
				bridge = hue.bridge($scope.hueSettings.hue_bridge_ip);
			} catch (e) {
				$scope.errorMessage = ['Error creating bridge'];
				$log.error(e);
				scrollTop();
				return;
			}
		};

		var createNewUser = function() {
			try {
				user = bridge.user($scope.hueSettings.hue_user_name);
			} catch (e) {
				$scope.errorMessage = ['Error creating user'];
				$log.error(e);
				scrollTop();
				return;
			}
		};

		/**
		 * [createNewBridgeAndUser create new user and bridge each time so as to check with latest settings at any time]
		 * @return {[type]} [description]
		 */
		var createNewBridgeAndUser = function() {
			createBridge();
			createNewUser();
		};

		$scope.createNewUser = function() {
			if (!bridge) {
				createBridge();
			}
			// create user account (requires link button to be pressed)
			bridge.createUser('snt#app').then(function(data) {
				// extract bridge-generated username from returned data
				var username = data[0].success.username;

				$scope.newUsername = username;
				// instantiate user object with username
				user = bridge.user(username);
				runDigestCycle();
			})
			.catch(function(e) {
				$scope.errorMessage = ['Sorry, someting went wrong while creating a new user name. Please note that you have to click the link button on the Hue bridge before creating a new user name.'];
				$log.error(e);
				scrollTop();
				return;
			});
		};

		$scope.getLightsList = function() {
			createNewBridgeAndUser();
			$scope.availableLights = [];
			user.getLights().then(function(lightsData) {
				if (lightsData.error) {
					$scope.errorMessage = ['Sorry, someting went wrong. Please check the lights connections'];
					scrollTop();
				} else {
					for (var key in lightsData) {
						if (lightsData.hasOwnProperty(key)) {
							$scope.availableLights.push({
								id: key,
								name: lightsData[key].name,
								type: lightsData[key].type,
								reachable: lightsData[key].state.reachable
							});
						}
					}
				}
				runDigestCycle();
			})
			.catch(function(e) {
				$scope.errorMessage = ['Sorry, someting went wrong. Please check the lights connections'];
				$log.error(e);
				scrollTop();
				return;
			});
		};

		$scope.turnONLight = function() {
			createNewBridgeAndUser();
			user.setLightState($scope.hueSettings.hue_test_light_id, {
				on: true
			}).then(function(data) {
				if (data[0].error) {
					$scope.errorMessage = ['Some thing went wrong while trying to turn ON Light with ID - ' + $scope.hueSettings.hue_test_light_id + '. Make sure this light is correctly connected and is reachable'];
				} else {
					$scope.successMessage = 'Light with ID - ' + $scope.hueSettings.hue_test_light_id + ' is turned ON';
				}
				scrollTop();
			})
			.catch(function(e) {
				$scope.errorMessage = ['Some thing went wrong while trying to turn ON Light with ID - ' + $scope.hueSettings.hue_test_light_id + '. Make sure this light is correctly connected and is reachable'];
				$log.error(e);
				scrollTop();
				return;
			});
		};

		$scope.turnOFFLight = function() {
			createNewBridgeAndUser();
			user.setLightState($scope.hueSettings.hue_test_light_id, {
				on: false
			}).then(function(data) {
				if (data[0].error) {
					$scope.errorMessage = ['Some thing went wrong while trying to turn OFF Light with ID - ' + $scope.hueSettings.hue_test_light_id + '. Make sure this light is correctly connected and is reachable'];
				} else {
					$scope.successMessage = 'Light with ID - ' + $scope.hueSettings.hue_test_light_id + ' is turned OFF';
				}
				scrollTop();
			})
			.catch(function(e) {
				$scope.errorMessage = ['Some thing went wrong while trying to turn OFF Light with ID - ' + $scope.hueSettings.hue_test_light_id + '. Make sure this light is correctly connected and is reachable'];
				$log.error(e);
				scrollTop();
				return;
			});
		};
	}
]);