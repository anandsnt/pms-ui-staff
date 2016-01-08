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
var sntGuestWebTemplates = angular.module('sntGuestWebTemplates',[]);
var sntGuestWeb = angular.module('sntGuestWeb',['ui.router','ui.bootstrap','pickadate', 'oc.lazyLoad']);
sntGuestWeb.controller('rootController', ['$state', '$scope', function($state, $scope){
	$state.go('guestwebRoot', {mode: 'checkout'});
}]);
sntGuestWeb.controller('homeController', ['$rootScope','$scope','$location','$state','$timeout', 'reservationAndhotelData',
 function($rootScope,$scope,$location,$state,$timeout, reservationAndhotelData) {
	var that = this;
	loadAssets('/assets/favicon.png', 'icon', 'image/png');
	loadAssets('/assets/apple-touch-icon-precomposed.png', 'apple-touch-icon-precomposed');
	loadAssets('/assets/apple-touch-startup-image-768x1004.png', 'apple-touch-startup-image', '' ,'(device-width: 768px) and (orientation: portrait)');
	loadAssets('/assets/apple-touch-startup-image-1024x748.png', 'apple-touch-startup-image', '' ,'(device-width: 768px) and (orientation: landscape)');
	loadAssets('/assets/apple-touch-startup-image-1536x2008.png', 'apple-touch-startup-image', '' ,'(device-width: 768px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)');
	loadAssets('/assets/apple-touch-startup-image-2048x1496.png', 'apple-touch-startup-image', '' ,'(device-width: 768px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 2)');

	//store basic details as rootscope variables

	$rootScope.hotelName     = reservationAndhotelData.hotelName;
 	$rootScope.currencySymbol= reservationAndhotelData.currencySymbol;
	$rootScope.hotelPhone    = reservationAndhotelData.hotelPhone;
	$rootScope.businessDate  = reservationAndhotelData.businessDate;
	$rootScope.mliMerchatId = reservationAndhotelData.mliMerchatId;
	$rootScope.dateFormatPlaceholder = reservationAndhotelData.dateFormatValue;
 	$rootScope.dateFormat = getDateFormat(reservationAndhotelData.dateFormatValue);
 	$rootScope.roomVerificationInstruction = reservationAndhotelData.roomVerificationInstruction;
 	$rootScope.isSixpayments = (reservationAndhotelData.paymentGateway  === "sixpayments") ? true:false;

 	$rootScope.reservationID = reservationAndhotelData.reservationId;
	$rootScope.userName      = reservationAndhotelData.userName;
	$rootScope.checkoutDate  = reservationAndhotelData.checkoutDate;
	$rootScope.checkoutTime  = reservationAndhotelData.checkoutTime;
	$rootScope.userCity   	 = reservationAndhotelData.city;
	$rootScope.userState     = reservationAndhotelData.state;
	$rootScope.roomNo        = reservationAndhotelData.roomNo;
	$rootScope.isLateCheckoutAvailable  = (reservationAndhotelData.isLateCheckoutAvailable  === 'true') ? true : false;
	$rootScope.emailAddress  = reservationAndhotelData.emailAddress;
	$rootScope.isCheckedout  = (reservationAndhotelData.isCheckedout === 'true') ? true : false;
	$rootScope.isCheckin     =   (reservationAndhotelData.isCheckin ==='true') ? true : false;
	$rootScope.reservationStatusCheckedIn = (reservationAndhotelData.reservationStatus ==='CHECKIN')? true :false;
    $rootScope.isActiveToken = (reservationAndhotelData.isActiveToken ==='true') ? true : false;
 	$rootScope.isCheckedin  =  ($rootScope.reservationStatusCheckedIn  && !$rootScope.isActiveToken);
 	$rootScope.isCCOnFile = (reservationAndhotelData.isCcAttached ==='true')? true:false;
 	$rootScope.isPreCheckedIn   = (reservationAndhotelData.isPreCheckedIn === 'true') ? true: false;
 	$rootScope.isRoomVerified =  false;
 	$rootScope.isPrecheckinOnly = (reservationAndhotelData.isPrecheckinOnly ==='true' && reservationAndhotelData.reservationStatus ==='RESERVED')?true:false;
 	$rootScope.isCcAttachedFromGuestWeb = false;
 	$rootScope.isAutoCheckinOn = ((reservationAndhotelData.isAutoCheckin === 'true') && (reservationAndhotelData.isPrecheckinOnly === 'true')) ? true :false;;
 	$rootScope.isExternalVerification = (reservationAndhotelData.isExternalVerification === "true") ? true :false;
 	$rootScope.hotelIdentifier = reservationAndhotelData.hotelIdentifier;
 	$rootScope.guestAddressOn = reservationAndhotelData.guestAddressOn === 'true' ? true:false;
 	$rootScope.isGuestAddressVerified =  false;

 	$rootScope.guestBirthdateOn = (reservationAndhotelData.birthdateOn === 'true') ? true :false;
 	$rootScope.guestBirthdateMandatory = (reservationAndhotelData.birthdateMandatory === 'true') ? true :false;
	$rootScope.guestPromptAddressOn = (reservationAndhotelData.promptForAddressOn === 'true') ? true :false;
	$rootScope.minimumAge = parseInt(reservationAndhotelData.minimumAge);
	$rootScope.primaryGuestId = reservationAndhotelData.primaryGuestId;


 	$rootScope.isGuestEmailURl =  (reservationAndhotelData.checkinUrlVerification === "true" && reservationAndhotelData.isZestCheckin ==="true") ?true:false;
 	$rootScope.zestEmailCheckinNoServiceMsg = reservationAndhotelData.zestCheckinNoServiceMsg;
 	$rootScope.termsAndConditions = reservationAndhotelData.termsAndConditions;
 	$rootScope.isBirthdayVerified =  false;

 	$rootScope.application        = reservationAndhotelData.application;
 	$rootScope.urlSuffix        = reservationAndhotelData.urlSuffix;
 	$rootScope.collectCCOnCheckin = (reservationAndhotelData.checkinCollectCc === "true") ? true:false;
 	$rootScope.isMLI = (reservationAndhotelData.paymentGateway  = "MLI") ? true : false;

 	//room key delivery options
 	$rootScope.preckinCompleted =  false;
 	$rootScope.userEmail = reservationAndhotelData.primaryGuestEmail;
 	$rootScope.keyDeliveryByEmail = true;
 	//$rootscope.keyDeliveryByText  = true;


    //Params for zest mobile and desktop screens
    if(reservationAndhotelData.hasOwnProperty('isPasswordReset')){
    	$rootScope.isPasswordResetView = reservationAndhotelData.isPasswordReset;
    	$rootScope.isTokenExpired = reservationAndhotelData.isTokenExpired === "true"? true: false;
    	$rootScope.accessToken = reservationAndhotelData.token;
    	$rootScope.user_id = reservationAndhotelData.id;
    	$rootScope.user_name = reservationAndhotelData.login;
    }

    //work around to fix flashing of logo before app loads
    $timeout(function() {
        $rootScope.hotelLogo     = reservationAndhotelData.hotelLogo;
    }, 750);

 	if(typeof reservationAndhotelData.accessToken !== "undefined") {
		$rootScope.accessToken = reservationAndhotelData.accessToken	;
	}
	//navigate to different pages

	if(reservationAndhotelData.checkinUrlVerification === "true" && reservationAndhotelData.isZestCheckin ==="false"){
		$location.path('/guestCheckinTurnedOff');
	}
	else if(reservationAndhotelData.checkinUrlVerification === "true"){
		$location.path('/externalCheckinVerification'); // external checkin URL available and is on
	}
	else if(reservationAndhotelData.isExternalVerification ==="true"){
		$location.path('/externalVerification'); //external checkout URL
	}
	else if(reservationAndhotelData.isPrecheckinOnly  ==='true' && reservationAndhotelData.reservationStatus ==='RESERVED' && !(reservationAndhotelData.isAutoCheckin === 'true')){
 		$location.path('/tripDetails');// only available for Fontainbleau -> precheckin + sent to que
 	}
 	else if	(reservationAndhotelData.isPrecheckinOnly  ==='true' && reservationAndhotelData.reservationStatus ==='RESERVED' && (reservationAndhotelData.isAutoCheckin === 'true')){
 		$location.path('/checkinConfirmation');//checkin starting -> page precheckin + auto checkin
 	}
 	else if($rootScope.isCheckedin){
 		$location.path('/checkinSuccess');//already checked in
 	}
    else if(reservationAndhotelData.isCheckin ==='true'){
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
         $state.go('checkoutRoomVerification'); // checkout landing page
	};

	$( ".loading-container" ).hide();
	/*
	 * function to handle exception when state is not found
	 */
	$scope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
		event.preventDefault();
		$state.go('noOptionAvailable'); 
	})

	$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      // Hide loading message
      console.error(error);
      //TODO: Log the error in proper way
    });
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








