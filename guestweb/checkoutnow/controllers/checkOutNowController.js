(function() {
	var checkOutNowController = function($scope, BillService) {
		$scope.showBill = false;

		BillService.fetch().then(function(bills) {
			$scope.bills = bills;
		});

		$scope.total = function() {
			var amount = 0;
			angular.forEach($scope.bills, function(bill){
				amount = amount + (bill.amount * 1) + (bill.tax.amount * 1)		
			});

			return amount;
		};

		$scope.viewBillImage = 'downarrow.png'
	};

	var dependencies = [
		'$scope',
		'BillService',
		checkOutNowController
	];

	snt.controller('checkOutNowController', dependencies);
})();