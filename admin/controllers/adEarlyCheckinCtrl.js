admin.controller('ADEarlyCheckinCtrl',['$scope','$rootScope','$state','adUpsellEarlyCheckinService', 'ADChargeCodesSrv', 'ADRatesSrv', 'ADRatesAddonsSrv','blockCodeData',  function($scope,$rootScope,$state,adUpsellEarlyCheckinService, ADChargeCodesSrv, ADRatesSrv, ADRatesAddonsSrv,blockCodeData){

BaseCtrl.call(this, $scope);
$scope.upsellData = {};
$scope.upsell_rate = {};
$scope.upsell_end_time = {};
$scope.upsell_rate.selected_rate_id = "";
$scope.excludedBlockCodes=[];
$scope.block_codes = blockCodeData.block_codes;

$scope.successMessage = "";


$scope.showRoomType = function(max_early_checkins){
   return((typeof max_early_checkins !=="undefined") && max_early_checkins !== null) ? true:false;
};

var setUpList = function(){

   //remove the selected item from drop down
  var selectedIds = [];
  angular.forEach($scope.upsellData.room_types,function(item, index) {
    if((typeof item.max_early_checkins !=="undefined") && item.max_early_checkins !== null){
       selectedIds.push(item.id);
    }
  });
  angular.forEach(selectedIds,function(id, index1) {
  angular.forEach($scope.upsellData.room_type_list,function(room_type_list, index) {
        if(room_type_list.value === id){
           $scope.upsellData.room_type_list.splice(index,1);
        }
    });
  });

  angular.forEach($scope.block_codes,function(block, index) {
    angular.forEach($scope.upsellData.excluded_block_codes,function(excludedblock, index) {
      if(block.id === excludedblock){
        $scope.excludedBlockCodes.push(block);
        block.ticked = true;// for the multi-select implementation
      }
    });
   });

};

/**
 * Method to check if max_late_checkins of all elements are blank or not.
 * Configured room type will have valid max_late_checkouts value.
 */
var isRoomTypesSelected = function(){
  $scope.upsellData.isRoomTypesSelectedFlag = false;
  angular.forEach($scope.upsellData.room_types,function(item, index) {
    if((typeof item.max_early_checkins !=="undefined") && item.max_early_checkins !== null) {
      $scope.upsellData.isRoomTypesSelectedFlag = true;
    }
  });
};

$scope.clickExcludeRoomType = function(){
  //While addig a room type, making its max_late_checkins defaults to 0.
  angular.forEach($scope.upsellData.room_types,function(item, index) {
      if(parseInt(item.id) === parseInt($scope.upsellData.selected_room_type)){
         item.max_early_checkins = 0;
      }
  });
    //Removing the selected room type from dropdown of room type list.
  angular.forEach($scope.upsellData.room_type_list,function(item, index) {
    if(item.value === $scope.upsellData.selected_room_type){
       $scope.upsellData.room_type_list.splice(index,1);
    }
  });
  isRoomTypesSelected();
  $scope.upsellData.selected_room_type = "";
};

/*
 * Method to delete the room type.
 */
$scope.deleteRoomType = function(value,name){

  var data = { "value": value , "name": name };
  $scope.upsellData.room_type_list.push(data);

  angular.forEach($scope.upsellData.room_types,function(item, index) {
    if(parseInt(item.id) === parseInt(value)){
      item.max_early_checkins = null;
    }
  });
  $scope.upsellData.deleted_room_types.push(value);
  isRoomTypesSelected();
  $scope.upsellData.selected_room_type = "";
};
// to add to excluded block codes
$scope.clickExcludeBlockCode = function(){

  $scope.excludedBlockCodes = [];
  angular.forEach($scope.block_codes, function( value, key ) {
    if ( (value.ticked === true) && ( $scope.excludedBlockCodes.indexOf(value) === -1)) {
        $scope.excludedBlockCodes.push(value);
    }
  });
};

//remove exclude block code
$scope.deleteBlockCode = function(id){
  //remove from final array
  angular.forEach($scope.excludedBlockCodes,function(item, index) {
    if(item.id === id){
      $scope.excludedBlockCodes.splice(index,1);
    }
  });
  //untick from list
   angular.forEach($scope.block_codes,function(item, index) {
    if(item.id === id){
      item.ticked = false;
    }
  });

};
/**
* To fetch upsell details
*
*/
$scope.fetchUpsellDetails = function(){
    var fetchUpsellDetailsSuccessCallback = function(data) {
       $scope.upsellData = data;
       setUpList();
       $scope.upsellData.deleted_room_types = [];
       isRoomTypesSelected();
       $scope.setRateFlag();
       $scope.fetchAddons();
       $scope.setUpUpsellWindowData();
       $scope.setEarlyCheckinTimeForRates();
       $scope.startWatching();
   };
   $scope.invokeApi(adUpsellEarlyCheckinService.fetch, {},fetchUpsellDetailsSuccessCallback);
};

$scope.fetchAddons = function(){
    var fetchSuccessOfAddons = function(data) {
       $scope.addons = $scope.getAddonsWithNameValues(data.results);
       $scope.fetchRates();
   };
   $scope.invokeApi(ADRatesAddonsSrv.fetch, {"no_pagination": true}, fetchSuccessOfAddons);
};

$scope.fetchRates = function(){
    var fetchSuccessOfRates = function(data) {
       $scope.$emit('hideLoader');
       $scope.rates = $scope.getRatesWithNameValues(data.results);
   };
   $scope.invokeApi(ADRatesSrv.fetchRates, {}, fetchSuccessOfRates);
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
        $scope.setUpDefaultUpsellLevels();
         angular.forEach($scope.upsellData.early_checkin_levels,function(item, index) {
         upsellWindow = {};
         upsellWindow.hours = item.start_time === ""? "" : item.start_time.substring(0, 2);
         upsellWindow.minutes = item.start_time === ""? "" : item.start_time.substring(3, 5);
         upsellWindow.meridiem = item.start_time === ""? "AM" : item.start_time.substring(6);
         upsellWindow.addon_id = item.addon_id === null? "" : item.addon_id;
         upsellWindow.charge = item.charge;
         $scope.upsellWindows.push(upsellWindow);
  });
};

$scope.takenAddons = {
    0: '',
    1: '',
    2: ''
};

$scope.updateAddon = function(x, y){
    $scope.takenAddons[x] = y;
};

$scope.isAddonAvailable = function(index){
    if (parseInt($scope.takenAddons[0]) === $scope.addons[index].id){
             return false;
       } else if (parseInt($scope.takenAddons[1]) === $scope.addons[index].id){
             return false;
       } else if (parseInt($scope.takenAddons[2]) === $scope.addons[index].id){
             return false;
       } else {
        return true;
       }
};

$scope.isRateAvailable = function(index){
       for(var i = 0; i < $scope.upsellData.early_checkin_rates.length; i++){
         if($scope.upsellData.early_checkin_rates[i].id === $scope.rates[index].id) {
           return false;
         }
        }
       return true;
};

$scope.setUpDefaultUpsellLevels = function () {
         var upsellCountArray ;
         if($scope.upsellData.early_checkin_levels.length >= 3){
           return;
         }else if($scope.upsellData.early_checkin_levels.length === 0){
           upsellCountArray = [1, 2, 3];
         }else if($scope.upsellData.early_checkin_levels.length === 1){
           upsellCountArray = [1, 2];
         }else if($scope.upsellData.early_checkin_levels.length === 2){
           upsellCountArray = [1];
         }
         var defaultWindow;
          angular.forEach(upsellCountArray,function(item, index) {
          defaultWindow = {};
          defaultWindow.start_time = "";
          defaultWindow.addon_id = "";
          defaultWindow.charge = "";
          $scope.upsellData.early_checkin_levels.push(defaultWindow);
        });
};

$scope.setEarlyCheckinTimeForRates = function(){
       $scope.upsell_rate.hours = ($scope.upsellData.early_checkin_time === "" || $scope.upsellData.early_checkin_time === null)? "" : $scope.upsellData.early_checkin_time.substring(0, 2);
       $scope.upsell_rate.minutes = ($scope.upsellData.early_checkin_time === "" || $scope.upsellData.early_checkin_time === null)? "" : $scope.upsellData.early_checkin_time.substring(3, 5);
       $scope.upsell_rate.meridiem = ($scope.upsellData.early_checkin_time === "" || $scope.upsellData.early_checkin_time === null)? "AM" : $scope.upsellData.early_checkin_time.substring(6);

       $scope.upsell_end_time.hours = ($scope.upsellData.early_checkin_ends_at === "" || $scope.upsellData.early_checkin_ends_at === null)? "" : $scope.upsellData.early_checkin_ends_at.substring(0, 2);
       $scope.upsell_end_time.minutes = ($scope.upsellData.early_checkin_ends_at === "" || $scope.upsellData.early_checkin_ends_at === null)? "" : $scope.upsellData.early_checkin_ends_at.substring(3, 5);
       $scope.upsell_end_time.meridiem = ($scope.upsellData.early_checkin_ends_at === "" || $scope.upsellData.early_checkin_ends_at === null)? "AM" : $scope.upsellData.early_checkin_ends_at.substring(6);

};

$scope.setUpUpsellWindowDataToSave = function () {
        $scope.upsellData.early_checkin_levels = [];
        var upsellWindow;
         angular.forEach($scope.upsellWindows,function(item, index) {
             if(item.hours !== "" && item.hours !== null){
                 upsellWindow = {};
                 upsellWindow.start_time = item.hours + ":" + item.minutes + " " + item.meridiem;
                 upsellWindow.charge = item.charge;
                 upsellWindow.addon_id = item.addon_id;
                 $scope.upsellData.early_checkin_levels.push(upsellWindow);
             }
        });
};

$scope.validateUpsellWindowTime = function(){
  var time_window1 = new Date;
  var time_window2 = new Date;
  var time_window3 = new Date;
  var hrs1 = ($scope.upsellWindows[0].meridiem.localeCompare('PM') !== -1)? 12 + (parseInt($scope.upsellWindows[0].hours) % 12) : (parseInt($scope.upsellWindows[0].hours) === 12)? 0 : parseInt($scope.upsellWindows[0].hours);
  var hrs2 = ($scope.upsellWindows[1].meridiem.localeCompare('PM') !== -1)? 12 + (parseInt($scope.upsellWindows[1].hours) % 12) : (parseInt($scope.upsellWindows[1].hours) === 12)? 0 : parseInt($scope.upsellWindows[1].hours);
  var hrs3 = ($scope.upsellWindows[2].meridiem.localeCompare('PM') !== -1)? 12 + (parseInt($scope.upsellWindows[2].hours) % 12) : (parseInt($scope.upsellWindows[2].hours) === 12)? 0 : parseInt($scope.upsellWindows[2].hours);
  time_window1.setHours(hrs1);
  time_window2.setHours(hrs2);
  time_window3.setHours(hrs3);

  time_window1.setMinutes(parseInt($scope.upsellWindows[0].minutes));
  time_window2.setMinutes(parseInt($scope.upsellWindows[1].minutes));
  time_window3.setMinutes(parseInt($scope.upsellWindows[2].minutes));

  if(time_window1 >= time_window2){
          $scope.fetchedFailed(["The time for upsell window-1 should be less than time for upsell window-2"]);
          return false;
  }
  else if(time_window2 >= time_window3){

          $scope.fetchedFailed(["The time for upsell window-2 should be less than time for upsell window-3"]);
          return false;
  }
  else {
    return true;
  }
};

$scope.fetchUpsellDetails();
$scope.hours = ["01","02","03","04","05","06","07","08","09","10","11","12"];
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
    if(!$scope.validateUpsellWindowTime()){

        return;
    }

    $scope.setUpUpsellWindowDataToSave();
    $scope.upsellData.early_checkin_time = ($scope.upsell_rate.hours !== null && $scope.upsell_rate.hours !== "")?$scope.upsell_rate.hours + ":" + $scope.upsell_rate.minutes + " " + $scope.upsell_rate.meridiem : "";
   	$scope.upsellData.early_checkin_ends_at = ($scope.upsell_end_time.hours !== null && $scope.upsell_end_time.hours !== "")?$scope.upsell_end_time.hours + ":" + $scope.upsell_end_time.minutes + " " + $scope.upsell_end_time.meridiem : "";
    
    if ($scope.upsellData.zest_station_early_checkin_addon_id){
        $scope.upsellData.zest_station_early_checkin_addon_id = parseInt($scope.upsellData.zest_station_early_checkin_addon_id);
    }
    
    var upsellEarlyCheckinSaveSuccessCallback = function(data) {
      $scope.$emit('hideLoader');
      $scope.successMessage = 'Success';
      
        };
    // had to ovveride default error handler for custom actions.
   	var upsellEarlyCheckinSaveFailureCallback =  function(errorMessage) {
      $scope.$emit('hideLoader');
      $scope.fetchedFailed(errorMessage);
   	};

    var dataToSave = dclone($scope.upsellData, ['room_type_list']);
    dataToSave.excluded_block_codes = [];
    angular.forEach($scope.excludedBlockCodes,function(excludedBlockCode, index) {
      dataToSave.excluded_block_codes.push(excludedBlockCode.id);
    });
   	$scope.invokeApi(adUpsellEarlyCheckinService.update,dataToSave,upsellEarlyCheckinSaveSuccessCallback, upsellEarlyCheckinSaveFailureCallback);

};

$scope.clickAddRoomType = function(){
	//While addig a room type, making its max_late_checkouts defaults to 0.
  if($scope.getSelectedRateIndexForID($scope.upsell_rate.selected_rate_id) !== -1) {
    return;
  }
  var rate_item;
	angular.forEach($scope.rates,function(item, index) {
		if(parseInt(item.id) === parseInt($scope.upsell_rate.selected_rate_id)){
      rate_item = {};
      rate_item.id = item.id;
      rate_item.name = item.name;
			$scope.upsellData.early_checkin_rates.push(rate_item);
      }
    });
  $scope.setRateFlag();
};
/**
 * Method to check if max_late_checkouts of all elements are blank or not.
 * Configured room type will have valid max_late_checkouts value.
 */
$scope.setRateFlag = function(){
	$scope.isRateSelected = false;
	if($scope.upsellData.early_checkin_rates.length > 0){
    $scope.isRateSelected = true;
  }
};

$scope.getSelectedRateIndexForID = function(rateID){
  var rateIndex = -1;
  angular.forEach($scope.upsellData.early_checkin_rates,function(item, index) {
    if(item.id === rateID){
      rateIndex =  index;
    }
  });
  return rateIndex;
};
/*
 * Method to delete the room type.
 */
$scope.deleteRate = function(value,name){
	var indexForRate = $scope.getSelectedRateIndexForID(value);
  if(indexForRate !== -1) {
     $scope.upsellData.early_checkin_rates.splice(indexForRate, 1);
  }
   $scope.setRateFlag();
};

$scope.isChargeRequiredForWindow = function(windowIndex){
   if(windowIndex === 0){
      return $scope.upsellWindows[0].hours !== ""? 'yes' : 'no';
   }else if(windowIndex === 1){
      return $scope.upsellWindows[1].hours !== ""? 'yes' : 'no';
   }else if(windowIndex === 2){
      return $scope.upsellWindows[2].hours !== ""? 'yes' : 'no';
   }
};

/**
* To watch Upsell data
*
*/
$scope.startWatching = function(){
    $scope.$watch(function(){
      return ($scope.upsellWindows[0].hours === "" ||$scope.upsellWindows[0].hours === null )? "": $scope.upsellWindows[0].hours;
    }, function(newValue, oldValue){
        if($scope.upsellWindows[0].hours === "" || $scope.upsellWindows[0].hours === null){
            $scope.upsellWindows[0].charge = "";
            $scope.upsellWindows[0].minutes = "";
            $scope.upsellWindows[0].addon_id = "";
        }else if($scope.upsellWindows[0].minutes === "" || $scope.upsellWindows[0].minutes === null){
            $scope.upsellWindows[0].minutes = "00";
        }
   });

    $scope.$watch(function(){
      return ($scope.upsellWindows[1].hours === "" ||$scope.upsellWindows[1].hours === null )? "": $scope.upsellWindows[1].hours;
    }, function(newValue, oldValue){
        if($scope.upsellWindows[1].hours === "" || $scope.upsellWindows[1].hours === null){
            $scope.upsellWindows[1].charge = "";
            $scope.upsellWindows[1].minutes = "";
            $scope.upsellWindows[1].addon_id = "";
        }else if($scope.upsellWindows[1].minutes === "" || $scope.upsellWindows[1].minutes === null){
            $scope.upsellWindows[1].minutes = "00";
        }
   });

    $scope.$watch(function(){
      return ($scope.upsellWindows[2].hours === "" ||$scope.upsellWindows[2].hours === null )? "": $scope.upsellWindows[2].hours;
    }, function(newValue, oldValue){
        if($scope.upsellWindows[2].hours === "" || $scope.upsellWindows[2].hours === null){
            $scope.upsellWindows[2].charge = "";
            $scope.upsellWindows[2].minutes = "";
            $scope.upsellWindows[2].addon_id = "";
        }else if($scope.upsellWindows[2].minutes === "" || $scope.upsellWindows[2].minutes === null){
            $scope.upsellWindows[2].minutes = "00";
        }
   });

    $scope.$watch(function(){
      return ($scope.upsell_rate.hours === "" ||$scope.upsell_rate.hours === null )? "": $scope.upsell_rate.hours;
    }, function(newValue, oldValue){
        if($scope.upsell_rate.hours === "" || $scope.upsell_rate.hours === null){
            $scope.upsell_rate.minutes = "";
        }else if($scope.upsell_rate.minutes === "" || $scope.upsell_rate.minutes === null){
            $scope.upsell_rate.minutes = "00";
        }
   });

    $scope.$watch(function(){
      return ($scope.upsell_end_time.hours === "" ||$scope.upsell_end_time.hours === null )? "": $scope.upsell_end_time.hours;
    }, function(newValue, oldValue){
        if($scope.upsell_end_time.hours === "" || $scope.upsell_end_time.hours === null){
            $scope.upsell_end_time.minutes = "";
        }else if($scope.upsell_end_time.minutes === "" || $scope.upsell_end_time.minutes === null){
            $scope.upsell_end_time.minutes = "00";
        }
   });
};

}]);