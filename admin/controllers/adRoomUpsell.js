admin.controller('ADRoomUpsellCtrl', ['$scope', '$rootScope', '$state', 'adRoomUpsellService', 'ADChargeCodesSrv',
  function ($scope, $rootScope, $state, adRoomUpsellService, ADChargeCodesSrv) {

    BaseCtrl.call(this, $scope);
    $scope.upsellData = {};

    $scope.errorMessage = '';
    $scope.successMessage = '';
    /**
     * To fetch upsell details
     *
     */
    $scope.fetchUpsellDetails = function () {
      var fetchRoomUpsellDetailsSuccessCallback = function (data) {
        $scope.$emit('hideLoader');
        $scope.upsellData = data;
        $scope.levelOne = $scope.upsellData.upsell_room_levels[0].room_types;
        $scope.levelTwo = $scope.upsellData.upsell_room_levels[1].room_types;
        $scope.levelThree = $scope.upsellData.upsell_room_levels[2].room_types;
        
        if (typeof $scope.upsellData.next_day_selected_charge_code_id === typeof 123){
            $scope.upsellData.selected_next_day_charge_code_id = $scope.upsellData.next_day_selected_charge_code_id;
        }
        
        if (typeof $scope.upsellData.next_day_room_types_list !== typeof []){
            $scope.upsellData.next_day_room_types_list = angular.copy($scope.upsellData.room_types_list);
        }
        if (typeof $scope.upsellData.next_day_room_types !== typeof []){
            $scope.upsellData.next_day_room_types = angular.copy($scope.upsellData.room_types);
            for (var i in $scope.upsellData.next_day_room_types){
                $scope.upsellData.next_day_room_types[i].max_los = '';
            }
            $scope.upsellData.isNextDayRoomTypesSelectedFlag = false;
        }
        $scope.upsellData.deleted_room_types = [];
        $scope.upsellData.next_day_deleted_room_types = [];
        
        isRoomTypesSelected();
        isNextDayRoomTypesSelected();
        
        $scope.currency_code = getCurrencySign($scope.upsellData.upsell_setup.currency_code);
        if (!$scope.upsellData.next_day_upsell_amounts || $scope.upsellData.next_day_upsell_amounts.length === 0){
            $scope.upsellData.next_day_upsell_amounts = angular.copy($scope.upsellData.upsell_amounts);
            $scope.upsellData.next_day_upsell_amounts[0].amount = '';
            $scope.upsellData.next_day_upsell_amounts[1].amount = '';
            $scope.upsellData.next_day_upsell_amounts[2].amount = '';
        }
        if (typeof $scope.upsellData.next_day_room_types_list !== typeof []){
            $scope.upsellData.next_day_room_types_list = [];
        }
        
        if (!$scope.upsellData.upsell_setup.is_next_day_upsell_on){
            $scope.upsellData.upsell_setup.is_next_day_upsell_on = 'false';
        }
        
      };
      $scope.invokeApi(adRoomUpsellService.fetch, {}, fetchRoomUpsellDetailsSuccessCallback);
    };

    $scope.fetchUpsellDetails();

    /**
     * To handle drop success event
     *
     */
    $scope.dropSuccessHandler = function ($event, index, array) {
      array.splice(index, 1);
    };

    /**
     * To handle on drop event
     *
     */
    $scope.onDrop = function ($event, $data, array) {
      array.push($data);
    };

    /**
     * To handle switch
     *
     */
    $scope.switchClicked = function () {
      $scope.upsellData.upsell_setup.is_upsell_on = ($scope.upsellData.upsell_setup.is_upsell_on === 'true') ? 'false' : 'true';
    };
    $scope.nextDaySwitchClicked = function () {
        $scope.upsellData.upsell_setup.is_next_day_upsell_on = ($scope.upsellData.upsell_setup.is_next_day_upsell_on === 'true') ? 'false' : 'true';
    };

    /**
     * To handle checkbox action
     *
     */
    $scope.oneNightcheckBoxClicked = function () {
      $scope.upsellData.upsell_setup.is_one_night_only = ($scope.upsellData.upsell_setup.is_one_night_only === 'true') ? 'false' : 'true';
    };

    /**
     * To handle checkbox action
     *
     */
    $scope.forceUpsellcheckBoxClicked = function () {
      $scope.upsellData.upsell_setup.is_force_upsell = ($scope.upsellData.upsell_setup.is_force_upsell === 'true') ? 'false' : 'true';
    };

    /**
     * To handle addRoomType action
     *
     */
    $scope.clickAddRoomType = function (nextday) {
        var n = 'room_types', s = 'selected_room_type';
        if (nextday){
            n = 'next_day_room_types', s = 'next_day_selected_room_type';
        }
        //While addig a room type, making its max_los defaults to 0.
        angular.forEach($scope.upsellData[n], function (item, index) {
            if (item.id === parseInt($scope.upsellData[s])) {
              // CICO-32613: Do not reset existing value.
              if (!item.max_los) {
                item.max_los = 0;//this makes the added room type visible in the ui
              }
            }
        });
        if (nextday){
            isNextDayRoomTypesSelected();
        } else {
            isRoomTypesSelected();
        }
        $scope.upsellData[s] = "";
    };

    /**
     * Method to check if max_los of all elements are blank or not.
     * Configured room type will have valid max_los value.
     */
    var isRoomTypesSelected = function () {
      $scope.upsellData.isRoomTypesSelectedFlag = false;
      angular.forEach($scope.upsellData.room_types, function (item, index) {
        if (item.max_los !== '') {
          $scope.upsellData.isRoomTypesSelectedFlag = true;
        }
      });
    };
    var isNextDayRoomTypesSelected = function () {
      $scope.upsellData.isNextDayRoomTypesSelectedFlag = false;
      angular.forEach($scope.upsellData.next_day_room_types, function (item, index) {
        if (item.max_los !== '') {
          $scope.upsellData.isNextDayRoomTypesSelectedFlag = true;
        }
      });
    };

    /*
     * Method to delete the room type.
     */
    
    $scope.deleteRoomType = function (value, name, nextday) {
        //var data = {"value": value, "name": name};
        var losSet = function(n){
            var t = 'room_types';
            if (n){t = 'next_day_room_types';}
            angular.forEach($scope.upsellData[t], function (item, index) {
              if (item.id === value) {
                item.max_los = '';
              }
            });
        };
        if (nextday){
            //$scope.upsellData['next_day_room_types_list'].push(data);
            losSet(true);
            $scope.upsellData['next_day_deleted_room_types'].push(value);
            isNextDayRoomTypesSelected();
            $scope.upsellData['next_day_selected_room_type'] = "";
        } else {
           // $scope.upsellData['room_types_list'].push(data);
            losSet(false);
            $scope.upsellData['deleted_room_types'].push(value);
            isRoomTypesSelected();
            $scope.upsellData['selected_room_type'] = "";
        }
    };

    /**
     * To handle save button action
     *
     */
    $scope.saveClick = function () {
      var data = {};
      
      var upsell_setup = {};
      upsell_setup.is_force_upsell = $scope.upsellData.upsell_setup.is_force_upsell;
      upsell_setup.is_one_night_only = $scope.upsellData.upsell_setup.is_one_night_only;
      upsell_setup.is_upsell_on = $scope.upsellData.upsell_setup.is_upsell_on;
      upsell_setup.is_next_day_upsell_on = $scope.upsellData.upsell_setup.is_next_day_upsell_on;
      upsell_setup.total_upsell_target_amount = $scope.upsellData.upsell_setup.total_upsell_target_amount;
      upsell_setup.total_upsell_target_rooms = $scope.upsellData.upsell_setup.total_upsell_target_rooms;
      
      data.upsell_setup = upsell_setup;
      
      data.upsell_amounts = $scope.upsellData.upsell_amounts;
      data.next_day_upsell_amounts = $scope.upsellData.next_day_upsell_amounts;
      data.charge_code = $scope.upsellData.selected_charge_code_id;
      data.next_day_charge_code = $scope.upsellData.selected_next_day_charge_code_id;
      data.upsell_room_levels = $scope.upsellData.upsell_room_levels;
      data.room_types = [];
      data.next_day_room_types = [];
      data.deleted_room_types = [];
      data.deleted_room_types = $scope.upsellData.deleted_room_types;
      
      data.next_day_deleted_room_types = [];
      data.next_day_deleted_room_types = $scope.upsellData.next_day_deleted_room_types;
      
      
      
      //Creating room type array with available max_late_checkouts data
      angular.forEach($scope.upsellData.room_types, function (item, index) {
        if (item.max_los !== '') {
          var obj = {"id": item.id.toString(), "max_los": item.max_los.toString(), "allow_rover_overwrite": item.allow_rover_overwrite.toString()};
          data.room_types.push(obj);
        }
      });
      angular.forEach($scope.upsellData.next_day_room_types, function (item, index) {
        if (item.max_los !== '') {
          var obj = {"id": item.id.toString(), "max_los": item.max_los.toString(), "allow_rover_overwrite": item.allow_rover_overwrite.toString()};
          data.next_day_room_types.push(obj);
        }
      });
      
      
      
      

        var updateRoomUpsellSuccessCallback = function (data) {
              $scope.$emit('hideLoader');
              $scope.successMessage = "Success";
        };
        var updateRoomUpsellFailCallback = function (data) {
              $scope.$emit('hideLoader');
              var err = ['Unable to Save'];
              $scope.errorMessage = err;
        };
        $scope.invokeApi(adRoomUpsellService.update, data, updateRoomUpsellSuccessCallback,updateRoomUpsellFailCallback);
    };

  }]);