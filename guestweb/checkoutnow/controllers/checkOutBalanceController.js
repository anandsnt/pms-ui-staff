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


		
	};

	var dependencies = [
		'$scope',
		'BillService',
		checkOutBalanceController
	];

	snt.controller('checkOutBalanceController', dependencies);
})();