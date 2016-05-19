	sntGuestWeb.service('GwWebSrv', ['$q', '$http', 'GwScreenMappingSrv', '$rootScope',
		function($q, $http, GwScreenMappingSrv, $rootScope) {


			this.zestwebData = {};
			this.cms_screen_details = [];
			var that = this;

			var fetchScreenWiseData = function(hotel_identifier) {
				var deferred = $q.defer();
				var url = '/api/hotels/custom_cms_messages.json?application=ZEST_WEB&hotel_identifier=' + hotel_identifier;
				$http.get(url).success(function(response) {
						that.cms_screen_details = _.find(response.screen_list, function(cms_item) {
							return cms_item.screen_name === "ZEST WEB SCREENS"
						});
						that.cms_screen_details = typeof that.cms_screen_details !== 'undefined' ? that.cms_screen_details.screen_messages : [];
						deferred.resolve(response);
					}.bind(this))
					.error(function() {
						deferred.reject();
					});
				return deferred.promise;
			};
				//call CMS details only for checkin URLs now
			var absUrl = window.location.href;
			// if the guestweb is accessed normaly, ie invoked using
			// the mail sent from the hotel admin
			if (absUrl.indexOf("/guest_web/home/index?guest_web_token=") !== -1) {
				var offset = absUrl.indexOf("?");
				var remainingURl = absUrl.substring(offset, absUrl.length);
				var startingUrl = absUrl.substring(0, offset);
				apiUrl = startingUrl + "_data" + remainingURl;

			} else if (absUrl.indexOf("checkin") !== -1) {
				//to strip away state URLS
				absUrl = (absUrl.indexOf("#") !== -1) ? absUrl.substring(0, absUrl.indexOf("#")) : absUrl;
				var urlComponents = absUrl.split('/');;
				var hotel_identifier = urlComponents[urlComponents.length - 2];
				fetchScreenWiseData(hotel_identifier);
			} // direct URL checkout - accessing URLS set in hotel admin for checkin
			else {
				//to strip away state URLS
				absUrl = (absUrl.indexOf("#") !== -1) ? absUrl.substring(0, absUrl.indexOf("#")) : absUrl;
				var urlComponents = absUrl.split('/');;
				var hotel_identifier = urlComponents[urlComponents.length - 1];
				fetchScreenWiseData(hotel_identifier);
			};


			this.fetchHotelDetailsFromUrl = function(url) {
				var deferred = $q.defer();

				/*
				 * To fetch reservation and hotel data
				 * @return {object} CMS details
				 */
				$http.get(url).success(function(response) {
						if (response.status === "success") {
							that.zestwebData = response.data;
							deferred.resolve(that.zestwebData);
						} else {
							// when some thing is broken , need to redirect to error page with default theme
							response.data.hotel_theme = "guestweb";
							response.data.error_occured = true;
							deferred.resolve(response.data);
						}

					}.bind(this))
					.error(function() {
						deferred.reject();
					});
				return deferred.promise;
			};

			/*
			 * To fetch screenMappings
			 * @return {object} mapping details
			 */
			this.fetchScreenMappings = function() {
				return GwScreenMappingSrv.screenMappingList;

			};

			this.setScreenList = function(list) {
				that.screenList = list;
			};

			this.extractScreenDetails = function(screen_identifier) {
				return extractScreenDetails(screen_identifier, that.screenList, that.cms_screen_details);
			};

			this.setReservationDataForExternalCheckout = function(response) {

				that.zestwebData.reservationID = response.reservation_id;
				that.zestwebData.userName = response.user_name;
				that.zestwebData.checkoutDate = response.checkout_date;
				that.zestwebData.checkoutTime = response.checkout_time;
				that.zestwebData.userCity = response.user_city;
				that.zestwebData.userState = response.user_state;
				that.zestwebData.roomNo = response.room_no;
				that.zestwebData.isLateCheckoutAvailable = response.is_late_checkout_available;
				that.zestwebData.emailAddress = response.email_address;
				that.zestwebData.isCCOnFile = response.is_cc_attached;
				that.zestwebData.accessToken = $rootScope.accessToken = response.guest_web_token;

			};
			this.setzestwebData = function(zestwebData) {

				//store basic details as rootscope variables
				if (typeof zestwebData.access_token !== "undefined") {
					that.zestwebData.accessToken = $rootScope.accessToken = zestwebData.access_token;
				}
				that.zestwebData.hotelName = zestwebData.hotel_name;
				that.zestwebData.currencySymbol = zestwebData.currency_symbol;
				that.zestwebData.hotelPhone = zestwebData.hotel_phone;
				that.zestwebData.businessDate = zestwebData.business_date;
				that.zestwebData.mliMerchatId = zestwebData.mli_merchat_id;
				that.zestwebData.roomVerificationInstruction = zestwebData.room_verification_instruction;
				that.zestwebData.isSixpayments = (zestwebData.payment_gateway === "sixpayments") ? true : false;
				that.zestwebData.reservationID = zestwebData.reservation_id;
				that.zestwebData.userName = zestwebData.user_name;
				that.zestwebData.checkoutDate = zestwebData.checkout_date;
				that.zestwebData.checkoutTime = zestwebData.checkout_time;
				that.zestwebData.userCity = zestwebData.city;
				that.zestwebData.userState = zestwebData.state;
				that.zestwebData.roomNo = zestwebData.room_no;
				that.zestwebData.isLateCheckoutAvailable = (zestwebData.is_late_checkout_available === "true") ? true : false;
				that.zestwebData.emailAddress = zestwebData.primary_guest_email;
				that.zestwebData.isCheckedout = (zestwebData.is_checkedout === 'true') ? true : false;
				that.zestwebData.isCheckin = (zestwebData.is_checkin === 'true') ? true : false;
				that.zestwebData.reservationStatusCheckedIn = (zestwebData.reservation_status === 'CHECKIN') ? true : false;
				that.zestwebData.isActiveToken = (zestwebData.is_active_token === "true") ? true : false;
				that.zestwebData.isCheckedin = (that.zestwebData.reservationStatusCheckedIn && !that.zestwebData.isActiveToken);
				that.zestwebData.isCCOnFile = (zestwebData.is_cc_attached === "true") ? true : false;
				that.zestwebData.isPreCheckedIn = (zestwebData.is_pre_checked_in === 'true') ? true : false;
				that.zestwebData.isRoomVerified = false;
				that.zestwebData.isPrecheckinOnly = (zestwebData.is_precheckin_only === 'true' && zestwebData.reservation_status === 'RESERVED') ? true : false;
				that.zestwebData.isCcAttachedFromGuestWeb = false;
				that.zestwebData.isAutoCheckinOn = ((zestwebData.is_auto_checkin === 'true') && (zestwebData.is_precheckin_only === 'true')) ? true : false;;
				that.zestwebData.isExternalVerification = (zestwebData.is_external_verification === "true") ? true : false;
				that.zestwebData.hotelIdentifier = zestwebData.hotel_identifier;
				that.zestwebData.guestAddressOn = zestwebData.guest_address_on === 'true' ? true : false;
				that.zestwebData.isGuestAddressVerified = false;

				that.zestwebData.guestBirthdateOn = (zestwebData.birthdate_on === 'true') ? true : false;
				that.zestwebData.guestBirthdateMandatory = (zestwebData.birthdate_mandatory === 'true') ? true : false;
				that.zestwebData.guestPromptAddressOn = (zestwebData.prompt_for_address_on === 'true') ? true : false;
				that.zestwebData.minimumAge = parseInt(zestwebData.minimum_age);
				that.zestwebData.primaryGuestId = zestwebData.primary_guest_id;


				that.zestwebData.isGuestEmailURl = (zestwebData.checkin_url_verification === "true" && zestwebData.is_zest_checkin === "true") ? true : false;
				that.zestwebData.zestEmailCheckinNoServiceMsg = zestwebData.zest_checkin_no_serviceMsg;
				that.zestwebData.termsAndConditions = zestwebData.terms_and_conditions;
				that.zestwebData.isBirthdayVerified = false;

				that.zestwebData.application = zestwebData.application;
				that.zestwebData.urlSuffix = zestwebData.url_suffix;
				that.zestwebData.collectCCOnCheckin = (zestwebData.checkin_collect_cc === "true") ? true : false;
				that.zestwebData.isMLI = (zestwebData.payment_gateway = "MLI") ? true : false;

				//room key delivery options
				that.zestwebData.preckinCompleted = false;
				that.zestwebData.userEmail = zestwebData.primary_guest_email;
				that.zestwebData.keyDeliveryByEmail = true;
				//that.zestwebData.keyDeliveryByText  = true;
				that.zestwebData.zestCheckinNoServiceMsg = zestwebData.zest_checkin_no_service_msg;

				that.zestwebData.offerRoomDeliveryOptions = (zestwebData.offer_room_delivery_options === "true") ? true : false;

				//Params for zest mobile and desktop screens
				if (zestwebData.hasOwnProperty('is_password_reset')) {
					that.zestwebData.isPasswordResetView = zestwebData.is_password_reset = "true";
					that.zestwebData.isTokenExpired = zestwebData.is_token_expired === "true" ? true : false;
					that.zestwebData.accessToken = $rootScope.accessToken = zestwebData.token;
					that.zestwebData.user_id = zestwebData.id;
					that.zestwebData.user_name = zestwebData.login;
				} else {
					that.zestwebData.dateFormatPlaceholder = !!zestwebData.date_format ? zestwebData.date_format.value : "";
					that.zestwebData.dateFormat = !!zestwebData.date_format ? getDateFormat(zestwebData.date_format.value) : "";
				}

			};

		}
	]);