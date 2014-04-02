

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


    /**
    * To handle cancel button action
    *
    */ 

    $scope.cancelClick = function(){

    	$state.go( 'admin.dashboard', {menu:2});

    };


     $scope.saveClick = function(){

    	
    	// $scope.setUpLateCheckoutArray();

    	var updateData = 
    	{

    		'is_force_upsell':$scope.upsellData.upsell_setup.is_force_upsell,
    		'is_one_night_only':$scope.upsellData.upsell_setup.is_one_night_only,
    		'is_upsell_on':$scope.upsellData.upsell_setup.is_upsell_on,

    		'total_upsell_target_amount':$scope.upsellData.upsell_setup.total_upsell_target_amount,
    		'total_upsell_target_rooms':$scope.upsellData.upsell_setup.total_upsell_target_rooms,
    		'charge_code':$scope.upsellData.selected_charge_code,
    		 'upsell_amounts' : $scope.upsellData.upsell_amounts,
    		 'upsell_room_levels' : $scope.upsellData.upsell_room_levels

    	};
    	//var updateData = $scope.upsellData;
    	var updateChainSuccessCallback = function(data) {
    		$scope.$emit('hideLoader');
    	};
    	$scope.invokeApi(adRoomUpsellService.update,updateData,updateChainSuccessCallback);

    };

   


}]);