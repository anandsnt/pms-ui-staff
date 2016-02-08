/*
*	This Ctrl is to view bill
*/
sntGuestWeb.controller('gwCheckoutNowInitialCtrl', ['$scope','$state','gwWebSrv','$timeout',
 function($scope,$state,gwWebSrv,$timeout) {
	    //TODO : remove unwanted injections like $timeout
	 	BaseCtrl.call(this, $scope);
	 	var init = function(){
			var screenIdentifier = "CHECKOUT_NOW_LANDING";
			$scope.screenCMSDetails =  gwWebSrv.extractScreenDetails(screenIdentifier);
		}();

}]);