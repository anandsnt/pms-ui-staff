(function() {
	var checkOutBalanceController = function($scope, BillService,$rootScope,$state) {

		if($rootScope.isCheckedout)	{
			$state.go('checkOutStatus');
			$scope.pageValid = false;	
		}
		else{
			$scope.pageValid = true;
		};	
		if($scope.pageValid){

	// showBill flag and its reference in $rootScope
	$scope.showBill = false;
	$rootScope.showBill = $scope.showBill;
	$scope.netWorkError = false;	
	$scope.isFetching = true;

	//fetch data to display
	BillService.fetchBillData().then(function(billData) {
		$scope.billData = billData.data.bill_details;
		$scope.isFetching = false;
		if($scope.billData)
			$scope.optionsAvailable = true;
	},function(){
		$scope.netWorkError = true;
		$scope.isFetching = false;
	});
};
};

var dependencies = [
'$scope',
'BillService','$rootScope','$location',
checkOutBalanceController
];

snt.controller('checkOutBalanceController', dependencies);
})();