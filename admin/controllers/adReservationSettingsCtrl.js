admin.controller('ADReservationSettingsCtrl', ['$scope', '$rootScope', '$state', 'ADReservationSettingsSrv', 'reservationSettingsData',
  function($scope, $rootScope, $state, ADReservationSettingsSrv, reservationSettingsData) {

    BaseCtrl.call(this, $scope);
    $scope.errorMessage = "";

    var init = function(){
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
      "value": "$",
      "name": "$"
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
      "value": "$",
      "name": "$"
    }];
    $scope.eod_types = [{
      "value": "perStay",
      "name": "Per Stay"
    }, {
      "value": "perNight",
      "name": "Per Night"
    }];
    
    $scope.incidentalObj = {
      'values' : [{
        "value" : "$",
        "name"  : "$"
      }],
      'types' : [{
        "value" : "perStay",
        "name"  : "Per Stay"
        }, {
        "value": "perNight",
        "name": "Per Night"
      }]
    };
   
   _.each(reservationSettingsData.prepaid_commission_charge_codes, function(chargeCode, index){     
      chargeCode.name = chargeCode.code +" "+chargeCode.name;
    });

   _.each(reservationSettingsData.tax_transaction_codes, function(chargeCode, index){     
      chargeCode.name = chargeCode.code +" "+chargeCode.name;
    });

    $scope.reservationSettingsData = reservationSettingsData;

  }


    /**
     *  save reservation settings changes
     */

    $scope.saveChanges = function() {

      var saveChangesSuccessCallback = function(data) {
        $rootScope.isHourlyRatesEnabled = !!$scope.reservationSettingsData.is_hourly_rate_on;
        $scope.$emit("refreshLeftMenu");
        $scope.$emit('hideLoader');
        $scope.goBackToPreviousState();
      };
      var saveChangesFailureCallback = function(data) {
        $scope.errorMessage = data;
        $scope.$emit('hideLoader');
      };
      var data = dclone($scope.reservationSettingsData,['prepaid_commission_charge_codes','tax_transaction_codes']);

      $scope.invokeApi(ADReservationSettingsSrv.saveChanges, data, saveChangesSuccessCallback, saveChangesFailureCallback);

    };

    init();
  }
]);