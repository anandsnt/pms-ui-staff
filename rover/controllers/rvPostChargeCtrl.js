sntRover.controller('RVPostChargeController',
	[
		'$rootScope',
		'$scope',
		'rvChargeItems',
		'$timeout',
		function($rootScope, $scope, rvChargeItems, $timeout) {

			// hook up the basic things
			BaseCtrl.call( this, $scope );

			// set up scroll for item listing
			$scope.$parent.myScrollOptions = {		
			    'fetchedItemList': {
			    	scrollbars: true,
			        snap: false,
			        hideScrollbar: false,
			        preventDefault: false
			    },
			};

			// set up scroll for chosen items
			$scope.$parent.myScrollOptions = {		
			    'chargedItemsList': {
			    	scrollbars: true,
			        snap: false,
			        hideScrollbar: false,
			        preventDefault: false
			    },
			};

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

			// quick ref to fetched items
			// and chosen one from the list
			$scope.fetchedItem = $scope.fetchedData.items;
			$scope.chosenFetchedItem = null;

			// filter the items based on the chosen charge group
			$scope.filterbyChargeGroup = function() {
				for (var i = 0, j = $scope.fetchedItem.length; i < j; i++) {
					var item = $scope.fetchedItem[i];

					if ( !$scope.chargeGroup || item.charge_group_value === $scope.chargeGroup ) {
						item.show = true;
					} else {
						item.show = false;
					}
				}

				// refresh scrolls
				$timeout(function() {
					$scope.$parent.myScroll['fetchedItemList'].refresh();
				}, 1000);
			};

			// filter the items based on the search query
			// will search on all items, discard chosen 'chargeGroup'
			$scope.filterByQuery = function() {
				var query = $scope.query.toLowerCase();

				if (query === '') {
					return;
				};

				$scope.chargeGroup = '';

				for (var i = 0, j = $scope.fetchedItem.length; i < j; i++) {
					var item = $scope.fetchedItem[i];

					// let show all items
					item.show = true;

					// find
					if( item.item_name.toLowerCase().indexOf(query) >= 0 ) {
						item.show = true;
					} else {
						item.show = false;
					}
				};

				// refresh scrolls
				$timeout(function() {
					$scope.$parent.myScroll['fetchedItemList'].refresh();
				}, 1000);
			};




			// quick ref to charged items
			$scope.chargedItems = [];
			$scope.chosenChargedItem = null;

			$scope.net_total_price = 0;

			// set the default toggle to 'QTY'
			$scope.calToggle = 'QTY';

			var calNetTotalPrice = function() {
				var item  = '',
					totalPrice = 0;

				for (var i = 0, j = $scope.chargedItems.length; i < j; i++) {
					item = $scope.chargedItems[i];
					totalPrice += parseFloat(item.total_price);
				}

				// if we changed this scope prop inside the loop
				// every addition will trigger a digest loop
				// this way just one digest loop ;)
				$scope.net_total_price = totalPrice;
			};

			$scope.addItem = function() {
				var item = angular.copy( this.each );

				var hasItem = _.find($scope.chargedItems, function(each) {
					return each.item_name === item.item_name;
				});

				// if already added
				if ( !!hasItem ) {
					return;
				};

				// show the count on the main list
				$scope.chosenFetchedItem = this.each;
				this.each.count = 1;

				// set up new things
				item.total_price = item.unit_price;

				// update net total price
				// since single add just add the new price
				$scope.net_total_price += parseFloat(item.total_price);

				$scope.chargedItems.push( item );
				$scope.chosenChargedItem = item;

				// refresh scrolls
				$timeout(function() {
					$scope.$parent.myScroll['chargedItemsList'].refresh();
				}, 1000);
			};

			$scope.removeItem = function() {
				if ( !$scope.chosenChargedItem || !$scope.chargedItems.length ) {
					return;
				};

				for (var i = 0, j = $scope.chargedItems.length; i < j; i++) {
					if ( $scope.chargedItems[i]['item_name'] === $scope.chosenChargedItem.item_name ) {

						// reduce the total price from net total price
						$scope.net_total_price -= parseFloat( $scope.chargedItems[i]['total_price'] );

						$scope.chargedItems.splice( i, 1 );
						$scope.chosenChargedItem = null;

						break;
					};
				};

				$scope.chosenFetchedItem.count = 0;
				$scope.chosenFetchedItem = null;
			};

			$scope.selectUnselect = function() {

				// if already selected then unselect
				// else selected the clicked
				if ( $scope.chosenChargedItem && $scope.chosenChargedItem.item_name === this.each.item_name ) {
					$scope.chosenChargedItem = null;
					$scope.chosenFetchedItem = null;
				} else {
					$scope.chosenChargedItem = this.each;
					// $scope.chosenFetchedItem = that.each;
				}

				// TODO: update chosenFetchedItem also!!

				// TODO: switch to match with value rather than item.name
			};


			var lastInput = null;
			$scope.calAction = function(input) {
				lastInput = input;

				if ( input === 'QTY' || input === 'PR' ) {
					$scope.calToggle = input;
					return;
				};

				if ( input === 'SIGN' ) {
					$scope.chosenChargedItem.total_price = parseFloat($scope.chosenChargedItem.total_price);

					// change
					if ( $scope.chosenChargedItem.total_price < 0 ) {
						$scope.chosenChargedItem.total_price = Math.abs( $scope.chosenChargedItem.total_price );
					} else {
						$scope.chosenChargedItem.total_price = -Math.abs( $scope.chosenChargedItem.total_price );
					}

					calNetTotalPrice();

					return;
				};

				if ( input === 'CLR' ) {
					var valueStr = '';

					if ( $scope.calToggle === 'QTY' && $scope.chosenChargedItem.count > 1 ) {
						valueStr = $scope.chosenChargedItem.count.toString();
						valueStr = parseInt( valueStr.slice(0, -1) );

						if ( isNaN(valueStr) || valueStr === 1 ) {
							$scope.chosenChargedItem.count = 1;
							$scope.chosenFetchedItem.count = 1;
						} else {
							$scope.chosenChargedItem.count = valueStr;
							$scope.chosenFetchedItem.count = valueStr;
						}

						// update price of the chosenChargedItem
						$scope.chosenChargedItem.total_price = $scope.chosenChargedItem.unit_price * $scope.chosenChargedItem.count;

						// update net total price
						calNetTotalPrice();
					};

					return;
				};

				// TODO: switch between 'QTY' and 'PR'
				// TODO: make this method pretty

				// ok so we are here
				// well the input is either number or decimal
				var countStr = $scope.chosenChargedItem.count.toString();
				switch(input) {
					case 1:
						if ( $scope.chosenChargedItem.count === 1 && lastInput === 1 ) {
							$scope.chosenChargedItem.count = 11;
							$scope.chosenFetchedItem.count = 11;
						} else {
							countStr += 1;
							$scope.chosenChargedItem.count = parseInt( countStr );
							$scope.chosenFetchedItem.count = parseInt( countStr );
						}
						break;

					case '.':
						if ( $scope.calToggle === 'PR') {
							// do things
						};
						break;

					default:
						if ( $scope.chosenChargedItem.count === 1 ) {
							$scope.chosenChargedItem.count = parseInt( input );
							$scope.chosenFetchedItem.count = parseInt( input );
						} else {
							countStr += input;
							$scope.chosenChargedItem.count = parseInt( countStr );
							$scope.chosenFetchedItem.count = parseInt( countStr );
						}
						break;
				}

				// update price of the chosenChargedItem
				$scope.chosenChargedItem.total_price = $scope.chosenChargedItem.unit_price * $scope.chosenChargedItem.count;

				// update net total price
				calNetTotalPrice();
			};
		}
	]
);