(function() {
	var checkOutBalanceController = function($scope, BillService,$rootScope,$location) {

		//if checkout is already done
		
 		if ($rootScope.isCheckedout) 
		$location.path('/checkOutNowSuccess')



		$scope.reloadPage=  function (){
			  $scope.fetch();
		}

		$scope.showBill = false;
		$scope.showAlert = false;

		// fecth text details to display

		BillService.fetchDisplayDetails().then(function(billDisplayDetails) {
			$scope.billDisplayDetails = billDisplayDetails;
		});

		$scope.closeAlert = function(){

			$scope.showAlert = false
		}


		//fetch data to display

		$scope.fetch = function (){


		
		BillService.fetchBillData().then(function(billData) {
			$scope.billData = billData.data.bill_details;


		if($scope.billData)
		 	$scope.optionsAvailable = true;
		else
			$scope.showAlert = true;
		
			
		});

	  }
	  $scope.fetch();

		
	};

	var dependencies = [
		'$scope',
		'BillService','$rootScope','$location',
		checkOutBalanceController
	];

	snt.controller('checkOutBalanceController', dependencies);
})();