admin.controller('ADSntAppsListCtrl', ['$scope',
	'adDebuggingSetupSrv', 'adAppVersionsSrv', 'ngTableParams', '$filter', 'appTypes',
	function($scope, adDebuggingSetupSrv, adAppVersionsSrv, ngTableParams, $filter, appTypes) {
		BaseCtrl.call(this, $scope);

		// $scope.sortByVersion = function() {
		// 	$scope.tableParams.sorting({
		// 		'version': $scope.tableParams.isSortBy('version', 'asc') ? 'desc' : 'asc'
		// 	});
		// };

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
				$scope.tableParams.reload();
			};

			$scope.callAPI(adAppVersionsSrv.fetchAppVersions, {
                params: {},
                successCallBack: fetchAppListSuccessCallback
            });
		};

		var setAppTypes = function (appTypes) {
			// exclude iPad Apps
			appTypes = _.filter(appTypes, function(app) {
				return app.id !== 1;
			});
			$scope.filterList = appTypes;
			$scope.filterType = appTypes[0];
		};

		$scope.appTypeChanged = function() {
			fetchAppVersions();
		};

		var resetSelectedApp = function() {
			$scope.selectedApp = {
				"build": "",
				"version": "",
				"description": "",
				"updated_on": ""
			};
		};

		$scope.changeToUploadBuildMode = function() {
			resetSelectedApp();
			$scope.screenMode = 'ADD_BUILD';
		};

		$scope.changeToListView = function() {
			$scope.screenMode = 'BUILD_LIST';
			resetSelectedApp();
		};

		$scope.uploadBuild = function() {

		};

		$scope.deleteApp = function(app) {
			console.log(app);
		};

		$scope.editApp = function(app, index) {
			// edit only avalaible for latest build
			if (index === 0) {
				$scope.selectedApp = {
					"build": app.build,
					"version": app.version,
					"description": app.description,
					"updated_on": app.updated_on
				};
				$scope.screenMode = 'EDIT_BUILD';
			}
			return;
		};

		$scope.deleteBuild  = function () {

		};

		$scope.showGeneralSettings = function () {
			$scope.appTypesList = angular.copy($scope.filterList);
			$scope.screenMode = 'SETTINGS';
		};

		$scope.updateUpgradeTime = function () {
			
			var params = {
				'service_application_types': $scope.appTypesList
			};
			var updateUpgradeTimeSuccess = function () {
				// On sucess, update filter list with updated time
				$scope.filterList = angular.copy($scope.appTypesList);
				$scope.screenMode = 'BUILD_LIST';
			};
			var updateUpgradeTimeFailure = function (response) {
				$scope.errorMessage = response;
			};

			$scope.callAPI(adAppVersionsSrv.updateAppUpgradeTimes, {
                params: params,
                successCallBack: updateUpgradeTimeSuccess,
                failureCallBack: updateUpgradeTimeFailure
            });
		};

		(function() {
			fetchAppVersions();
			$scope.errorMessage = '';
			$scope.timings = adAppVersionsSrv.returnTimeArray();
			$scope.screenMode = 'BUILD_LIST';
			setAppTypes(appTypes);
		})();
	}
]);