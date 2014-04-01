admin.controller('ADUpsellLateCheckoutCtrl',['$scope','$rootScope','$state','adUpsellLatecheckoutService',  function($scope,$rootScope,$state,adUpsellLatecheckoutService){
	BaseCtrl.call(this, $scope);
	$scope.upsellData = {};

   /**
    * To fetch upsell details
    *
    */ 

    $scope.fetchUpsellDetails = function(){

		var fetchUpsellDetailsSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.upsellData = data;
			
		};
		$scope.invokeApi(adUpsellLatecheckoutService.fetch, {},fetchUpsellDetailsSuccessCallback);
	};

	$scope.fetchUpsellDetails();

	$scope.hours = ["01","02","03","04","05","06","07","08","09","10","11","12"];
	$scope.minutes = ["00","15","30","45"];


	/**
    * To handle switch actions
    *
    */ 

	$scope.switchClicked = function(){

	$scope.upsellData.is_late_checkout_set =  ($scope.upsellData.is_late_checkout_set === 'true')?'false':'true';
		
	}

	/**
    * To handle checkbox actions
    *
    */ 

	$scope.checkBoxClicked = function(){
		
	$scope.upsellData.is_exclude_guests = ($scope.upsellData.is_exclude_guests === 'true')?'false':'true';

	}




	/**
    * To handle cancel button action
    *
    */ 

	$scope.cancelClick = function(){

		$state.go( 'admin.dashboard', {menu:2});
		
	}

	/**
    * To handle save button action
    *
    */ 

	$scope.saveClick = function(){



 		var updateData = {'updateData' :$scope.upsellData };
 		var updateChainSuccessCallback = function(data) {
 			$scope.$emit('hideLoader');
 			$state.go( 'admin.dashboard', {menu:2});
 		};
 		$scope.invokeApi(adUpsellLatecheckoutService.update,updateData,updateChainSuccessCallback);
 	
	
		
	
	}
	

}]);