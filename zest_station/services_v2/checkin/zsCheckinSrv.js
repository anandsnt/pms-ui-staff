/**
 * Service used for tablet-kiosk UI (Zest Station)
 */

sntZestStation.service('zsCheckinSrv', ['$http', '$q', 'zsBaseWebSrv', 'zsBaseWebSrv2', '$rootScope',
    function($http, $q, zsBaseWebSrv, zsBaseWebSrv2, $rootScope) {

        var that = this,
            TERMINAL_POLLING_INTERVAL_MS = 3000;

        this.checkInReservations = [];
        this.setCheckInReservations = function(data) {
            that.checkInReservations = [];
            that.checkInReservations = data;
        };

        this.getCheckInReservations = function() {
            return that.checkInReservations;
        };
        this.selectedCheckInReservation = [];
        this.setSelectedCheckInReservation = function(data) {
            that.selectedCheckInReservation = [];
            that.selectedCheckInReservation = data[0];
        };

        this.getSelectedCheckInReservation = function() {
            return that.selectedCheckInReservation;
        };
        // add / remove additional guests from reservation
        this.updateGuestTabDetails = function(data) {
            var deferred = $q.defer();
            var url = '/api/reservations/' + data.reservation_id + '/reservations_guest_details';

            zsBaseWebSrv.postJSON(url, data).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        // add / remove additional guests from reservation
        this.getGuestTabDetails = function(data) {
            var deferred = $q.defer();
            var url = '/api/reservations/' + data.reservation_id + '/reservations_guest_details';

            zsBaseWebSrv.getJSON(url, data).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchReservations = function(params) {
            var deferred = $q.defer(),
                url = '/api/reservations';

            zsBaseWebSrv.getJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        /**
         * CICO-41520
         * Modified the zs services so that this is the ONLY method that makes this api call!
         * @param param
         * @return {*|promise|{then, catch, finally}|e}
         */
        this.fetchReservationDetails = function(param) {
            var url = '/staff/staycards/reservation_details.json?is_kiosk=true&reservation_id=' + param.id,
                deferred = $q.defer();

            // To fetch the latest guest details, the following parameter has to be sent to trigger a fetchProfile OWS request
            if (!$rootScope.isStandAlone) {
                url += '&sync_guest_with_external_pms=true';
            }

            zsBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });

            return deferred.promise;
        };

        /**
         * /api/reservations/:reservation_id/pre_auth
         * @param {String} id reservation_id
         * @return {HttpPromise} authorize_cc_at_checkin, pre_auth_amount_at_checkin, pre_auth_amount_for_zest_station
         */
        that.fetchReservationPreAuthInfo = function(id) {
            return $http.get('api/reservations/' + id + '/pre_auth');
        };

        /**
         * CICO-41520
         * Returns reservation_details.json response along with authorize_cc_at_checkin, pre_auth_amount_at_checkin, pre_auth_amount_for_zest_station
         * @param params
         * @return {*|promise|{then, catch, finally}|e}
         */
        that.fetchReservationInfo = function(params) {
            var deferred = $q.defer(),
                responses = {},
                promises = [];


            var onSuccessFetchReservationDetails = function(response) {
                responses['details'] = response;
            };

            var onSuccessFetchReservationPreAuth = function(response) {
                responses['preAuth'] = response.data;
                if (response.status !== 200) {
                    deferred.reject(response.data);
                }
            };

            promises.push(that.fetchReservationDetails(params).then(onSuccessFetchReservationDetails, onSuccessFetchReservationDetails));

            promises.push(that.fetchReservationPreAuthInfo(params.id).then(onSuccessFetchReservationPreAuth, onSuccessFetchReservationPreAuth));

            $q.all(promises).then(function() {
                var mergedReservationDetails = responses['details'];

                if (mergedReservationDetails.data) {
                    _.extend(mergedReservationDetails.data.reservation_card, responses['preAuth']);
                    deferred.resolve(mergedReservationDetails);
                } else {
                    deferred.reject(mergedReservationDetails);
                }
            });

            return deferred.promise;
        };

        this.fetchAddonDetails = function(param) {
            var deferred = $q.defer(),
                url = '/staff/staycards/reservation_addons?reservation_id=' + param.id;

            zsBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        this.sendThirdPartyEmail = function(params) {
            var deferred = $q.defer(),
                url = '/api/reservations/' + params.id + '/send_station_offer_mobilekey_mail';

            zsBaseWebSrv.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.checkInGuest = function(params) {
            var deferred = $q.defer(),
                url = '/staff/checkin';

            zsBaseWebSrv.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.saveNationality = function(params) {
            var deferred = $q.defer(),
                url = '/api/guest_details/' + params.guest_id;

            param = {
                'nationality_id': params.nationality_id
            };

            zsBaseWebSrv.putJSON(url, param).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        this.fetchOwsMessage = function(params) {

            var deferred = $q.defer(),
                url = '/api/reservation_guest_messages/' + params.reservation_id + '.json';
            // var url = '/sample_json/zest_station/ows_msgs.json';

            zsBaseWebSrv.getJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        this.fetchECIPlaceholderData = function(params) {
            var deferred = $q.defer(),
                url = '/sample_json/zest_station/early_checkin.json';

            zsBaseWebSrv.getJSON(url, params).then(function(data) {
                deferred.resolve(data);

            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchDetailsPlaceholderData = function(params) {
            var deferred = $q.defer(),
                url = '/sample_json/zest_station/checkin_details.json';

            zsBaseWebSrv.getJSON(url, params).then(function(data) {
                deferred.resolve(data);

            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.sendOWSMsgAsMail = function(params) {
            var deferred = $q.defer(),
                url = '/api/reservation_guest_messages/email_message.json';

            zsBaseWebSrv.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.checkInGuest = function(params) {
            var deferred = $q.defer(),
                url = '/staff/checkin';
            var selectedReservation = that.getSelectedCheckInReservation();
            
            if (selectedReservation.reservation_details.accepted_terms_and_conditions) {
                params.accepted_terms_and_conditions = selectedReservation.reservation_details.accepted_terms_and_conditions;
            }
            
            zsBaseWebSrv2.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.sendRegistrationByEmail = function(data) { // to get terms & conditions
            var deferred = $q.defer();
            var id = data.id;
            var url = '/api/reservations/' + id + '/email_registration_card';
            var params = {
                'application': data.application
            };

            zsBaseWebSrv.getJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchRegistrationCardPrintData = function(params) {
            var deferred = $q.defer();
            var url = '/api/reservations/' + params.id + '/print_registration_card';

            zsBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });

            return deferred.promise;
        };

        this.assignGuestRoom = function(params) {
            // params['reservation_id'] = some id...
            var deferred = $q.defer(),
                url = '/guest/reservations/assign_room';

            zsBaseWebSrv.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchReservationAddress = function(id) {
            var deferred = $q.defer(),
                url = '/guest_web/guest_details/' +id;

            zsBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.saveGuestAddress = function(params) {
            var deferred = $q.defer(),
                url = '/guest_web/guest_details/' + params.reservation_id;

            zsBaseWebSrv.putJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchReservationBalanceDetails = function(params) {

            var deferred = $q.defer(),
                url = '/zest_station/reservations/' + params.reservation_id,
                param = {
                    'nationality_id': params.nationality_id
                };

            zsBaseWebSrv2.getJSON(url, param).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchUpsellDetails = function(reservation) {
            var params = {
                    set_arrival_time_to_current_time: true
                },
                deferred = $q.defer(),
                url = '/guest_web/reservations/' + reservation.id + '.json';

            zsBaseWebSrv.getJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        this.fetchStarTacPrinterData = function(params) {
            var deferred = $q.defer(),
                url = '/api/reservations/' + params.reservation_id + '/bill_print_data?is_checkout=false';

            zsBaseWebSrv.getJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchHotelTime = function(params) {

            var deferred = $q.defer(),
                url = '/guest_web/home/fetch_hotel_time.json?reservation_id=' + params.reservation_id;

            zsBaseWebSrv.getJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        this.fetchRoomUpsellDetails = function(param) {
            var deferred = $q.defer(),
                url = '/zest_station/upgrade_options.json';

            zsBaseWebSrv2.getJSON(url, param).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fethHotelRooms = function(params) {
            var deferred = $q.defer();
            var url = '/staff/rooms/get_rooms';

            zsBaseWebSrv2.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.selectRoomUpgrade = function(param) {
            var deferred = $q.defer();
            var url = '/staff/reservations/upgrade_room.json';

            param.is_kiosk = true;
            zsBaseWebSrv2.postJSON(url, param).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchAddons = function(param) {
            var deferred = $q.defer();
            var url = '/api/upsell_addons';
            var params = {
                'for_zest_station': true,
                'reservation_id': param.reservation_id,
                'application': 'KIOSK'
            };

            zsBaseWebSrv.getJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.updateAddon = function(params) {

            var deferred = $q.defer();
            var url = '/api/reservations/update_package';

            var data = params;

            data.application = 'KIOSK';

            zsBaseWebSrv.postJSON(url, data).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.deleteAddon = function(params) {
            var deferred = $q.defer();
            var url = '/api/reservations/delete_package';
            var data = params;

            data.application = 'KIOSK';

            zsBaseWebSrv.postJSON(url, data).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchHotelAddonLabels = function(param) {
            var deferred = $q.defer();
            var url = '/api/upsell_addons_setups';

            zsBaseWebSrv.getJSON(url, param).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchRoomUpsellAvailability = function(param) {
            var deferred = $q.defer();
            var url = '/api/reservations/' + param.id + '/upsell_availability';

            zsBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchLateCheckoutSettings = function(param) {
            var deferred = $q.defer();
            var url = '/admin/hotel/get_late_checkout_setup.json';

            zsBaseWebSrv2.getJSON(url, param).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.acceptPassport = function(params) {
            var deferred = $q.defer();
            var url = '/zest_station/log_passport_scanning';

            params.is_kiosk = true;

            var data = params;

            data.application = 'KIOSK';

            zsBaseWebSrv.postJSON(url, data).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.savePassport = function(params) {
            var deferred = $q.defer();
            var url = '/api/guest_identity';

            params.is_kiosk = true;

            var data = params;

            data.application = 'KIOSK';

            zsBaseWebSrv.postJSON(url, data).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.checkIDType = function(params) {
            var deferred = $q.defer();
            var url = '/api/guest_identity/' + params.reservation_id + '/scan_type?guest_id_type=passport';

            params.is_kiosk = true;

            zsBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        
        this.eciDemoData = { "early_checkin_on": true, "early_checkin_available": true, "checkin_time": " 3:00 PM", "eci_upsell_limit_reached": false, "offer_eci_bypass": false, "is_room_already_assigned": true, "is_room_ready": false, "is_donot_move_room_marked": false, "guest_arriving_today": true, "reservation_in_early_checkin_window": true, "early_checkin_charge": "\u00a353.00", "is_early_checkin_purchased": false, "is_early_checkin_bundled": false, "is_early_checkin_bundled_by_addon": false, "free_eci_for_vips": true, "is_vip": false, "early_checkin_restrict_hour_for_display": " 9", "early_checkin_restrict_hour": "09", "early_checkin_restrict_minute": "45", "early_checkin_restrict_primetime": "PM", "early_checkin_restrict_time": "09:45:00 PM", "early_checkin_offer_id": 1836 };

        this.resDetailsDemoData = { "status": "success", "data": { "reservation_card": { "timeline": "current", "confirmation_num": "101182", "reservation_status": "CHECKEDIN", "arrival_date": "2017-04-17", "departure_date": "2017-04-18", "group_name": "", "group_id": "", "group_block_from": "", "group_block_to": "", "group_rate_id": null, "allotment_name": "", "allotment_id": "", "accompaying_guests": [{ "guest_name": "guest" }], "guests_total": 2, "number_of_infants": 0, "number_of_adults": 2, "number_of_children": 0, "guarentee_type": "Deposit Requested", "has_smartbands": false, "room_number": "249", "room_id": "12712", "is_exclude_from_manual_checkin": false, "key_settings": "encode", "room_status": "NOTREADY", "fo_status": "OCCUPIED", "room_type_description": "PREMIUM VIEW QUEEN CABIN", "room_type_code": "PRQ", "membership_type": "", "avg_daily_rate": "139", "total_rate": "139", "rate_name": "Complimentary Early Check In", "rate_description": "Free", "total_nights": 1, "loyalty_level": { "selected_loyalty": null, "frequentFlyerProgram": [], "hotelLoyaltyProgram": [] }, "reservation_id": 1654218, "payment_details": { "card_type_image": "images/.png", "card_number": "", "card_expiry": "", "is_swiped": false, "id": 51857, "auth_color_code": "black", "card_name": "" }, "wake_up_time": { "today_date": "2017-04-17", "tomorrow_date": "2017-04-18" }, "is_force_upsell": "true", "news_paper_pref": { "news_papers": [], "selected_newspaper": "" }, "payment_type": 51857, "currency_code": "GBP", "balance_amount": "0.00", "enable_nights": "false", "is_late_checkout_on": true, "is_opted_late_checkout": false, "late_checkout_time": null, "routings": "", "deposit_attributes": { "room_cost": "139.00", "packages": "0.00", "sub_total": "139.00", "fees": "0.00", "stay_total": "139.00", "nightly_charges": "0.00", "total_cost_of_stay": "139.00", "deposit_paid": "0.00", "outstanding_stay_total": "139.00", "currency_code": null, "deposit_dues": [{ "due_date": "2017-07-18", "due_amount": "139.00", "paid": false }], "balance_deposit_amount": "139.00" }, "payment_method_used": "CA", "restrict_post": true, "payment_method_description": "Cash Payment", "has_any_credit_card_attached_bill": false, "is_rates_suppressed": "false", "text_rates_suppressed": "", "arrival_time": "12:02 PM", "departure_time": "11:00 AM", "is_routing_available": "false", "room_ready_status": "CLEAN", "use_inspected": "false", "use_pickup": "false", "checkin_inspected_only": "false", "is_reservation_queued": "false", "is_queue_rooms_on": "false", "icare_enabled": "false", "smartband_has_balance": "false", "booking_origin_id": null, "market_segment_id": null, "source_id": null, "segment_id": null, "reservation_type_id": 4, "is_pre_checkin": false, "is_rate_suppressed_present_in_stay_dates": "false", "combined_key_room_charge_create": "false", "stay_dates": [{ "adults": 2, "children": 0, "infants": 0, "date": "2017-04-17", "rate": { "actual_amount": "139.00", "modified_amount": "139.00", "is_discount_allowed": "true", "is_suppressed": "false" }, "rate_id": 2222, "room_type_id": 235, "rate_config": { "child": 0.0, "double": 139.0, "extra_adult": 0.0, "single": 139.0 } }], "is_multiple_rates": false, "is_hourly_reservation": false, "no_of_hours": "NA", "max_occupancy": 4, "deposit_amount": "139.00", "deposit_policy": { "id": 30, "name": "Deposite", "description": "the full amount for deposit", "amount": 100.0, "amount_type": "percent" }, "is_disabled_email_phone_dialog": "", "hotel_selected_key_system": "SAFLOK", "is_remote_encoder_enabled": true, "is_package_exist": false, "package_count": "0", "sharer_information": {}, "commission_details": { "is_on": false, "commission_origin": null, "commission_value": 0.0, "commission_type": null, "is_prepaid": null }, "hide_rates": null, "company_card_id": null, "travel_agent_card_id": null, "company_card_name": null, "travel_agent_card_name": null, "is_custom_text_per_reservation": false, "cannot_move_room": false, "room_pin": null, "is_suite": false, "default_bill_id": 96063, "station_offer_mobilekey": "disabled" } }, "errors": [], "is_eod_in_progress": false, "is_eod_manual_started": false, "is_eod_failed": false, "is_eod_process_running": false };

        this.fetchResDemoData = { "results": [{ "id": 1654218, "arrival_date": "2017-04-17", "departure_date": "2017-04-18", "confirmation_number": "101182", "arrival_time": "15:00", "departure_time": "11:00", "room": "249", "company_account_number": "", "travel_agent_account_number": "", "reservation_type": "DEPOSIT_REQUESTED", "promotion_id": null, "is_rate_suppressed": "false", "avg_rate": "139.0", "is_checked_in": "false", "guest_details": [{ "id": 476005, "is_primary": true, "title": "", "first_name": "Guest", "last_name": "Smith", "email": "test@stayntouch.com", "is_email_blacklisted": false, "birthday": "", "job_title": "", "works_at": "", "is_opted_promotion_email": false, "is_vip": true, "home_phone": null, "mobile_phone": null, "address": { "street": null, "city": "", "state": null, "postal_code": null, "country": null } }] }] };

        this.findResDemoData = { "reservation_id": 1654207, "email": "test@stayntouch.com", "guest_detail_id": 475484, "has_cc": false, "first_name": "guest", "last_name": 'last_name', "days_of_stay": 44, "is_checked_out": false, "is_checked_in": true, "is_departing_today": false, "guest_arriving_today": true };

        this.guestDetailsDemoData = { "adult_count": 1, "children_count": 0, "infants_count": 0, "varying_occupancy": false, "primary_guest_details": { "first_name": "guest", "last_name": "guest", "is_vip": false, "image": "http://localhost:3000/assets/images/avatar-trans.png", "is_passport_present": true }, "accompanying_guests_details": [{ "first_name": "guest", "last_name": "x2", "image": "http://localhost:3000/assets/images/avatar-trans.png", "id": 615589, "guest_type": "ADULT", "guest_type_id": 1, "is_passport_present": false }] };

        this.getSampleIdFrontSideData = function (params) {
            var deferred = $q.defer();
            var url = (params.demoModeScanCount % 2 === 0) ? '/sample_json/zest_station/sample_passport_data.json': '/sample_json/zest_station/sample_id_front_side_data.json';

            zsBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.getSampleIdBackSideData = function () {
            var deferred = $q.defer();
            var url = '/sample_json/zest_station/sample_id_back_side_data.json';

            zsBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.getSampleAcuantIdScanDetails = function() {
            var deferred = $q.defer();
            var url = '/sample_json/zest_station/acuant_sample_response.json';

            zsBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;

        };
    }
]);
