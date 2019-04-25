admin.controller('ADReservationSettingsCtrl', ['$scope', '$rootScope', '$state', 'ADReservationSettingsSrv', 'reservationSettingsData',
  function($scope, $rootScope, $state, ADReservationSettingsSrv, reservationSettingsData) {

    BaseCtrl.call(this, $scope);
    $scope.errorMessage = "";

    var init = function() {
    $scope.defaultRateDisplays = [{
      "value": 0,
      "name": "Recommended"
    }, {
      "value": 1,
      "name": "By Room Type"
    }, {
      "value": 2,
      "name": "By Rate"
    }];
    $scope.defaultSignDisplays = [{
      "value": "+",
      "name": "+"
    }, {
      "value": "-",
      "name": "-"
    }];
     $scope.checkin_values = [{
      "value": "%",
      "name": "%"
    }, {
      "value": "amount",
      "name": $rootScope.currencySymbol
    }];
    $scope.checkin_types = [{
      "value": "perStay",
      "name": "Per Stay"
    }, {
      "value": "perNight",
      "name": "Per Night"
    }];
    $scope.eod_values = [{
      "value": "%",
      "name": "%"
    }, {
      "value": "amount",
      "name": $rootScope.currencySymbol
    }];
    $scope.eod_types = [{
      "value": "perStay",
      "name": "Per Stay"
    }, {
      "value": "perNight",
      "name": "Per Night"
    }];

    $scope.incidentalObj = {
      'values': [{
        "value": "amount",
        "name": $rootScope.currencySymbol
      }],
      'types': [{
        "value": "perStay",
        "name": "Per Stay"
        }, {
        "value": "perNight",
        "name": "Per Night"
      }]
    };

   _.each(reservationSettingsData.prepaid_commission_charge_codes, function(chargeCode, index) {
      chargeCode.name = chargeCode.code + " " + chargeCode.name;
    });

   _.each(reservationSettingsData.tax_transaction_codes, function(chargeCode, index) {
      chargeCode.name = chargeCode.code + " " + chargeCode.name;
    });

    $scope.reservationSettingsData = reservationSettingsData;

  };


    /**
     *  save reservation settings changes
     */

    $scope.saveChanges = function() {

      var saveChangesSuccessCallback = function(data) {
        $rootScope.isHourlyRatesEnabled = !!$scope.reservationSettingsData.is_hourly_rate_on;
        $rootScope.dayUseEnabled = $scope.reservationSettingsData.day_use_enabled;
        $rootScope.hourlyRatesForDayUseEnabled = $scope.reservationSettingsData.hourly_rates_for_day_use_enabled;
        $rootScope.isSuiteRoomsAvailable = $scope.reservationSettingsData.suite_enabled;
        $scope.$emit("refreshLeftMenu");
        $scope.$emit('hideLoader');
        $scope.goBackToPreviousState();
      };
      var saveChangesFailureCallback = function(data) {
        $scope.errorMessage = data;
        $scope.$emit('hideLoader');
      };
      var data = dclone($scope.reservationSettingsData, ['prepaid_commission_charge_codes', 'tax_transaction_codes']);

      if (!data.hourly_rates_for_day_use_enabled) {
        data.hourly_availability_calculation = '';
      }
      else if (data.hourly_availability_calculation === '') {
        data.hourly_availability_calculation = 'FULL';
      }

      $scope.invokeApi(ADReservationSettingsSrv.saveChanges, data, saveChangesSuccessCallback, saveChangesFailureCallback);

    };

    $scope.toggleDayUse = function() {
        /* CICO-64699 */
        $scope.reservationSettingsData.day_use_enabled = !$scope.reservationSettingsData.day_use_enabled;
        $scope.reservationSettingsData.hourly_rates_for_day_use_enabled = $scope.reservationSettingsData.day_use_enabled;
        if ($scope.reservationSettingsData.hourly_rates_for_day_use_enabled) {
            $scope.reservationSettingsData.hourly_availability_calculation = 'FULL';
        }
    };

    $scope.toggleHourlyRatesForDayUse = function() {
        if (!$scope.reservationSettingsData.day_use_enabled) {
            $scope.reservationSettingsData.hourly_rates_for_day_use_enabled = false;
        }
         else {
            $scope.reservationSettingsData.hourly_rates_for_day_use_enabled = !$scope.reservationSettingsData.hourly_rates_for_day_use_enabled;
        }
        if (!$scope.reservationSettingsData.hourly_rates_for_day_use_enabled) {
            $scope.reservationSettingsData.hourly_availability_calculation = 'FULL';
        }
    };
    
    $scope.toggleHourlyAvailability = function(value) {
        $scope.reservationSettingsData.hourly_availability_calculation = value;
    };

    /*
     * Suite rooms toggle button actions
     */
    $scope.suiteRoomsSwitchClicked = function() {
      var canSuiteDisableSuccessCallback = function() {
        $scope.$emit('hideLoader');
        $scope.reservationSettingsData.suite_enabled = !$scope.reservationSettingsData.suite_enabled;
      };
      var canSuiteDisableFailureCallback = function(data) {
        $scope.errorMessage = data;
        $scope.$emit('hideLoader');
      };

      if ($scope.reservationSettingsData.suite_enabled) {
        $scope.invokeApi(ADReservationSettingsSrv.canDisableSuite, {}, canSuiteDisableSuccessCallback, canSuiteDisableFailureCallback);

      } else {
        $scope.reservationSettingsData.suite_enabled = !$scope.reservationSettingsData.suite_enabled;
      }

    };
    init();
  }
]);