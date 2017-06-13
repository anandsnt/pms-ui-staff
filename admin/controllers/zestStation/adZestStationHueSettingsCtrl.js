admin.controller('adZestStationHueSettingsCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'ADZestStationSrv', 'kioskSettings', '$log',
	function($scope, $state, $rootScope, $stateParams, ADZestStationSrv, kioskSettings, $log) {

		BaseCtrl.call(this, $scope);
		$scope.$emit('changedSelectedMenu', 10);
		$scope.errorMessage = '';
		$scope.successMessage = '';
		$scope.hueSettings = kioskSettings;
		$scope.availableBridges = []; // Have to manulay discover bridges
		$scope.availableLights = []; // Have to manulay discover lights
		var ws;

		var bridge,
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

		// https://github.com/StayNTouch/pms/blob/develop/app/assets/admin/controllers/zestStation/adZestStationHueSettingsCtrl.js
		var handleWebSocketResponse = function(response) {
			if (response.ResponseCode === 0 && response.Command === 'cmd_hue_light_locate_bridge_ips') {
				$scope.availableBridges = response.bridgeIps;
			} else if (response.Command === 'cmd_hue_light_register') {
				if (response.ResponseCode === 0) {
					$scope.newUsername = response.appKey;
					runDigestCycle();
				} else {
					$scope.errorMessage = [response.Message];
					scrollTop();
				}
			} else if (response.ResponseCode === 0 && response.Command === 'cmd_hue_light_list') {
				// for (var key in lightsData) {
				// 		if (lightsData.hasOwnProperty(key)) {
				// 			$scope.availableLights.push({
				// 				id: key,
				// 				name: lightsData[key].name,
				// 				type: lightsData[key].type,
				// 				reachable: lightsData[key].state.reachable
				// 			});
				// 		}
				// 	}
				$scope.availableLights = [];
				_.each(response.lights, function(light) {
					$scope.availableLights.push({
						id: light
					});
				});
				runDigestCycle();
			}
		};

		function createNewWebSocketConnection() {
			ws = new WebSocket("wss://localhost:4649/CCSwipeService");
			//Triggers when websocket connection is established.
			ws.onopen = function() {
				$log.info("Connected. Warning : Clicking on Connect multipple times will create multipple connections to the server");
				$scope.successMessage = "Zest station handler is running.";
				scrollTop();
			};

			// Triggers when there is a message from websocket server.
			ws.onmessage = function(evt) {
				var response = JSON.parse(evt.data)
				var cmd = response.Command,
					msg = response.Message;
				// to delete after QA pass

				$log.info('Websocket: msg ->' + msg + '--' + 'Websocket: Command ->' + cmd);

				console.log(response.ResponseCode);
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
		};
		createNewWebSocketConnection();

		$scope.connectUsingWS = function() {
			createNewWebSocketConnection();
		};

		var sendCommand = function(Command, Data, hueLightAppkey) {
			if (ws.readyState === 1) {
				ws.send("{\"Command\" : \"" + Command + "\", \"Data\" : \"" + $scope.hueSettings.hue_bridge_ip + "\", \"hueLightAppkey\" : \"" + $scope.hueSettings.hue_user_name + "\"}");

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
			sendCommand('discover_bridges');
		};

		$scope.turnOFFLight = function() {
			sendCommand('discover_bridges');
		};
	}
]);