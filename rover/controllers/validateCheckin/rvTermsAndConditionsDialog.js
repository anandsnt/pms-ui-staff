sntRover.controller('RVTermsAndConditionsDialogCtrl',['$rootScope', '$scope', '$state', 'ngDialog', 'RVValidateCheckinSrv',  function($rootScope, $scope, $state, ngDialog, RVValidateCheckinSrv){
	BaseCtrl.call(this, $scope);

	var scrollerOptions = { preventDefault: false};
  	$scope.setScroller('termsandconditions', scrollerOptions);
  	setTimeout(function(){
				$scope.refreshScroller('termsandconditions');
				},
			500);

	$scope.clickCancel = function(){
		ngDialog.close();
	};

	$scope.agreeButtonClicked = function(){
			$scope.saveData.termsAndConditions = true;
			ngDialog.close();
	};

	$scope.disagreeButtonClicked = function(){
			$scope.saveData.termsAndConditions = false;
			ngDialog.close();
	};
}]);