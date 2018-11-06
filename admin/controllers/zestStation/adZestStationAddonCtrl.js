admin.controller('ADZestStationAddonCtrl', ['$scope', 'ADZestStationAddonSrv', 'ngTableParams', '$controller', 'addonUpsellSettings',
	function($scope, ADZestStationAddonSrv, ngTableParams, $controller, addonUpsellSettings) {

		// inheriting from base table controller
		$controller('ADSortableAddonListBaseCtrl', {
			$scope: $scope
		});
		$scope.showZestWebSettings = addonUpsellSettings.zest_web_addon_upsell_availability;
		// higlight the selected Main menu (can come to this screen using the addon shortcuts)
		$scope.$emit("changedSelectedMenu", $scope.findMainMenuIndex('Station'));
		// fetch addon list
		var fetAddonsData = function($defer) {
			var options = {
				params: {
					"for_zest_station": true
				},
				successCallBack: function(response) {
					$scope.data = response.addons;
					$defer.resolve($scope.data);
				}
			};

			$scope.callAPI(ADZestStationAddonSrv.fetchAddonSettings, options);
		};

		$scope.loadTable = function() {
			$scope.tableParams = new ngTableParams({
				page: 1, // show first page
				count: $scope.displyCount, // count per page
				sorting: {
					zest_station_position: 'asc' // initial sorting
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
				type: "station"
			});
		});

		$scope.saveSettings = function() {
			var upsell_addons = [];
			// filter active addons
			var activeAddons = _.filter($scope.data, function(addon) {
				return addon.zest_station_active;
			});

			// generate params based on active addons only
			_.each(activeAddons, function(addon, index) {
				upsell_addons.push({
					"addon_id": addon.addon_id,
					"sequence_number": index + 1
				});
			});

			var options = {
				params: {
					"upsell_addons": upsell_addons,
					"for_zest_station": true
				},
				successCallBack: function() {
					$scope.successMessage = "Your setting has been successfully saved.";
					$scope.reloadTable();
				}
			};

			$scope.callAPI(ADZestStationAddonSrv.saveAddonSettings, options);
		};
	}
]);