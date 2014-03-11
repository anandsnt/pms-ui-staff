(function() {
	var checkOutBalanceController = function($scope, BillService,$rootScope,$location) {

		
		$scope.pageSuccess = true;

		if($rootScope.isCheckedin){
			$scope.pageSuccess = false;
			$location.path('/checkinSuccess');
		}
		else if($rootScope.isCheckin){
			$scope.pageSuccess = false;
			$location.path('/checkinConfirmation');
		}
		else if($rootScope.isCheckedout){
			$scope.pageSuccess = false;
			$location.path('/checkOutNowSuccess');

		}


		if($scope.pageSuccess){

		//if checkout is already done
		
 		if ($rootScope.isCheckedout) 
		 $location.path('/checkOutNowSuccess');

		// showBill flag and its reference in $rootScope
		$scope.showBill = false;
		$rootScope.showBill = $scope.showBill;

		$rootScope.netWorkError = false;

		// fecth text details to display
		$scope.isFetching = true;

		BillService.fetchDisplayDetails().then(function(billDisplayDetails) {
			$scope.billDisplayDetails = billDisplayDetails;
			$scope.isFetching = false;
			$rootScope.netWorkError =false;
		});

		//watch for any network errors

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
			$location.path('/serverError');
	});
		
	}
		
	};

	var dependencies = [
		'$scope',
		'BillService','$rootScope','$location',
		checkOutBalanceController
	];

	snt.controller('checkOutBalanceController', dependencies);
})();