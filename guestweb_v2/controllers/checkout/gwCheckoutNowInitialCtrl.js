/*
*	This Ctrl is to view bill
*/
sntGuestWeb.controller('gwCheckoutNowInitialCtrl', ['$scope','$state','gwWebSrv','$timeout',
 function($scope,$state,gwWebSrv,$timeout) {

 		var checkout_time = gwWebSrv.reservationAndhotelData.checkoutTime =  "10:20 PM";

	    //TODO : remove unwanted injections like $timeout
	 	BaseCtrl.call(this, $scope);
	 	var init = function(){
			var screenIdentifier = "CHECKOUT_NOW_LANDING";
			$scope.screenCMSDetails =  gwWebSrv.extractScreenDetails(screenIdentifier);
			$scope.screenCMSDetails.description = $scope.screenCMSDetails.description.replace("@checkout-time",checkout_time);
		}();

}]);