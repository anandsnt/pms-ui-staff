(function() {
	var ccVerificationViewController = function($scope,$rootScope,$state,$stateParams,$modal,ccVerificationService) {

	
  $scope.pageValid = false;
  $scope.cardNumber = "";
  $scope.ccv = "";
  $scope.monthSelected = "";
  $scope.yearSelected ="";

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
    var MLISessionId = "";
    
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
    /* MLI integration starts here */

    $scope.netWorkError = false;

    //set merchant id

    HostedForm.setMerchant($rootScope.mliMerchatId);


    //setup options for error popup

    $scope.cardErrorOpts = {
      backdrop: true,
      backdropClick: true,
      templateUrl: '/assets/checkoutnow/partials/ccVerificationErrorModal.html',
      controller: ccVerificationModalCtrl,
      resolve: {
        errorMessage: function(){
          return "There is a problem with your credit card.";
        }
      }
    };

    $scope.errorOpts = {
      backdrop: true,
      backdropClick: true,
      templateUrl: '/assets/checkoutnow/partials/ccVerificationErrorModal.html',
      controller: ccVerificationModalCtrl,
      resolve: {
        errorMessage:function(){
          return "All fields are required";
        }
      }
    };

    

    $scope.ccvOpts = {
      backdrop: true,
      backdropClick: true,
      templateUrl: '/assets/checkoutnow/partials/ccVerificationNumberModal.html',
      controller: ccVerificationModalCtrl
    };

		

    $scope.showCcvPopup = function(){
      $modal.open($scope.ccvOpts); // error modal popup
    }

    $scope.goToNextStep = function(){
          if( ($scope.cardNumber.length === 0) || 
          ($scope.ccv.length === 0) || 
          ($scope.monthSelected === null) ||
          ($scope.yearSelected === null)){
              $modal.open($scope.errorOpts); // details modal popup
          }
          else{
              $scope.isFetching = true;
              var data = {'reservation_id':$rootScope.reservationID,'mli_SessionId':MLISessionId};
              alert("fef");
              console.log(data);
              ccVerificationService.verifyCC(data).then(function(response) {
              $scope.isFetching = false;
              if(response.status ==="success"){
                  if($stateParams.isFromCheckoutNow === "true"){
                    $rootScope.ccPaymentSuccessForCheckoutNow = true;
                    $state.go('checkOutStatus');
                  }else{
                     $rootScope.ccPaymentSuccessForCheckoutLater = true;
                     $state.go('checkOutLaterSuccess',{id:$scope.fee});
                  }
              }
              else{
               $modal.open($scope.cardErrorOpts);
              };        
          
            },function(){
              $scope.netWorkError = true;
              $scope.isFetching = false;
            });
          }
    }     

    $scope.savePaymentDetails = function(){
      
      

      $scope.fetchMLISessionId = function(){

       var sessionDetails = {};
       sessionDetails.cardNumber = '6700649826438453';
       sessionDetails.cardSecurityCode = '123';
       sessionDetails.cardExpiryMonth = '07';
       sessionDetails.cardExpiryYear = '15';
      
       // var sessionDetails = {};
       // sessionDetails.cardNumber = $scope.cardNumber;
       // sessionDetails.cardSecurityCode = $scope.ccv;
       // sessionDetails.cardExpiryMonth = $scope.monthSelected;
       // sessionDetails.cardExpiryYear = $scope.yearSelected;

       $scope.callback = function(response){
        $scope.isFetching = false;
  
          if(response.status ==="ok"){     
            MLISessionId = response.session;
            $scope.goToNextStep();
            console.log(response);
        }
        else{
         $scope.netWorkError = false;
        }
        
       }
       //$scope.isFetching = true;
       HostedForm.updateSession(sessionDetails, $scope.callback);

      
    }
    $scope.fetchMLISessionId();

    }

     /* MLI integration starts here */

}
}



var dependencies = [
'$scope','$rootScope','$state','$stateParams','$modal','ccVerificationService',
ccVerificationViewController
];

snt.controller('ccVerificationViewController', dependencies);
})();

// controller for the modal

  var ccVerificationModalCtrl = function ($scope, $modalInstance,$state,errorMessage) {
    
    $scope.errorMessage = errorMessage;
    $scope.closeDialog = function () {
      $modalInstance.dismiss('cancel');
    };
    $scope.cancelTransaction = function(){
      $scope.closeDialog();
      $state.go('checkOutOptions');
    };
  };