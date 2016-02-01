/*
*	This Ctrl is to list checkout options
*/

sntGuestWeb.controller('checkOutOptionsController', ['$scope','$state','gwWebSrv','$timeout',
 function($scope,$state,gwWebSrv,$timeout) {
	    //TODO : remove unwanted injections like $timeout
	 	BaseCtrl.call(this, $scope);
	 	var init = function(){
			var screenIdentifier = "CHECKOUT_LANDING";
			$scope.screenCMSDetails =  gwWebSrv.extractScreenDetails(screenIdentifier);
		}();

}]);
