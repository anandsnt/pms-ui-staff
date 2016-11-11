/* global sntGuestWeb */
/* eslint no-undef: "error"*/
sntGuestWeb.controller('roomReadyAlertUsingTextController', ['$scope',
  '$state',
  '$rootScope',
  function($scope, $state, $rootScope) {
    $scope.skip = function() {
      $rootScope.userMobileSkipped = true;
      $state.go('preCheckinStatus');
    };
    $scope.changeNumber = function() {
      $state.go('mobileNumberAddition');
    };
    $scope.roomReadyAction = function() {
      if ($rootScope.userMobile.length > 0) {
        $scope.mode = "EXISTING_NUMBER";
      } else {
        $state.go('mobileNumberAddition');
      }
    };
    var init = function() {
      $scope.mode = "TEXT_ALERT";
    }();
  }
]);