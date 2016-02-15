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
		$scope.closeDialog = function() {
			ngDialog.close();
		};
		$scope.previewClicked = function() {
			$scope.previewData = ($scope.previewData.hasOwnProperty("is_cms_on")) ? $scope.previewData : angular.copy($scope.globalSettings);
			ngDialog.open({
				template: '/assets/partials/zestwebGlobalSettings/adZestWebPreview.html',
				className: 'ngdialog-theme-default single-calendar-modal phone-preview',
				controller: 'adZestWebPreviewCtrl',
				scope: $scope,
				closeByDocument: true
			});
		}

	}
]);