admin.controller('ADZestWebAddonCtrl', ['$scope', 'ADZestWebAddonSrv', 'ngTableParams', '$controller',
	function($scope, ADZestWebAddonSrv, ngTableParams, $controller) {

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

			$scope.callAPI(ADZestWebAddonSrv.fetchAddonSettings, options);
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

			var upsell_addons = [];
			var addonIndex = 1;
			_.each($scope.data, function(addon) {
				if (addon.zest_web_active) {
					upsell_addons.push({
						"addon_id": addon.addon_id,
						"sequence_number": addonIndex
					});
					addonIndex++;
				}
			});



			var options = {
				params: {
					"upsell_addons": upsell_addons
				},
				successCallBack: function() {
					$scope.successMessage = "save success!";
					fetAddonsData();
				}
			};

			$scope.callAPI(ADZestWebAddonSrv.saveAddonSettings, options);
		};
	}
]);