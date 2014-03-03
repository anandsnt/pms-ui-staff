(function() {
	var checkOutBalanceController = function($scope, BillService,$rootScope,$location) {

		//if checkout is already done
		
 		if ($rootScope.isCheckedout) 
		$location.path('/checkOutNowSuccess')


		$scope.showBill = false;
		$rootScope.netWorkError = false;

		// fecth text details to display


		$scope.isFetching = true;

		BillService.fetchDisplayDetails().then(function(billDisplayDetails) {
			$scope.billDisplayDetails = billDisplayDetails;
			$scope.isFetching = false;
			$rootScope.netWorkError =false;
		});

		$rootScope.$watch('netWorkError',function(){

			if($rootScope.netWorkError)
				$scope.isFetching = false;
		});


		//fetch data to display

		BillService.fetchBillData().then(function(billData) {
			$scope.billData = billData.data.bill_details;


		if($scope.billData)
		 	$scope.optionsAvailable = true;
		else
			$location.path('/serverError')
	});
		

		
	};

	var dependencies = [
		'$scope',
		'BillService','$rootScope','$location',
		checkOutBalanceController
	];

	snt.controller('checkOutBalanceController', dependencies);
})();