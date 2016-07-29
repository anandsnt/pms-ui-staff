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
var sntGuestWebTemplates = angular.module('sntGuestWebTemplates', []);
var sntGuestWeb = angular.module('sntGuestWeb', ['ui.router', 'ui.bootstrap', 'pickadate', 'oc.lazyLoad']);
sntGuestWeb.controller('rootController', ['$state', '$scope', function($state, $scope) {
	$state.go('guestwebRoot');
	/*
	 * function to handle exception when state is not found
	 */
	$scope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
		event.preventDefault();
		console.info("Hotel admin settings are wrong. This feature is not available for this theme. Please check the settings related to -> "+unfoundState.to);
		$state.go('noOptionAvailable');
	})
}]);
sntGuestWeb.controller('homeController', ['$rootScope', '$scope', '$location', '$state', '$timeout', 'reservationAndhotelData', '$window',
	function($rootScope, $scope, $location, $state, $timeout, reservationAndhotelData, $window) {

		var that = this;
		loadAssets('/assets/favicon.png', 'icon', 'image/png');
		loadAssets('/assets/apple-touch-icon-precomposed.png', 'apple-touch-icon-precomposed');
		loadAssets('/assets/apple-touch-startup-image-768x1004.png', 'apple-touch-startup-image', '', '(device-width: 768px) and (orientation: portrait)');
		loadAssets('/assets/apple-touch-startup-image-1024x748.png', 'apple-touch-startup-image', '', '(device-width: 768px) and (orientation: landscape)');
		loadAssets('/assets/apple-touch-startup-image-1536x2008.png', 'apple-touch-startup-image', '', '(device-width: 768px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)');
		loadAssets('/assets/apple-touch-startup-image-2048x1496.png', 'apple-touch-startup-image', '', '(device-width: 768px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 2)');

		var trackinID = reservationAndhotelData.google_analytics_tracking_id;
		// initialise google analytics
		$window.ga('create', trackinID, 'auto');
		//store basic details as rootscope variables
		if (typeof reservationAndhotelData.access_token !== "undefined") {
			$rootScope.accessToken = reservationAndhotelData.access_token;
		}
		$rootScope.hotelName = reservationAndhotelData.hotel_name;
		$rootScope.currencySymbol = reservationAndhotelData.currency_symbol;
		$rootScope.hotelPhone = reservationAndhotelData.hotel_phone;
		$rootScope.businessDate = reservationAndhotelData.business_date;
		$rootScope.mliMerchatId = reservationAndhotelData.mli_merchat_id;
		$rootScope.roomVerificationInstruction = reservationAndhotelData.room_verification_instruction;
		$rootScope.isSixpayments = (reservationAndhotelData.payment_gateway === "sixpayments") ? true : false;
		$rootScope.reservationID = reservationAndhotelData.reservation_id;
		$rootScope.userName = reservationAndhotelData.user_name;
		$rootScope.checkoutDate = reservationAndhotelData.checkout_date;
		$rootScope.checkoutTime = reservationAndhotelData.checkout_time;
		$rootScope.userCity = reservationAndhotelData.city;
		$rootScope.userState = reservationAndhotelData.state;
		$rootScope.roomNo = reservationAndhotelData.room_no;
		$rootScope.isLateCheckoutAvailable = (reservationAndhotelData.is_late_checkout_available === "true") ? true : false;
		$rootScope.emailAddress = reservationAndhotelData.primary_guest_email;
		$rootScope.isCheckedout = (reservationAndhotelData.is_checkedout === 'true') ? true : false;
		$rootScope.isCheckin = (reservationAndhotelData.is_checkin === 'true') ? true : false;
		$rootScope.reservationStatusCheckedIn = (reservationAndhotelData.reservation_status === 'CHECKIN') ? true : false;
		$rootScope.isActiveToken = (reservationAndhotelData.is_active_token === "true") ? true : false;
		$rootScope.isCheckedin = (($rootScope.reservationStatusCheckedIn && !$rootScope.isActiveToken) || reservationAndhotelData.is_checked_in);
		$rootScope.isCCOnFile = (reservationAndhotelData.is_cc_attached === "true") ? true : false;
		$rootScope.isPreCheckedIn = (reservationAndhotelData.is_pre_checked_in === 'true') ? true : false;
		$rootScope.isRoomVerified = false;
		$rootScope.isPrecheckinOnly = (reservationAndhotelData.is_precheckin_only === 'true' && reservationAndhotelData.reservation_status === 'RESERVED') ? true : false;
		$rootScope.isCcAttachedFromGuestWeb = false;
		$rootScope.isAutoCheckinOn = ((reservationAndhotelData.is_auto_checkin === 'true') && (reservationAndhotelData.is_precheckin_only === 'true')) ? true : false;;
		$rootScope.isExternalVerification = (reservationAndhotelData.is_external_verification === "true") ? true : false;
		$rootScope.hotelIdentifier = reservationAndhotelData.hotel_identifier;
		$rootScope.guestAddressOn = reservationAndhotelData.guest_address_on === 'true' ? true : false;
		$rootScope.isGuestAddressVerified = false;

		$rootScope.guestBirthdateOn = (reservationAndhotelData.birthdate_on === 'true') ? true : false;
		$rootScope.guestBirthdateMandatory = (reservationAndhotelData.birthdate_mandatory === 'true') ? true : false;
		$rootScope.guestPromptAddressOn = (reservationAndhotelData.prompt_for_address_on === 'true') ? true : false;
		$rootScope.minimumAge = parseInt(reservationAndhotelData.minimum_age);
		$rootScope.primaryGuestId = reservationAndhotelData.primary_guest_id;


		$rootScope.isGuestEmailURl = (reservationAndhotelData.checkin_url_verification === "true" && reservationAndhotelData.is_zest_checkin === "true") ? true : false;
		$rootScope.zestCheckinNoServiceMsg = reservationAndhotelData.zest_checkin_no_service_msg;
		$rootScope.termsAndConditions = reservationAndhotelData.terms_and_conditions;
		$rootScope.isBirthdayVerified = false;

		$rootScope.application = reservationAndhotelData.application;
		$rootScope.urlSuffix = reservationAndhotelData.url_suffix;
		$rootScope.collectCCOnCheckin = (reservationAndhotelData.checkin_collect_cc === "true") ? true : false;
		$rootScope.isMLI = (reservationAndhotelData.payment_gateway === "MLI") ? true : false;

		//room key delivery options
		$rootScope.preckinCompleted = false;
		$rootScope.userEmail = reservationAndhotelData.primary_guest_email;
		$rootScope.userMobile = reservationAndhotelData.primary_guest_mobile;
		$rootScope.keyDeliveryByEmail = true;
		$rootScope.restrictByHotelTimeisOn = reservationAndhotelData.eta_enforcement;
		$rootScope.checkinOptionShown = false;
		$rootScope.userEmailEntered = false;
		//$rootscope.keyDeliveryByText  = true;

		$rootScope.offerRoomDeliveryOptions = (reservationAndhotelData.offer_room_delivery_options === "true") ? true : false;
		$rootScope.enforceDeposit = !!reservationAndhotelData.zestweb_enforce_deposit ? true : false;
		$rootScope.isExternalCheckin = (reservationAndhotelData.checkin_url_verification === "true" && reservationAndhotelData.is_zest_checkin !== "false");
		$rootScope.skipDeposit = false;

		$rootScope.enforceCountrySort = !!reservationAndhotelData.enforce_country_sort ? true : false;
		$rootScope.promptForKeyCount = !!reservationAndhotelData.key_prompt_on ? true : false;
		$rootScope.KeyCountAttemptedToSave = false;

		$rootScope.collectOutStandingBalance = !!reservationAndhotelData.zestweb_collect_outstanding_balance ? true : false;
		$rootScope.skipBalanceCollection = false;


		//TODO: to follow hotel settings
		$rootScope.conductSurvey =  !!reservationAndhotelData.survey_question_prompt_on ? true : false;
		$rootScope.skipBalanceconductSurvey = false;

		//Params for zest mobile and desktop screens
		if (reservationAndhotelData.hasOwnProperty('is_password_reset')) {
			$rootScope.isPasswordResetView = reservationAndhotelData.is_password_reset;
			$rootScope.isTokenExpired = reservationAndhotelData.is_token_expired === "true";
			$rootScope.accessToken = reservationAndhotelData.token;
			$rootScope.user_id = reservationAndhotelData.id;
			$rootScope.user_name = reservationAndhotelData.login;
		} else {
			$rootScope.dateFormatPlaceholder = !!reservationAndhotelData.date_format ? reservationAndhotelData.date_format.value : "";
			$rootScope.dateFormat = !!reservationAndhotelData.date_format ? getDateFormat(reservationAndhotelData.date_format.value) : "";
		}

		//work around to fix flashing of logo before app loads
		$timeout(function() {
			$rootScope.hotelLogo = reservationAndhotelData.hotel_logo;
		}, 750);

		var checkinNowisAvailable = function() {
			return ((reservationAndhotelData.zest_email_allow_checkin_now && reservationAndhotelData.application === "EMAIL") ||
				(reservationAndhotelData.zest_sms_allow_checkin_now && reservationAndhotelData.application === "SMS"));
		};

		$rootScope.is_checkin_now_on = checkinNowisAvailable();
		$rootScope.checkin_now_text = 
		(reservationAndhotelData.zest_checkin_now_text !== null && typeof reservationAndhotelData.zest_checkin_now_text !== "undefined" && reservationAndhotelData.zest_checkin_now_text.length>0) ? reservationAndhotelData.zest_checkin_now_text : "I'm Already Here";
		$rootScope.checkin_later_text = 
		(reservationAndhotelData.zest_checkin_later_text !== null && typeof reservationAndhotelData.zest_checkin_later_text !== "undefined" && reservationAndhotelData.zest_checkin_later_text.length>0) ? reservationAndhotelData.zest_checkin_later_text :"Arriving Later";

		if (typeof reservationAndhotelData.accessToken !== "undefined") {
			$rootScope.accessToken = reservationAndhotelData.accessToken;
		}
		//navigate to different pages
		if (reservationAndhotelData.checkin_url_verification === "true" && reservationAndhotelData.is_zest_checkin === "false") {
			$state.go('guestCheckinTurnedOff');
		} else if (reservationAndhotelData.checkin_url_verification === "true") {
			$state.go('externalCheckinVerification'); // external checkin URL available and is on
		} else if (reservationAndhotelData.is_external_verification === "true") {
			$state.go('externalVerification'); //external checkout URL
		} else if (reservationAndhotelData.is_precheckin_only === 'true' && reservationAndhotelData.reservation_status === 'RESERVED' && !(reservationAndhotelData.is_auto_checkin === 'true')) {
			$state.go('preCheckinTripDetails'); // only available for Fontainbleau -> precheckin + sent to que
		} else if (reservationAndhotelData.is_precheckin_only === 'true' && reservationAndhotelData.reservation_status === 'RESERVED' && (reservationAndhotelData.is_auto_checkin === 'true')) {
			$state.go('checkinConfirmation'); //checkin starting -> page precheckin + auto checkin
		} else if ($rootScope.isCheckedin) {
			$state.go('checkinSuccess'); //already checked in
		} else if (reservationAndhotelData.is_checkin === 'true') {
			$state.go('checkinConfirmation'); //checkin starting page -> precheckin turned off
		} else if ($rootScope.isCheckedout) {
			$state.go('checkOutStatus'); //already checked out
		} else if ($rootScope.hasOwnProperty('isPasswordResetView')) {
			var path = $rootScope.isPasswordResetView === 'true' ? 'resetPassword' : 'emailVerification';
			$state.go(path);
		} else {
			!reservationAndhotelData.error_occured ? $state.go('checkoutRoomVerification') : $state.go('errorOccured'); // checkout landing page
		};

		$(".loading-container").hide();

		$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
			// Hide loading message
			// console.log(toState, toParams, fromState, fromParams, error)
			console.error(error);
			$state.go('noOptionAvailable');
			//TODO: Log the error in proper way
		});
	}
]);


var loadAssets = function(filename, rel, type, media) {
	var fileref = document.createElement("link");
	fileref.setAttribute("rel", rel);
	fileref.setAttribute("href", filename);
	if (type !== '') {
		fileref.setAttribute("type", type);
	}
	if (media !== '') {
		fileref.setAttribute("media", media);
	}
	document.getElementsByTagName('head')[0].appendChild(fileref);
};