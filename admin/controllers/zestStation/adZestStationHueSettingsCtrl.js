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


		function connectWS() {
			ws = new WebSocket("wss://localhost:4649/CCSwipeService");
			//Triggers when websocket connection is established.
			ws.onopen = function() {
				$log.info("Connected. Warning : Clicking on Connect multipple times will create multipple connections to the server");
				$scope.successMessage = "Zest station handler is running.";
				scrollTop();
			};

			// Triggers when there is a message from websocket server.
			ws.onmessage = function(response) {

				var cmd = response.Command,
					msg = response.Message;
				// to delete after QA pass

				$log.info('Websocket:-> uid=' + response.UID + '--' + 'Websocket:-> response code:' + response.ResponseCode);
				$log.info('Websocket: msg ->' + msg + '--' + 'Websocket: Command ->' + cmd);
				if (response.Command === 'cmd_insert_key_card') {};
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
		connectWS();

		$scope.connectUsingWS = function(){
			connectWS();
		};

		var isWSReady = function(){
			return (ws.readyState === 1);
		};

		var setWSError = function(){
			setTimeout(function(){
				$scope.errorMessage = ["Web socket not ready. Please ensure that zest station handler is running in the system. If handler is not running, please run the handler and click on connect button below."];
				scrollTop();
			}, 500);
			
		};

		$scope.discoverBridges = function() {
			isWSReady() ? ws.send("{\"Command\" : \"cmd_scan_passport\"}") : setWSError();

		};

		var createNewUser = function() {
			isWSReady() ? ws.send("{\"Command\" : \"cmd_scan_passport\"}") : setWSError();
		};

		$scope.createNewAppKey = function() {
			isWSReady() ? ws.send("{\"Command\" : \"cmd_scan_passport\"}") : setWSError();
		};

		$scope.createNewUser = function() {
			isWSReady() ? ws.send("{\"Command\" : \"cmd_scan_passport\"}") : setWSError();
		};

		$scope.getLightsList = function() {
			isWSReady() ? ws.send("{\"Command\" : \"cmd_scan_passport\"}") : setWSError();
		};

		$scope.turnONLight = function() {
			isWSReady() ? ws.send("{\"Command\" : \"cmd_scan_passport\"}") : setWSError();
		};

		$scope.turnOFFLight = function() {
			isWSReady() ? ws.send("{\"Command\" : \"cmd_scan_passport\"}") : setWSError();
		};
	}
]);