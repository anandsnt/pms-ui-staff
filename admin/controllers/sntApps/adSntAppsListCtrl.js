admin.controller('ADSntAppsListCtrl', ['$scope',
	'adDebuggingSetupSrv', 'adAppVersionsSrv', 'ngTableParams', '$filter', 'appTypes', '$state', 'ngDialog', '$timeout',
	function($scope, adDebuggingSetupSrv, adAppVersionsSrv, ngTableParams, $filter, appTypes, $state, ngDialog, $timeout) {
		BaseCtrl.call(this, $scope);


		var pendingUploadIds = [];
		var checkStatusOfpendingUploadIds = function() {

			var fetchVersionsStatusSuccess = function(response) {
				var allStatusUpdated = true;

				_.each(response, function(build) {
					if (build.upload_status === 'PENDING') {
						allStatusUpdated = false;
					}
					if (build.upload_status === 'SUCCESS' || build.upload_status === 'FAILURE') {
						pendingUploadIds = _.without(pendingUploadIds, build.id);
					}
					// update the list wrt to this API response
					_.each($scope.appList, function(app) {
						if (app.id === build.id) {
							app.upload_status = build.upload_status;
							if (build.upload_status === 'FAILURE') {
								app.upload_failure_reason = build.upload_failure_reason;
							}
						}
					});
				});

				if (!allStatusUpdated) {
					$timeout(checkStatusOfpendingUploadIds, 3000);
				}
			};

			$scope.callAPI(adAppVersionsSrv.checkVersionStatus, {
				params: {
					pending_upload_ids: JSON.stringify(pendingUploadIds),
					service_application_type_id: $scope.filterType.id
				},
				loader: 'NONE',
				successCallBack: fetchVersionsStatusSuccess,
				failureCallBack: function() {
					// do nothing
				}
			});
		};
		
		var fetchAppVersions = function() {

			var fetchAppListSuccessCallback = function(data) {

				$scope.appList = data;
				// check if any of the version upload is in pending status
				pendingUploadIds = [];
				_.each($scope.appList, function(app) {
					if (app.upload_status === 'PENDING') {
						pendingUploadIds.push(app.id);
					}
				});

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
				// if any of the versions is in PENDING status call API to retrive the status continuosly
				if (pendingUploadIds.length > 0) {
					checkStatusOfpendingUploadIds();
				}
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

		var uploadBuild = function() {
			
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
		};

		$scope.continueToVersionList = function () {
			ngDialog.close();
			fetchAppVersions();
		};

		$scope.checkIfVersionIsValid = function() {
            $scope.fileName = $scope.selectedApp.sftp_path;
			$scope.clearErrorMessage();
			$scope.callAPI(adAppVersionsSrv.checkIfVersionIsValid, {
				params: {
					version: $scope.selectedApp.version,
					service_application_type_id: $scope.filterType.id,
					sftp_path: $scope.selectedApp.sftp_path
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

		(function() {
			$scope.fileName = "";
			$scope.errorMessage = '';
			$scope.screenMode = 'BUILD_LIST';
			setAppTypes(appTypes);
		})();
	}
]);
