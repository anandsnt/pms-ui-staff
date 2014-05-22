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
$scope.hours = ["HH","01","02","03","04","05","06","07","08","09","10","11","12"];
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
        if(!$scope.upsellData.extended_checkout_charge_0) 
            $scope.upsellData.extended_checkout_charge_0 = { 'time':'HH','charge':''};
        if(!$scope.upsellData.extended_checkout_charge_1)
            $scope.upsellData.extended_checkout_charge_1 = { 'time':'HH','charge':''};
        if(!$scope.upsellData.extended_checkout_charge_2)
           $scope.upsellData.extended_checkout_charge_2 = { 'time':'HH','charge':''};

       $scope.startWatchingCheckoutcharge0();            
       $scope.startWatchingCheckoutcharge1();
   });
}
$scope.startWatchingCheckoutcharge0 = function(){

/**
* To watch charges
*
*/ 
$scope.$watch('upsellData.extended_checkout_charge_0', function(newValue, oldValue){
    $scope.setUpLateCheckoutArray();
    if($scope.upsellData.extended_checkout_charge_0.charge.length ===0 || $scope.upsellData.extended_checkout_charge_0.time === "HH"){
       if($scope.upsellData.extended_checkout_charge_2){
          $scope.upsellData.extended_checkout_charge_2.charge = "";
          $scope.upsellData.extended_checkout_charge_2.time = "HH";
          $scope.chekoutchargesArray.splice(2,1);
      }
      if($scope.upsellData.extended_checkout_charge_1){
          $scope.upsellData.extended_checkout_charge_1.charge = "";
          $scope.upsellData.extended_checkout_charge_1.time = "HH";
          $scope.chekoutchargesArray.splice(1,1);
      }   		
      $scope.disableThirdOption = true;
      $scope.disableSecondOption = true;		
  }
  else if($scope.upsellData.extended_checkout_charge_0.charge.length > 0 && $scope.upsellData.extended_checkout_charge_0.time != "HH")
    $scope.disableSecondOption = false;
}, true);  
}
$scope.startWatchingCheckoutcharge1 = function(){

/**
* To watch charges
*
*/ 
$scope.setUpLateCheckoutArray();
$scope.$watch('upsellData.extended_checkout_charge_1', function(newValue, oldValue){
    if($scope.upsellData.extended_checkout_charge_1.charge.length ===0 || $scope.upsellData.extended_checkout_charge_1.time === "HH"){		
       if($scope.upsellData.extended_checkout_charge_2){
          $scope.upsellData.extended_checkout_charge_2.charge = "";
          $scope.upsellData.extended_checkout_charge_2.time = "HH";
          $scope.chekoutchargesArray.splice(2,1);
      }
      $scope.disableThirdOption = true;    		
  }
  else if($scope.upsellData.extended_checkout_charge_1.charge.length > 0 && $scope.upsellData.extended_checkout_charge_1.time != "HH")
    $scope.disableThirdOption = false;       
}, true);

};


/**
* To handle cancel button action
*
*/ 
$scope.cancelClick = function(){
 if($rootScope.previousStateParam){
  $state.go($rootScope.previousState, { menu:$rootScope.previousStateParam});
}
else if($rootScope.previousState){
  $state.go($rootScope.previousState);
}
else 
{
 $state.go('admin.dashboard', {menu : 0});
}
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