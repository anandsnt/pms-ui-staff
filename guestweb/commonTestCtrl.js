/*

//= require ../guestweb/commonTestCtrl.js
//= require ../guestweb/scripts/app_router_common.js
//= require ../guestweb/scripts/app_config.js
//= require_tree ../guestweb/shared
//= require_tree ../guestweb/checkoutlater/services
//= require_tree ../guestweb/checkoutnow/services
//= require_tree ../guestweb/checkin/services
//= require_tree ../guestweb/preCheckin/services
*/




var sntGuestWeb = angular.module('sntGuestWeb',['ui.router','ui.bootstrap','pickadate']);

sntGuestWeb.controller('rootController', ['$rootScope','$scope','$attrs', '$location','$state','$timeout',
  function($rootScope,$scope,$attrs,$location,$state,$timeout) {

    var that = this;
//load the style elements. Done to reduce the loading time of web page.

loadStyleSheets('/assets/' + $('body').attr('data-theme') +'.css');
loadAssets('/assets/favicon.png', 'icon', 'image/png');
loadAssets('/assets/apple-touch-icon-precomposed.png', 'apple-touch-icon-precomposed');
loadAssets('/assets/apple-touch-startup-image-768x1004.png', 'apple-touch-startup-image', '' ,'(device-width: 768px) and (orientation: portrait)');
loadAssets('/assets/apple-touch-startup-image-1024x748.png', 'apple-touch-startup-image', '' ,'(device-width: 768px) and (orientation: landscape)');
loadAssets('/assets/apple-touch-startup-image-1536x2008.png', 'apple-touch-startup-image', '' ,'(device-width: 768px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)');
loadAssets('/assets/apple-touch-startup-image-2048x1496.png', 'apple-touch-startup-image', '' ,'(device-width: 768px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 2)');

//store basic details as rootscope variables

// precheckin

$attrs.isPrecheckinOnly  ='false'; //set to true
$attrs.reservationStatus ='RESERVED' ;
$attrs.isAutoCheckin = 'true';//$attrs.isCheckin ='true';
$attrs.isExternalVerification=  'true';

// for checkin
$attrs.isCheckin= 'true'; // set to true

$rootScope.hotelName     = $attrs.hotelName;
$rootScope.currencySymbol= $attrs.currencySymbol;
$rootScope.hotelPhone    = $attrs.hotelPhone;
$rootScope.businessDate  = $attrs.businessDate;
$rootScope.mliMerchatId = $attrs.mliMerchatId;
$rootScope.dateFormatPlaceholder = $attrs.dateFormatValue;
$rootScope.dateFormat = getDateFormat($attrs.dateFormatValue);
$rootScope.roomVerificationInstruction = $attrs.roomVerificationInstruction;
$rootScope.isSixpayments = ($attrs.paymentGateway  === "sixpayments") ? true:false;

$rootScope.reservationID = $attrs.reservationId;
$rootScope.userName      = $attrs.userName;
$rootScope.checkoutDate  = $attrs.checkoutDate;
$rootScope.checkoutTime  = $attrs.checkoutTime;
$rootScope.userCity      = $attrs.city;
$rootScope.userState     = $attrs.state;
$rootScope.roomNo        = $attrs.roomNo;
$rootScope.isLateCheckoutAvailable  = ($attrs.isLateCheckoutAvailable  === 'true') ? true : false;
$rootScope.emailAddress  = $attrs.emailAddress;
$rootScope.isCheckedout  = ($attrs.isCheckedout === 'true') ? true : false;
$rootScope.isCheckin     =   ($attrs.isCheckin ==='true') ? true : false;
$rootScope.reservationStatusCheckedIn = ($attrs.reservationStatus ==='CHECKIN')? true :false;
$rootScope.isActiveToken = ($attrs.isActiveToken ==='true') ? true : false;
$rootScope.isCheckedin  =  ($rootScope.reservationStatusCheckedIn  && !$rootScope.isActiveToken);
$rootScope.isCCOnFile = ($attrs.isCcAttached ==='true')? true:false;
$rootScope.isPreCheckedIn   = ($attrs.isPreCheckedIn === 'true') ? true: false;
$rootScope.isRoomVerified =  false;
$rootScope.isPrecheckinOnly = ($attrs.isPrecheckinOnly ==='true' && $attrs.reservationStatus ==='RESERVED')?true:false;
$rootScope.isCcAttachedFromGuestWeb = false;
$rootScope.isAutoCheckinOn = (($attrs.isAutoCheckin === 'true') && ($attrs.isPrecheckinOnly === 'true')) ? true :false;;
$rootScope.isExternalVerification = ($attrs.isExternalVerification === "true") ? true :false;
$rootScope.hotelIdentifier = $attrs.hotelIdentifier;
$rootScope.guestAddressOn = $attrs.guestAddressOn === 'true' ? true:false;
$rootScope.isGuestAddressVerified =  false;


//Params for zest mobile and desktop screens
if($attrs.hasOwnProperty('isPasswordReset')){
  $rootScope.isPasswordResetView = $attrs.isPasswordReset;
  $rootScope.isTokenExpired = $attrs.isTokenExpired === "true"? true: false;
  $rootScope.accessToken = $attrs.token;
  $rootScope.user_id = $attrs.id;
  $rootScope.user_name = $attrs.login;
}

//work around to fix flashing of logo before app loads
$timeout(function() {
  $rootScope.hotelLogo     = $attrs.hotelLogo;
}, 750);

if(typeof $attrs.accessToken !== "undefined") {
  $rootScope.accessToken = $attrs.accessToken ;
}
//navigate to different pages
if($attrs.isExternalVerification ==="true"){
  $location.path('/externalVerification');
}
else if($attrs.isPrecheckinOnly  ==='true' && $attrs.reservationStatus ==='RESERVED' && !($attrs.isAutoCheckin === 'true')){
  $location.path('/tripDetails');
}
else if ($attrs.isPrecheckinOnly  ==='true' && $attrs.reservationStatus ==='RESERVED' && ($attrs.isAutoCheckin === 'true')){
  $location.path('/checkinConfirmation');
}
else if($rootScope.isCheckedin){
  $location.path('/checkinSuccess');
}
else if($attrs.isCheckin ==='true'){
  $location.path('/checkinConfirmation');
}
else if($rootScope.isCheckedout)  {
  $location.path('/checkOutStatus');
}
else if($rootScope.hasOwnProperty('isPasswordResetView')){
  var path = $rootScope.isPasswordResetView === 'true'? '/resetPassword' : '/emailVerification';
  $location.path(path);
  $location.replace();
}else{
  $location.path('/checkoutRoomVerification');
};

$( ".loading-container" ).hide();
/*
* function to handle exception when state is not found
*/
$scope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
  event.preventDefault();
  $state.go('noOptionAvailable');
})
}]);

