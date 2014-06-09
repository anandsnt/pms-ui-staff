sntRover.controller('rvDeleteLoyaltyModalController',['$scope','$rootScope','$filter','RVLoyaltyProgramSrv', 'ngDialog', function($scope, $rootScope,$filter, RVLoyaltyProgramSrv, ngDialog){
	BaseCtrl.call(this, $scope);
	
	$scope.availableFFPS = [];
	$scope.availableHLPS = [];
	$scope.loyaltyPrograms = [{name:"Frequent Flyer Program", code:"FFP"},{name:"Hotel Loyalty Program", code:"HLP"}];
	$scope.selectedLoyaltyProgram = "";
	$scope.selectedLoyaltyType = "";
	$scope.selectedLevel = "";
	$scope.loyaltyCode = "";
	$scope.closeDialog = function(){
		ngDialog.close();
	};

	$scope.dimissLoaderAndDialog = function(){
			$scope.$emit('hideLoader');
			$scope.closeDialog();
		};

	$scope.deleteLoyalty = function(){
			var successCallbackDeleteLoyalty = function(){

			};
			var errorCallbackDeleteLoyalty = function(){

			};
			$scope.invokeApi(RVGuestCardLoyaltySrv.deleteLoyalty,$scope.loaytyID , successCallbackDeleteLoyalty, errorCallbackDeleteLoyalty);
	};

	$scope.validate = function(){
		
	};
	
}]);