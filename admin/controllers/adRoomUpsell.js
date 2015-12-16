admin.controller('ADRoomUpsellCtrl', ['$scope', '$rootScope', '$state', 'adRoomUpsellService', 'ADChargeCodesSrv',
  function ($scope, $rootScope, $state, adRoomUpsellService, ADChargeCodesSrv) {

    BaseCtrl.call(this, $scope);
    $scope.upsellData = {};

    var setUpList = function () {
      //remove the selected item from drop down
      var selectedIds = [];
      angular.forEach($scope.upsellData.room_types, function (item, index) {
        if (item.max_los !== '') {
          selectedIds.push(item.id);
        }
      });
      angular.forEach(selectedIds, function (id, index1) {
        angular.forEach($scope.upsellData.room_types_list, function (room_types_list, index) {
          if (room_types_list.value === id) {
            $scope.upsellData.room_types_list.splice(index, 1);
          }
        });
        angular.forEach($scope.upsellData.next_day_room_types_list, function (room_types_list, index) {
          if (room_types_list.value === id) {
            $scope.upsellData.next_day_room_types_list.splice(index, 1);
          }
        });
      });
    };

    /**
     * To fetch upsell details
     *
     */
    $scope.fetchUpsellDetails = function () {
      var fetchRoomUpsellDetailsSuccessCallback = function (data) {
        $scope.$emit('hideLoader');
        console.info('upsell data: ',data)
        $scope.upsellData = data;
        $scope.levelOne = $scope.upsellData.upsell_room_levels[0].room_types;
        $scope.levelTwo = $scope.upsellData.upsell_room_levels[1].room_types;
        $scope.levelThree = $scope.upsellData.upsell_room_levels[2].room_types;
        setUpList();
        $scope.upsellData.deleted_room_types = [];
        $scope.upsellData.next_day_deleted_room_types = [];
        isRoomTypesSelected();
        $scope.currency_code = getCurrencySign($scope.upsellData.upsell_setup.currency_code);
        
        if (!$scope.upsellData.next_day_upsell_amounts){
            $scope.upsellData.next_day_upsell_amounts = angular.copy($scope.upsellData.upsell_amounts);
        }
        if (!$scope.upsellData.next_day_room_types_list){
            $scope.upsellData.next_day_room_types_list = [];
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
        if (!$scope.upsellData.next_day_upsell_setup){
            $scope.upsellData.next_day_upsell_setup = {};
        }
        $scope.upsellData.next_day_upsell_setup.is_upsell_on = ($scope.upsellData.next_day_upsell_setup.is_upsell_on === 'true') ? 'false' : 'true';
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
    $scope.clickAddRoomType = function () {
      //While addig a room type, making its max_los defaults to 0.
      angular.forEach($scope.upsellData.room_types, function (item, index) {
        if (item.id === parseInt($scope.upsellData.selected_room_type)) {
          item.max_los = 0;
        }
      });
      //Removing the selected room type from dropdown of room type list.
      angular.forEach($scope.upsellData.room_types_list, function (item, index) {
        if (item.value === $scope.upsellData.selected_room_type) {
          $scope.upsellData.room_types_list.splice(index, 1);
        }
      });
      isRoomTypesSelected();
      $scope.upsellData.selected_room_type = "";
    };
    
    $scope.clickNextDayAddRoomType = function () {
      //While addig a room type, making its max_los defaults to 0.
      angular.forEach($scope.upsellData.next_day_room_types, function (item, index) {
        if (item.id === parseInt($scope.upsellData.next_day_selected_room_type)) {
          item.max_los = 0;
        }
      });
      //Removing the selected room type from dropdown of room type list.
      angular.forEach($scope.upsellData.next_day_room_types_list, function (item, index) {
        if (item.value === $scope.upsellData.next_day_selected_room_type) {
          $scope.upsellData.next_day_room_types_list.splice(index, 1);
        }
      });
      isRoomTypesSelected();
      $scope.upsellData.next_day_selected_room_type = "";
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

    /*
     * Method to delete the room type.
     */
    $scope.deleteRoomType = function (value, name) {
      var data = {"value": value, "name": name};
      $scope.upsellData.room_types_list.push(data);
      angular.forEach($scope.upsellData.room_types, function (item, index) {
        if (item.id === value) {
          item.max_los = '';
        }
      });
      $scope.upsellData.deleted_room_types.push(value);
      isRoomTypesSelected();
      $scope.upsellData.selected_room_type = "";
    };
    $scope.deleteNextDayRoomType = function (value, name) {
      var data = {"value": value, "name": name};
      $scope.upsellData.next_day_room_types_list.push(data);
      angular.forEach($scope.upsellData.room_types, function (item, index) {
        if (item.id === value) {
          item.max_los = '';
        }
      });
      $scope.upsellData.next_day_deleted_room_types.push(value);
      isRoomTypesSelected();
      $scope.upsellData.next_day_selected_room_type = "";
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
      upsell_setup.is_next_day_upsell_on = $scope.upsellData.next_day_upsell_setup.is_upsell_on;
      upsell_setup.total_upsell_target_amount = $scope.upsellData.upsell_setup.total_upsell_target_amount;
      upsell_setup.total_upsell_target_rooms = $scope.upsellData.upsell_setup.total_upsell_target_rooms;
      
      var next_day_upsell_setup = {};
      
      data.upsell_setup = upsell_setup;
      data.next_day_upsell_setup = next_day_upsell_setup;
      
      data.upsell_amounts = $scope.upsellData.upsell_amounts;
      data.next_day_upsell_amounts = $scope.upsellData.next_day_upsell_amounts;
      
      data.charge_code = $scope.upsellData.selected_charge_code_id;
      data.upsell_room_levels = $scope.upsellData.upsell_room_levels;
      data.room_types = [];
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

      var updateRoomUpsellSuccessCallback = function (data) {
        $scope.$emit('hideLoader');
      };
      $scope.invokeApi(adRoomUpsellService.update, data, updateRoomUpsellSuccessCallback);
    };

  }]);