var loadStyleSheets = function(filename){
  var fileref = document.createElement("link");
  fileref.setAttribute("rel", "stylesheet");
  fileref.setAttribute("type", "text/css");
  fileref.setAttribute("href", filename);
  $('body').append(fileref);
};


var loadAssets = function(filename, rel, type, media){
  var fileref = document.createElement("link");
  fileref.setAttribute("rel", rel);
  fileref.setAttribute("href", filename);
  if(type !== '') {
    fileref.setAttribute("type", type);
  }
  if(media !== '') {
    fileref.setAttribute("media", media);
  }
  document.getElementsByTagName('head')[0].appendChild(fileref);
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

var response = {
  "status": "success",
  "data": {
    "bill_details": {
      "fee_details": [
      {
        "date": "14/08/2015",
        "fee_date": "FRI 14 AUG",
        "print_date": "14-Aug",
        "charge_details": [
        {
          "reference_text": "",
          "description": "Breakfast",
          "is_tax": false,
          "amount": "20.00"
        },
        {
          "reference_text": "",
          "description": "Package Breakfast - US",
          "is_tax": false,
          "amount": "4.75"
        },
        {
          "reference_text": "",
          "description": "Food Tax - US",
          "is_tax": true,
          "amount": "0.28"
        },
        {
          "reference_text": "",
          "description": "Package Breakfast - US",
          "is_tax": false,
          "amount": "4.25"
        },
        {
          "reference_text": "",
          "description": "Food Tax - US",
          "is_tax": true,
          "amount": "0.26"
        }
        ],
        "credit_details": []
      }
      ],
      "tax_details": [
      {
        "description": "GST 12.5%",
        "amount": "2.22"
      },
      {
        "description": "Food Tax - US",
        "amount": "0.54"
      }
      ],
      "credits": "0.00",
      "total_fees": "29.54",
      "total_incl_tax": "0.54",
      "net_amount": "26.78",
      "balance": "29.54",
      "currency": "€",
      "currency_for_html": "€"
    },
    "room_number": "195"
  },
  "errors": []
};
$scope.billData = response.data.bill_details;
$scope.roomNo = response.data.room_number;
$scope.isFetching = false;
if($scope.billData) {
  $scope.optionsAvailable = true;
}


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
  var externalVerificationViewController = function($scope,$rootScope,$state,$modal,$timeout) {

    $scope.submit = function(){

      var setReservartionDetails = function(response){

        $rootScope.reservationID      = response.reservation_id;
        $rootScope.userName           = response.user_name;
        $rootScope.checkoutDate       = response.checkout_date;
        $rootScope.checkoutTime       = response.checkout_time;
        $rootScope.userCity           = response.user_city;
        $rootScope.userState          = response.user_state;
        $rootScope.roomNo             = response.room_no;
        $rootScope.isLateCheckoutAvailable  = response.is_late_checkout_available = true;
        $rootScope.emailAddress       = response.email_address;
        $rootScope.isCCOnFile       = response.is_cc_attached = false;
        $rootScope.accessToken        = response.guest_web_token;

      };
      setReservartionDetails({"guest_web_token":"4c46f2fb42241caf08a3f9675abb11c3","reservation_id":1333742,"user_name":"d, dfsdff"
        ,"checkout_date":"06/10/2015","checkout_time":"11:00 PM","user_city":"","user_state":"","room_no":"195"
        ,"is_late_checkout_available":false,"email_address":"resheil@qburst.com","is_cc_attached":true})
      $rootScope.isRoomVerified =  true;
      $scope.isLoading = true;
      $timeout(function() {
        $scope.isLoading = false;
        $rootScope.isRoomVerified =  true;
        if($rootScope.isLateCheckoutAvailable ){
          $state.go('checkOutOptions');
        }else {
          $state.go('checkOutConfirmation');
        }
      }, 500);
    };



  };

  var dependencies = [
  '$scope','$rootScope','$state','$modal','$timeout',
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

    $scope.charges = [{"time":"12","ap":"PM","amount":"56","class":"checkouttime1"},{"time":"12","ap":"PM","amount":"56","class":"checkouttime2"},{"time":"12","ap":"PM","amount":"56","class":"checkouttime3"}];
    if($scope.charges.length > 0) {
      $scope.optionsAvailable = true;
    }
// If CC is not attached to the reservation we need to add CC to proceed to opt an late checkouttime.
$scope.gotToNextStep = function(fee,chargeId){
  if(!$rootScope.isCCOnFile && !$rootScope.isSixpayments){
    $state.go('ccVerification',{'fee':fee,'message':"Late check-out fee",'isFromCheckoutNow':false});
  }
  else{
    $state.go('checkOutLaterSuccess',{id:chargeId});
  }

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
  var checkOutLaterSuccessController = function($scope, $rootScope) {
    $scope.success =  true ;
    $scope.posted = true;
    $scope.oldCheckoutTime = angular.copy($rootScope.checkoutTime);
    $rootScope.checkoutTime = 11 +':00 '+"pm";
    $rootScope.checkoutTimessage = "Your new check-out time is ";
    $rootScope.isLateCheckoutAvailable = false;
    $scope.keyExpiry = "Your room keys are set to expire for the checkout time of "+$scope.oldCheckoutTime+". Please see a guest service agent at the front desk to re-activate your keys for the late checkout time selected.";

  };

  var dependencies = [
  '$scope',
  '$rootScope',
  checkOutLaterSuccessController
  ];

  sntGuestWeb.controller('checkOutLaterSuccessController', dependencies);
})();


///cc


(function() {
  var ccVerificationViewController = function($scope,$rootScope,$state,$stateParams,$modal,ccVerificationService) {


    $scope.pageValid = false;
    $scope.cardNumber = "";
    $scope.ccv = "";
    $scope.monthSelected = "";
    $scope.yearSelected ="";

   
      $scope.pageValid = true;
  //}

    if($scope.pageValid){
      $scope.roomVerificationInstruction = "ddebfiebhfi hjevuebfbe ehdved e hdevdb ed e dh ed ejd e dkj edj ejd e de dnendn"
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

  $rootScope.isCCOnFile = true;
  $rootScope.isCcAttachedFromGuestWeb = true;
  if($stateParams.isFromCheckoutNow === "true"){
    $rootScope.ccPaymentSuccessForCheckoutNow = true;
    $state.go('checkOutStatus');
  }else{
    $rootScope.ccPaymentSuccessForCheckoutLater = true;
    $state.go('checkOutLaterSuccess',{id:$scope.fee});
  }

};

$scope.savePaymentDetails = function(){
  $scope.goToNextStep();
};

/* MLI integration ends here */

}
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


////////////////// checkin
/*
Checkin confimation Ctrl 
The user enetered card number and departure number are verified.
However if the operation is autocheckin and the reservation has non CC payment type, then the card entry is not required.
The reservation details will be the  in the API response of the verification API.
*/

(function() {
  var checkInConfirmationViewController = function($scope,$modal,$rootScope,$state, dateFilter, $filter, checkinConfirmationService,checkinDetailsService) {


    $scope.pageValid = false;
    var dateToSend = '';
    if($rootScope.isCheckedin){
      $state.go('checkinSuccess');
    }
    else{
      $scope.pageValid = true;
    }
//uncheck checkbox in reservation details page

$rootScope.checkedApplyCharges = false;
$scope.minDate  = $rootScope.businessDate;
$scope.cardDigits = '';

//setup options for modal
$scope.opts = {
  backdrop: true,
  backdropClick: true,
  templateUrl: '/assets/checkin/partials/errorModal.html'
// controller: ModalInstanceCtrl
};

if($scope.pageValid){

//set up flags related to webservice
$scope.isPosting     = false;
$rootScope.netWorkError  = false;


//next button clicked actions
$scope.nextButtonClicked = function() {
  var data = {'departure_date':dateToSend,'credit_card':$scope.cardDigits,'reservation_id':$rootScope.reservationID};
  $scope.isPosting     = true;

//call service
// checkinConfirmationService.login(data).then(function(response) {
  $scope.isPosting = false;
  response = {data:{}};
  response.data = 
  {

    "arrival_date":"23/23/33",
    "departure_date":"23/23/33",
    "room_type":"224e2wwwfwf3f3",
    "room_rate":"wgewdu3d",
    "currency":"$",
    "is_rate_suppressed": 'false', 
    "avg_rate" : '0.00',
    "status" :"fef",
    "is_upgrades_available":"false"

  }
  $rootScope.ShowupgradedLabel = true;

  if(response.status === 'failure') {
$modal.open($scope.opts); // error modal popup
}
else{
// display options for room upgrade screen
$rootScope.ShowupgradedLabel = false;
$rootScope.roomUpgradeheading = "Your trip details";
$scope.isResponseSuccess = true;
checkinDetailsService.setResponseData(response.data);
$rootScope.upgradesAvailable = (response.data.is_upgrades_available === "true") ? true :  false;
//navigate to next page
$state.go('checkinReservationDetails');
}

};

// moved date picker controller logic
$scope.isCalender = false;
$scope.date = dateFilter(new Date(), 'yyyy-MM-dd');
$scope.selectedDate = ($filter('date')($scope.date, $rootScope.dateFormat));

$scope.showCalender = function(){
  $scope.isCalender = true;
};
$scope.closeCalender = function(){
  $scope.isCalender = false;
};
$scope.dateChoosen = function(){
  $scope.selectedDate = ($filter('date')($scope.date, $rootScope.dateFormat));
  $rootScope.departureDate = $scope.selectedDate;

  dateToSend = dclone($scope.date,[]);
  dateToSend = ($filter('date')(dateToSend,'MM-dd-yyyy'));
  $scope.closeCalender();
};
}
};

var dependencies = [
'$scope','$modal','$rootScope','$state', 'dateFilter', '$filter', 'checkinConfirmationService','checkinDetailsService',
checkInConfirmationViewController
];

sntGuestWeb.controller('checkInConfirmationViewController', dependencies);
})();
/*
Checkin reservation details Ctrl 
Reservation details are shown in this page.
*/
(function() {
  var checkInReservationDetails = function($scope,$rootScope,$location,checkinDetailsService,$state,$modal) {

    $scope.pageValid = false;

    if($rootScope.isCheckedin){
      $state.go('checkinSuccess');
    }
    else{
      $scope.pageValid = true;
    };

    if($scope.pageValid){
      $rootScope.ShowupgradedLabel = true;
//check if checkbox was already checked (before going to upgrades)
$scope.checked =  ($rootScope.ShowupgradedLabel) ? true:true;
$scope.reservationData = checkinDetailsService.getResponseData();
$scope.reservationData.terms_and_conditions = " Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.33"
$rootScope.confirmationNumber = $scope.reservationData.confirm_no;
$scope.showTermsPopup = false;

//setup options for modal
$scope.opts = {
  backdrop: true,
  backdropClick: true,
  templateUrl: '/assets/checkin/partials/acceptChargesError.html',
  controller: ModalInstanceCtrl
};

$scope.termsClicked = function(){
//alert("vefhcgh")
$scope.showTermsPopup = true;
};

$scope.agreeClicked = function(){
  $rootScope.checkedApplyCharges = $scope.checked =  true;
  $scope.showTermsPopup = false;
};

$scope.cancel = function(){
  $rootScope.checkedApplyCharges = $scope.checked = false;
  $scope.showTermsPopup = false;
};

$scope.checkInButtonClicked = function(){
  if($scope.checked){
    if(!$rootScope.guestAddressOn || $rootScope.isGuestAddressVerified){
// if room upgrades are available
if($rootScope.upgradesAvailable){
  $state.go('checkinUpgrade');
}
else{
  if($rootScope.isAutoCheckinOn){
    $state.go('checkinArrival');
//$state.go('guestDetails');  
//$state.go('checkinUpgrade');
}
else{
  $state.go('guestDetails');
}
};
}
else{
  $state.go('guestDetails');  
}       
}
else{
$modal.open($scope.opts); // error modal popup
};
};

}

};

var dependencies = [
'$scope','$rootScope','$location','checkinDetailsService','$state','$modal',
checkInReservationDetails
];

sntGuestWeb.controller('checkInReservationDetails', dependencies);
})();


// controller for the modal

var ModalInstanceCtrl = function ($scope, $modalInstance) {
  $scope.closeDialog = function () {
    $modalInstance.dismiss('cancel');
  };
};




/*
Checkin Room Upgrade Ctrl 
This displays the available rooms for upgrading.
*/
(function() {
  var checkinUpgradeRoomController = function($scope,$location,$rootScope,checkinRoomUpgradeOptionsService,checkinRoomUpgradeService,checkinDetailsService,$state) {

    $scope.pageValid = false;

    if($rootScope.isCheckedin){
      $state.go('checkinSuccess');
    }
    else{
      $scope.pageValid = true;
    };

    if($scope.pageValid){
      $scope.slides = [];
//set up flags related to webservice

$scope.isFetching     = false;
$rootScope.netWorkError  = false;
var data = {'reservation_id':$rootScope.reservationID};
$scope.slides = [];

var slide = {"upgrade_room_type_name":"room1","upsell_amount":33,"upsell_amount_id":22,"upgrade_room_description":"<h1>ssss</h1>bvccbebebfbebfbefbebfbfbe"};
var slide1 = {"upgrade_room_type_name":"room2","upsell_amount":33,"upsell_amount_id":22,"upgrade_room_description":"<h1>ssss</h1>bvccbebebfbebfbefbebfbfbe"};
$scope.slides.push(slide);
$scope.slides.push(slide1);

// upgrade button clicked

$scope.upgradeClicked = function(upgradeID,roomNumber){

  $scope.isFetching          = true;
  var data = {'reservation_id':$rootScope.reservationID,'upsell_amount_id':upgradeID,'room_no':roomNumber};
  checkinRoomUpgradeService.post(data).then(function(response) {

    $scope.isFetching     = false;
    if(response.status === "failure") {
      $rootScope.netWorkError  = true;
    }
    else
    {
      $rootScope.upgradesAvailable = false;
      $rootScope.ShowupgradedLabel = true;
      $rootScope.roomUpgradeheading = "Your new trip details";
      checkinDetailsService.setResponseData(response.data);
      $state.go('checkinReservationDetails');
    }

  },function(){
    $rootScope.netWorkError = true;
    $scope.isFetching = false;
  });


};

$scope.noThanksClicked = function(){
  if($rootScope.isAutoCheckinOn){
    $state.go('checkinArrival');
  }
  else{
    $state.go('checkinKeys');
  }
};

}
};

var dependencies = [
'$scope','$location','$rootScope','checkinRoomUpgradeOptionsService','checkinRoomUpgradeService','checkinDetailsService','$state',
checkinUpgradeRoomController
];

sntGuestWeb.controller('checkinUpgradeRoomController', dependencies);
})();

// Setup directive to compile html

sntGuestWeb.directive("description", function ($compile) {
  function createList(template) {
    templ = template;
    return templ;
  }

  return{
    restrict:"E",
    scope: {},
    link:function (scope, element, attrs) {

      element.append(createList(attrs.template));
      $compile(element.contents())(scope);
    }
  };
});

// Setup directive to handle image not found case

sntGuestWeb.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        element.attr('src', attrs.errSrc);
      });
    }
  };
});



