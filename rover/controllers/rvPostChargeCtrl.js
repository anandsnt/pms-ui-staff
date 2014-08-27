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
			$scope.fetchedChargeCodes = $scope.fetchedData.non_item_linked_charge_codes;
			$scope.selectedChargeItem = null;
			$scope.isResultOnFetchedItems = true;
			//$scope.isResultOnFetchedChargecode = false;
			
			// set the default bill number
			// $scope.billNumber = $scope.fetchedData.bill_numbers[0];

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
				var isFoundInFetchedItems = false;
				$scope.isResultOnFetchedChargecode = false;
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
						isFoundInFetchedItems = true;
					}
					else if( item.charge_code_name.toLowerCase().indexOf(query) >= 0 ) {
						item.show = true;
						isFoundInFetchedItems = true;
					}
					else {
						item.show = false;
					}
				};
				/*
				 *  When searched by charge code, if the charge code has no item configured, 
				 * 	show charge code and the description but no price
				 * 	Searching on fetchedChargeCodes array with charge_code or description.
				 */
				//if(!isFoundInFetchedItems){
					for (var i = 0, j = $scope.fetchedChargeCodes.length; i < j; i++) {
						var item = $scope.fetchedChargeCodes[i];
						// find
						if( item.charge_code.toLowerCase().indexOf(query) >= 0 ) {
							item.show = true;
							$scope.isResultOnFetchedChargecode = true;
						}
						else if( item.description.toLowerCase().indexOf(query) >= 0 ) {
							item.show = true;
							$scope.isResultOnFetchedChargecode = true;
						}
						else {
							item.show = false;
						}
							
					}
					
				//}
			};

			// clear the filter query
			$scope.clearQuery = function() {
				
				$scope.query = '';
				
				// show all
				for (var i = 0, j = $scope.fetchedItems.length; i < j; i++) {
					$scope.fetchedItems[i].show = true;
				};
				// show all
				for (var i = 0, j = $scope.fetchedChargeCodes.length; i < j; i++) {
					$scope.fetchedChargeCodes[i].show = true;
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
				for (var i = 0, j = $scope.fetchedChargeCodes.length; i < j; i++) {
					if ( $scope.fetchedChargeCodes[i].isChosen ) {
						totalPrice += $scope.fetchedChargeCodes[i].total_price;
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

				// recalculate net price
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
				for (var i = 0, j = $scope.fetchedChargeCodes.length; i < j; i++) {
					if ( $scope.fetchedChargeCodes[i].isChosen ) {
						ret = true;
						break;
					};
				};

				return ret;
			};


			// actions to be taken for numberpad number press
			$scope.calNumAction = function(input) {

				//selectedChargeItem

				// if user is trying to update the quantity
				if ( $scope.calToggle === 'QTY' ) {
					var countStr = $scope.selectedChargeItem.count.toString();

					switch(input) {
						case 1:
							if ( $scope.selectedChargeItem.count === 1 && (lastInput === null || lastInput === 'CLR' || lastInput === 'QTY') ) {
								// do nothing
								// hard to explain in words
								// try it out in rover and see
							} else if ( $scope.selectedChargeItem.count === 1 && lastInput === 1 ) {
								$scope.selectedChargeItem.count = 11;
							} else {
								countStr += 1;
								$scope.selectedChargeItem.count = parseInt( countStr );
							}
							break;

						case '.':
							// do nothing, but should be catched here
							// else will be processed in default
							break;

						default:
							if ( $scope.selectedChargeItem.count === 1 && lastInput != 1 ) {
								if (input != '0') {
									$scope.selectedChargeItem.count = parseInt( input );
								}
							} else {
								countStr += input;
								$scope.selectedChargeItem.count = parseInt( countStr );
							}
							break;
					}

					// update price of the chosenChargedItem
					$scope.selectedChargeItem.total_price = $scope.selectedChargeItem.modifiedPrice * $scope.selectedChargeItem.count;
				}

				// user is trying to update the price
				else {
					switch(input) {
						case '.':
							if ( $scope.selectedChargeItem.userEnteredPrice.length && $scope.selectedChargeItem.userEnteredPrice.indexOf('.') === -1 ) {
								$scope.selectedChargeItem.userEnteredPrice += '.';
							};
							break;

						default:

							// normal senario user must no be allowed to make the price as 0
							// as soon as it choosen
							if( $scope.selectedChargeItem.modifiedPrice === $scope.selectedChargeItem.unit_price ) {
								if ( input !== 0 ) {
									$scope.selectedChargeItem.userEnteredPrice += input;
									$scope.selectedChargeItem.modifiedPrice = parseFloat( $scope.selectedChargeItem.userEnteredPrice );
								};
							} else {
								$scope.selectedChargeItem.userEnteredPrice += input;

								// additional check
								// if there are decimals and are not limited to 2 place
								// chop off the 3 palce decimal
								if ( $scope.selectedChargeItem.userEnteredPrice.split('.')[1] && $scope.selectedChargeItem.userEnteredPrice.split('.')[1].length > 2 ) {
									$scope.selectedChargeItem.userEnteredPrice = $scope.selectedChargeItem.userEnteredPrice.slice(0, -1);
								}

								$scope.selectedChargeItem.modifiedPrice = parseFloat( $scope.selectedChargeItem.userEnteredPrice );

								// please note:
								// 1. user cannot enter anymore after e.g: "65.89"
								// 2. after this, user cant enter anymore after selecting some other charge then this "65.89" charge
								// 3. user will have to first clear added "65.89" before adding a new value.
							}
							break;
					}

					// update price of the chosenChargedItem
					$scope.selectedChargeItem.total_price = $scope.selectedChargeItem.modifiedPrice * $scope.selectedChargeItem.count;
				}

				// update net total price
				calNetTotalPrice();

				// for numbers save current input to lastInput only
				// after processing the current input
				lastInput = input;
			};


			// actions to be taken for numberpad button press
			$scope.calBtnAction = function(input) {

				lastInput = input;

				// toggle 'QTY' and 'PR' as required and exit
				if ( input === 'QTY' || input === 'PR' ) {
					$scope.calToggle = input;
					return;
				};

				// toggle total_price of 'selectedChargeItem' sign value and exit
				if ( input === 'SIGN' ) {
					// change
					if ( $scope.selectedChargeItem.total_price < 0 ) {
						$scope.selectedChargeItem.total_price = Math.abs( $scope.selectedChargeItem.total_price );
					} else {
						$scope.selectedChargeItem.total_price = -Math.abs( $scope.selectedChargeItem.total_price );
					}

					// update net total price
					calNetTotalPrice();

					return;
				};

				// clear input numbers
				if ( input === 'CLR' ) {

					var valueStr = '';

					// user trying to clear the count
					if ( $scope.calToggle === 'QTY' && $scope.selectedChargeItem.count > 1 ) {
						valueStr = $scope.selectedChargeItem.count.toString();
						valueStr = parseInt( valueStr.slice(0, -1) );

						// update countStr
						$scope.selectedChargeItem.count = isNaN(valueStr) ? 1 : valueStr;

						// update price of the chosenChargedItem
						$scope.selectedChargeItem.total_price = $scope.selectedChargeItem.modifiedPrice * $scope.selectedChargeItem.count;

						// update net total price
						calNetTotalPrice();
					} 

					// user tryin to clear price he entered
					else {

						// reduce the last char
						$scope.selectedChargeItem.userEnteredPrice = $scope.selectedChargeItem.userEnteredPrice.slice(0, -1);

						// if we are left e.g "12." remove the last "."
						if ( $scope.selectedChargeItem.userEnteredPrice.charAt($scope.selectedChargeItem.userEnteredPrice.length - 1) === '.' ) {
							$scope.selectedChargeItem.userEnteredPrice = $scope.selectedChargeItem.userEnteredPrice.slice(0, -1);
						}

						// if there is any char left
						if ( $scope.selectedChargeItem.userEnteredPrice.length ) {
							$scope.selectedChargeItem.modifiedPrice = parseFloat( $scope.selectedChargeItem.userEnteredPrice );
						} 

						// nope everything is cleared
						else {
							$scope.selectedChargeItem.modifiedPrice = $scope.selectedChargeItem.unit_price;
						}

						// update price of the chosenChargedItem
						$scope.selectedChargeItem.total_price = $scope.selectedChargeItem.modifiedPrice * $scope.selectedChargeItem.count;

						// update net total price
						calNetTotalPrice();
					}

					return;
				};
			};

			$scope.postCharges = function() {
				var items = [],
					each = {};

				for (var i = 0, j = $scope.fetchedItems.length; i < j; i++) {
					if ( $scope.fetchedItems[i].isChosen ) {
						each = {};

						each['value']    = $scope.fetchedItems[i]['value'];
						each['is_item']  = true;
						each['amount']   = $scope.fetchedItems[i]['total_price'];
						each['quantity'] = $scope.fetchedItems[i]['count'];

						items.push( each );
					};
				}
				for (var i = 0, j = $scope.fetchedChargeCodes.length; i < j; i++) {
					if ( $scope.fetchedChargeCodes[i].isChosen ) {
						each = {};

						each['value']    = $scope.fetchedChargeCodes[i]['value'].toString();
						each['is_item']  = false;
						each['amount']   = $scope.fetchedChargeCodes[i]['total_price'];
						each['quantity'] = $scope.fetchedChargeCodes[i]['count'];

						items.push( each );
					};
				}

				var data = {
					reservation_id: $scope.reservation_id,
					fetch_total_balance: $scope.fetchTotalBal,
					bill_no: $scope.passActiveBillNo || $scope.billNumber,
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
			
			$scope.searchByRoomNumber = function(){
				console.log("teststtstststs");
			};
			
		}
	]
);