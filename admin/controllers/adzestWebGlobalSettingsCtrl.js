admin.controller('ADzestWebGlobalSettingsCtrl', ['$scope', 'ADzestWebGlobalSettingsSrv', function($scope, ADzestWebGlobalSettingsSrv) {

	BaseCtrl.call(this, $scope);
	$scope.successMessage = '';
	$scope.languages = ["EN", "ES"];
	$scope.supportedFonts = ['Source Sans Pro', 'VAGRounded-Light'];
	$scope.iconColors = ["White","Black"];
	$scope.selectedMenu = "";
	$scope.globalSettings = {};

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