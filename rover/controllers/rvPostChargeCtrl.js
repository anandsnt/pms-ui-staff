sntRover.controller('RVPostChargeController',
	[
		'$rootScope',
		'$scope',
		'rvChargeItems',

		function($rootScope, $scope, rvChargeItems) {

			// hook up the basic things
			BaseCtrl.call( this, $scope );

			// post the data
			// https://pms-dev.stayntouch.com/staff/items/post_items_to_bill
			// data = {
			// 	reservation_id:35980
			// 	fetch_total_balance:true
			// 	bill_no:1
			// 	total:14.20
			// 	items[0][value]:57
			// 	items[0][amount]:7.20
			// 	items[0][quantity]:1
			// 	items[1][value]:53
			// 	items[1][amount]:7.00
			// 	items[1][quantity]:1
			// }

			// filter the items based on the chosen charge group
			$scope.filterbyChargeGroup = function() {
				for (var i = 0, j = $scope.fetchedData.items.length; i < j; i++) {
					var item = $scope.fetchedData.items[i];

					if ( !$scope.chargeGroup || item.charge_group_value === $scope.chargeGroup ) {
						item.show = true;
					} else {
						item.show = false;
					}
				}
			};

			// filter the items based on the search query
			// will search on all items, discard chosen 'chargeGroup'
			$scope.filterByQuery = function() {
				var query = $scope.query.toLowerCase();

				$scope.chargeGroup = '';

				for (var i = 0, j = $scope.fetchedData.items.length; i < j; i++) {
					var item = $scope.fetchedData.items[i];

					// let show all items
					item.show = true;

					// find
					if( item.item_name.toLowerCase().indexOf(query) >= 0 ) {
						item.show = true;
					} else {
						item.show = false;
					}
				};
			};

			$scope.items = [];

			$scope.chosenItem = null;

			$scope.addItem = function() {
				var item = angular.copy( this.each );

				var hasItem = _.find($scope.items, function(each) {
					return each.item_name === $scope.chosenItem.item_name;
				});

				// if already added
				if ( !!hasItem ) {
					return;
				};

				// set up new things
				item.total_price = item.unit_price;

				$scope.items.push( item );
				$scope.chosenItem = item;
			};
		}
	]
);