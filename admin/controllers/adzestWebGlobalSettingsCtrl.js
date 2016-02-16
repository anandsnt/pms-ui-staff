admin.controller('ADzestWebGlobalSettingsCtrl', ['$scope', 'ADzestWebGlobalSettingsSrv', 'ngDialog', 'zestWebGlobalSettings','$controller',
	function($scope, ADzestWebGlobalSettingsSrv, ngDialog, zestWebGlobalSettings,$controller) {

		BaseCtrl.call(this, $scope);
		$scope.successMessage = '';
		$scope.languages = ["EN", "ES"];
		$scope.supportedFonts = ['Source Sans Pro', 'VAGRounded-Light'];
		$scope.iconColors = ["White", "Black"];
		$scope.selectedMenu = "";
		$scope.globalSettings = zestWebGlobalSettings.zest_web; //resolved on route change

		$scope.saveSettings = function() {
			var saveSettingsCallback = function() {
				$scope.successMessage = 'Success';
			};
			var options = {
				params: {
					"zest_web": $scope.globalSettings
				},
				successCallBack: saveSettingsCallback
			};
			$scope.callAPI(ADzestWebGlobalSettingsSrv.saveZestwebGlobalSettings, options);
		};
		//on scolling hide all the color pickers
		$scope.pageScrolled = function() {
			$("*").spectrum("hide");
		};
		// selected menu changed
		$scope.$on("changeMenu", function(e, value) {
			$scope.selectedMenu = value;
		});
		$scope.cancelClicked = function() {
			$scope.selectedMenu = "";
		};
		var setUpPopUpData = function(template, className, isSmallDevice) {
			return {
				controller: $controller('adZestWebPreviewCtrl', {
					$scope: $scope,
					isSmallDevice: isSmallDevice
				}),
				closeByDocument: true,
				template: template,
				className: className
			};
		};
		var openPreviewForSmallerScreens = function() {
			var popupSetup = setUpPopUpData('/assets/partials/zestwebGlobalSettings/adZestWebPreview.html',
				'ngdialog-theme-default single-calendar-modal phone-preview', true);
			ngDialog.open(popupSetup);
		};
		var openPreviewForLargerScreens = function() {
			var popupSetup = setUpPopUpData('/assets/partials/zestwebGlobalSettings/adZestWebLargeScreenPreview.html',
				'ngdialog-theme-default single-calendar-modal ipad-preview', false);
			ngDialog.open(popupSetup);
		};
		$scope.previewClicked = function() {
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