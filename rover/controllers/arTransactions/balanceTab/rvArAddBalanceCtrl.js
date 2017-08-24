sntRover.controller('RvArAddBalanceController', ['$scope', '$rootScope', 'ngDialog', 
	function($scope, $rootScope, ngDialog ) {

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
				'totalAmount': '0.00'
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
		// Handle balance tab save action.
		$scope.clickedSaveAddBalance = function() {
			console.log('Save');
		};

		// Show calendar popup.
		$scope.popupCalendar = function(clickedOn) {
			$scope.clickedOn = clickedOn;
	      	ngDialog.open({
	      		template: '/assets/partials/companyCard/rvCompanyCardContractsCalendar.html',
		        controller: 'RVArTransactionsDatePickerController',
		        className: '',
		        scope: $scope
	      	});
	    };
		
		init();
}]);