/*
*	This Controller is to view bill
*/
sntGuestWeb.controller('GwCheckoutNowInitialController', ['$scope','$state','GwWebSrv','$timeout',
 function($scope,$state,GwWebSrv,$timeout) {

 		$scope.checkout_time = GwWebSrv.reservationAndhotelData.checkoutTime =  "10:20 PM";

	    //TODO : remove unwanted injections like $timeout
	 	BaseController.call(this, $scope);
	 	var init = function(){
			var screenIdentifier = "CHECKOUT_NOW_LANDING";
			$scope.screenCMSDetails =  GwWebSrv.extractScreenDetails(screenIdentifier);
			$scope.screenCMSDetails.description = $scope.screenCMSDetails.description.replace("@checkout-time",$scope.checkout_time);
		}();

}]);