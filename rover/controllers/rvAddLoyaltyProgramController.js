sntRover.controller('rvAddLoyaltyProgramController',['$scope','$filter','RVLoyaltyProgramSrv', 'ngDialog', function($scope, $filter, RVLoyaltyProgramSrv, ngDialog){
	BaseCtrl.call(this, $scope);
	
	
	$scope.closeDialog = function(){
		ngDialog.close();
	};

	$scope.dimissLoaderAndDialog = function(){
			$scope.$emit('hideLoader');
			$scope.closeDialog();
		};

	$scope.addLoyaltyProgram = function(){
		var params = {};		
		
		var successCallbackaddLoyaltyProgram = function(){
			
			$scope.dimissLoaderAndDialog();
		};

		var errorCallbackaddLoyaltyProgram = function(errorMessage){
			$scope.$emit('hideLoader');
			$scope.errorMessage = errorMessage;
		};

		$scope.invokeApi(RVLoyaltyProgramSrv.addLoyaltyProgram, params , successCallbackaddLoyaltyProgram, errorCallbackaddLoyaltyProgram);
	};

	$scope.fetchLoyaltyDetails = function(){
		var params = {};
		params.reservation_id = $scope.reservationData.reservation_card.reservation_id;
		var successCallbackfetchLoyalty = function(){
			
			$scope.dimissLoaderAndDialog();
		};
		var errorCallbackfetchLoyalty = function(errorMessage){
			$scope.$emit('hideLoader');
			$scope.errorMessage = errorMessage;
		};
		$scope.invokeApi(RVLoyaltyProgramSrv.getLoyaltyDetails, params , successCallbackfetchLoyalty, errorCallbackfetchLoyalty);

	};

	$scope.validate = function(){
		
	};
	
}]);