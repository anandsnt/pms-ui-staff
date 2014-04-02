

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


}]);