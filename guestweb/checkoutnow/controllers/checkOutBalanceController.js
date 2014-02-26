(function() {
	var checkOutBalanceController = function($scope, BillService,$rootScope,$location) {

		//if checkout is already done
		
 		if ($rootScope.isCheckedout) 
		$location.path('/checkOutNowSuccess')


		$scope.hidePopup = function (){

			$('#myModal').modal('hide')
			$(".modal-backdrop").remove()
		}

		$scope.hidePopup();

		$scope.reloadPage=  function (){
			$('#myModal').modal('hide')
			  $scope.fetch();
		}

		$scope.showBill = false;

		// fecth text details to display

		BillService.fetchDisplayDetails().then(function(billDisplayDetails) {
			$scope.billDisplayDetails = billDisplayDetails;
		});



		//fetch data to display

		$scope.fetch = function (){

		$scope.hidePopup();
		
		BillService.fetchBillData().then(function(billData) {
			$scope.billData = billData.data.bill_details;


		if($scope.billData){

			$scope.optionsAvailable = true;
			$scope.hidePopup();
		}
		else
			$('#myModal').modal('show')
			
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