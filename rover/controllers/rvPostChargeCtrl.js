
// Array Remove - By John Resig (MIT Licensed)
// array remove via splice is very very costly
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

sntRover.controller('RVPostChargeController',
	[
		'$rootScope',
		'$scope',
		'RVChargeItems',
		'$timeout',
		function($rootScope, $scope, RVChargeItems, $timeout) {

			// hook up the basic things
			BaseCtrl.call( this, $scope );

			// quick ref to fetched items
			// and chosen one from the list
			$scope.fetchedItems = $scope.fetchedData.items;
			$scope.selectedChargeItem = null;

			console.log( $scope.fetchedItems );

			// set the default bill number
			$scope.billNumber = $scope.fetchedData.bill_numbers[0];

			// filter the items based on the chosen charge group
			$scope.filterbyChargeGroup = function() {

				// reset the search query
				$scope.query === '';

				// since the user input charge group will be string
				// convert it to int, with causion
				var chargeGroupInt = isNaN(parseInt($scope.chargeGroup)) ? $scope.chargeGroup : parseInt($scope.chargeGroup);

				for (var i = 0, j = $scope.fetchedItems.length; i < j; i++) {
					var item = $scope.fetchedItems[i];

					if ( $scope.chargeGroup === '' ) {
						item.show = true;
						continue;
					} else if ( chargeGroupInt === item.charge_group_value || ($scope.chargeGroup === 'FAV' && item.is_favorite) ) {
						item.show = true;
					} else {
						item.show = false;
					}
				}
			};

			// filter the items based on the search query
			// will search on all items, discard chosen 'chargeGroup'
			$scope.filterByQuery = function() {
				var query = $scope.query ? $scope.query.toLowerCase() : '';

				if (query === '') {
					$scope.clearQuery();
					return;
				};

				// reset the charge group
				$scope.chargeGroup = '';

				for (var i = 0, j = $scope.fetchedItems.length; i < j; i++) {
					var item = $scope.fetchedItems[i];

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

			// clear the filter query
			$scope.clearQuery = function() {
				$scope.query = '';

				// show all
				for (var i = 0, j = $scope.fetchedItems.length; i < j; i++) {
					$scope.fetchedItems[i].show = true;
				};
			};

			// make favorite selected by default
			// must have delay
			$timeout(function() {
				$scope.chargeGroup = 'FAV';
				$scope.filterbyChargeGroup();
			}, 500);



			// quick ref to charged items
			$scope.chargedItems = [];
			$scope.chosenChargedItem = null;

			$scope.net_total_price = 0;

			// set the default toggle to 'QTY'
			$scope.calToggle = 'QTY';

			// need to keep track of the last pressed
			// button or number on the numberpad
			var lastInput = null;

			// need to keep track of the price
			// entered by the user
			var userEnteredPrice = '';


			var calNetTotalPrice = function() {
				var totalPrice = 0;

				for (var i = 0, j = $scope.fetchedItems.length; i < j; i++) {
					if ( $scope.fetchedItems[i].isChosen ) {
						totalPrice += $scope.fetchedItems[i].total_price;
					};
				}

				// if we changed this scope prop inside the loop
				// every addition will trigger a digest loop
				// this way just one digest loop ;)
				$scope.net_total_price = totalPrice;
			};

			/**
			*	Method to add single charge to charged item list
			*
			*	Thing to do:
			*	1. modify the count
			*	2. track the item as selected
			*	3. update the net total price
			*/
			$scope.addItem = function(item) {
				
				// it is already added
				if ( item.isChosen ) {
					item.count++;
				}

				// adding to the list
				else {
					item.isChosen = true;
					item.count = 1;
				}

				item.total_price = item.modifiedPrice * item.count;

				$scope.selectedChargeItem = item;

				calNetTotalPrice();
			};

			/**
			*	Method to remove the chosen charge from charged list
			*
			*	Things to do:
			*	1. mark it as not chosen
			*	2. reset its count
			*	3. reset its modified price
			*	4. untrack
			*	5. update the net total price
			*/
			$scope.removeItem = function() {
				$scope.selectedChargeItem.isChosen = false;
				$scope.selectedChargeItem.count = 0;
				$scope.selectedChargeItem.modifiedPrice = $scope.selectedChargeItem.unit_price;

				$scope.selectedChargeItem = {};

				calNetTotalPrice();
			};

			/**
			*	Method to select/un-select current selected item
			*/
			$scope.selectUnselect = function(item) {

				// yep we have a selected item, gonna un-select
				if ( $scope.selectedChargeItem && $scope.selectedChargeItem.item_name === item.item_name ) {
					$scope.selectedChargeItem = null;
				} 

				// nope we dont have a selected item 
				else {
					$scope.selectedChargeItem = item;
				}

				// since we moved reset this value
				userEnteredPrice = '';

				// since we are unselecting
				lastInput = null;
			};

			$scope.isAnyChosen = function(from) {
				var ret = false;

				for (var i = 0, j = $scope.fetchedItems.length; i < j; i++) {
					if ( $scope.fetchedItems[i].isChosen ) {
						ret = true;
						break;
					};
				};

				return ret;
			};


			// actions to be taken for numberpad button press
			$scope.calBtnAction = function(input) {
				return;


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

				return;

				// if user is trying to update the quantity
				if ( $scope.calToggle === 'QTY' ) {
					var countStr = $scope.chosenChargedItem.count.toString();

					switch(input) {
						case 1:
							if ( $scope.chosenChargedItem.count === 1 && (lastInput === 'QTY' || lastInput === 'CLR' || lastInput === null) ) {
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