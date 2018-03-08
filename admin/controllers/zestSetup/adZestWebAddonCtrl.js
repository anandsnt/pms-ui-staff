admin.controller('ADZestWebAddonCtrl', ['$scope', 'ADZestWebAddonSrv', 'ngTableParams', '$controller', 'addonUpsellSettings',
	function($scope, ADZestWebAddonSrv, ngTableParams, $controller, addonUpsellSettings) {

		// inheriting from base table controller
		$controller('ADSortableAddonListBaseCtrl', {
			$scope: $scope
		});
        $scope.showZestStationSettings = addonUpsellSettings.zest_station_addon_upsell_availability;
		// higlight the selected Main menu (can come to this screen using the addon shortcuts)
		$scope.$emit("changedSelectedMenu", $scope.findMainMenuIndex('Zest'));

		// fetch addon list
		var fetAddonsData = function($defer) {
			var options = {
				params: {
					"for_zest_web": true
				},
				successCallBack: function(response) {
					$scope.data = response.addons;
					$defer.resolve($scope.data);
				}
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
			// filter active addons
			var activeAddons = _.filter($scope.data, function(addon) {
				return addon.zest_web_active;
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
					"for_zest_web": true
				},
				successCallBack: function() {
					$scope.successMessage = "Your setting has been successfully saved.";
					$scope.reloadTable();
				}
			};

			$scope.callAPI(ADZestWebAddonSrv.saveAddonSettings, options);
		};
	}
]);