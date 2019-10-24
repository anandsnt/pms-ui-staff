admin.controller('ADzestWebGlobalSettingsCtrl', ['$scope', 'ADzestWebGlobalSettingsSrv', 'ngDialog', 'zestWebGlobalSettings', '$controller',
	function($scope, ADzestWebGlobalSettingsSrv, ngDialog, zestWebGlobalSettings, $controller) {

		BaseCtrl.call(this, $scope);
		$scope.successMessage = '';
		$scope.languages = ["EN", "ES"];
		$scope.supportedFonts = ADzestWebGlobalSettingsSrv.webSafeFonts;
		$scope.iconColors = ["White", "Black"];
		$scope.selectedMenu = "";
		$scope.globalSettings = zestWebGlobalSettings.zest_web; // resolved on route change

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
		// on scolling hide all the color pickers
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
		var setUpPopUpDataAndOpen = function(template, className, isSmallDevice) {
			ngDialog.open({
				controller: $controller('adZestWebPreviewCtrl', {
					$scope: $scope,
					isSmallDevice: isSmallDevice
				}),
				closeByDocument: true,
				template: '/assets/partials/zestwebGlobalSettings/' + template,
				className: 'ngdialog-theme-default ' + className
			});
		};
		var openSmallScreenPreview = function() {
			setUpPopUpDataAndOpen('adZestWebPreview.html', 'phone-preview', true);
		};
		var openLargeScreenPreview = function() {
			setUpPopUpDataAndOpen('adZestWebLargeScreenPreview.html', 'ipad-preview', false);
		};

		$scope.previewClicked = function() {
			$scope.globalSettings.is_large_screen_preview_on ? openLargeScreenPreview() : openSmallScreenPreview();
		};
		// image upload section starts here
		$scope.isImageAvailable = function(image) {
			return (image !== '') ? true : false;
		};
		var isEmptyString = function(str) {
			return (_.isUndefined(str) || _.isNull(str) || str.length === 0);
		};
		// image place holder texts

		$scope.stripAndDisplay = function(str) {
			return  isEmptyString(str) ? "select image.." : "..." + str.substring((str.length - 15), str.length);
		};
	}
]);