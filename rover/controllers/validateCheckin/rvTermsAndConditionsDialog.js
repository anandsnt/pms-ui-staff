sntRover.controller('RVTermsAndConditionsDialogCtrl',['$rootScope', '$scope', '$state', 'ngDialog', 'RVValidateCheckinSrv',  function($rootScope, $scope, $state, ngDialog, RVValidateCheckinSrv){
	BaseCtrl.call(this, $scope);
	
	
	$scope.refreshScroller('termsandconditions');
	$scope.clickCancel = function(){
		ngDialog.close();
	};
	
	$scope.agreeButtonClicked = function(){
			
	};
	
}]);