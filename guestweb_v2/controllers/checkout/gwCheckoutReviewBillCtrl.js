/*
*	This Controller is to view bill
*/

sntGuestWeb.controller('GwCheckoutReviewBillController', ['$scope','$state','GwWebSrv','$timeout','GwCheckoutSrv',
 function($scope,$state,GwWebSrv,$timeout,GwCheckoutSrv) {
	    //TODO : remove unwanted injections like $timeout
	 	BaseController.call(this, $scope);
	 	var init = function(){
			var screenIdentifier    = "REVIEW_BILL";
			$scope.screenCMSDetails =  GwWebSrv.extractScreenDetails(screenIdentifier); 
			$scope.invokeApi(GwCheckoutSrv.fetchBillDetails, {}, fetchBillSuccess);
			$scope.showBill         =  false;
		}();

		function fetchBillSuccess(response){
			$scope.$emit("hideLoader");
			$scope.billData = response.bill_details;
			$scope.roomNo 	= response.room_number;
		};

		$scope.gotToNextStep = function(){
			$state.go('checkOutFinal');
		};



}]);