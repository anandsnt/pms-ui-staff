

/*
*	This Controller is to view bill
*/

sntGuestWeb.controller('GwCheckoutFinalController', ['$scope','$state','$controller','GwWebSrv','$timeout','GwCheckoutSrv',
 function($scope,$state,$controller,GwWebSrv,$timeout,GwCheckoutSrv,$controller) {
	    //TODO : remove unwanted injections like $timeout
	 	$controller('BaseController', { $scope: $scope });
	 	var init = function(){
			var screenIdentifier = "CHECKOUT_FINAL";
			$scope.screenCMSDetails =  GwWebSrv.extractScreenDetails(screenIdentifier); 
		}();

		$scope.$emit('showLoader');
		$timeout(function() {
   			 $scope.$emit('hideLoader');
   			 $scope.isCheckoutCompleted = true;
		}, 500);


}]);