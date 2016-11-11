/* global sntGuestWeb */
/* eslint no-undef: "error"*/
sntGuestWeb.controller('roomReadyAlertUsingTextController', ['$scope',
  '$state',
  '$rootScope',
  function($scope, $state, $rootScope) {
    // on skip, go to precheckin final screen
    $scope.skip = function() {
      $rootScope.userMobileSkipped = true;
      $state.go('preCheckinStatus');
    };
    // change mobile number
    $scope.changeNumber = function() {
      $state.go('mobileNumberAddition');
    };
    // check if mobile number is present or not
    $scope.roomReadyAction = function() {
      if ($rootScope.userMobile.length > 0) {
        $scope.mode = "EXISTING_NUMBER";
      } else {
        $state.go('mobileNumberAddition');
      }
    };
    $scope.mode = "TEXT_ALERT";
  }
]);