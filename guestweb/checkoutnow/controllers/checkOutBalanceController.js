(function() {
	var checkOutBalanceController = function($scope, BillService) {
		$scope.showBill = false;

		// fecth text details to display

		BillService.fetchDisplayDetails().then(function(billDisplayDetails) {
			$scope.billDisplayDetails = billDisplayDetails;
		});

		//fetch data to display
		
		BillService.fetchBillData().then(function(billData) {
			$scope.billData = billData.data.bill_details;

		
		});

		$scope.total = function() {
			var amount = 0;
			angular.forEach($scope.bills, function(bill){
				amount = amount + (bill.amount * 1) + (bill.tax.amount * 1)		
			});

			return amount;
		};

		
	};

	var dependencies = [
		'$scope',
		'BillService',
		checkOutBalanceController
	];

	snt.controller('checkOutBalanceController', dependencies);
})();