

/*
*	This Controller is to view bill
*/

sntGuestWeb.controller('GwCheckoutFinalController', ['$scope','$state','GwWebSrv','$timeout','GwCheckoutSrv',
 function($scope,$state,GwWebSrv,$timeout,GwCheckoutSrv) {
	    //TODO : remove unwanted injections like $timeout
	 	BaseController.call(this, $scope);
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