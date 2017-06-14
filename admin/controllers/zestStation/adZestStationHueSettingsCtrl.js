admin.controller('adZestStationHueSettingsCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'ADZestStationSrv', 'kioskSettings', '$log',
	function($scope, $state, $rootScope, $stateParams, ADZestStationSrv, kioskSettings, $log) {


		var initialize = (function() {
			BaseCtrl.call(this, $scope);
			$scope.$emit('changedSelectedMenu', 10);
			$scope.errorMessage = '';
			$scope.successMessage = '';
			$scope.hueSettings = kioskSettings;
			$scope.availableBridges = []; // Have to manulay discover bridges
			$scope.availableLights = []; // Have to manulay discover lights
		}());

		var ws, runDigestCycle = function() {
				if (!$scope.$$phase) {
					$scope.$digest();
				}
			},
			scrollTop = function() {
				$(".content-scroll").scrollTop(0);
				$scope.$emit('hideLoader');
				runDigestCycle();
			};

		/**
		 * [saveSettings description]
		 * @return {[type]} [description]
		 */
		$scope.saveSettings = function() {
			$scope.invokeApi(ADZestStationSrv.save, {
				'kiosk': $scope.hueSettings
			}, function() {
				$scope.successMessage = 'Success';
				$scope.$emit('hideLoader');
				scrollTop();
			});
		};

		/**
		 * [handleWebSocketResponse websocket response actions]
		 * @param  {[type]} response [description]
		 * @return {[type]}          [description]
		 */
		var handleWebSocketResponse = function(response) {
			if (response.ResponseCode === 0 && response.Command === 'cmd_hue_light_locate_bridge_ips') {
				$scope.availableBridges = response.bridgeIps;
				$log.info('bridges -->' + $scope.availableBridges);
			} else if (response.Command === 'cmd_hue_light_register') {
				if (response.ResponseCode === 0) {
					$scope.newUsername = response.appKey;
					runDigestCycle();
				} else {
					$scope.errorMessage = [response.Message];
					scrollTop();
				}
			} else if (response.ResponseCode === 0 && response.Command === 'cmd_hue_light_list') {
				$scope.availableLights = [];
				_.each(response.lights, function(light) {
					$scope.availableLights.push({
						id: light.id,
						name: light.name,
						type: light.type,
						reachable: light.state.reachable
					});
				});
				runDigestCycle();
			} else if (response.Command === 'cmd_hue_light_change') {
				if (response.ResponseCode === 0) {
					$log.info('Selected Light is turned ON/OFF');
				} else {
					$log.error('Selected Light is not reachable');
				}
			}
		};

		/**
		 * [createNewWebSocketConnection description]
		 * @return {[type]} [description]
		 */
		function createNewWebSocketConnection() {
			ws = new WebSocket("wss://localhost:4649/CCSwipeService");
			// Triggers when websocket connection is established.
			ws.onopen = function() {
				$log.info("Connected. Warning : Clicking on Connect multipple times will create multipple connections to the server");
				$scope.successMessage = "Zest station handler is running.";
				scrollTop();
			};

			// Triggers when there is a message from websocket server.
			ws.onmessage = function(evt) {
				var response = JSON.parse(evt.data);
				var cmd = response.Command,
					msg = response.Message;
				// to delete after QA pass

				$log.info('Websocket: msg ->' + msg + '--' + 'Websocket: Command ->' + cmd);
				handleWebSocketResponse(response);
			};

			// Triggers when the server is down.
			ws.onclose = function() {
				// websocket is closed.
				$log.warn("WS Server is not running.");
				$scope.errorMessage = ["Zest station handler is not running."];
				scrollTop();
			};
			return ws;
		}
		createNewWebSocketConnection();

		$scope.connectUsingWS = function() {
			createNewWebSocketConnection();
		};

		var sendCommand = function(Command, lightToggleJson) {
			if (ws.readyState === 1) {
				if (lightToggleJson) {
					ws.send(lightToggleJson);
				} else {
					ws.send("{\"Command\" : \"" + Command + "\", \"Data\" : \"" + $scope.hueSettings.hue_bridge_ip + "\", \"hueLightAppkey\" : \"" + $scope.hueSettings.hue_user_name + "\"}");
				}
			} else {
				setTimeout(function() {
					$scope.errorMessage = ["Web socket not ready. Please ensure that zest station handler is running in the system. If handler is not running, please run the handler and click on connect button below."];
					scrollTop();
				}, 200);
			}
		};

		$scope.discoverBridges = function() {
			sendCommand('cmd_hue_light_locate_bridge_ips');
		};

		$scope.createNewAppKey = function() {
			sendCommand('cmd_hue_light_register');
		};

		$scope.getLightsList = function() {
			sendCommand('cmd_hue_light_list');
		};

		$scope.turnONLight = function() {

			var json = {
				"Command": "cmd_hue_light_change",
				"Data": $scope.hueSettings.hue_bridge_ip,
				"hueLightAppkey": $scope.hueSettings.hue_user_name,
				"shouldLight": "1",
				"lightColor": $scope.hueSettings.hue_light_color_hex,
				"lightList": [$scope.hueSettings.hue_test_light_id]
			};
			var jsonstring = JSON.stringify(json);
			
			sendCommand('cmd_hue_light_change', jsonstring);
		};

		$scope.turnOFFLight = function() {
			var json = {
				"Command": "cmd_hue_light_change",
				"Data": $scope.hueSettings.hue_bridge_ip,
				"hueLightAppkey": $scope.hueSettings.hue_user_name,
				"shouldLight": "0",
				"lightList": [$scope.hueSettings.hue_test_light_id]
			};
			var jsonstring = JSON.stringify(json);

			sendCommand('cmd_hue_light_change', jsonstring);
		};
	}
]);