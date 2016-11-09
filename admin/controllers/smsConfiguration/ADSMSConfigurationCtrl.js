admin.controller('ADSMSConfigurationCtrl',['$scope', '$state', 'ADHotelListSrv', 'ADHotelConfigurationSrv', 'ngTableParams','$filter', '$anchorScroll', '$timeout', '$location',
  function($scope, $state, ADHotelListSrv, ADHotelConfigurationSrv, ngTableParams, $filter, $anchorScroll, $timeout, $location) {

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

