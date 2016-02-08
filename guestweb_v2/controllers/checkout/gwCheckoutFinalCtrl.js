

/*
*	This Ctrl is to view bill
*/

sntGuestWeb.controller('gwCheckoutFinalCtrl', ['$scope','$state','gwWebSrv','$timeout','gwCheckoutSrv',
 function($scope,$state,gwWebSrv,$timeout,gwCheckoutSrv) {
	    //TODO : remove unwanted injections like $timeout
	 	BaseCtrl.call(this, $scope);
	 	var init = function(){
			var screenIdentifier = "CHECKOUT_FINAL";
			$scope.screenCMSDetails =  gwWebSrv.extractScreenDetails(screenIdentifier); 
		}();

		$scope.$emit('showLoader');
		$timeout(function() {
   			 $scope.$emit('hideLoader');
   			 $scope.isCheckoutCompleted = true;
		}, 500);


}]);