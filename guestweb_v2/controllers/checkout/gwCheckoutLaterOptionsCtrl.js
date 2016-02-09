/*
*	This Controller is to show the  late checkout options
*/
sntGuestWeb.controller('GwCheckoutLaterController', ['$scope','$state','$controller','GwWebSrv','GwCheckoutSrv',
 function($scope,$state,$controller,GwWebSrv,GwCheckoutSrv) {

	    //TODO : remove unwanted injections like $timeout
	 	$controller('BaseController', { $scope: $scope });
	 	var fetchLateCheckoutOptionsSuccess = function(response){
			$scope.$emit("hideLoader");
			$scope.lateCheckoutOptions = response;
			$scope.isFetching          =  false;
		};

	 	var init = function(){
			var screenIdentifier    = "CHECKOUT_LATER_OPTIONS";
			$scope.screenCMSDetails =  GwWebSrv.extractScreenDetails(screenIdentifier);
			$scope.isFetching       =  true;
			$scope.invokeApi(GwCheckoutSrv.fetchLateCheckoutOptions, {}, fetchLateCheckoutOptionsSuccess);
		}();
}]);