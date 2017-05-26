admin.controller('adZestStationHueSettingsCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'ADZestStationSrv', 'kioskSettings',
	function($scope, $state, $rootScope, $stateParams, ADZestStationSrv, kioskSettings) {
		
		BaseCtrl.call(this, $scope);
		$scope.$emit('changedSelectedMenu', 10);
		$scope.availableBridges = []; // Have to manulay discover bridges
		$scope.availableLights = []; // Have to manulay discover lights

		$scope.hueSettings = kioskSettings.hueSettings;
		$scope.saveSettings = function() {
			var saveSuccess = function() {
				$scope.successMessage = 'Success';
				$scope.$emit('hideLoader');
			};

			var dataToSend = {
				'kiosk': $scope.data
			};

			$scope.invokeApi(ADZestStationSrv.save, dataToSend, saveSuccess, saveFailed);
		};


		$scope.discoverBridges =  function(){
			var data = [{"id":"001788fffe100491","internalipaddress":"192.168.2.23","macaddress":"00:17:88:10:04:91","name":"Philips Hue"},{"id":"001788fffe09a168","internalipaddress":"192.168.88.252"},{"id":"001788fffe16c18f","internalipaddress":"192.168.2.20","macaddress":"00:17:88:16:c1:8f","name":"Philips Hue"}];
			$scope.availableBridges =  data;
		};

		$scope.createNewUser  = function(){
			$scope.hueSettings = {};
			$scope.newUsername = "VFYBEUIN(@NNINVFYBEUIN(@NNINVFYBEUIN(@NNINVFYBEUIN(@NNIN";
		};

		$scope.getLightsList = function(){
			var lightsData = {"1":{"state":{"on":true,"bri":144,"hue":13088,"sat":212,"xy":[0.5128,0.4147],"ct":467,"alert":"none","effect":"none","colormode":"xy","reachable":true},"type":"Extended color light","name":"Hue Lamp 1","modelid":"LCT001","swversion":"66009461","pointsymbol":{"1":"none","2":"none","3":"none","4":"none","5":"none","6":"none","7":"none","8":"none"}},"2":{"state":{"on":false,"bri":0,"hue":0,"sat":0,"xy":[0,0],"ct":0,"alert":"none","effect":"none","colormode":"hs","reachable":true},"type":"Extended color light","name":"Hue Lamp 2","modelid":"LCT001","swversion":"66009461","pointsymbol":{"1":"none","2":"none","3":"none","4":"none","5":"none","6":"none","7":"none","8":"none"}}}
			$scope.availableLights = [];
			for (var key in lightsData) {
			  if (lightsData.hasOwnProperty(key)) {
			    console.log(key + " -> " + lightsData[key].name +" "+ lightsData[key].type);
			    $scope.availableLights.push({id:key,name:lightsData[key].name,type: lightsData[key].type});
			  }
			}
		};


	}
]);