(function() {
	var checkOutBalanceController = function($scope, BillService,$rootScope,$state) {

	$scope.pageValid = false;

	if($rootScope.isCheckedin){
		$state.go('checkinSuccess');
	}
	else if($rootScope.isCheckin){
		$state.go('checkinConfirmation');
	}
	else if($rootScope.isCheckedout ){
		$state.go('checkOutStatus');
	}
	else if(!$rootScope.isRoomVerified){
		$state.go('checkoutRoomVerification');
	}
	else{
		$scope.pageValid = true;
	}


	if($scope.pageValid){
		// showBill flag and its reference in $rootScope
		$scope.showBill = false;
		$rootScope.showBill = $scope.showBill;
		$scope.netWorkError = false;
		$scope.isFetching = true;

		//fetch data to display
		BillService.fetchBillData().then(function(billData) {
			$scope.billData = billData.data.bill_details;
			$scope.roomNo = billData.data.room_number;
			$scope.isFetching = false;
			if($scope.billData) {
				$scope.optionsAvailable = true;
			}
		},function(){
			$scope.netWorkError = true;
			$scope.isFetching = false;
		});

		$scope.gotToNextStep = function(){
			if($rootScope.isCCOnFile || parseInt($scope.billData.balance) === 0.00 || $rootScope.isSixpayments){
				$state.go('checkOutStatus');
			}
			else{
				$state.go('ccVerification',{'fee':$scope.billData.balance,'message':"Check-out fee",'isFromCheckoutNow':true});
			}

		};

	}
};

var dependencies = [
'$scope',
'BillService','$rootScope','$state',
checkOutBalanceController
];

snt.controller('checkOutBalanceController', dependencies);
})();