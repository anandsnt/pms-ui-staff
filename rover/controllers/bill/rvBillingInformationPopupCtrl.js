sntRover.controller('rvBillingInformationPopupCtrl',['$scope','$rootScope','$filter','RVBillinginfoSrv', 'ngDialog', function($scope, $rootScope,$filter, RVBillinginfoSrv, ngDialog){
	BaseCtrl.call(this, $scope);
	
	$scope.isInitialPage = true;
    $scope.isEntitySelected = false;

	$scope.closeDialog = function(){
		ngDialog.close();
	};

	$scope.dimissLoaderAndDialog = function(){
			$scope.$emit('hideLoader');
			$scope.closeDialog();
		};

	$scope.getHeaderButtonLabel = function(){
		return $scope.isInitialPage? $filter('translate')('ADD_ROUTES_LABEL') : $filter('translate')('ALL_ROUTES_LABEL');		
	}

	$scope.headerButtonClicked = function(){
        $scope.isEntitySelected = false;
		$scope.isInitialPage = !$scope.isInitialPage;
	}

	$scope.selectEntity = function(){
		$scope.isEntitySelected = true;
        $scope.isInitialPage = false;
	}

    $scope.fetchRoutes = function(){
        
            var successCallback = function(data) {
                $scope.attachedEntities = data;
                 $scope.$emit('hideLoader');
            };
            var errorCallback = function(errorMessage) {
                $scope.$emit('hideLoader');
                $scope.errorMessage = errorMessage;
            };
           
            $scope.invokeApi(RVBillinginfoSrv.fetchRoutes, {}, successCallback, errorCallback);
    };	

    $scope.fetchRoutes();
	
}]);