(function() {
	var checkOutBalanceController = function($scope, BillService) {
		$scope.showBill = false;

		BillService.fetchDisplayDetails().then(function(billDisplayDetails) {
			$scope.billDisplayDetails = billDisplayDetails;
		});

		BillService.fetchBillData().then(function(billData) {
			$scope.billData = billData;
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