/*
Checkin arrival details Ctrl 
The user can change the estimated time of arrival from here and optionally add comments.
*/

(function() {

  var checkinArrivalDetailsController = function($scope, preCheckinSrv,$rootScope,$state,$modal,$stateParams) {

    var init = function(){

      $scope.hours = ["01","02","03","04","05","06","07","08","09","10","11","12"];
      $scope.minutes = ["00","15","30","45"];
      $scope.primeTimes = ["AM","PM"];

      if(typeof $rootScope.earlyCheckinRestrictHour !=="undefined"){
        $scope.earlyCheckinRestrictLimit = $rootScope.earlyCheckinRestrictHourForDisplay+":"+$rootScope.earlyCheckinRestrictMinute+" "+$rootScope.earlyCheckinRestrictPrimetime;
//restrict time before earlyCheckinRestrictTime
if($rootScope.earlyCheckinRestrictPrimetime === "PM"){
  $scope.primeTimes = $scope.primeTimes.slice(1);
  if( $rootScope.earlyCheckinRestrictHour !=="12"){
    angular.forEach( $scope.hours, function(hour,index) {
      if(hour === $rootScope.earlyCheckinRestrictHour){
        $scope.hours =  $scope.hours.slice(index);
        $scope.hours.splice($scope.hours.length-1,1);
      };
    });
  }
};
$scope.stayDetails = {
  "hour":$rootScope.earlyCheckinRestrictHour,
  "minute":$rootScope.earlyCheckinRestrictMinute,
  "primeTime" : $rootScope.earlyCheckinRestrictPrimetime
};
}else{
  $scope.stayDetails = {
    "hour":"",
    "minute":"",
    "primeTime" : ""
  };
};

$scope.errorOpts = {
  backdrop: true,
  backdropClick: true,
  templateUrl: '/assets/preCheckin/partials/preCheckinErrorModal.html',
  controller: ccVerificationModalCtrl,
  resolve: {
    errorMessage:function(){
      return "Please select a valid estimated arrival time";
    }
  }
};
$scope.checkinTime = (typeof $stateParams.time !=="undefined") ? $stateParams.time :"";

};
init();

$scope.postStayDetails = function(){
  $scope.isLoading = true;
//change format to 24 hours
var hour = parseInt($scope.stayDetails.hour);
if ($scope.stayDetails.primeTime === 'PM' && hour < 12) {
  hour = hour+ 12;
}
else if ($scope.stayDetails.primeTime === 'AM' && hour === 12) {
  hour = hour-12;
}
hour = (hour <10)?("0"+hour): hour;
var dataTosend = {
  "arrival_time":  hour+":"+$scope.stayDetails.minute,
  "comments":$scope.stayDetails.comment
};

response = {};
response.early_checkin_available = true;
response.early_checkin_offer_id  = 33;
response.checkin_time = "21313";
response.early_checkin_charge = 34;
response.id = 66;

// preCheckinSrv.postStayDetails(dataTosend).then(function(response) {
  $rootScope.earlyCheckinHour   =  response.last_early_checkin_hour;
  $rootScope.earlyCheckinMinute =  response.last_early_checkin_minute;
  $rootScope.earlyCheckinPM     =  response.last_early_checkin_primetime;
  $rootScope.earlyCheckinRestrictHour = response.early_checkin_restrict_hour;
  $rootScope.earlyCheckinRestrictHourForDisplay = response.early_checkin_restrict_hour_for_display;
  $rootScope.earlyCheckinRestrictMinute = response.early_checkin_restrict_minute;
  $rootScope.earlyCheckinRestrictPrimetime = response.early_checkin_restrict_primetime;

  if(response.early_checkin_available && typeof response.early_checkin_offer_id !== "undefined" && !response.bypass_early_checkin){
    $state.go('earlyCheckinOptions',{'time':response.checkin_time,'charge':response.early_checkin_charge,'id':response.early_checkin_offer_id});
  }
  else if(response.early_checkin_on && !response.early_checkin_available && !response.bypass_early_checkin){
    $state.go('laterArrival',{'time':response.checkin_time,'isearlycheckin':true});
  }
  else{
    $state.go('preCheckinStatus');
  }
};
};

var dependencies = [
'$scope',
'preCheckinSrv','$rootScope','$state','$modal','$stateParams',
checkinArrivalDetailsController
];

sntGuestWeb.controller('checkinArrivalDetailsController', dependencies);
})();

