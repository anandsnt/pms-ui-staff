sntGuestWeb.controller('ModalInstanceCtrl', ['$scope','$rootScope','$modalInstance','message', function($scope,$rootScope,$modalInstance,message) {

  $scope.message = replaceStringWithScopeVariable(message,"<hotelPhone>", $rootScope.hotelPhone);

  $scope.ok = function() {
    $modalInstance.close();
  };

  $scope.cancel = function() {
    $modalInstance.dismiss();
  };

}]);