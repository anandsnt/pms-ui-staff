sntRover.controller('rvDeleteLoyaltyModalController', ['$scope', '$rootScope', '$filter', 'RVGuestCardLoyaltySrv', 'ngDialog', function($scope, $rootScope, $filter, RVGuestCardLoyaltySrv, ngDialog) {
	BaseCtrl.call(this, $scope);


	$scope.closeDialog = function() {
		ngDialog.close();
	};

	$scope.dimissLoaderAndDialog = function() {
			$scope.$emit('hideLoader');
			$scope.closeDialog();
		};

	$scope.deleteLoyalty = function() {
			var successCallbackDeleteLoyalty = function() {
				$scope.loyaltyProgramDeleted($scope.loaytyID, $scope.loyaltyIndexToDelete, $scope.loyaltyProgramToDelete);
				$rootScope.$broadcast('loyaltyProgramDeleted', $scope.loaytyID, $scope.loyaltyIndexToDelete, $scope.loyaltyProgramToDelete);
				$scope.$emit('REFRESH_CONTACT_INFO', {guestId: $scope.$parent.guestCardData.userId});
				$scope.dimissLoaderAndDialog();
			};
			var errorCallbackDeleteLoyalty = function(error) {
				$scope.dimissLoaderAndDialog();
				$scope.$emit('loyaltyDeletionError', error);
			};

			$scope.invokeApi(RVGuestCardLoyaltySrv.deleteLoyalty, $scope.loaytyID, successCallbackDeleteLoyalty, errorCallbackDeleteLoyalty);
	};

	$scope.validate = function() {

	};

}]);