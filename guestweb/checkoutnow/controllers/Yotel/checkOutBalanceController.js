(function() {
	var checkOutBalanceController = function($scope, BillService,$rootScope,$location) {

		if($rootScope.isCheckedout)	{
			$state.go('checkOutNow.checkOutStatus');
			$scope.pageSuccess = false;	
		}
		else{
			$scope.pageSuccess = true;
		};	
		if($scope.pageSuccess){

		//if checkout is already done	
		if ($rootScope.isCheckedout) 
			$location.path('/checkOutNowSuccess');

		// showBill flag and its reference in $rootScope
		$scope.showBill = false;
		$rootScope.showBill = $scope.showBill;
		$rootScope.netWorkError = false;	
		$scope.isFetching = true;

		//watch for any network errors
		$rootScope.$watch('netWorkError',function(){
			if($rootScope.netWorkError)
				$scope.isFetching = false;
		});

		//fetch data to display
		BillService.fetchBillData().then(function(billData) {
			$scope.billData = billData.data.bill_details;
			$scope.isFetching = false;
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