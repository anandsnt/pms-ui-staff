admin.controller('ADEarlyCheckinCtrl',['$scope','$rootScope','$state','adUpsellEarlyCheckinService', 'ADChargeCodesSrv', 'ADRatesSrv', 'ADRatesAddonsSrv',  function($scope,$rootScope,$state,adUpsellEarlyCheckinService, ADChargeCodesSrv, ADRatesSrv, ADRatesAddonsSrv){

    BaseCtrl.call(this, $scope);
    
    $scope.upsellData = {};
    $scope.upsell_rate = {};
    $scope.upsell_rate.selected_rate_id = "";
	
/**
* To fetch upsell details
*
*/ 
$scope.fetchUpsellDetails = function(){
    var fetchUpsellDetailsSuccessCallback = function(data) {
       
       $scope.upsellData = data;
       $scope.isRatesSelected();
       $scope.fetchChargeCodes();
       $scope.setUpUpsellWindowData();
   };
   $scope.invokeApi(adUpsellEarlyCheckinService.fetch, {},fetchUpsellDetailsSuccessCallback);
};

$scope.fetchChargeCodes = function(){
    var fetchSuccessOfChargeCodes = function(data) {
       
       $scope.charge_codes = $scope.getChargeCodesWithNameValues(data.charge_codes);
       $scope.fetchAddons();
   };
   $scope.invokeApi(ADChargeCodesSrv.fetch, {}, fetchSuccessOfChargeCodes);
};

$scope.fetchAddons = function(){
    var fetchSuccessOfAddons = function(data) {
       
       $scope.addons = $scope.getAddonsWithNameValues(data.results);
       $scope.fetchRates();
   };
   $scope.invokeApi(ADRatesAddonsSrv.fetch, {}, fetchSuccessOfAddons);
};

$scope.fetchRates = function(){
    var fetchSuccessOfRates = function(data) {
       $scope.$emit('hideLoader');
       $scope.rates = $scope.getRatesWithNameValues(data.results);
       
   };
   $scope.invokeApi(ADRatesSrv.fetchRates, {}, fetchSuccessOfRates);
};

$scope.getChargeCodesWithNameValues = function(chargecodes){
        angular.forEach(chargecodes,function(item, index) {
    
       item.name = item.charge_code + " " +item.description;
       item.value = item.charge_code;
    
  });
        return chargecodes;
};

$scope.getAddonsWithNameValues = function(addons){
        angular.forEach(addons,function(item, index) {
       item.value = item.id;
    
  });
        return addons;
};

$scope.getRatesWithNameValues = function(rates){
        angular.forEach(rates,function(item, index) {
       item.value = item.id;
    
  });
        return rates;
};

$scope.setUpUpsellWindowData = function () {
        $scope.upsellWindows = [];
        var upsellWindow;
         angular.forEach($scope.upsellData.early_checkin_levels,function(item, index) {
         upsellWindow = {};
         upsellWindow.hours = item.start_time.substring(0, 2);
         upsellWindow.minutes = item.start_time.substring(3, 5);
         upsellWindow.meridiem = item.start_time.substring(6);
         upsellWindow.addon_id = item.addon_id;    
         upsellWindow.charge = item.charge;
         $scope.upsellWindows.push(upsellWindow);
  });
}

$scope.setUpUpsellWindowDataToSave = function () {
        $scope.upsellData.early_checkin_levels = [];
        var upsellWindow;
         angular.forEach($scope.upsellWindows,function(item, index) {
             upsellWindow = {};
             upsellWindow.start_time = item.hours + "." + item.minutes + " " + item.meridiem;
             upsellWindow.charge = item.charge;
             upsellWindow.addon_id = item.addon_id;

             $scope.upsellData.early_checkin_levels.push(upsellWindow);
        });
}

$scope.fetchUpsellDetails();
$scope.hours = ["HH","01","02","03","04","05","06","07","08","09","10","11","12"];
$scope.minutes = ["00","15","30","45"];
/**
* To handle switch actions
*
*/ 
$scope.switchClicked = function(){
    $scope.upsellData.is_early_checkin_allowed =  !$scope.upsellData.is_early_checkin_allowed;
};

/**
* To handle save button action
*
*/ 
$scope.saveClick = function(){   	
    $scope.setUpUpsellWindowDataToSave();
   	var upsellEarlyCheckinSaveSuccessCallback = function(data) {
      $scope.$emit('hideLoader');
       	
   	};
    // had to ovveride default error handler for custom actions.
   	var upsellEarlyCheckinSaveFailureCallback =  function(errorMessage) {
      $scope.$emit('hideLoader');
      $scope.errorMessage = errorMessage;       	
   	};
   	$scope.invokeApi(adUpsellEarlyCheckinService.update,$scope.upsellData,upsellEarlyCheckinSaveSuccessCallback, upsellEarlyCheckinSaveFailureCallback);

};

$scope.clickAddRoomType = function(){
	//While addig a room type, making its max_late_checkouts defaults to 0.
  
  if($scope.getSelectesRateIndexForID($scope.upsell_rate.selected_rate_id) != -1)
    return;
  var rate_item;
	angular.forEach($scope.rates,function(item, index) {
		if(item.id == $scope.upsell_rate.selected_rate_id){
      rate_item = {};
      rate_item.id = item.id;
      rate_item.name = item.name;
			$scope.upsellData.early_checkin_rates.push(rate_item); 
      }
    });
  $scope.isRateSelected();
};
/**
 * Method to check if max_late_checkouts of all elements are blank or not.
 * Configured room type will have valid max_late_checkouts value.
 */
$scope.isRatesSelected = function(){
	$scope.isRateSelected = false;
	if($scope.upsellData.early_checkin_rates.length > 0){
    $scope.isRateSelected = true;
  }
};

$scope.getSelectesRateIndexForID = function(rateID){
  var rateIndex = -1;
  angular.forEach($scope.upsellData.early_checkin_rates,function(item, index) {
    if(item.id == rateID){
      rateIndex =  index;
    }
  });
  return rateIndex;
};
/*
 * Method to delete the room type.
 */
$scope.deleteRate = function(value,name){
	
	
	var indexForRate = $scope.getSelectesRateIndexForID(value);
  if(indexForRate != -1)
     $scope.upsellData.early_checkin_rates.splice(indexForRate, 1);
   $scope.isRateSelected();
};

}]);