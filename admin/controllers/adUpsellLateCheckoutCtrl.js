admin.controller('ADUpsellLateCheckoutCtrl',['$scope','$rootScope','$state','adUpsellLatecheckoutService','ADChargeCodesSrv',  function($scope,$rootScope,$state,adUpsellLatecheckoutService, ADChargeCodesSrv){

    BaseCtrl.call(this, $scope);
    $scope.$emit("changedSelectedMenu", 2);
    $scope.upsellData = {};


var setUpList = function(){
   //remove the selected item from drop down
  var selectedIds = [];
  angular.forEach($scope.upsellData.room_types,function(item, index) {
    if(item.max_late_checkouts !== ''){
       selectedIds.push(item.id);
    }
  });
  angular.forEach(selectedIds,function(id, index1) {
  angular.forEach($scope.upsellData.room_types_list,function(room_types_list, index) {
        if(room_types_list.value === id){
           $scope.upsellData.room_types_list.splice(index,1);
        }
    });
  });
};
/**
* To fetch upsell details
*
*/
$scope.fetchUpsellDetails = function(){
    var fetchUpsellDetailsSuccessCallback = function(data) {
       $scope.$emit('hideLoader');
       $scope.upsellData = data;
       setUpList();
       $scope.upsellData.deleted_room_types = [];
       isRoomTypesSelected();
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
   else {
       $scope.chekoutchargesArray = [];
   }
};

/**
* To watch Upsell data
*
*/
$scope.startWatching = function(){
    $scope.$watch('upsellData', function(newValue, oldValue){
        if(!$scope.upsellData.extended_checkout_charge_0) {
            $scope.upsellData.extended_checkout_charge_0 = { 'time':'HH','charge':''};
        }
        if(!$scope.upsellData.extended_checkout_charge_1) {
            $scope.upsellData.extended_checkout_charge_1 = { 'time':'HH','charge':''};
        }
        if(!$scope.upsellData.extended_checkout_charge_2) {
           $scope.upsellData.extended_checkout_charge_2 = { 'time':'HH','charge':''};
        }
       $scope.startWatchingCheckoutcharge0();
       $scope.startWatchingCheckoutcharge1();
   });
};
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
  else if($scope.upsellData.extended_checkout_charge_0.charge.length > 0 && $scope.upsellData.extended_checkout_charge_0.time !== "HH") {
    $scope.disableSecondOption = false;
  }
}, true);
};
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
  else if($scope.upsellData.extended_checkout_charge_1.charge.length > 0 && $scope.upsellData.extended_checkout_charge_1.time !== "HH") {
    $scope.disableThirdOption = false;
  }
}, true);

};



/**
* To handle save button action
*
*/
$scope.saveClick = function(){
  $scope.setUpLateCheckoutArray();
  var updateData = {};

  updateData.is_late_checkout_set = $scope.upsellData.is_late_checkout_set;
  updateData.allowed_late_checkout = $scope.upsellData.allowed_late_checkout;
  updateData.is_exclude_guests = $scope.upsellData.is_exclude_guests;
  updateData.sent_alert = $scope.upsellData.alert_hour+':'+$scope.upsellData.alert_minute;

  for (var i = $scope.chekoutchargesArray.length - 1; i >= 0; i--) {
    if ($scope.chekoutchargesArray[i].time ==="HH" && $scope.chekoutchargesArray[i].charge ==="") {
        $scope.chekoutchargesArray.splice(i, 1);
    }
    else{
        $scope.chekoutchargesArray[i].time = $scope.chekoutchargesArray[i].time+" PM";
    }
  }

  updateData.extended_checkout = $scope.chekoutchargesArray;
  updateData.charge_code = $scope.upsellData.selected_charge_code;
	updateData.room_types = [];
	updateData.deleted_room_types = [];
	updateData.deleted_room_types = $scope.upsellData.deleted_room_types;
	//Creating room type array with available max_late_checkouts data
	angular.forEach($scope.upsellData.room_types,function(item, index) {
		if(item.max_late_checkouts !== ''){
			 var obj = { "id": item.id.toString() , "max_late_checkouts": item.max_late_checkouts.toString() };
			 updateData.room_types.push(obj);
		}
	});
   	var upsellLateCheckoutSuccessCallback = function(data) {
      $scope.$emit('hideLoader');
      angular.forEach($scope.chekoutchargesArray,function(value, key) {
      var timeValue = value.time;
			value.time = timeValue.replace(" PM", "");// To make the UI updated after success

		});

   	};
    // had to ovveride default error handler for custom actions.
   	var upsellLateCheckoutFailureCallback =  function(errorMessage) {
      $scope.$emit('hideLoader');
      $scope.errorMessage = errorMessage;
      angular.forEach($scope.chekoutchargesArray,function(value, key) {
      var timeValue = value.time;
			value.time = timeValue.replace(" PM", "");// To make the UI updated after success

		});

   	};
   	$scope.invokeApi(adUpsellLatecheckoutService.update,updateData,upsellLateCheckoutSuccessCallback, upsellLateCheckoutFailureCallback);

};

$scope.clickAddRoomType = function(){
	//While addig a room type, making its max_late_checkouts defaults to 0.
	angular.forEach($scope.upsellData.room_types,function(item, index) {
		if (item.id === parseInt($scope.upsellData.selected_room_type)) {
      // CICO-32613: Do not reset existing value.
      if (!item.max_late_checkouts) {
        item.max_late_checkouts = 0;
      }
		}
  });
    //Removing the selected room type from dropdown of room type list.
    angular.forEach($scope.upsellData.room_types_list,function(item, index) {
		if(item.value === $scope.upsellData.selected_room_type){
			 $scope.upsellData.room_types_list.splice(index,1);
		}
    });
    isRoomTypesSelected();
    $scope.upsellData.selected_room_type = "";
};
/**
 * Method to check if max_late_checkouts of all elements are blank or not.
 * Configured room type will have valid max_late_checkouts value.
 */
var isRoomTypesSelected = function(){
	$scope.upsellData.isRoomTypesSelectedFlag = false;
	angular.forEach($scope.upsellData.room_types,function(item, index) {
		if(item.max_late_checkouts !== '') {
      $scope.upsellData.isRoomTypesSelectedFlag = true;
    }
    });
};
/*
 * Method to delete the room type.
 */
$scope.deleteRoomType = function(value,name){

	var data = { "value": value , "name": name };
	$scope.upsellData.room_types_list.push(data);
	angular.forEach($scope.upsellData.room_types,function(item, index) {
		if(item.id === value){
			item.max_late_checkouts = '';
		}
    });
    $scope.upsellData.deleted_room_types.push(value);
    isRoomTypesSelected();
    $scope.upsellData.selected_room_type = "";
};

}]);