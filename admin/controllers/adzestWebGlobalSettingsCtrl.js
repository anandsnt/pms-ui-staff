admin.controller('ADzestWebGlobalSettingsCtrl', ['$scope', 'ADzestWebGlobalSettingsSrv', 'ngDialog', 'zestWebGlobalSettings',
	function($scope, ADzestWebGlobalSettingsSrv, ngDialog, zestWebGlobalSettings) {

		BaseCtrl.call(this, $scope);
		$scope.successMessage = '';
		$scope.languages = ["EN", "ES"];
		$scope.supportedFonts = ['Source Sans Pro', 'VAGRounded-Light'];
		$scope.iconColors = ["White", "Black"];
		$scope.selectedMenu = "";
		$scope.previewData = {};
		$scope.globalSettings = zestWebGlobalSettings.zest_web;

		$scope.saveSettings = function() {
			var saveSettingsCallback = function() {
				$scope.$emit('hideLoader');
				$scope.successMessage = 'Success';
				$scope.previewData = angular.copy($scope.globalSettings);
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

		var setUpPopUpData = function(template, className) {
			return {
				controller: 'adZestWebPreviewCtrl',
				scope: $scope,
				closeByDocument: true,
				template: template,
				className: className
			};
		};
		
		var openPreviewForSmallerScreens = function() {
			$scope.previewData = angular.copy($scope.globalSettings);
			$scope.previewData.isSmallDevice = true;
			var popupSetup = setUpPopUpData('/assets/partials/zestwebGlobalSettings/adZestWebPreview.html',
				'ngdialog-theme-default single-calendar-modal phone-preview');
			ngDialog.open(popupSetup);
		};
		var openPreviewForLargerScreens = function() {
			$scope.previewData = angular.copy($scope.globalSettings);
			$scope.previewData.isSmallDevice = false;
			var popupSetup = setUpPopUpData('/assets/partials/zestwebGlobalSettings/adZestWebLargeScreenPreview.html',
				'ngdialog-theme-default single-calendar-modal ipad-preview');
			ngDialog.open(popupSetup);
		};
		$scope.previewClicked = function() {
			$scope.previewData = angular.copy($scope.globalSettings);
			if ($scope.globalSettings.is_large_screen_preview_on) {
				openPreviewForLargerScreens();
			} else {
				openPreviewForSmallerScreens();
			};
		};
		//image upload section starts here
		$scope.isImageAvailable = function(image) {
			return (image !== '') ? true : false;
		};
		//image place holder texts
		$scope.stripAndDisplay = function(str) {
			return (typeof str === "undefined" || str === null || str.length === 0) ? "select image.." : "..." + str.substring((str.length - 15), str.length);
		};

	}
]);