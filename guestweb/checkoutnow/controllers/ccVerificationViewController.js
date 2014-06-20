(function() {
	var ccVerificationViewController = function($scope,$rootScope,$state,$stateParams,$modal) {

	
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


    //Set merchant ID for MLI integration
    //HostedForm.setMerchant(data.merchantId);

    /* MLI integration starts here */

  HostedForm.setMerchant("TESTSTAYNTOUCH01"); //to be retrieved from server
  
  
    $scope.savePaymentDetails = function(){
      
      var MLISessionId = "";

      $scope.fetchMLISessionId = function(){

       var sessionDetails = {};
       sessionDetails.cardNumber = '6700649826438453';
       sessionDetails.cardSecurityCode = '123';
       sessionDetails.cardExpiryMonth = '07';
       sessionDetails.cardExpiryYear = '15';
      
       // var sessionDetails = {};
       // sessionDetails.cardNumber = $scope.saveData.card_number;
       // sessionDetails.cardSecurityCode = $scope.saveData.ccv;
       // sessionDetails.cardExpiryMonth = $scope.saveData.card_expiry_month;
       // sessionDetails.cardExpiryYear = $scope.saveData.card_expiry_year;

       var callback = function(response){
          if(response.status ==="ok"){    
          console.log(response);      
          MLISessionId = response.session;
          // call other WS
        }
        else{
         $scope.netWorkError = false;
        }
        
       }
            alert("")
       HostedForm.updateSession(sessionDetails, callback);

      
    }
    $scope.fetchMLISessionId();

    }

    $scope.savePaymentDetails();

     /* MLI integration starts here */



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

		$scope.checkoutmessage = $stateParams.message;
		$scope.fee = $stateParams.fee;
		
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

          $scope.showCcvPopup = function(){
            $modal.open($scope.ccvOpts); // error modal popup
          }

          $scope.goToNextStep = function(){



  if( $scope.cardNumber.length === 0 || 
      $scope.ccv.length === 0 || 
      $scope.monthSelected === null ||
      $scope.yearSelected === null){
          $modal.open($scope.errorOpts); // details modal popup
      }
          else{
             if($scope.cardNumber.toString() ==="1"){
              if($stateParams.isFromCheckoutNow === "true"){
                $rootScope.ccPaymentSuccessForCheckoutNow = true;
                $state.go('checkOutStatus');
              }else{
                 $rootScope.ccPaymentSuccessForCheckoutLater = true;
                 $state.go('checkOutLaterSuccess',{id:$scope.fee});
              }
            }
            else{
              $modal.open($scope.cardErrorOpts); // card error modal popup
            }


          }     
          }
	
}
}

var dependencies = [
'$scope','$rootScope','$state','$stateParams','$modal',
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