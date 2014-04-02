

admin.controller('ADRoomUpsellCtrl',['$scope','$rootScope','$state','adRoomUpsellService',  function($scope,$rootScope,$state,adRoomUpsellService){
	
	BaseCtrl.call(this, $scope);
	$scope.upsellData = {};


	/**
    * To fetch upsell details
    *
    */ 
    $scope.fetchUpsellDetails = function(){
    	var fetchRoomUpsellDetailsSuccessCallback = function(data) {
    		$scope.$emit('hideLoader');
    		$scope.upsellData = data;
    		$scope.currency_code = getCurrencySign($scope.upsellData.upsell_setup.currency_code);

    	};
    	$scope.invokeApi(adRoomUpsellService.fetch, {},fetchRoomUpsellDetailsSuccessCallback);
    };

    $scope.fetchUpsellDetails();

     $scope.switchClicked = function(){

    	$scope.upsellData.upsell_setup.is_upsell_on =  ($scope.upsellData.upsell_setup.is_upsell_on === 'true')?'false':'true';

    };


    $scope.oneNightcheckBoxClicked = function(){

    	$scope.upsellData.upsell_setup.is_one_night_only = ($scope.upsellData.upsell_setup.is_one_night_only === 'true')?'false':'true';

    };

    $scope.forceUpsellcheckBoxClicked = function(){

    	$scope.upsellData.upsell_setup.is_force_upsell = ($scope.upsellData.upsell_setup.is_force_upsell === 'true')?'false':'true';

    };

   


}]);