/*
Early Checkin options Ctrl 
There are two options 1) purcahase an early checkin 2) change the arrival time to a later time.
*/

(function() {
  var earlyCheckinOptionsController = function($scope,$rootScope,$state,$stateParams) {

    $scope.pageValid = false;

    if($rootScope.isCheckedin){
      $state.go('checkinSuccess');
    }
    else if($rootScope.isCheckedout ){
      $state.go('checkOutStatus');
    }
    else{
      $scope.pageValid = true;
    }

    if($scope.pageValid){

      $scope.checkinTime = $stateParams.time;
      $scope.earlyCheckinCharge = $stateParams.charge;
      var offerId = $stateParams.id;

      $scope.nextButtonClicked = function(){
        $state.go('earlyCheckinFinal',{'time':$scope.checkinTime,'charge': $stateParams.charge,'id':offerId});
      };

      $scope.changeArrivalTime = function(){
        $state.go('laterArrival',{'time':$scope.checkinTime,'isearlycheckin':true});
      };
    }
  };

  var dependencies = [
  '$scope','$rootScope','$state','$stateParams',
  earlyCheckinOptionsController
  ];

  sntGuestWeb.controller('earlyCheckinOptionsController', dependencies);
})();

/*
Early Checkin final Ctrl 
The early checkin purcahse is done here on entering to this page itself.
*/
(function() {
  var earlyCheckinFinalController = function($scope,$rootScope,$state,$stateParams,earlyCheckinService) {


    $scope.pageValid = false;

    if($rootScope.isCheckedin){
      $state.go('checkinSuccess');
    }
    else if($rootScope.isCheckedout){
      $state.go('checkOutStatus');
    }
    else{
      $scope.pageValid = true;
    }
    if($scope.pageValid){
      $scope.checkinTime = $stateParams.time;
      $scope.earlyCheckinCharge = $stateParams.charge;
      var offerId= $stateParams.id;
      $scope.isPosting = true;
      var dataTosend = {'reservation_id':$rootScope.reservationID,'early_checkin_offer_id':offerId};
      $scope.isPosting = false;
      $scope.nextButtonClicked =  function(){
        $state.go('preCheckinStatus');
      };
    }
  };

  var dependencies = [
  '$scope','$rootScope','$state','$stateParams','earlyCheckinService',
  earlyCheckinFinalController
  ];

  sntGuestWeb.controller('earlyCheckinFinalController', dependencies);
})();


