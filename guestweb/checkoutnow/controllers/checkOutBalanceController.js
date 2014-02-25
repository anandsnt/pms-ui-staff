(function() {
	var checkOutBalanceController = function($scope, BillService,$rootScope,$location) {

		//if checkout is already done
		
 		if ($rootScope.isCheckedout) 
		$location.path('/checkOutNowSuccess')

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
		'BillService','$rootScope','$location',
		checkOutBalanceController
	];

	snt.controller('checkOutBalanceController', dependencies);
})();