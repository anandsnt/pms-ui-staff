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
				'totalAmount': '0.00',
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
			console.log('Cancel');
			init();
		};
		// Generate data to send.
		var getDataToSend = function() {
			var manualBalanceList = [];

			_.each($scope.manualBalanceObj.manualBalanceList, function(value, key) {
			    var obj = {
			    	'manual_charge_name': value.name,
					'invoice_number': value.invoiceNo,
					'dep_date': value.departureDate,
					'amount': value.amount
			    };

			    manualBalanceList.push(obj);
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
			};

			var dataToSend = getDataToSend();

			$scope.invokeApi(rvAccountsArTransactionsSrv.saveArBalance, dataToSend, successCallbackOfSaveArBalanceAPI );
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
		
		init();
}]);