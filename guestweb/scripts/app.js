/*

There are different ways to invoke guest web. 

User can send mail from hotel admin or use direct URL for checkin and checkout. 

But the options available for different hotels are different. 
So make sure the hotel admin settings for checkin and checkout are turned on or off w.r.t . 
You can see all the available options for a hotel in the router file for the corresponding hotel. 
If because of some settings, if user tries to go to a state not listed in the app router (eg:app_router_yotel.js)
for the hotel ,the user will be redirected to no options page.

The initial condtions to determine the status of reseravations are extracted from the embedded data in the HTML.


Initially we had a set of HTMLs for every single hotel.

Now we are trying to minimize the difference to use the same templates as much possible.

The new set of HTMLs can be found under the folder common_templates. inside that we have generic templates
and some folder dedicated to MGM, which has some text changes specifically asked by client.

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
	$rootScope.userCity   	 = $attrs.city;
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

 	$rootScope.guestBirthdateOn = ($attrs.birthdateOn === 'true') ? true :false;
 	$rootScope.guestBirthdateMandatory = ($attrs.birthdateMandatory === 'true') ? true :false;
	$rootScope.guestPromptAddressOn = ($attrs.promptForAddressOn === 'true') ? true :false;
	$rootScope.minimumAge = parseInt($attrs.minimumAge);
	$rootScope.primaryGuestId = $attrs.primaryGuestId;


 	$rootScope.isGuestEmailURl =  ($attrs.checkinUrlVerification === "true" && $attrs.isZestEmailCheckin ==="true") ?true:false;
 	$rootScope.zestEmailCheckinNoServiceMsg = $attrs.zestEmailCheckinNoServiceMsg;
 	$rootScope.termsAndConditions = $attrs.termsAndConditions;
 	$rootScope.isBirthdayVerified =  false;
 	$rootScope.application        = $attrs.application;
 	$rootScope.collectCCOnCheckin = ($attrs.checkinCollectCc === "true") ? true:false;
 	$rootScope.isMLI = ($attrs.paymentGateway  = "MLI") ? true : false;
 	//room key delivery options
 	$rootScope.preckinCompleted =  false;
 	$rootScope.userEmail = $attrs.primaryGuestEmail;
 	$rootScope.keyDeliveryByEmail = true;
 	//$rootscope.keyDeliveryByText  = true;


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
		$rootScope.accessToken = $attrs.accessToken	;
	}
	//navigate to different pages
	if($attrs.checkinUrlVerification === "true" && $attrs.isZestEmailCheckin ==="false"){
		$location.path('/guestCheckinTurnedOff'); // external checkin URL available, but its turned off
	}
	else if($attrs.checkinUrlVerification === "true"){
		$location.path('/externalCheckinVerification'); // external checkin URL available and is on
	}
	else if($attrs.isExternalVerification ==="true"){
		$location.path('/externalVerification'); //external checkout URL
	}
	else if($attrs.isPrecheckinOnly  ==='true' && $attrs.reservationStatus ==='RESERVED' && !($attrs.isAutoCheckin === 'true')){
 		$location.path('/tripDetails');// only available for Fontainbleau -> precheckin + sent to que
 	}
 	else if	($attrs.isPrecheckinOnly  ==='true' && $attrs.reservationStatus ==='RESERVED' && ($attrs.isAutoCheckin === 'true')){
 		$location.path('/checkinConfirmation');//checkin starting -> page precheckin + auto checkin
 	}
 	else if($rootScope.isCheckedin){
 		$location.path('/checkinSuccess');//already checked in
 	}
    else if($attrs.isCheckin ==='true'){
 		$location.path('/checkinConfirmation');//checkin starting page -> precheckin turned off
 	}
  	else if($rootScope.isCheckedout)	{
		$location.path('/checkOutStatus');//already checked out
	}
	else if($rootScope.hasOwnProperty('isPasswordResetView')){
		var path = $rootScope.isPasswordResetView === 'true'? '/resetPassword' : '/emailVerification';
		$location.path(path);
		$location.replace();
	}else{
         $location.path('/checkoutRoomVerification'); // checkout landing page
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








