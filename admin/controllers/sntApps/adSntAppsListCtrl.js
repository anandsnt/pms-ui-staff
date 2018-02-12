admin.controller('ADSntAppsListCtrl', ['$scope',
	'adDebuggingSetupSrv', 'adAppVersionsSrv', 'ngTableParams', '$filter',
	function($scope, adDebuggingSetupSrv, adAppVersionsSrv, ngTableParams, $filter) {
		BaseCtrl.call(this, $scope);

		$scope.sortByVersion = function() {
			$scope.tableParams.sorting({
				'version': $scope.tableParams.isSortBy('version', 'asc') ? 'desc' : 'asc'
			});
		};

		var fetchDeviceDebugSetup = function() {

			var fetchAppListSuccessCallback = function(data) {

				$scope.$emit('hideLoader');
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

			$scope.invokeApi(adAppVersionsSrv.fetchAppVersions, {}, fetchAppListSuccessCallback);
		};

		$scope.appTypeChanged = function() {
			fetchDeviceDebugSetup();
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

		$scope.editApp = function(app) {
			$scope.selectedApp = {
				"build": app.build,
				"version": app.version,
				"description": app.description,
				"updated_on": app.updated_on
			};
			$scope.screenMode = 'EDIT_BUILD';
		};

		(function() {
			fetchDeviceDebugSetup();
			$scope.screenMode = 'BUILD_LIST';
			$scope.filterList = adDebuggingSetupSrv.appTypes;
			$scope.filterType = adDebuggingSetupSrv.appTypes[0];
		})();
	}
]);