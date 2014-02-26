(function() {
	var checkOutBalanceController = function($scope, BillService,$rootScope,$location,$route) {

		//if checkout is already done
		
 		if ($rootScope.isCheckedout) 
		$location.path('/checkOutNowSuccess')

		$('#myModal').modal('hide')

		$scope.reloadPage=  function (){
			 $route.reload();
		}

		$scope.showBill = false;

		// fecth text details to display

		BillService.fetchDisplayDetails().then(function(billDisplayDetails) {
			$scope.billDisplayDetails = billDisplayDetails;
		});

		//fetch data to display
		
		BillService.fetchBillData().then(function(billData) {
			$scope.billData = billData.data.bill_details;


		if($scope.billData){
			$scope.optionsAvailable = true;
			$('#myModal').modal('hide')
		}
		else
			$('#myModal').modal('show')
			
		});


		
	};

	var dependencies = [
		'$scope',
		'BillService','$rootScope','$location','$route',
		checkOutBalanceController
	];

	snt.controller('checkOutBalanceController', dependencies);
})();