/*
guest details Ctrl 
If the admin settings for this is turned on , this screen will be shown and user can
update the guest details here.
*/
(function() {
  var guestDetailsController = function($scope,$rootScope,$state,guestDetailsService,$modal) {

    $scope.pageValid = false;

    if($rootScope.isCheckedin){
      $state.go('checkinSuccess');
    }
    else if($rootScope.isCheckedout ){
      $state.go('checkOutStatus');
    }
    else{
      $scope.pageValid = true;
    }   

    if($scope.pageValid){

      $scope.countries  = [];
      $scope.years      = [];
      $scope.months     = [];
      $scope.days       = [];
      $scope.guestDetails = {
        'day':'',
        'month':'',
        'year':'',
        'postal_code':'',
        'state':'',
        'city':'',
        'street1':'',
        'street2':'',
        'birthday':'',
        'country_id':''
      };


      for(year=1900;year<=new Date().getFullYear();year++){
        $scope.years.push(year);
      };
      for(month=1;month<=12;month++){
        $scope.months.push(month);
      };

      for(day=1;day<=31;day++){
        $scope.days.push(day);
      };

      $scope.isLoading          = false;
      $scope.guestDetails       = {};
      $scope.guestDetails.day   = 11;
      $scope.guestDetails.month = 11;
      $scope.guestDetails.year  = 1988;
//fetch country list
$scope.isLoading = true;
guestDetailsService.fetchCountryList().then(function(response) {
  $scope.countries = response;
  $scope.isLoading = false;
},function(){
  $rootScope.netWorkError = true;
  $scope.isLoading = false;
});


var getDataToSave = function(){
  var data        = {};
  var unwanted_keys     = ["month","year","day"];
  var newObject       = JSON.parse(JSON.stringify($scope.guestDetails));
  for(var i=0; i < unwanted_keys.length; i++){
    delete newObject[unwanted_keys[i]];
  };
  data          = newObject;
  if($scope.guestDetails.month && $scope.guestDetails.day && $scope.guestDetails.year){
    data.birthday = $scope.guestDetails.month+"-"+$scope.guestDetails.day+"-"+$scope.guestDetails.year;
  }
  else{
    delete data["birthday"];
  };

  return data;
};

$scope.opts = {
  backdrop: true,
  backdropClick: true,
  templateUrl: '/assets/checkin/partials/guestDetailsErrorModal.html',
  controller: ModalInstanceCtrl
};

//post guest details
$scope.postGuestDetails = function(){

      $scope.isLoading  = false;
      $rootScope.isGuestAddressVerified =  true;
      if($rootScope.upgradesAvailable){
        $state.go('checkinUpgrade');
      }
      else{
        if($rootScope.isAutoCheckinOn){
          $state.go('checkinArrival');
        }
        else{
          $state.go('checkinKeys');
        }
      }
};    
}
};
var dependencies = [
'$scope','$rootScope','$state','guestDetailsService','$modal',
guestDetailsController
];
sntGuestWeb.controller('guestDetailsController', dependencies);
})();
/*
Checkin keys Ctrl 
This is the final screen for the checkin operations.
It will have two types of responses. Some hotels may have QR code facility, so the HTML will
display the QR code ,else the text enterd in room key delivery in the admin setting will be shown as text.
*/
(function() {
  var checkInKeysController = function($scope,$rootScope,$http,$location,checkinDetailsService,checkinKeysService,$state) {

//set up flags related to webservice
$scope.isPosting     = false;
$rootScope.netWorkError  = false;
$scope.responseData  = [];
$scope.reservationData = checkinDetailsService.getResponseData();
var url = '/guest_web/checkin.json';
var data = {'reservation_id':$rootScope.reservationID};
$rootScope.isCheckedin = true;
$scope.responseData =response.data;
$scope.responseData.delivery_message  = "Please conatct front desk";
};
var dependencies = [
'$scope','$rootScope','$http','$location','checkinDetailsService','checkinKeysService','$state',
checkInKeysController
];
sntGuestWeb.controller('checkInKeysController', dependencies);
})();

/*
Precheckin final Ctrl where the pre checkin API is called
*/
(function() {
  var preCheckinStatusController = function($scope, preCheckinSrv) {
    $scope.isLoading = false;
    $scope.responseData ={};
    $scope.responseData.confirmation_message = "Please go to front desk";
  };

  var dependencies = [
  '$scope',
  'preCheckinSrv',
  preCheckinStatusController
  ];
  sntGuestWeb.controller('preCheckinStatusController', dependencies);
})();
