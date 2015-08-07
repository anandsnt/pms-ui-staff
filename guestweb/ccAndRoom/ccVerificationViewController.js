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
            'value': '01'
          }, {
            'name': 'February',
            'value': '02'
          }, {
            'name': 'March',
            'value': '03'
          }, {
            'name': 'April',
            'value': '04'
          }, {
            'name': 'May',
            'value': '05'
          }, {
            'name': 'June',
            'value': '06'
          }, {
            'name': 'July',
            'value': '07'
          }, {
            'name': 'August',
            'value': '08'
          }, {
            'name': 'September',
            'value': '09'
          }, {
            'name': 'October',
            'value': '10'
          }, {
            'name': 'November',
            'value': '11'
          }, {
            'name': 'December',
            'value': '12'
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
      controller: ccVerificationModalCtrl,
      resolve: {
        errorMessage:function(){
          return "";
        }
      }
    };



    $scope.showCcvPopup = function(){
      $modal.open($scope.ccvOpts); // error modal popup
    };

    $scope.goToNextStep = function(){

        //$scope.isFetching = true;
        var cardExpiryDate = $scope.yearSelected+"-"+$scope.monthSelected+"-"+"01";
        var data = {'reservation_id':$rootScope.reservationID,'token':MLISessionId,'card_expiry':cardExpiryDate,'payment_type':"CC"};
        ccVerificationService.verifyCC(data).then(function(response) {
        $scope.isFetching = false;
        if(response.status ==="success"){
            $rootScope.isCCOnFile = true;
            $rootScope.isCcAttachedFromGuestWeb = true;
            if($stateParams.isFromCheckoutNow === "true"){
              $rootScope.ccPaymentSuccessForCheckoutNow = true;
              $state.go('checkOutStatus');
            }else{
               $rootScope.ccPaymentSuccessForCheckoutLater = true;
               $state.go('checkOutLaterSuccess',{id:$scope.fee});
            }
        }
        else{
         $scope.netWorkError = true;
        };

      },function(){
        $scope.netWorkError = true;
        $scope.isFetching = false;
      });

    };

    $scope.savePaymentDetails = function(){

      $scope.fetchMLISessionId = function(){

       var sessionDetails = {};

       $scope.callback = function(response){
         // $scope.isFetching = false;
          $scope.$apply();
          if(response.status ==="ok"){
              MLISessionId = response.session;
              $scope.goToNextStep();
          }
          else{
            $modal.open($scope.cardErrorOpts);
            $scope.isFetching = false;
          }

       };

      if( ($scope.cardNumber.length === 0) ||
          ($scope.ccv.length === 0) ||
          (!$scope.monthSelected) ||
          (!$scope.yearSelected)){
              $modal.open($scope.errorOpts); // details modal popup
              if($scope.ccv.length===0){
                $scope.isCVVEmpty = true;
              }
              else{
                $scope.isCVVEmpty = false;
              }
         }
         else{

             $scope.isFetching = true;
             $scope.isCVVEmpty = false;
             sessionDetails.cardNumber = $scope.cardNumber;
             sessionDetails.cardSecurityCode = $scope.ccv;
             sessionDetails.cardExpiryMonth = $scope.monthSelected;
             sessionDetails.cardExpiryYear = $scope.yearSelected.toString();
             try {
                HostedForm.updateSession(sessionDetails, $scope.callback);
             }
             catch(err) {
                $scope.netWorkError = true;
             };

         }



    };
    $scope.fetchMLISessionId();

    };

     /* MLI integration ends here */

}
};



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