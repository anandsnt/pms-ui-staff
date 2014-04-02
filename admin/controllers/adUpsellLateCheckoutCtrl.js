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



    		$scope.currency_code = getCurrencySign($scope.upsellData.currency_code);
    		
    		$scope.startWatching();

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

    };

	/**
    * To handle checkbox actions
    *
    */ 

    $scope.checkBoxClicked = function(){

    	$scope.upsellData.is_exclude_guests = ($scope.upsellData.is_exclude_guests === 'true')?'false':'true';

    };
    /**
    * To setup charges array after checking if any  is undefined or not
    *
    */ 

    $scope.setUpLateCheckoutArray = function(){

    	if($scope.upsellData.extended_checkout_charge_0 && $scope.upsellData.extended_checkout_charge_1 && $scope.upsellData.extended_checkout_charge_2)
    	{
    		$scope.chekoutchargesArray = [$scope.upsellData.extended_checkout_charge_0,
    		$scope.upsellData.extended_checkout_charge_1,
    		$scope.upsellData.extended_checkout_charge_2];
    	}
    	else if ($scope.upsellData.extended_checkout_charge_0 && $scope.upsellData.extended_checkout_charge_1)
    	{
    		$scope.chekoutchargesArray = [$scope.upsellData.extended_checkout_charge_0,
    		$scope.upsellData.extended_checkout_charge_1];
    	}
    	else if($scope.upsellData.extended_checkout_charge_0){
    		$scope.chekoutchargesArray = [$scope.upsellData.extended_checkout_charge_0];
    	}
    	else
    		$scope.chekoutchargesArray = [];
    }

    /**
    * To watch Upsell data
    *
    */ 
    $scope.startWatching = function(){

    	$scope.$watch('upsellData', function(newValue, oldValue){


    		if($scope.upsellData.extended_checkout_charge_0)
    			$scope.startWatchingCheckoutcharge0();
    		 if($scope.upsellData.extended_checkout_charge_1)
    			$scope.startWatchingCheckoutcharge1();  

    			

    	});
    }

    $scope.startWatchingCheckoutcharge0 = function(){

	/**
    * To watch charges
    *
    */ 

    $scope.$watch('upsellData.extended_checkout_charge_0.charge', function(newValue, oldValue){

    	$scope.setUpLateCheckoutArray();

    	if($scope.upsellData.extended_checkout_charge_0.charge.length ===0){

    		if($scope.upsellData.extended_checkout_charge_2){
    			$scope.upsellData.extended_checkout_charge_2.charge = "";
    			$scope.upsellData.extended_checkout_charge_2.time = "";
    			$scope.chekoutchargesArray.splice(2,1);
    		}

    		if($scope.upsellData.extended_checkout_charge_1){
    			$scope.upsellData.extended_checkout_charge_1.charge = "";
    			$scope.upsellData.extended_checkout_charge_1.time = "";
    			$scope.chekoutchargesArray.splice(1,1);
    		}
    		
    		
    		
    	}


    }, true);
}
$scope.startWatchingCheckoutcharge1 = function(){

  	/**
    * To watch charges
    *
    */ 
    $scope.setUpLateCheckoutArray();

    $scope.$watch('upsellData.extended_checkout_charge_1.charge', function(newValue, oldValue){

    	if($scope.upsellData.extended_checkout_charge_1.charge.length ===0){
    		
    		if($scope.upsellData.extended_checkout_charge_2){
    			$scope.upsellData.extended_checkout_charge_2.charge = "";
    			$scope.upsellData.extended_checkout_charge_2.time = "";
    			$scope.chekoutchargesArray.splice(2,1);
    		}

    		
    	}


    }, true);
};


	/**
    * To handle cancel button action
    *
    */ 

    $scope.cancelClick = function(){

    	$state.go( 'admin.dashboard', {menu:2});

    };

	/**
    * To handle save button action
    *
    */ 

    $scope.saveClick = function(){

    	
    	$scope.setUpLateCheckoutArray();

    	var updateData = 
    	{
    		'is_late_checkout_set' :$scope.upsellData.is_late_checkout_set,
    		'allowed_late_checkout':$scope.upsellData.allowed_late_checkout,
    		'is_exclude_guests':$scope.upsellData.is_exclude_guests,
    		'sent_alert':$scope.upsellData.alert_hour+':'+$scope.upsellData.alert_minute,
    		'extended_checkout_charge':$scope.chekoutchargesArray,
    		'charge_code':$scope.upsellData.selected_charge_code

    	};
    	var updateChainSuccessCallback = function(data) {
    		$scope.$emit('hideLoader');
    	};
    	$scope.invokeApi(adUpsellLatecheckoutService.update,updateData,updateChainSuccessCallback);

    };


}]);