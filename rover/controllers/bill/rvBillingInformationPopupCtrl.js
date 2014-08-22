sntRover.controller('rvBillingInformationPopupCtrl',['$scope','$rootScope','$filter','RVGuestCardLoyaltySrv', 'ngDialog', function($scope, $rootScope,$filter, RVGuestCardLoyaltySrv, ngDialog){
	BaseCtrl.call(this, $scope);
	
	$scope.isInitialPage = true;
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
		$scope.isInitialPage = !$scope.isInitialPage;
	}

	$scope.noDetails = true;

	$scope.showBillGroup = function(){
		$scope.noDetails = false;
	}



	 $scope.attachedEntities = [
        {
            "id": "1",
            "entity_name": "Aron Smith",
            "entity_avatar": "http://localhost:3000/assets/avatar-female.png",
            "entity_role": "guest",
            "status":"check-in"
        },
        {
            "id": "2",
            "entity_name": "Allianz Insurance",
            "entity_avatar": "http://localhost:3000/assets/avatar-female.png",
            "entity_role": "company"
        },
        {
            "id": "3",
            "entity_name": "Mctavish travels",
            "entity_avatar": "http://localhost:3000/assets/avatar-female.png",
            "entity_role": "travel_agent"
        },
        {
            "id": "4",
            "entity_name": "John Smith",
            "entity_avatar": "http://localhost:3000/assets/avatar-female.png",
            "entity_role": "accompanying guest",
            "status":"check-out"
        }
    ]

	
	
}]);