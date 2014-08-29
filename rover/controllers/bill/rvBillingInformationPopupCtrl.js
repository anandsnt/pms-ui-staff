sntRover.controller('rvBillingInformationPopupCtrl',['$scope','$rootScope','$filter','RVBillinginfoSrv', 'ngDialog', function($scope, $rootScope,$filter, RVBillinginfoSrv, ngDialog){
	BaseCtrl.call(this, $scope);
	
	$scope.isInitialPage = true;
    $scope.isEntitySelected = false;

    $scope.selectedEntity = {};

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

	$scope.selectEntity = function(index){
		$scope.isEntitySelected = true;
        $scope.isInitialPage = false;
        $scope.selectedEntity = $scope.attachedEntities[index];
	}

	$scope.getEntityRole = function(route){
    	if(route.entity_type == 'RESERVATION' &&  route.has_accompanying_guests == 'false')
    		return 'guest';
    	else if(route.entity_type == 'RESERVATION')
    		return 'accompany';
    	else if(route.entity_type == 'TRAVEL_AGENT')
    		return 'travel-agent';
    	else if(route.entity_type == 'COMPANY_CARD')
    		return 'company';
    };
    $scope.getEntityIconClass = function(route){
        if(route.entity_type == 'RESERVATION' &&  route.has_accompanying_guests == 'true')
            return 'accompany';
    	else if(route.entity_type == 'RESERVATION' || route.entity_type == 'COMPANY_CARD')
            return '';
    	else if(route.entity_type == 'TRAVEL_AGENT')
    		return 'icons icon-travel-agent';
    	
    };

    $scope.fetchRoutes = function(){
        
            var successCallback = function(data) {
                $scope.attachedEntities = data;
                $scope.routes = data;
                 $scope.$parent.$emit('hideLoader');
            };
            var errorCallback = function(errorMessage) {
                $scope.$emit('hideLoader');
                $scope.errorMessage = errorMessage;
            };
           
            $scope.invokeApi(RVBillinginfoSrv.fetchRoutes, {}, successCallback, errorCallback);
    };	

    $scope.fetchRoutes();
	
}]);