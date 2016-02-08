/*
*	This Ctrl is to view bill
*/

sntGuestWeb.controller('gwCheckoutReviewBillCtrl', ['$scope','$state','gwWebSrv','$timeout','gwCheckoutSrv',
 function($scope,$state,gwWebSrv,$timeout,gwCheckoutSrv) {
	    //TODO : remove unwanted injections like $timeout
	 	BaseCtrl.call(this, $scope);
	 	var init = function(){
			var screenIdentifier = "REVIEW_BILL";
			$scope.screenCMSDetails =  gwWebSrv.extractScreenDetails(screenIdentifier); 
			$scope.invokeApi(gwCheckoutSrv.fetchBillDetails, {}, fetchBillSuccess);
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