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
var sntGuestWeb = angular.module('sntGuestWeb', ['ui.router', 'ui.bootstrap', 'pickadate', 'oc.lazyLoad', 'sntIDCollection']);
sntGuestWeb.controller('rootController', ['$state', '$scope', function($state, $scope) {
	$state.go('guestwebRoot');
	/*
	 * function to handle exception when state is not found
	 */
	$scope.$on('$stateNotFound', function(event, unfoundState, fromState) {
		event.preventDefault();
		console.info("Hotel admin settings are wrong. This feature is not available for this theme. Please check the settings related to -> " + unfoundState.to);
		$state.go('noOptionAvailable');
	});
}]);
sntGuestWeb.controller('homeController', ['$rootScope', '$scope', '$location', '$state', '$timeout', 'reservationAndhotelData', '$window', 'checkinDetailsService', 'sntIDCollectionSrv', 'sntIDCollectionUtilsSrv',
	function($rootScope, $scope, $location, $state, $timeout, reservationAndhotelData, $window, checkinDetailsService, sntIDCollectionSrv, sntIDCollectionUtilsSrv) {

		loadAssets('/assets/favicon.png', 'icon', 'image/png');
		loadAssets('/assets/apple-touch-icon-precomposed.png', 'apple-touch-icon-precomposed');
		loadAssets('/assets/apple-touch-startup-image-768x1004.png', 'apple-touch-startup-image', '', '(device-width: 768px) and (orientation: portrait)');
		loadAssets('/assets/apple-touch-startup-image-1024x748.png', 'apple-touch-startup-image', '', '(device-width: 768px) and (orientation: landscape)');
		loadAssets('/assets/apple-touch-startup-image-1536x2008.png', 'apple-touch-startup-image', '', '(device-width: 768px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)');
		loadAssets('/assets/apple-touch-startup-image-2048x1496.png', 'apple-touch-startup-image', '', '(device-width: 768px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 2)');

		// the below tracking ID is SNT Tracking IDs - ZEST WEB in hotel admin
		$rootScope.trackingID = reservationAndhotelData.google_analytics_tracking_id;
		// initialise google analytics
		if ($rootScope.trackingID && $rootScope.trackingID.length > 0) {
			$window.ga('create', $rootScope.trackingID, 'auto');
			$window.ga('set', 'anonymizeIp', true);
		}
		
		// store basic details as rootscope variables
		if (typeof reservationAndhotelData.access_token !== "undefined") {
			$rootScope.accessToken = reservationAndhotelData.access_token;
		}
		$rootScope.hotelName = reservationAndhotelData.hotel_name;
		$rootScope.currencySymbol = reservationAndhotelData.currency_symbol;
		$rootScope.hotelPhone = reservationAndhotelData.hotel_phone;
		$rootScope.businessDate = reservationAndhotelData.business_date;
		$rootScope.mliMerchatId = reservationAndhotelData.mli_merchat_id;
		$rootScope.roomVerificationInstruction = reservationAndhotelData.room_verification_instruction;
		$rootScope.isSixpayments = (reservationAndhotelData.payment_gateway === "sixpayments");
		$rootScope.reservationID = reservationAndhotelData.reservation_id;
		$rootScope.userName = reservationAndhotelData.user_name;
		$rootScope.checkoutDate = reservationAndhotelData.checkout_date;
		$rootScope.checkoutTime = reservationAndhotelData.checkout_time;
		$rootScope.userCity = reservationAndhotelData.city;
		$rootScope.userState = reservationAndhotelData.state;
		$rootScope.roomNo = reservationAndhotelData.room_no;
		$rootScope.isLateCheckoutAvailable = (reservationAndhotelData.is_late_checkout_available === "true");
		$rootScope.emailAddress = reservationAndhotelData.primary_guest_email;
		$rootScope.isCheckedout = (reservationAndhotelData.is_checkedout === 'true');
		$rootScope.isCheckin = (reservationAndhotelData.is_checkin === 'true');
		$rootScope.reservationStatusCheckedIn = (reservationAndhotelData.reservation_status === 'CHECKIN');
		$rootScope.isActiveToken = (reservationAndhotelData.is_active_token === "true");
		$rootScope.isCheckedin = (($rootScope.reservationStatusCheckedIn && !$rootScope.isActiveToken) || reservationAndhotelData.is_checked_in);
		$rootScope.isCCOnFile = (reservationAndhotelData.is_cc_attached === "true");
		$rootScope.isPreCheckedIn = (reservationAndhotelData.is_pre_checked_in === 'true');
		$rootScope.isRoomVerified = false;
		$rootScope.isPrecheckinOnly = (reservationAndhotelData.is_precheckin_only === 'true' && reservationAndhotelData.reservation_status === 'RESERVED') ? true : false;
		$rootScope.isCcAttachedFromGuestWeb = false;
		$rootScope.isAutoCheckinOn = ((reservationAndhotelData.is_auto_checkin === 'true') && (reservationAndhotelData.is_precheckin_only === 'true')) ? true : false;
		$rootScope.isExternalVerification = (reservationAndhotelData.is_external_verification === "true");
		$rootScope.hotelIdentifier = reservationAndhotelData.hotel_identifier;
		$rootScope.guestAddressOn = reservationAndhotelData.guest_address_on === 'true';
		$rootScope.isGuestAddressVerified = false;

		$rootScope.guestBirthdateOn = (reservationAndhotelData.birthdate_on === 'true');
		$rootScope.guestBirthdateMandatory = (reservationAndhotelData.birthdate_mandatory === 'true');
		$rootScope.guestPromptAddressOn = (reservationAndhotelData.prompt_for_address_on === 'true');
		$rootScope.minimumAge = parseInt(reservationAndhotelData.minimum_age);
		$rootScope.primaryGuestId = reservationAndhotelData.primary_guest_id;


		$rootScope.isGuestEmailURl = (reservationAndhotelData.checkin_url_verification === "true" && reservationAndhotelData.is_zest_checkin === "true") ? true : false;
		$rootScope.zestCheckinNoServiceMsg = reservationAndhotelData.zest_checkin_no_service_msg;
		$rootScope.termsAndConditions = reservationAndhotelData.terms_and_conditions;
		$rootScope.isBirthdayVerified = false;

		$rootScope.application = reservationAndhotelData.application;
		$rootScope.urlSuffix = reservationAndhotelData.url_suffix;
		$rootScope.collectCCOnCheckin = (reservationAndhotelData.checkin_collect_cc === "true");
		$rootScope.isMLI = (reservationAndhotelData.payment_gateway === "MLI");

		//room key delivery options
		$rootScope.preckinCompleted = false;
		$rootScope.userEmail = reservationAndhotelData.primary_guest_email;
		$rootScope.userMobile = reservationAndhotelData.primary_guest_mobile;
		$rootScope.keyDeliveryByEmail = true;
		$rootScope.restrictByHotelTimeisOn = reservationAndhotelData.eta_enforcement;
		$rootScope.checkinOptionShown = false;
		$rootScope.userEmailEntered = false;
		// $rootscope.keyDeliveryByText  = true;

		$rootScope.offerRoomDeliveryOptions = (reservationAndhotelData.offer_room_delivery_options === "true");
		$rootScope.enforceDeposit = !!reservationAndhotelData.zestweb_enforce_deposit ? true : false;
		$rootScope.isExternalCheckin = (reservationAndhotelData.checkin_url_verification === "true" && reservationAndhotelData.is_zest_checkin !== "false");
		$rootScope.skipDeposit = false;

		$rootScope.enforceCountrySort = !!reservationAndhotelData.enforce_country_sort ? true : false;
		$rootScope.promptForKeyCount = !!reservationAndhotelData.key_prompt_on ? true : false;
		$rootScope.KeyCountAttemptedToSave = false;

		$rootScope.collectOutStandingBalance = !!reservationAndhotelData.zestweb_collect_outstanding_balance ? true : false;
		$rootScope.skipBalanceCollection = false;

		$rootScope.id_collection_enabled = reservationAndhotelData.id_collection_enabled;
		$rootScope.scan_all_guests = reservationAndhotelData.scan_all_guests;
		$rootScope.id_collection_mandatory = reservationAndhotelData.id_collection_mandatory;
		$rootScope.face_recognition_enabled = reservationAndhotelData.face_recognition_enabled;


		if (reservationAndhotelData.payment_gateway === "MLI") {
			var script = document.createElement("script")

			script.type = "text/javascript";
			script.src = 'https://cnp.merchantlink.com/form/v2.1/hpf.js';
			document.getElementsByTagName("head")[0].appendChild(script);
		}

		// This is used for greatwolf only
		if (!_.isUndefined(reservationAndhotelData.zestweb_cc_authorization_amount) && reservationAndhotelData.zestweb_cc_authorization_amount.length > 0){
			$rootScope.ccAuthorizationAmount = reservationAndhotelData.zestweb_cc_authorization_amount;
		} else {
			$rootScope.ccAuthorizationAmount = reservationAndhotelData.hotel_theme === 'guestweb_ihg' ? '40' : '50';
		}


		$rootScope.conductSurvey = !!reservationAndhotelData.survey_question_prompt_on ? true : false;
		$rootScope.skipBalanceconductSurvey = false;
		// we will be showing the departure date as a verification option in external URL landing based
		// on admin settings
		$rootScope.showDepartureDateForExtUrl = (reservationAndhotelData.checkin_auth_actions === 'conf_num_and_depart_date');

		// for some hotels, we may need to ask for mobile number even if using hotel triggered email
		$rootScope.alwaysAskForMobileNumber = _.isUndefined(reservationAndhotelData.always_ask_for_mobile_number) ? false : reservationAndhotelData.always_ask_for_mobile_number;

		// Footer Settings
		$rootScope.footerSettings = reservationAndhotelData.zest_web_footer_settings;

		$rootScope.hotelCheckinTime = reservationAndhotelData.hotel_checkin_time;

		if (!sntIDCollectionSrv.isInDevEnv) {
			sntIDCollectionSrv.setAcuantCredentialsForProduction(reservationAndhotelData.acuant_credentials);
		}

		// Marketting apps
		$rootScope.mobileMarketingOn = reservationAndhotelData.zest_web_checkin_details_about_mobile_app;
		$rootScope.mobileAppText = reservationAndhotelData.zest_web_checkin_mobile_app_call_to_action;
		$rootScope.apps = {
			app_store : {
				available: reservationAndhotelData.zest_web_include_app_store_banner,
				url: reservationAndhotelData.ios_app_url,
				img: reservationAndhotelData.ios_app_banner_image
			},
			play_store : {
				available: reservationAndhotelData.zest_web_include_google_play_banner,
				url: reservationAndhotelData.android_app_url,
				img: reservationAndhotelData.android_app_banner_image
			}
		};

		$rootScope.isAddonUpsellActive = reservationAndhotelData.addon_upsell_availability;
		$rootScope.upsellDisplayOrderAmountFirst =  (reservationAndhotelData.addon_upsell_display_order === 'amount_then_post_type'); 

		$rootScope.sellLcoAsAddons = reservationAndhotelData.is_sell_late_checkout_as_addon;
		
		if (!!$rootScope.footerSettings.display_footer) {
			// active footer count
			var footerCount = _.filter($rootScope.footerSettings.footers, function(footer) {
				return footer.is_active;
			}).length;
			// set zestweb footer color based on admin settings
			applyFooterStyle($rootScope.footerSettings.footer_color); //utils function
			// based upon number of footer items, set a class for styling
			$rootScope.footerClass = returnFooterStyleClass(footerCount);
			// to avoid flickering effect we hides the footer initially using CSS
			$("#zest-footer").show();
		} else {
			// if no footer is set
			$rootScope.footerSettings.display_footer = false;
		}

		// Params for zest mobile and desktop screens
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

		// work around to fix flashing of logo before app loads
		$timeout(function() {
			$rootScope.hotelLogo = reservationAndhotelData.hotel_logo;
		}, 750);

		var checkinNowisAvailable = function() {
			return ((reservationAndhotelData.zest_email_allow_checkin_now && reservationAndhotelData.application === "EMAIL") ||
				(reservationAndhotelData.zest_sms_allow_checkin_now && reservationAndhotelData.application === "SMS"));
		};

		$rootScope.is_checkin_now_on = checkinNowisAvailable();
		$rootScope.checkin_now_text =
			(reservationAndhotelData.zest_checkin_now_text !== null && typeof reservationAndhotelData.zest_checkin_now_text !== "undefined" && reservationAndhotelData.zest_checkin_now_text.length > 0) ? reservationAndhotelData.zest_checkin_now_text : "I'm Already Here";
		$rootScope.checkin_later_text =
			(reservationAndhotelData.zest_checkin_later_text !== null && typeof reservationAndhotelData.zest_checkin_later_text !== "undefined" && reservationAndhotelData.zest_checkin_later_text.length > 0) ? reservationAndhotelData.zest_checkin_later_text : "Arriving Later";


		if (reservationAndhotelData.is_sent_to_que === 'true' && !!reservationAndhotelData.zest_web_use_new_sent_to_que_action) {
			// even though this is sent to que, the  flag name in 
			// next screens are isAutoCheckinOn. So setting that as true
			$rootScope.isAutoCheckinOn = true;
		}


		//check if we are using new send to que settings.
		$rootScope.bypassCheckinVerification = (reservationAndhotelData.is_sent_to_que === 'true' && !!reservationAndhotelData.zest_web_use_new_sent_to_que_action);

		var absUrl = $location.$$absUrl;
		var isInvokedFromApp = absUrl.indexOf("/guest_web/") !== -1 && absUrl.indexOf("/checkin?guest_web_token=") !== -1;
		var theme = reservationAndhotelData.hotel_theme;

		var isIDScanOnAndDeviceIsNotMobile = function(){
			return $state.href('sntIDScan') !== null &&
				   $state.href('sntIDScanUseMobile') &&
				   $rootScope.id_collection_enabled &&
				   $rootScope.id_collection_mandatory &&
				   !sntIDCollectionUtilsSrv.isInMobile();
		};

		var navigatePageBasedOnUrlAndType = function() {
			// If zestweb is loaded inside  mobile App in webview
			// customize style - like hide header and footer and other styles
			if (isInvokedFromApp && reservationAndhotelData.skip_checkin_verification && reservationAndhotelData.reservation_details) {
				checkinDetailsService.setResponseData(reservationAndhotelData.reservation_details);
				$rootScope.upgradesAvailable = (reservationAndhotelData.reservation_details.is_upgrades_available === "true") ? true : false;
				$rootScope.isUpgradeAvailableNow = reservationAndhotelData.reservation_details.is_upsell_available_now;
				$rootScope.outStandingBalance = reservationAndhotelData.reservation_details.outstanding_balance;
				$rootScope.payment_method_used = reservationAndhotelData.reservation_details.payment_method_used;
				$rootScope.paymentDetails = reservationAndhotelData.reservation_details.payment_details;

				if (isIDScanOnAndDeviceIsNotMobile()) {
					$state.go('sntIDScanUseMobile', {
						is_external_verification: false,
						skip_checkin_verification: true
					});
				} else {
					// navigate to next page
					$state.go('checkinReservationDetails');
				}
				customizeStylesBasedOnUrlType(theme);
			} else {
				if (isIDScanOnAndDeviceIsNotMobile()) {
					$state.go('sntIDScanUseMobile', {
						is_external_verification: false,
						skip_checkin_verification: false
					});
				} else {
					$state.go('checkinConfirmation'); //checkin starting -> page precheckin + auto checkin
				}
			}
		};

		$scope.navigateToNextscreen = function() {
			$rootscope.skipIDScan = true;
			if(reservationAndhotelData.checkin_url_verification === "true"){
				$state.go('externalCheckinVerification');
			} else {
				navigatePageBasedOnUrlAndType();
			}
		};

		if (typeof reservationAndhotelData.accessToken !== "undefined") {
			$rootScope.accessToken = reservationAndhotelData.accessToken;
		}
		//navigate to different pages
		if (reservationAndhotelData.checkin_url_verification === "true" && reservationAndhotelData.is_zest_checkin === "false") {
			$state.go('guestCheckinTurnedOff');
		} else if (reservationAndhotelData.checkin_url_verification === "true") {
			if (isIDScanOnAndDeviceIsNotMobile()) {
				$state.go('sntIDScanUseMobile', {
					is_external_verification: true
				});
			} else {
				$state.go('externalCheckinVerification'); // external checkin URL available and is on
			}
		} else if (reservationAndhotelData.is_external_verification === "true") {
			$state.go('externalVerification'); //external checkout URL
		} else if (reservationAndhotelData.is_precheckin_only === 'true' && reservationAndhotelData.reservation_status === 'RESERVED' && (reservationAndhotelData.is_auto_checkin === 'true' || (reservationAndhotelData.is_sent_to_que === 'true' && !!reservationAndhotelData.zest_web_use_new_sent_to_que_action))) {
			navigatePageBasedOnUrlAndType();
		} else if (reservationAndhotelData.is_precheckin_only === 'true' && reservationAndhotelData.reservation_status === 'RESERVED' && (reservationAndhotelData.is_sent_to_que === 'true')) {
			$state.go('preCheckinTripDetails'); // only available for Fontainbleau -> precheckin + sent to que
		} else if ($rootScope.isCheckedin) {
			if (isInvokedFromApp && reservationAndhotelData.skip_checkin_verification) {
				customizeStylesBasedOnUrlTyppe();
			}
			$state.go('checkinSuccess'); //already checked in
		} else if (reservationAndhotelData.is_checkin === 'true') {
			navigatePageBasedOnUrlAndType(); //checkin starting page -> precheckin turned off
		} else if ($rootScope.isCheckedout) {
			$state.go('checkOutStatus'); //already checked out
		} else if ($rootScope.hasOwnProperty('isPasswordResetView')) {
			var path = $rootScope.isPasswordResetView === 'true' ? 'resetPassword' : 'emailVerification';
			$state.go(path);
		} else {
			if (reservationAndhotelData.error_occured) {
				$state.go('errorOccured');
			} else {
				if (isInvokedFromApp) {
					customizeStylesBasedOnUrlType(theme);
				}
				$state.go('checkoutRoomVerification');
			}
		}

		$(".loading-container").hide();
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