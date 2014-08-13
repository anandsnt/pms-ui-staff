sntRover.controller('RVAccountReceivableMessagePopupCtrl',['$rootScope', '$scope', '$state','ngDialog', function($rootScope, $scope, $state, ngDialog){
	BaseCtrl.call(this, $scope);
	$scope.account_no = "";
	
	$scope.createAccountReceivable = function(){
		ngDialog.close();
		ngDialog.open({
				template: '/assets/partials/payment/rvAccountReceivablesCreatePopup.html',
				controller: 'RVCreateAccountReceivableCtrl',
				className: 'ngdialog-theme-default',
				scope: $scope
			});
	};

	$scope.closeDialog = function(){
		ngDialog.close();
	}
	
}]);