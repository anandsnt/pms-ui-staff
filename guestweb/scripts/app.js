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
sntGuestWeb.controller('rootController', ['$state', function($state){
	$state.go('guestwebRoot');
	console.log('start');
}]);
sntGuestWeb.controller('homeController', ['$rootScope','$scope','$location','$state','$timeout',
 function($rootScope,$scope,$location,$state,$timeout) {
 	console.log('home');
	var that = this;
	hotelData = {
					  "is_external_verification": "true",
					  "business_date": "2015-09-15",
					  "currency_symbol": "€",
					  "date_format": {
					    "id": 1,
					    "value": "DD-MM-YYYY"
					  },
					  "hotel_logo": "https://c9fb255204921bbf6f41-821329d308ba0768463def967ad6e6e5.ssl.cf2.rackcdn.com/THREE/GHLD/hotels/80/template_logos/original/template_logo20151124110214.png?1448384541",
					  "mli_merchat_id": "TESTSTAYNTOUCH01",
					  "room_verification_instruction": "If there are less than 4 digits, please add a 0 in front of the room number",
					  "payment_gateway": "MLI",
					  "hotel_identifier": "grand",
					  "hotel_phone": "123-123-1234",
					  "hotel_theme": "guestweb_row"
					}
	//load the style elements. Done to reduce the loading time of web page.

	loadStyleSheets('/assets/stylesheets/guestweb/' + hotelData.hotel_theme +'.css');
	loadAssets('/assets/favicon.png', 'icon', 'image/png');
	loadAssets('/assets/apple-touch-icon-precomposed.png', 'apple-touch-icon-precomposed');
	loadAssets('/assets/apple-touch-startup-image-768x1004.png', 'apple-touch-startup-image', '' ,'(device-width: 768px) and (orientation: portrait)');
	loadAssets('/assets/apple-touch-startup-image-1024x748.png', 'apple-touch-startup-image', '' ,'(device-width: 768px) and (orientation: landscape)');
	loadAssets('/assets/apple-touch-startup-image-1536x2008.png', 'apple-touch-startup-image', '' ,'(device-width: 768px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)');
	loadAssets('/assets/apple-touch-startup-image-2048x1496.png', 'apple-touch-startup-image', '' ,'(device-width: 768px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 2)');

	//store basic details as rootscope variables

	$rootScope.hotelName     = hotelData.hotelName;
 	$rootScope.currencySymbol= hotelData.currencySymbol;
	$rootScope.hotelPhone    = hotelData.hotelPhone;
	$rootScope.businessDate  = hotelData.businessDate;
	$rootScope.mliMerchatId = hotelData.mliMerchatId;
	$rootScope.dateFormatPlaceholder = hotelData.dateFormatValue;
 	$rootScope.dateFormat = getDateFormat(hotelData.dateFormatValue);
 	$rootScope.roomVerificationInstruction = hotelData.roomVerificationInstruction;
 	$rootScope.isSixpayments = (hotelData.paymentGateway  === "sixpayments") ? true:false;

 	$rootScope.reservationID = hotelData.reservationId;
	$rootScope.userName      = hotelData.userName;
	$rootScope.checkoutDate  = hotelData.checkoutDate;
	$rootScope.checkoutTime  = hotelData.checkoutTime;
	$rootScope.userCity   	 = hotelData.city;
	$rootScope.userState     = hotelData.state;
	$rootScope.roomNo        = hotelData.roomNo;
	$rootScope.isLateCheckoutAvailable  = (hotelData.isLateCheckoutAvailable  === 'true') ? true : false;
	$rootScope.emailAddress  = hotelData.emailAddress;
	$rootScope.isCheckedout  = (hotelData.isCheckedout === 'true') ? true : false;
	$rootScope.isCheckin     =   (hotelData.isCheckin ==='true') ? true : false;
	$rootScope.reservationStatusCheckedIn = (hotelData.reservationStatus ==='CHECKIN')? true :false;
    $rootScope.isActiveToken = (hotelData.isActiveToken ==='true') ? true : false;
 	$rootScope.isCheckedin  =  ($rootScope.reservationStatusCheckedIn  && !$rootScope.isActiveToken);
 	$rootScope.isCCOnFile = (hotelData.isCcAttached ==='true')? true:false;
 	$rootScope.isPreCheckedIn   = (hotelData.isPreCheckedIn === 'true') ? true: false;
 	$rootScope.isRoomVerified =  false;
 	$rootScope.isPrecheckinOnly = (hotelData.isPrecheckinOnly ==='true' && hotelData.reservationStatus ==='RESERVED')?true:false;
 	$rootScope.isCcAttachedFromGuestWeb = false;
 	$rootScope.isAutoCheckinOn = ((hotelData.isAutoCheckin === 'true') && (hotelData.isPrecheckinOnly === 'true')) ? true :false;;
 	$rootScope.isExternalVerification = (hotelData.isExternalVerification === "true") ? true :false;
 	$rootScope.hotelIdentifier = hotelData.hotelIdentifier;
 	$rootScope.guestAddressOn = hotelData.guestAddressOn === 'true' ? true:false;
 	$rootScope.isGuestAddressVerified =  false;

 	$rootScope.guestBirthdateOn = (hotelData.birthdateOn === 'true') ? true :false;
 	$rootScope.guestBirthdateMandatory = (hotelData.birthdateMandatory === 'true') ? true :false;
	$rootScope.guestPromptAddressOn = (hotelData.promptForAddressOn === 'true') ? true :false;
	$rootScope.minimumAge = parseInt(hotelData.minimumAge);
	$rootScope.primaryGuestId = hotelData.primaryGuestId;


 	$rootScope.isGuestEmailURl =  (hotelData.checkinUrlVerification === "true" && hotelData.isZestEmailCheckin ==="true") ?true:false;
 	$rootScope.zestEmailCheckinNoServiceMsg = hotelData.zestEmailCheckinNoServiceMsg;
 	$rootScope.termsAndConditions = hotelData.termsAndConditions;
 	$rootScope.isBirthdayVerified =  false;
 	$rootScope.application        = hotelData.application;
 	$rootScope.collectCCOnCheckin = (hotelData.checkinCollectCc === "true") ? true:false;
 	$rootScope.isMLI = (hotelData.paymentGateway  = "MLI") ? true : false;


    //Params for zest mobile and desktop screens
    if(hotelData.hasOwnProperty('isPasswordReset')){
    	$rootScope.isPasswordResetView = hotelData.isPasswordReset;
    	$rootScope.isTokenExpired = hotelData.isTokenExpired === "true"? true: false;
    	$rootScope.accessToken = hotelData.token;
    	$rootScope.user_id = hotelData.id;
    	$rootScope.user_name = hotelData.login;
    }

    //work around to fix flashing of logo before app loads
    $timeout(function() {
        $rootScope.hotelLogo     = hotelData.hotelLogo;
    }, 750);

 	if(typeof hotelData.accessToken !== "undefined") {
		$rootScope.accessToken = hotelData.accessToken	;
	}
	//navigate to different pages
	if(hotelData.checkinUrlVerification === "true" && hotelData.isZestEmailCheckin ==="false"){
		$location.path('/guestCheckinTurnedOff'); // external checkin URL available, but its turned off
	}
	else if(hotelData.checkinUrlVerification === "true"){
		$location.path('/externalCheckinVerification'); // external checkin URL available and is on
	}
	else if(hotelData.isExternalVerification ==="true"){
		$location.path('/externalVerification'); //external checkout URL
	}
	else if(hotelData.isPrecheckinOnly  ==='true' && hotelData.reservationStatus ==='RESERVED' && !(hotelData.isAutoCheckin === 'true')){
 		$location.path('/tripDetails');// only available for Fontainbleau -> precheckin + sent to que
 	}
 	else if	(hotelData.isPrecheckinOnly  ==='true' && hotelData.reservationStatus ==='RESERVED' && (hotelData.isAutoCheckin === 'true')){
 		$location.path('/checkinConfirmation');//checkin starting -> page precheckin + auto checkin
 	}
 	else if($rootScope.isCheckedin){
 		$location.path('/checkinSuccess');//already checked in
 	}
    else if(hotelData.isCheckin ==='true'){
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








