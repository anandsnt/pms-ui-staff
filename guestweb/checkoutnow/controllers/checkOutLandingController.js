snt.controller('checkOutLandingController', ['$rootScope','$location','$state', function($rootScope,$location,$state) {


	if($rootScope.isCheckedout)	{
		$state.go('checkOutStatus');	
	}
	else if(!$rootScope.isLateCheckoutAvailable){
		$state.go('checkOutConfirmation');
	};

}]);

snt.filter('customizeLabelText', function () {
    return function (input, scope) {
        return input.substring(0, 1) +" ' "+ input.substring(1, 2).toBold() +" ' "+ input.substring(2);
    }
});