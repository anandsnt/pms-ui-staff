/*
	mobile number options
*/

(function() {
	var mobileOptionsController = function($scope, $state, $rootScope) {
	
	 $scope.skip =  function() {
      $rootScope.userMobileSkipped = true;
      $state.go('preCheckinStatus');
    };

    $scope.changeNumber =  function() {
    	$state.go('mobileNumberAddition');
    };
};

var dependencies = [
'$scope', '$state', '$rootScope',
mobileOptionsController
];

sntGuestWeb.controller('mobileOptionsController', dependencies);
})();