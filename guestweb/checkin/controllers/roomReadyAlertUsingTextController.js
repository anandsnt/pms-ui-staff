/*
  email entry Ctrl where the email is added
*/

(function() {
  var roomReadyAlertUsingTextController = function($scope, $state, $rootScope) {

    $scope.skip = function() {
      $rootScope.userMobileSkipped = true;
      $state.go('preCheckinStatus');
    };
    $scope.changeNumber = function() {
      $state.go('mobileNumberAddition');
    };
  };

  var dependencies = [
    '$scope', '$state', '$rootScope',
    roomReadyAlertUsingTextController
  ];

  sntGuestWeb.controller('roomReadyAlertUsingTextController', dependencies);
})();