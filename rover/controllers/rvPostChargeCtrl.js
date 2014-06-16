sntRover.controller('RVPostChargeController',
	[
		'$rootScope',
		'$scope',
		'RVChargeItems',
		'$timeout',
		function($rootScope, $scope, RVChargeItems, $timeout) {

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

			console.log( $scope.fetchedData );

			// quick ref to fetched items
			// and chosen one from the list
			$scope.fetchedItem = $scope.fetchedData.items;
			$scope.chosenFetchedItem = null;

			// set the default bill number
			$scope.billNumber = $scope.fetchedData.bill_numbers[0];

			// filter the items based on the chosen charge group
			$scope.filterbyChargeGroup = function() {

				// reset the search query
				$scope.query === '';

				for (var i = 0, j = $scope.fetchedItem.length; i < j; i++) {
					var item = $scope.fetchedItem[i];

					console.log( $scope.chargeGroup );

					if ( $scope.chargeGroup === '' ) {
						item.show = true;
						continue;
					} else if ( $scope.chargeGroup === item.charge_group_value || ($scope.chargeGroup === 'FAV' && item.is_favorite) ) {
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
					$scope.clearQuery();
					return;
				};

				// reset the charge group
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

			// clear the filter query
			$scope.clearQuery = function() {
				$scope.query = '';

				// show all
				for (var i = 0, j = $scope.fetchedItem.length; i < j; i++) {
					$scope.fetchedItem[i].show = true;
				};

				// refresh scrolls
				$timeout(function() {
					$scope.$parent.myScroll['fetchedItemList'].refresh();
				}, 1000);
			};

			// make favorite selected by default
			// must have delay
			$timeout(function() {
				$scope.chargeGroup = 'FAV';
				$scope.filterByQuery();
			}, 500);



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
					totalPrice += item.total_price;
				}

				// if we changed this scope prop inside the loop
				// every addition will trigger a digest loop
				// this way just one digest loop ;)
				$scope.net_total_price = totalPrice;
			};

			$scope.addItem = function() {
				var item = angular.copy( this.each );

				var hasItem = _.find($scope.chargedItems, function(each) {
					return each.value === item.value;
				});

				// if already added
				if ( !!hasItem ) {

					// update the charged Item
					$scope.chosenFetchedItem = this.each;
					$scope.chosenChargedItem = hasItem;

					// update the count
					$scope.chosenFetchedItem.count++;
					$scope.chosenChargedItem.count++;

					// update price
					$scope.chosenChargedItem.total_price = $scope.chosenChargedItem.unit_price * $scope.chosenChargedItem.count;

					// update net total price
					calNetTotalPrice();

					return;
				};

				// track the choosend from fetched
				$scope.chosenFetchedItem = this.each;

				// update chosenFetchedItem count
				$scope.chosenFetchedItem.count = 1;

				// set up initial count
				item.count = 1;

				// set up initial total price
				item.total_price = item.unit_price * item.count;

				// update net total price
				// since single add just add the new price
				$scope.net_total_price += item.total_price;

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
					if ( $scope.chargedItems[i]['value'] === $scope.chosenChargedItem.value ) {

						// reduce the total price from net total price
						$scope.net_total_price -= $scope.chargedItems[i]['total_price'];

						$scope.chargedItems.splice( i, 1 );
						$scope.chosenChargedItem = null;

						break;
					};
				};

				// reset the count and remove reference
				$scope.chosenFetchedItem.count = 0;
				$scope.chosenFetchedItem = null;

				// refresh scrolls
				$timeout(function() {
					$scope.$parent.myScroll['chargedItemsList'].refresh();
				}, 1000);
			};

			// need to keep track of the last pressed
			// button or number on the numberpad
			var lastInput = null;

			// need to keep track of the price
			// entered by the user
			var userEnteredPrice = '';

			$scope.selectUnselect = function() {

				// if already selected then unselect
				// else selected the clicked
				if ( $scope.chosenChargedItem && $scope.chosenChargedItem.value === this.each.value ) {
					$scope.chosenChargedItem = null;
					$scope.chosenFetchedItem = null;
				} else {
					$scope.chosenChargedItem = this.each;
					
					// loop and update
					for (var i = 0, j = $scope.fetchedItem.length; i < j; i++) {
						var item = $scope.fetchedItem[i];

						if (item.value === $scope.chosenChargedItem.value) {
							$scope.chosenFetchedItem = item;
							break;
						};
					};
				}

				// since we moved reset this value
				userEnteredPrice = '';
			};

			// actions to be taken for numberpad button press
			$scope.calBtnAction = function(input) {
				lastInput = input;

				// toggle 'QTY' and 'PR' as required and exit
				if ( input === 'QTY' || input === 'PR' ) {
					$scope.calToggle = input;
					return;
				};

				// toggle total_price of 'chosenChargedItem' sign value and exit
				if ( input === 'SIGN' ) {
					// change
					if ( $scope.chosenChargedItem.total_price < 0 ) {
						$scope.chosenChargedItem.total_price = Math.abs( $scope.chosenChargedItem.total_price );
					} else {
						$scope.chosenChargedItem.total_price = -Math.abs( $scope.chosenChargedItem.total_price );
					}

					// update net total price
					calNetTotalPrice();

					return;
				};

				// clear input numbers
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
					} else {

						if ( userEnteredPrice.length > 1 ) {
							userEnteredPrice = userEnteredPrice.slice(0, -1);
							$scope.chosenChargedItem.unit_price = parseFloat( userEnteredPrice );

							// if our 'userEnteredPrice' string
							// now ends with '.' remove that too
							if ( userEnteredPrice.indexOf('.') + 1 === userEnteredPrice.length ) {
								userEnteredPrice = userEnteredPrice.slice(0, -1);
							};
						} else {
							$scope.chosenChargedItem.unit_price = $scope.chosenFetchedItem.unit_price;
						}

						// update price of the chosenChargedItem
						$scope.chosenChargedItem.total_price = $scope.chosenChargedItem.unit_price * $scope.chosenChargedItem.count;

						// update net total price
						calNetTotalPrice();
					}

					return;
				};
			};

			// actions to be taken for numberpad number press
			$scope.calNumAction = function(input) {

				// if user is trying to update the quantity
				if ( $scope.calToggle === 'QTY' ) {
					var countStr = $scope.chosenChargedItem.count.toString();

					switch(input) {
						case 1:
							if ( $scope.chosenChargedItem.count === 1 && lastInput === 'CLR' ) {
								// do nothing
								// hard to explain in words
								// try it out in rover and see
							} else if ( $scope.chosenChargedItem.count === 1 && lastInput === 1 ) {
								$scope.chosenChargedItem.count = 11;
								$scope.chosenFetchedItem.count = 11;
							} else {
								countStr += 1;
								$scope.chosenChargedItem.count = parseInt( countStr );
								$scope.chosenFetchedItem.count = parseInt( countStr );
							}
							break;

						case '.':
							// do nothing, but should be catched here
							// else will be processed in default
							break;

						default:
							if ( $scope.chosenChargedItem.count === 1 && lastInput != 1 ) {
								if (input != '0') {
									$scope.chosenChargedItem.count = parseInt( input );
									$scope.chosenFetchedItem.count = parseInt( input );
								}
							} else {
								countStr += input;
								$scope.chosenChargedItem.count = parseInt( countStr );
								$scope.chosenFetchedItem.count = parseInt( countStr );
							}
							break;
					}

					// update price of the chosenChargedItem
					$scope.chosenChargedItem.total_price = $scope.chosenChargedItem.unit_price * $scope.chosenChargedItem.count;
				} else {
					switch(input) {
						case '.':
							if ( userEnteredPrice.indexOf('.') === -1) {
								userEnteredPrice += input;
							};
							break;

						default:
							if( $scope.chosenChargedItem.unit_price === $scope.chosenFetchedItem.unit_price ) {
								if (input != '0') {
									$scope.chosenChargedItem.unit_price = parseFloat( input );

									// keep a string verison too
									userEnteredPrice = input.toString();
								};								
							} else {
								userEnteredPrice += input.toString();

								if ( userEnteredPrice.indexOf('.') === -1) {
									$scope.chosenChargedItem.unit_price = parseFloat( userEnteredPrice );
								} else {
									// TODO: ignore multiple 00 press

									if ( userEnteredPrice.split('.')[1].length < 3 ) {
										$scope.chosenChargedItem.unit_price = parseFloat( userEnteredPrice );
									} else {
										userEnteredPrice = userEnteredPrice.slice(0, -1);
									}
								}
							}
							break;
					}

					// update price of the chosenChargedItem
					$scope.chosenChargedItem.total_price = $scope.chosenChargedItem.unit_price * $scope.chosenChargedItem.count;
				}

				// update net total price
				calNetTotalPrice();

				// for numbers save current input to lastInput only
				// after processing the current input
				lastInput = input;
			};

			$scope.postCharges = function() {
				var items = [];

				console.log( $scope.chargedItems );

				for (var i = 0, j = $scope.chargedItems.length; i < j; i++) {
					var each = {};

					each['value'] = $scope.chargedItems[i]['value'];
					each['amount'] = $scope.chargedItems[i]['total_price'];
					each['quantity'] = $scope.chargedItems[i]['count'];

					items.push( each );
				};

				var data = {
					reservation_id: $scope.reservation_id,
					fetch_total_balance: true,
					bill_no: $scope.billNumber,
					total: $scope.net_total_price,
					items: items
				};

				var callback = function() {
					$scope.$emit( 'hideLoader' );

					// update the price in staycard
					$scope.$emit('postcharge.added', $scope.net_total_price);

					$scope.closeDialog();
				};

				$scope.invokeApi(RVChargeItems.postCharges, data, callback);
			};
		}
	]
);