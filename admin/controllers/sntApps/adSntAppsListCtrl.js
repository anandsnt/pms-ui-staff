admin.controller('ADSntAppsListCtrl', ['$scope',
	'adDebuggingSetupSrv', 'adAppVersionsSrv', 'ngTableParams', '$filter', 'appTypes', '$state', 'ngDialog',
	function($scope, adDebuggingSetupSrv, adAppVersionsSrv, ngTableParams, $filter, appTypes, $state, ngDialog) {
		BaseCtrl.call(this, $scope);
		
		var fetchAppVersions = function() {

			var fetchAppListSuccessCallback = function(data) {
				$scope.appList = data;
				// REMEMBER - ADDED A hidden class in ng-table angular module js. Search for hidde or pull-right
				$scope.tableParams = new ngTableParams({
					// show first page
					page: 1,
					// count per page - Need to change when on pagination implemntation
					count: $scope.appList.length,
					sorting: {
						// initial sorting
						device_name: 'asc'
					}
				}, {
					// length of data
					total: $scope.appList.length,
					getData: function($defer, params) {
						if (params.settings().$scope === null) {
							params.settings().$scope = $scope;
						}
						// use build-in angular filter
						var orderedData = params.sorting() ?
							$filter('orderBy')($scope.appList, params.orderBy()) :
							$scope.appList;

						$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
					}
				});
				$scope.changeToListView();
				$scope.tableParams.reload();
			};

			$scope.clearErrorMessage();
			$scope.callAPI(adAppVersionsSrv.fetchAppVersions, {
				params: {
					service_application_type_id: $scope.filterType.id
				},
				successCallBack: fetchAppListSuccessCallback
			});
		};

		var setAppTypes = function(appTypes) {
			// exclude iPad Apps
			appTypes = _.filter(appTypes, function(app) {
				return app.id !== 1;
			});
			$scope.filterList = appTypes;
			$scope.filterType = appTypes[0];
			fetchAppVersions();
		};

		$scope.appTypeChanged = function() {
			fetchAppVersions();
		};

		var resetSelectedApp = function() {
			$scope.selectedApp = {
				"build": "",
				"version": "",
				"description": ""
			};
			$scope.fileName = "";
		};

		$scope.changeToUploadBuildMode = function() {
			resetSelectedApp();
			$scope.screenMode = 'ADD_BUILD';
		};

		$scope.changeToListView = function() {
			$scope.screenMode = 'BUILD_LIST';
			resetSelectedApp();
		};

		var checkIfFileTypeisInValid = function() {
			return ($scope.filterType.value === 'Rover Service Mac' && !$scope.fileName.endsWith(".pkg")) ||
				($scope.filterType.value !== 'Rover Service Mac' && !$scope.fileName.endsWith(".exe"));
		};

		var uploadBuild = function() {
			if (checkIfFileTypeisInValid()) {
				$scope.errorMessage = ['Wrong file extension !'];
			}
			// processing the huge build param will take time in backend
			// so inorder to avoid that, check if build is presnet in UI
			else if (_.isEmpty($scope.selectedApp.build)) {
				$scope.errorMessage = ['Upload Build is mandatory']
			} else {
				var params = angular.copy($scope.selectedApp);

				params.service_application_type_id = $scope.filterType.id;
				if ($scope.screenMode === 'ADD_BUILD' || $scope.fileName !== 'File Attached') {
					params.file_name = $scope.fileName;
				}
				$scope.callAPI(adAppVersionsSrv.uploadBuild, {
					params: params,
					successCallBack: function() {
						fetchAppVersions();
					}
				});
			}
		};

		$scope.checkIfVersionIsValid = function() {
			$scope.clearErrorMessage();
			$scope.callAPI(adAppVersionsSrv.checkIfVersionIsValid, {
				params: {
					version: $scope.selectedApp.version,
					service_application_type_id: $scope.filterType.id,
					file_name: $scope.fileName
				},
				successCallBack: uploadBuild
			});
		};

		var deletingAppId = '';

		$scope.deleteApp = function() {
			ngDialog.close();
			$scope.callAPI(adAppVersionsSrv.deleteBuild, {
				params: {
					service_application_type_id: $scope.filterType.id,
					id: deletingAppId
				},
				successCallBack: fetchAppVersions
			});
		};

		$scope.deleteVersion = function (app) {
			deletingAppId = app.id;
			ngDialog.open({
				template: '/assets/partials/sntApps/adSntVersionDeleteWarning.html',
				className: 'ngdialog-theme-default',
				scope: $scope,
				closeByDocument: true
			});
		};

		$scope.editApp = function() {
			// edit only avalaible for latest build
			// if (index === 0) {
			// 	$scope.selectedApp = {
			// 		"build": app.build,
			// 		"version": app.version,
			// 		"description": app.description,
			// 		"updated_on": app.updated_on,
			// 		"id": app.id
			// 	};
			// 	$scope.fileName = 'File Attached';
			// 	$scope.screenMode = 'EDIT_BUILD';
			// }
			
			// Disable edit for now
			return;
		};

		$scope.saveFTPsettings = function() {

			var saveFTPSuccess = function() {
				$scope.screenMode = 'BUILD_LIST';
			};
			var saveFTPFailure = function(response) {
				$scope.errorMessage = response;
			};

			$scope.callAPI(adAppVersionsSrv.saveFTPsettings, {
				params: $scope.settingsData,
				successCallBack: saveFTPSuccess,
				failureCallBack: saveFTPFailure
			});
		};
		$scope.fileChanged = function(data) {
			$scope.errorMessage = '';
			$scope.selectedApp.version = '';
			// extract the build version from the filename (eg:- rover-v1.0.5-installer.exe)
			var tmpStr = data.file.name.match("-v(.*)-");

			if (checkIfFileTypeisInValid()) {
				$scope.errorMessage = ['Wrong file extension !'];
			} else if (!tmpStr || tmpStr.length < 1) {
				$scope.errorMessage = ["Wrong file name format ! The file name should include the build version in the format '-vx.x.x-'"];
			} else if (tmpStr && tmpStr.length > 1) {
				$scope.selectedApp.version = tmpStr[1];
			}
		};

		(function() {
			$scope.fileName = "";
			$scope.errorMessage = '';
			$scope.screenMode = 'BUILD_LIST';
			setAppTypes(appTypes);
		})();
	}
]);
