sntRover.controller('RVAccountReceivableMessagePopupCtrl',['$rootScope', '$scope', '$state','ngDialog', 'RVCompanyCardSrv', function($rootScope, $scope, $state, ngDialog, RVCompanyCardSrv){
	BaseCtrl.call(this, $scope);

	$scope.isCreateNewARAccountMode = false;
	$scope.ar_number = "";

	$scope.createAccountAction = function(){

		if((typeof $scope.reservationBillData !=="undefined"  && $scope.reservationBillData.is_auto_assign_ar_numbers === "true")||(typeof $scope.is_auto_assign_ar_numbers !=="undefined" && $scope.is_auto_assign_ar_numbers)){
			var isAutoAssignARNumber = true;
			$scope.createAccountReceivable( isAutoAssignARNumber );
		}
		else{
			$scope.isCreateNewARAccountMode = true;
		}
	};

	$scope.successCreate = function(data){
		$scope.$emit("hideLoader");
		if(typeof $scope.reservationBillData !=="undefined"){
			$scope.reservationBillData.ar_number = data.ar_number;
		}
		$rootScope.$emit('arAccountCreated');
		ngDialog.close();
	};

	$scope.failureCreate = function(errorMessage){
		$scope.$emit("hideLoader");
		$scope.errorMessage = errorMessage;
	};

	$scope.createAccountReceivable = function( isAutoAssignARNumber ){

		var data = {
			"id": $scope.account_id,
			"ar_number": isAutoAssignARNumber ? "" : $scope.ar_number
		};
		$scope.invokeApi(RVCompanyCardSrv.saveARDetails, data, $scope.successCreate, $scope.failureCreate);
	};

	$scope.closeDialog = function(){
		ngDialog.close();
	};

	$scope.cancelButtonClick = function(){
		$scope.errorMessage = "";
		$scope.isCreateNewARAccountMode = false;
	};

}]);