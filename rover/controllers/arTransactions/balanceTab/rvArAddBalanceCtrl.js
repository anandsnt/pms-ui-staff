sntRover.controller('RvArAddBalanceController', ['$scope', '$rootScope', 'ngDialog', 'rvAccountsArTransactionsSrv', '$stateParams',
	function($scope, $rootScope, ngDialog, rvAccountsArTransactionsSrv, $stateParams ) {

		BaseCtrl.call(this, $scope);

		var init = function() {
			// Data object to add new manual balance.
			$scope.manualBalanceObj = {
				'manualBalanceList': [
					{
						'name': 'Manual Balance',
						'invoiceNo': '',
						'departureDate': '',
						'amount': ''
					}
				],
				'selectedIndex': 0
			};
		};

		// Remove a row from balance add screen.
		$scope.removeBalanceRow = function( index ) {
			$scope.manualBalanceObj.manualBalanceList.splice( index, 1 );
		};
		// Add a new row from balance add screen.
		$scope.addBalanceRow = function( index ) {
			var newBalanceRowObj = {
					'name': 'Manual Balance',
					'invoiceNo': '',
					'departureDate': '',
					'amount': ''
			};

			$scope.manualBalanceObj.manualBalanceList.push( newBalanceRowObj );
		};
		// Handle balance tab cancel action.
		$scope.clickedCancelAddBalance = function() {
			init();
			$scope.arFlags.isAddBalanceScreenVisible = false;
		};
		// Checks whether a balance object is empty.
		var isBalanceObjEmpty = function( index ) {
			var obj = $scope.manualBalanceObj.manualBalanceList[index], isBalanceObjIsEmpty = false;

			if ( obj.name === '' && obj.invoiceNo === '' && obj.departureDate === '' && obj.amount === '') {
				isBalanceObjIsEmpty = true;
			}
			return isBalanceObjIsEmpty;
		};

		// Generate data to send.
		var getDataToSend = function() {
			var manualBalanceList = [];

			_.each($scope.manualBalanceObj.manualBalanceList, function(value, key) {

				if (!isBalanceObjEmpty(key)) {
				    var obj = {
				    	'manual_charge_name': value.name,
						'invoice_number': value.invoiceNo,
						'dep_date': value.departureDate,
						'amount': value.amount
				    };

				    manualBalanceList.push(obj);
				}
			});

			var dataToSend = {
				'manual_balance_data': manualBalanceList,
				'account_id': $stateParams.id
			};

			return dataToSend;
		};

		// Handle balance tab save action.
		$scope.clickedSaveAddBalance = function() {

			var successCallbackOfSaveArBalanceAPI = function() {
				$scope.$emit('hideLoader');
				$scope.arFlags.isAddBalanceScreenVisible = false;
			};

			var dataToSend = getDataToSend();

			if (dataToSend.manual_balance_data.length > 0) {
				$scope.invokeApi(rvAccountsArTransactionsSrv.saveArBalance, dataToSend, successCallbackOfSaveArBalanceAPI );
			}
			else {
				$log.info('Data Validation :: No data to save !!');
			}
		};

		// Show calendar popup.
		$scope.popupArDateCalendar = function( index ) {

			$scope.manualBalanceObj.selectedIndex = index;

	      	ngDialog.open({
	      		template: '/assets/partials/companyCard/rvCompanyCardContractsCalendar.html',
		        controller: 'RVArAddBalanceDatePickerController',
		        className: '',
		        scope: $scope
	      	});
	    };
	    // Clear date selected.
	    $scope.clearDateSelection = function( index ) {
	    	$scope.manualBalanceObj.manualBalanceList[index].departureDate = '';
	    };
	    // Check whether we need to disable the add new row button (+),
	    // If the row having all fields empty.
	    $scope.balanceObjIsEmpty = function( index ) {
	    	return isBalanceObjEmpty(index);
	    };
	    // Method to find total balance amount.
	    $scope.calculateTotalBalance = function() {
	    	var totalBalance = 0.00, 
	    		manualBalanceList = $scope.manualBalanceObj.manualBalanceList;

	    	if ( manualBalanceList.length > 0 ) {
		    	_.each(manualBalanceList, function(value, key) {
		    		if (value.amount !== '') {
			    		totalBalance += parseFloat(value.amount);
			    	}
		    	});
		    }
	    	return totalBalance;
	    };
		
		init();
}]);