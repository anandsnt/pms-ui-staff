/*
*	This Controller is to view bill
*/

sntGuestWeb.controller('GwCheckoutReviewBillController', ['$scope','$state','GwWebSrv','GwCheckoutSrv',
 function($scope,$state,GwWebSrv,GwCheckoutSrv) {

	 	BaseController.call(this, $scope);

	 	var fetchBillSuccess =function(response){
			$scope.$emit("hideLoader");
			$scope.billData = response.bill_details;
			$scope.roomNo 	= response.room_number;
		};
	 	var init = function(){
			var screenIdentifier    = "REVIEW_BILL";
			$scope.screenCMSDetails =  GwWebSrv.extractScreenDetails(screenIdentifier); 
			$scope.invokeApi(GwCheckoutSrv.fetchBillDetails, {}, fetchBillSuccess);
			$scope.showBill         =  false;
		}();
		$scope.gotToNextStep = function(){
			$state.go('checkOutFinal');
		};



}]);