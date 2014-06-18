(function() {
	var ccVerificationViewController = function($scope,$rootScope,$state,$stateParams) {

	
  $scope.pageValid = false;

  if($rootScope.isCheckedin){
    $state.go('checkinSuccess');
  }
  else if($rootScope.isCheckin){
    $state.go('checkinConfirmation');
  }
  else if(!$rootScope.isRoomVerified){
    $state.go('checkoutRoomVerification');
  }
  else{
    $scope.pageValid = true;
  } 		

	if($scope.pageValid){
		$scope.checkoutmessage = $stateParams.message;
		$scope.fee = $stateParams.fee;
		$scope.currency =  $stateParams.currency;


        $scope.months = [{
            'name': 'January',
            'value': '0'
          }, {
            'name': 'February',
            'value': '1'
          }, {
            'name': 'March',
            'value': '2'
          }, {
            'name': 'April',
            'value': '3'
          }, {
            'name': 'May',
            'value': '4'
          }, {
            'name': 'June',
            'value': '5'
          }, {
            'name': 'July',
            'value': '6'
          }, {
            'name': 'August',
            'value': '7'
          }, {
            'name': 'September',
            'value': '8'
          }, {
            'name': 'October',
            'value': '9'
          }, {
            'name': 'November',
            'value': '10'
          }, {
            'name': 'December',
            'value': '11'
          }];

          $scope.years = [];
          var startYear = new Date().getFullYear();
          var endYear   = parseInt(startYear) +100;
          for (year = parseInt(startYear); year <= parseInt(endYear); year++) {
            $scope.years.push(year);
          };

          $scope.goToNextStep = function(){

            if($stateParams.isFromCheckoutNow === "true"){
              $rootScope.ccPaymentSuccessForCheckoutNow = true;
              $state.go('checkOutStatus');
            }else{
               $rootScope.ccPaymentSuccessForCheckoutLater = true;
               $state.go('checkOutLaterSuccess',{id:$scope.fee});
            }

          }
	
}
}

var dependencies = [
'$scope','$rootScope','$state','$stateParams',
ccVerificationViewController
];

snt.controller('ccVerificationViewController', dependencies);
})();