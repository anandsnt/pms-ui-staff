	sntGuestWeb.service('GwWebSrv', ['$q', '$http', 'GwScreenMappingSrv',
		function($q, $http, GwScreenMappingSrv) {


			this.screenList = [];
			this.cMSdata = [];
			this.reservationAndhotelData = {};
			var that = this;


			this.fetchHotelDetailsFromUrl = function(url) {
				var deferred = $q.defer();
				/*
				 * To fetch CMS data
				 * @return {object} CMS details
				 */

				var fetchScreenFromCMSSetup = function(language) {
					var url = '/sample_json/zestweb_v2/screen_list_' + language + '.json';
					$http.get(url).success(function(response) {
							that.reservationAndhotelData.screenDataFromCMS = response;
							deferred.resolve(that.reservationAndhotelData);
						}.bind(this))
						.error(function() {
							deferred.reject();
						});
				}
				/*
				 * To fetch reservation and hotel data
				 * @return {object} CMS details
				 */
				$http.get(url).success(function(response) {
						if (response.status === "success") {
							that.reservationAndhotelData.generalDetails = response.data;
							fetchScreenFromCMSSetup(response.data.zest_web.language);
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
			/*
			 * To fetch Zestweb global settings
			 * @return {object} Zestweb global settings details
			 */
			this.fetchZestwebGlobalSettings = function() {
				var deferred = $q.defer();
				var url = '/sample_json/zestweb_v2/zestweb_global_settings.json';
				$http.get(url).success(function(response) {
						deferred.resolve(response);
					}.bind(this))
					.error(function() {
						deferred.reject();
					});
				return deferred.promise;

			};

			this.setScreenList = function(list) {
				that.screenList = list;
			};

			this.setCMSdata = function(data) {
				that.cMSdata = data;
			};

			this.extractScreenDetails = function(screen_identifier) {
				return extractScreenDetails(screen_identifier, that.screenList, that.cMSdata);
			};
			this.setReservationAndHotelData = function(reservationAndhotelData) {

				//store basic details as rootscope variables
				if (typeof reservationAndhotelData.access_token !== "undefined") {
					that.reservationAndhotelData.accessToken = reservationAndhotelData.access_token;
				}
				that.reservationAndhotelData.hotelName = reservationAndhotelData.hotel_name;
				that.reservationAndhotelData.currencySymbol = reservationAndhotelData.currency_symbol;
				that.reservationAndhotelData.hotelPhone = reservationAndhotelData.hotel_phone;
				that.reservationAndhotelData.businessDate = reservationAndhotelData.business_date;
				that.reservationAndhotelData.mliMerchatId = reservationAndhotelData.mli_merchat_id;
				that.reservationAndhotelData.roomVerificationInstruction = reservationAndhotelData.room_verification_instruction;
				that.reservationAndhotelData.isSixpayments = (reservationAndhotelData.payment_gateway === "sixpayments") ? true : false;
				that.reservationAndhotelData.reservationID = reservationAndhotelData.reservation_id;
				that.reservationAndhotelData.userName = reservationAndhotelData.user_name;
				that.reservationAndhotelData.checkoutDate = reservationAndhotelData.checkout_date;
				that.reservationAndhotelData.checkoutTime = reservationAndhotelData.checkout_time;
				that.reservationAndhotelData.userCity = reservationAndhotelData.city;
				that.reservationAndhotelData.userState = reservationAndhotelData.state;
				that.reservationAndhotelData.roomNo = reservationAndhotelData.room_no;
				that.reservationAndhotelData.isLateCheckoutAvailable = (reservationAndhotelData.is_late_checkout_available === "true") ? true : false;
				that.reservationAndhotelData.emailAddress = reservationAndhotelData.primary_guest_email;
				that.reservationAndhotelData.isCheckedout = (reservationAndhotelData.is_checkedout === 'true') ? true : false;
				that.reservationAndhotelData.isCheckin = (reservationAndhotelData.is_checkin === 'true') ? true : false;
				that.reservationAndhotelData.reservationStatusCheckedIn = (reservationAndhotelData.reservation_status === 'CHECKIN') ? true : false;
				that.reservationAndhotelData.isActiveToken = (reservationAndhotelData.is_active_token === "true") ? true : false;
				that.reservationAndhotelData.isCheckedin = (that.reservationAndhotelData.reservationStatusCheckedIn && !that.reservationAndhotelData.isActiveToken);
				that.reservationAndhotelData.isCCOnFile = (reservationAndhotelData.is_cc_attached === "true") ? true : false;
				that.reservationAndhotelData.isPreCheckedIn = (reservationAndhotelData.is_pre_checked_in === 'true') ? true : false;
				that.reservationAndhotelData.isRoomVerified = false;
				that.reservationAndhotelData.isPrecheckinOnly = (reservationAndhotelData.is_precheckin_only === 'true' && reservationAndhotelData.reservation_status === 'RESERVED') ? true : false;
				that.reservationAndhotelData.isCcAttachedFromGuestWeb = false;
				that.reservationAndhotelData.isAutoCheckinOn = ((reservationAndhotelData.is_auto_checkin === 'true') && (reservationAndhotelData.is_precheckin_only === 'true')) ? true : false;;
				that.reservationAndhotelData.isExternalVerification = (reservationAndhotelData.is_external_verification === "true") ? true : false;
				that.reservationAndhotelData.hotelIdentifier = reservationAndhotelData.hotel_identifier;
				that.reservationAndhotelData.guestAddressOn = reservationAndhotelData.guest_address_on === 'true' ? true : false;
				that.reservationAndhotelData.isGuestAddressVerified = false;

				that.reservationAndhotelData.guestBirthdateOn = (reservationAndhotelData.birthdate_on === 'true') ? true : false;
				that.reservationAndhotelData.guestBirthdateMandatory = (reservationAndhotelData.birthdate_mandatory === 'true') ? true : false;
				that.reservationAndhotelData.guestPromptAddressOn = (reservationAndhotelData.prompt_for_address_on === 'true') ? true : false;
				that.reservationAndhotelData.minimumAge = parseInt(reservationAndhotelData.minimum_age);
				that.reservationAndhotelData.primaryGuestId = reservationAndhotelData.primary_guest_id;


				that.reservationAndhotelData.isGuestEmailURl = (reservationAndhotelData.checkin_url_verification === "true" && reservationAndhotelData.is_zest_checkin === "true") ? true : false;
				that.reservationAndhotelData.zestEmailCheckinNoServiceMsg = reservationAndhotelData.zest_checkin_no_serviceMsg;
				that.reservationAndhotelData.termsAndConditions = reservationAndhotelData.terms_and_conditions;
				that.reservationAndhotelData.isBirthdayVerified = false;

				that.reservationAndhotelData.application = reservationAndhotelData.application;
				that.reservationAndhotelData.urlSuffix = reservationAndhotelData.url_suffix;
				that.reservationAndhotelData.collectCCOnCheckin = (reservationAndhotelData.checkin_collect_cc === "true") ? true : false;
				that.reservationAndhotelData.isMLI = (reservationAndhotelData.payment_gateway = "MLI") ? true : false;

				//room key delivery options
				that.reservationAndhotelData.preckinCompleted = false;
				that.reservationAndhotelData.userEmail = reservationAndhotelData.primary_guest_email;
				that.reservationAndhotelData.keyDeliveryByEmail = true;
				//that.reservationAndhotelData.keyDeliveryByText  = true;

				that.reservationAndhotelData.offerRoomDeliveryOptions = (reservationAndhotelData.offer_room_delivery_options === "true") ? true : false;

				//Params for zest mobile and desktop screens
				if (reservationAndhotelData.hasOwnProperty('is_password_reset')) {
					that.reservationAndhotelData.isPasswordResetView = reservationAndhotelData.is_password_reset = "true";
					that.reservationAndhotelData.isTokenExpired = reservationAndhotelData.is_token_expired === "true" ? true : false;
					that.reservationAndhotelData.accessToken = reservationAndhotelData.token;
					that.reservationAndhotelData.user_id = reservationAndhotelData.id;
					that.reservationAndhotelData.user_name = reservationAndhotelData.login;
				} else {
					that.reservationAndhotelData.dateFormatPlaceholder = !!reservationAndhotelData.date_format ? reservationAndhotelData.date_format.value : "";
					that.reservationAndhotelData.dateFormat = !!reservationAndhotelData.date_format ? getDateFormat(reservationAndhotelData.date_format.value) : "";
				}

			};

		}
	]);