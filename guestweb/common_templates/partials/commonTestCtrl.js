/*

//= require ../guestweb/common_templates/partials/commonTestCtrl.js
//= require_tree ../guestweb/checkoutlater/services
//= require_tree ../guestweb/checkoutnow/services
//= require_tree ../guestweb/checkin/services
//= require_tree ../guestweb/preCheckin/services
*/

(function() {
	var ccVerificationViewController = function($scope,$rootScope,$state,$stateParams,$modal,ccVerificationService) {


  $scope.pageValid = true;
  $scope.cardNumber = "";
  $scope.ccv = "";
  $scope.monthSelected = "";
  $scope.yearSelected ="";



    $scope.checkoutmessage = $stateParams.message;
    $scope.isFromCheckoutNow =  ($stateParams.isFromCheckoutNow  ==="true") ? true :false;
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
             sessionDetails.cardNumber = '4111111111111111';
             sessionDetails.cardSecurityCode = '123';
             sessionDetails.cardExpiryMonth = '11';
             sessionDetails.cardExpiryYear = '22';
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
};



var dependencies = [
'$scope','$rootScope','$state','$stateParams','$modal','ccVerificationService',
ccVerificationViewController
];

sntGuestWeb.controller('ccVerificationViewController', dependencies);
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




  // room verification


  (function() {
  var checkoutRoomVerificationViewController = function($scope,$rootScope,$state,$modal,checkoutRoomVerificationService,$timeout) {

  $rootScope.isRoomVerified =  false;
  $scope.roomNumber = "";
    //setup options for error popup
    $scope.opts = {
      backdrop: true,
      backdropClick: true,
      templateUrl: '/assets/checkoutnow/partials/roomVerificationErrorModal.html',
      controller: roomVerificationErrorModalCtrl
    };

    $scope.continueButtonClicked = function(){

    var url = '/guest_web/verify_room.json';
    var data = {'reservation_id':$rootScope.reservationID,"room_number":$scope.roomNumber};
    $scope.isFetching = true;
    // checkoutRoomVerificationService.verifyRoom(url,data).then(function(response) {

         $timeout(function() {

          // if(response.status ==="success"){
            $rootScope.isRoomVerified =  true;
            if($rootScope.isLateCheckoutAvailable ){
                $state.go('checkOutOptions');
              }else {
                $state.go('checkOutConfirmation');
            }
          }, 2000);

  };


};

var dependencies = [
'$scope','$rootScope','$state','$modal','checkoutRoomVerificationService','$timeout',
checkoutRoomVerificationViewController
];

sntGuestWeb.controller('checkoutRoomVerificationViewController', dependencies);
})();


// controller for the modal

  var roomVerificationErrorModalCtrl = function ($scope, $modalInstance) {
    $scope.closeDialog = function () {
      $modalInstance.dismiss('cancel');
    };
    $scope.goToBrowserHomePage = function(){
      if (window.home) {
                window.home ();
            } else {        // Internet Explorer
                document.location.href = "about:home";
            }
    };
  };

  // checkout isFromCheckoutNow





(function() {
  var checkOutConfirmationController = function($scope,$rootScope,$state) {

    $scope.checkoutTimessage = $rootScope.checkoutTimessage ? $rootScope.checkoutTimessage:"Check-out time is ";
    $scope.footerMessage1 = !$rootScope.isLateCheckoutAvailable ? 'Late check-out is not available.' :'' ;

};

var dependencies = [
'$scope','$rootScope','$state',
checkOutConfirmationController
];

sntGuestWeb.controller('checkOutConfirmationController', dependencies);
})();

///



sntGuestWeb.controller('checkOutLandingController', ['$rootScope','$location','$state','$scope', function($rootScope,$location,$state,$scope) {

}]);

sntGuestWeb.filter('customizeLabelText', function () {
    return function (input, scope) {
        return input.substring(0, 1) +" ' "+ input.substring(1, 2).toBold() +" ' "+ input.substring(2);
    };
});




////
/*
  Balance Ctrl where the reservation balance is shown
*/

(function() {
  var checkOutBalanceController = function($scope, BillService,$rootScope,$state) {

    // showBill flag and its reference in $rootScope
    $scope.showBill = false;
    $rootScope.showBill = $scope.showBill;
    $scope.netWorkError = false;
    $scope.isFetching = true;

    //fetch data to display
    BillService.fetchBillData().then(function(billData) {
      $scope.billData = billData.data.bill_details;
      $scope.roomNo = billData.data.room_number;
      $scope.isFetching = false;
      if($scope.billData) {
        $scope.optionsAvailable = true;
      }
    },function(){
      $scope.netWorkError = true;
      $scope.isFetching = false;
    });

    // If the user has a non-zero balance and no cc attached to the reservation
    $scope.gotToNextStep = function(){
      if($rootScope.isCCOnFile || parseInt($scope.billData.balance) === 0.00 || $rootScope.isSixpayments){
        $state.go('checkOutStatus');
      }
      else{
        $state.go('ccVerification',{'fee':$scope.billData.balance,'message':"Check-out fee",'isFromCheckoutNow':true});
      }
    };
};

var dependencies = [
'$scope',
'BillService','$rootScope','$state',
checkOutBalanceController
];

sntGuestWeb.controller('checkOutBalanceController', dependencies);
})();




(function() {
  var checkOutStatusController = function($scope, checkoutNowService,$rootScope,$state) {

 

    // checkoutNowService.completeCheckout(url,data).then(function(response) {
    $scope.posted = true;
    $scope.success =  true;
    $rootScope.isCheckedout = $scope.isCheckoutCompleted = true;
  

};

var dependencies = [
'$scope',
'checkoutNowService','$rootScope','$state',
checkOutStatusController
];

sntGuestWeb.controller('checkOutStatusController', dependencies);
})();

/*
  External verification Ctrl 
  The landing page when the guestweb is accessed without the link from the email.
  This is accessed using URL set in admin settings WEB CHECK OUT URL in admin -> zest -> Checkout
*/
(function() {
  var externalVerificationViewController = function($scope, externalVerificationService,$rootScope,$state,dateFilter,$filter,$modal) {
    


    // },function(){
    //   $scope.isLoading = false;
    //   $modal.open($scope.errorOpts); // error modal popup
    // });
  // };
};

var dependencies = [
'$scope',
'externalVerificationService','$rootScope','$state','dateFilter','$filter','$modal',
externalVerificationViewController
];

sntGuestWeb.controller('externalVerificationViewController', dependencies);
})();

sntGuestWeb.controller('verificationErrorController', ['$scope', function($scope) {

  $scope.doneClicked = function(){

  };

}]);

// controller for the modal

  var verificationModalCtrl = function ($scope, $modalInstance,$state) {

    $scope.closeDialog = function () {
      $modalInstance.dismiss('cancel');
    };

  };

  //////////////////////// checkoutt late////////////
  /*
  Late checkout option Ctrl where user can opt a later checkout time
*/

(function() {
  var checkOutLaterController = function($scope, LateCheckOutChargesService,$rootScope,$location,$state) {
  

    $scope.showBackButtonImage = true;
    $scope.netWorkError = false;
    $scope.isFetching = true;

    // If CC is not attached to the reservation we need to add CC to proceed to opt an late checkouttime.
    $scope.gotToNextStep = function(fee,chargeId){
      if(!$rootScope.isCCOnFile && !$rootScope.isSixpayments){
        $state.go('ccVerification',{'fee':fee,'message':"Late check-out fee",'isFromCheckoutNow':false});
      }
      else{
        $state.go('checkOutLaterSuccess',{id:chargeId});
      }

    };

    // fetch late checkout options available
    $scope.charges = [{"time":"12","ap":"PM","amount":"56","class":"checkouttime1"},{"time":"12","ap":"PM","amount":"56","class":"checkouttime2"},{"time":"12","ap":"PM","amount":"56","class":"checkouttime3"}

];;
      $scope.isFetching = false;
      if($scope.charges.length > 0) {
        $scope.optionsAvailable = true;
      };
};

var dependencies = [
'$scope',
'LateCheckOutChargesService','$rootScope','$location','$state',
checkOutLaterController
];

sntGuestWeb.controller('checkOutLaterController', dependencies);
})();

/*
  Late checkout final Ctrl 
  New checkout time is set and an option to continue the checkout process is present
*/

(function() {
  var checkOutLaterSuccessController = function($scope, $http, $q, $stateParams, $state, $rootScope, LateCheckOutChargesService) {

    $scope.success =  true ;
      if($scope.success === true){
        $scope.posted = true;
        $scope.oldCheckoutTime = angular.copy($rootScope.checkoutTime);
        $rootScope.checkoutTime = 11 +':00 '+"pm";
        $rootScope.checkoutTimessage = "Your new check-out time is ";
        $rootScope.isLateCheckoutAvailable = false;
        $scope.keyExpiry = "Your room keys are set to expire for the checkout time of "+$scope.oldCheckoutTime+". Please see a guest service agent at the front desk to re-activate your keys for the late checkout time selected.";

    }
    else{
        $scope.netWorkError = true;
    }
};

var dependencies = [
'$scope',
'$http',
'$q',
'$stateParams',
'$state',
'$rootScope',
'LateCheckOutChargesService',
checkOutLaterSuccessController
];

sntGuestWeb.controller('checkOutLaterSuccessController', dependencies);
})();