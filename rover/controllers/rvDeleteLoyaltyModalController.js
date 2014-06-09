sntRover.controller('rvDeleteLoyaltyModalController',['$scope','$rootScope','$filter','RVGuestCardLoyaltySrv', 'ngDialog', function($scope, $rootScope,$filter, RVGuestCardLoyaltySrv, ngDialog){
	BaseCtrl.call(this, $scope);
	
	
	$scope.closeDialog = function(){
		ngDialog.close();
	};

	$scope.dimissLoaderAndDialog = function(){
			$scope.$emit('hideLoader');
			$scope.closeDialog();
		};

	$scope.deleteLoyalty = function(){
			var successCallbackDeleteLoyalty = function(){
				$scope.dimissLoaderAndDialog();
				$rootScope.$broadcast('loyaltyProgramDeleted', $scope.loaytyID);
			};
			var errorCallbackDeleteLoyalty = function(error){
				$scope.dimissLoaderAndDialog();
				$scope.errorMessage = error;
			};
			$scope.invokeApi(RVGuestCardLoyaltySrv.deleteLoyalty,$scope.loaytyID , successCallbackDeleteLoyalty, errorCallbackDeleteLoyalty);
	};

	$scope.validate = function(){
		
	};
	
}]);