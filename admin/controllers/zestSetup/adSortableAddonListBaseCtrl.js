admin.controller('ADSortableAddonListBaseCtrl', ['$scope', 'ADZestStationSrv', 'ngTableParams',
	function($scope, ADZestStationSrv, ngTableParams) {

		// inheriting from base table controller
		ADBaseTableCtrl.call(this, $scope, ngTableParams);
		$scope.data = {};
		$scope.successMessage = '';
		$scope.errorMessage = '';

		// save new order
		$scope.saveNewPosition = function(data) {

			var itemOrder = $('#sortable').sortable("toArray");

			_.each($scope.data, function(addon) {
				_.each(itemOrder, function(item, index) {
					if (parseInt(addon.id) === parseInt(item)) {
						if (data.type === 'station') {
							addon.zest_station_position = index + 1;
						} else {
							addon.zest_web_position = index + 1;
						}
					}
				});
			});
		};

		// to fix shrinking of width
		var fixHelper = function(e, ui) {
			ui.children().each(function() {
				$(this).width($(this).width());
			});
			return ui;
		};

		$scope.sortableOptions = {
			helper: fixHelper,
			start: function(event, ui) {
				$(ui.item).width($('#sortable tr').width());
			},
			stop: function(e, ui) {
				if (ui.item.sortable.dropindex !== ui.item.sortable.index && ui.item.sortable.dropindex !== null && !_.isUndefined(ui.item.sortable.dropindex)) {
					$scope.$broadcast('ORDER_CHANGED');
				}
			}
		};
	}
]);