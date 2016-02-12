admin.controller('ADzestWebGlobalSettingsCtrl', ['$scope', 'ADzestWebGlobalSettingsSrv', function($scope, ADzestWebGlobalSettingsSrv) {

	BaseCtrl.call(this, $scope);
	$scope.successMessage = '';
	$scope.languages = ["EN", "ES"];
	$scope.supportedFonts = ['Source Sans Pro', 'VAGRounded-Light'];
	$scope.selectedMenu = "general";
	$scope.globalSettings = {
		"zest_web": {
			"is_cms_on": false,
			"language": "EN",
			"main_bg": {
				"background": "red",
				"color": "white"
			},
			"header_bg": {
				"background": "red"
			},
			"button": {
				"background": "red",
				"color": "white"
			},
			"light_button": {
				"background": "red",
				"color": "white"
			},
			"dark_button": {
				"background": "red",
				"color": "white"
			},
			"title_text_color": "",
			"sub_text_color": ""
		}
	};

	var successCallbackFetch = function(data) {
		$scope.globalSettings = data.zest_web;
		$scope.$emit('hideLoader');
	};
	$scope.invokeApi(ADzestWebGlobalSettingsSrv.fetchZestwebGlobalSettings, "", successCallbackFetch);


	$scope.saveSettings = function() {
		var saveSettingsCallback = function() {
			$scope.$emit('hideLoader');
			$scope.successMessage = 'Success';
			$scope.selectedMenu = "";
		}
		var data = {
			"zest_web": $scope.globalSettings
		}
		$scope.invokeApi(ADzestWebGlobalSettingsSrv.saveZestwebGlobalSettings, data, saveSettingsCallback);
	};
	//on scolling hide all the color pickers
	$scope.pageScrolled = function() {
		$("*").spectrum("hide");
	};

	$scope.$on("changeMenu", function(e, value) {
		$scope.selectedMenu = value;
	});
	$scope.cancelClicked = function() {
		$scope.selectedMenu = "";
	};

}]);