admin.controller('ADSMSConfigurationCtrl', ['$scope',
  function($scope) {

	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
        $scope.data = {};

        $scope.fetchData = function() {

        };

	$scope.cancelClicked = function() {
		$scope.currentClickedElement = -1;
		$scope.isAddmode = false;
		$scope.isEditmode = false;
	};
        $scope.cancelClicked = function() {

        };
        $scope.saveClicked = function() {

        };

}]);

