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
  }
]);