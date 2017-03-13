admin.controller('ADZestWebAddonCtrl', ['$scope', 'ADZestStationSrv', 'ngTableParams', '$controller',
	function($scope, ADZestStationSrv, ngTableParams, $controller) {

		// inheriting from base table controller
		$controller('ADSortableAddonListBaseCtrl', {
			$scope: $scope
		});
		// fetch addon list
		var fetAddonsData = function($defer, params) {
			//var getParams = $scope.calculateGetParams(params);
			var onfetchCountriesSuccess = function(response) {
				$scope.data = response.addons;
				$defer.resolve($scope.data);
			};
			var options = {
				params: {},
				successCallBack: onfetchCountriesSuccess
			};

			$scope.callAPI(ADZestStationSrv.fetchAddonSettings, options);
		};

		$scope.loadTable = function() {
			$scope.tableParams = new ngTableParams({
				page: 1, // show first page
				count: $scope.displyCount, // count per page
				sorting: {
					zest_web_position: 'asc' // initial sorting
				}
			}, {
				total: 0, // length of data
				getData: fetAddonsData
			});
		};
		$scope.loadTable();

		// save the changed order to the scope data
		$scope.$on('ORDER_CHANGED', function() {
			$scope.saveNewPosition({
				type: "web"
			});
		});

		$scope.saveSettings = function() {
			var options = {
				params: $scope.data,
				successCallBack: function() {
					$scope.successMessage = "save success!";
				}
			};
			// TODO: deleted below code
			_.each($scope.data, function(addon) {
				console.log(addon.id + "-----" + addon.zest_web_position + "----" + addon.zest_web_active);
			});

			options.successCallBack();

			// $scope.callAPI(ADZestStationSrv.saveComponentOrder, options);
		};
	}
]);