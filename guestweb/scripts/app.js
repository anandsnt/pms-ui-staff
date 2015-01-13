
var snt = angular.module('snt',['ui.router','ui.bootstrap','pickadate']);

snt.controller('rootController', ['$rootScope','$scope','$attrs', '$location','$state', function($rootScope,$scope,$attrs,$location,$state) {

	//store basic details as rootscope variables

	$rootScope.reservationID = $attrs.reservationId;
	$rootScope.hotelName     = $attrs.hotelName;
	$rootScope.userName      = $attrs.userName;
	$rootScope.checkoutDate  = $attrs.checkoutDate;
	$rootScope.checkoutTime  = $attrs.checkoutTime;
	$rootScope.userCity   	 = $attrs.city;
	$rootScope.userState     = $attrs.state;
	$rootScope.roomNo        = $attrs.roomNo;
	$rootScope.isLateCheckoutAvailable  = ($attrs.isLateCheckoutAvailable  === 'true') ? true : false;
	$rootScope.emailAddress  = $attrs.emailAddress;
	$rootScope.hotelLogo     = $attrs.hotelLogo;
	$rootScope.currencySymbol= $attrs.currencySymbol;
	$rootScope.hotelPhone    = $attrs.hotelPhone;
	$rootScope.businessDate  = $attrs.businessDate;
	$rootScope.isCheckedout  = ($attrs.isCheckedout === 'true') ? true : false;
	$rootScope.isCheckin     =   ($attrs.isCheckin ==='true') ? true : false;
	$rootScope.reservationStatusCheckedIn = ($attrs.reservationStatus ==='CHECKIN')? true :false;
    $rootScope.isActiveToken = ($attrs.isActiveToken ==='true') ? true : false;
 	$rootScope.isCheckedin  =  ($rootScope.reservationStatusCheckedIn  && !$rootScope.isActiveToken);

 	$rootScope.isCCOnFile = ($attrs.isCcAttached ==='true')? true:false;
 	$rootScope.mliMerchatId = $attrs.mliMerchatId;
 	$rootScope.isRoomVerified =  false;
 	$rootScope.dateFormatPlaceholder = $attrs.dateFormatValue;
 	$rootScope.dateFormat = getDateFormat($attrs.dateFormatValue);
 	$rootScope.isPrecheckinOnly = ($attrs.isPrecheckinOnly ==='true' && $attrs.reservationStatus ==='RESERVED')?true:false;
 	$rootScope.roomVerificationInstruction = $attrs.roomVerificationInstruction;
 	$rootScope.isCcAttachedFromGuestWeb = false;
 	$rootScope.isSixpayments = ($attrs.paymentGateway  === "sixpayments") ? true:false;
 	// $rootScope.isPreCheckedIn   = ($attrs.isPreCheckedIn === 'true') ? true: false;
 	if($attrs.accessToken != "undefined")
		$rootScope.accessToken = $attrs.accessToken	;
	

	//navigate to different pages

	if($attrs.isPrecheckinOnly  ==='true' && $attrs.reservationStatus ==='RESERVED'){
 		$location.path('/tripDetails');
 	}	
 	else if($rootScope.isCheckedin){
 		$location.path('/checkinSuccess');
 	}
    else if($attrs.isCheckin ==='true'){
 		$location.path('/checkinConfirmation');
 	}
  	else if($rootScope.isCheckedout)	{
		$location.path('/checkOutStatus');	
	}
	else{
		$location.path('/checkoutRoomVerification');
	};

	//setTimeout(function() {
		$( ".loading-container" ).hide();

	//}, 500);
/*
	$( ".loading-container" ).slideUp( "slow", function() {
		console.log("animation complete");
	    // Animation complete.
	});
*/

}]);






