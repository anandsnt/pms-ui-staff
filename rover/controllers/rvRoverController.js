/* eslint-disable angular/document-service */
sntRover.controller('roverController', [
    '$rootScope',
    '$scope',
    '$state',
    '$window',
    'RVDashboardSrv',
    'RVHotelDetailsSrv',
    'ngDialog',
    '$translate',
    'hotelDetails',
    'userInfoDetails',
    '$stateParams',
    'rvMenuSrv',
    'rvPermissionSrv',
    '$timeout',
    'rvUtilSrv',
    'jsMappings',
    '$q',
    '$sce',
    '$log',
    'sntAuthorizationSrv',
    '$location',
    '$interval',
    'sntActivity',
    '$transitions',
    function ($rootScope, $scope, $state, $window, RVDashboardSrv, RVHotelDetailsSrv,
              ngDialog, $translate, hotelDetails, userInfoDetails, $stateParams,
              rvMenuSrv, rvPermissionSrv, $timeout, rvUtilSrv, jsMappings, $q, $sce,
              $log, sntAuthorizationSrv, $location, $interval, sntActivity, $transitions) {


        var observeDeviceInterval;

        $rootScope.isOWSErrorShowing = false;
        if (hotelDetails.language) {
            $translate.use(hotelDetails.language.value);
            $translate.fallbackLanguage('EN');
            /* For reason unclear, the fallback translation does not trigger
             * unless a translation is requested explicitly, for second screen
             * onwards.
             * TODO: Fix this bug in ng-translate and implement in this here.
             */
            setTimeout(function () {
                $translate('NA');
            }, 1000); // Word around.
        } else {
            $translate.use('EN');
        }

        // CICO-39623 : Setting up app theme.
        if (!!hotelDetails.selected_theme && hotelDetails.selected_theme.value !== 'ORANGE') {
            var appTheme = 'theme-' + (hotelDetails.selected_theme.value).toLowerCase();

            document.getElementsByTagName('html')[0].setAttribute('class', appTheme);
        }

        /*
         * To close drawer on click inside pages
         */
        $scope.closeDrawer = function () {
            $scope.menuOpen = false;
        };
        $scope.isAddToGuestCardEnabledDuringCheckin = false;
        $scope.$on('UPDATE_ADD_TO_GUEST_ON_CHECKIN_FLAG', function (e, value) {
            $scope.isAddToGuestCardEnabledDuringCheckin = value;
        });
        $scope.roverFlags = {};
        $scope.hotelDetails = hotelDetails;
        // set current hotel details
        $scope.currentHotelData = {
            'name': '',
            'id': ''
        };
        angular.forEach($scope.hotelDetails.userHotelsData.hotel_list, function (hotel, index) {
            if ($scope.hotelDetails.userHotelsData.current_hotel_id === hotel.hotel_id) {
                $scope.currentHotelData.name = hotel.hotel_name;
                $scope.currentHotelData.id = hotel.hotel_id;
                $scope.hotelDetails.userHotelsData.hotel_list.splice(index, 1);
            }
        });

        $scope.isSettingSubMenuActive = false;
        // Used to add precison in amounts
        $rootScope.precisonZero = 0;
        $rootScope.precisonTwo = 2;
        // To get currency symbol - update the value with the value from API see fetchHotelDetailsSuccessCallback
        $rootScope.currencySymbol = '';
        $scope.showSubMenu = false;
        $scope.activeSubMenu = [];
        $rootScope.isStandAlone = false;

        $rootScope.shortDateFormat = 'MM/yy'; // 05/99
        $rootScope.dayInWeek = 'EEE'; // Sun
        $rootScope.dayInMonth = 'dd'; // 01
        $rootScope.monthInYear = 'MMM'; // Jan
        // Use below standard date formatter in the UI.
        $rootScope.mmddyyyyFormat = 'MM-dd-yyyy'; // 01-22-2014
        $rootScope.mmddyyyyBackSlashFormat = 'dd/MM/yyyy'; // 01-22-2014
        $rootScope.fullDateFormat = 'EEEE, d MMMM yyyy'; // Wednesday, 4 June 2014
        $rootScope.dayAndDate = 'EEEE MM-dd-yyyy'; // Wednesday 06-04-2014
        $rootScope.fullDateFullMonthYear = 'dd MMMM yyyy';
        $rootScope.dayAndDateCS = 'EEEE, MM-dd-yyyy'; // Wednesday, 06-04-2014
        $rootScope.dateFormatForAPI = 'yyyy-MM-dd';
        // https://momentjs.com/docs/#/displaying/format/
        $rootScope.momentFormatForAPI = 'YYYY-MM-DD';
        $rootScope.shortMonthAndDate = 'MMM dd';
        $rootScope.monthAndDate = 'MMMM dd';
        $rootScope.fullMonth = 'MMMM';
        $rootScope.fullYear = 'yyyy';
        $rootScope.fulldayInWeek = 'EEEE';
        $rootScope.fullMonthFullDayFullYear = 'MMMM dd, yyyy'; // January 06, 2014
        $rootScope.timeWithAMPM = 'hh:mm a'; // 01:00 AM

        // CICO-25098 - Flag to enable/disable the billing info code refactoring.
        // Need to be removed finally.
        $rootScope.UPDATED_BI_ENABLED_ON = {
            'RESERVATION': false,
            'CARDS': false,
            'ACCOUNTS': false,
            'ALLOTMENT': false
        };
        enableBillingInfo = $rootScope.UPDATED_BI_ENABLED_ON; // Need to be removed finally.

        $rootScope.isCurrentUserChangingBussinessDate = false;
        $rootScope.termsAndConditionsText = hotelDetails.terms_and_conditions;
        // CICO-50810 checking for any interface enabled.
        $rootScope.roverObj = {
            isAnyInterfaceEnabled: hotelDetails.interface.is_avida_enabled || hotelDetails.interface.is_baseware_enabled
        };
        /*
         * hotel Details
         */
        $rootScope.hotelDetails = hotelDetails;

        $rootScope.isLateCheckoutTurnedOn = hotelDetails.late_checkout_settings.is_late_checkout_on;
        $rootScope.businessDate = hotelDetails.business_date;
        $rootScope.currencySymbol = getCurrencySign(hotelDetails.currency.value);
        $rootScope.dateFormat = getDateFormat(hotelDetails.date_format.value);
        $rootScope.jqDateFormat = getJqDateFormat(hotelDetails.date_format.value);
        $rootScope.MLImerchantId = hotelDetails.mli_merchant_id;
        $rootScope.isMLIEMVEnabled = hotelDetails.mli_emv_enabled;
        $rootScope.isQueuedRoomsTurnedOn = hotelDetails.housekeeping.is_queue_rooms_on;
        $rootScope.advanced_queue_flow_enabled = hotelDetails.advanced_queue_flow_enabled;
        $rootScope.isPmsProductionEnv = hotelDetails.is_pms_prod;
        // $rootScope.isRoomDiaryEnabled = hotelDetails.is_room_diary_enabled;
        // CICO-40544 - Now we have to enable menu in all standalone hotels
        // API not removing for now - Because if we need to disable it we can use the same param
        $rootScope.isRoomDiaryEnabled = true;
        $rootScope.isManualCCEntryEnabled = hotelDetails.is_allow_manual_cc_entry;
        $rootScope.isAnMPHotel = hotelDetails.is_multi_property;

         /**
         * CICO-34068
         * NOTE: Temporary Fix
         * As saferpay is not supported in Rover, if saferpay is selected in SNT Admin; default to sixpayments
         */
        if (hotelDetails.payment_gateway === 'SAFERPAY') {
            $rootScope.paymentGateway = 'sixpayments';
        } else {
            $rootScope.paymentGateway = hotelDetails.payment_gateway;
        }
        $rootScope.isHourlyRateOn = hotelDetails.is_hourly_rate_on;
        $rootScope.minimumHourlyReservationPeriod = hotelDetails.hourly_min_reservation_hours;
        $rootScope.isAddonOn = hotelDetails.is_addon_on;
        $rootScope.desktopSwipeEnabled = hotelDetails.allow_desktop_swipe;
        $rootScope.ccSwipeListeningPort = hotelDetails.cc_swipe_listening_port;
        $rootScope.ccSwipeListeningUrl = hotelDetails.cc_swipe_listening_url;
        $rootScope.printCancellationLetter = hotelDetails.print_cancellation_letter;
        $rootScope.sendCancellationLetter = hotelDetails.send_cancellation_letter;
        $rootScope.printConfirmationLetter = hotelDetails.print_confirmation_letter;
        $rootScope.sendConfirmationLetter = hotelDetails.send_confirmation_letter;
        $rootScope.isItemInventoryOn = hotelDetails.is_item_inventory_on;
        $rootScope.guestTypes = hotelDetails.guest_types;
        $rootScope.isFromDevice = navigator.userAgent.match(/iPad/i) !== null || navigator.userAgent.match(/iPhone/i) !== null;

        // CICO-41410
        $rootScope.isDashboardSwipeEnabled = hotelDetails.enable_dashboard_swipe;

        // need to set some default timeout
        // discuss with Mubarak

        if (hotelDetails.emv_timeout) {
            $rootScope.emvTimeout = hotelDetails.emv_timeout;
        } else {
            var defaultTimeout = 120;

            $log.warn('configuration missing: [emv] no timeout set. defaulting to ' + defaultTimeout);
            $rootScope.emvTimeout = defaultTimeout;
        }


        // CICO-25728
        // TEMPORARY FLAG TO SKIP BAR AREAS
        $rootScope.hideRateOfDay = hotelDetails.hide_rate_of_day;


        // CICO-18040
        $rootScope.isFFPActive = hotelDetails.is_ffp_active;
        $rootScope.isHLPActive = hotelDetails.is_hlp_active;
        $rootScope.isPromoActive = hotelDetails.is_promotion_active;

        // set MLI Merchant Id
        try {
            sntapp.MLIOperator.setMerChantID($rootScope.MLImerchantId);
        } catch (err) {
            $log.error(err);
        }
        $rootScope.isSingleDigitSearch = hotelDetails.is_single_digit_search;


        // handle six payment iFrame communication
        var eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
        var eventer = window[eventMethod];
        var messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message';

        eventer(messageEvent, function (e) {
            var responseData = e.data;

            if (responseData.response_message === 'token_created') {
                $scope.$broadcast('six_token_recived', {
                    'six_payment_data': responseData
                });
                $scope.$digest();
            }
        }, false);

        // set flag if standalone PMS
        if (hotelDetails.pms_type === null) {
            $rootScope.isStandAlone = true;
        }

        /*
         * retrieve user info
         */
        $scope.userInfo = userInfoDetails;
        $scope.isPmsConfigured = $scope.userInfo.is_pms_configured;
        $rootScope.adminRole = $scope.userInfo.user_role;
        $rootScope.isHotelStaff = $scope.userInfo.is_staff;


        // self executing check
        $rootScope.isMaintenanceStaff = (function (roles) {
            // Values taken form DB
            var FLO_STF = 'floor_&_maintenance_staff',
                FLO_STF_ID = 11,
                isFloStf = false;

            isFloStf = _.find(roles, function (item) {
                return item.id === FLO_STF_ID || item.name === FLO_STF;
            });

            return isFloStf ? true : false;
        })(hotelDetails.current_user.roles);

        $rootScope.isMaintenanceManager = (function (roles) {
            // Values taken form DB
            var FLO_MGR = 'floor_&_maintenance_manager',
                FLO_MGR_ID = 10,
                isFloMgr = false;

            isFloMgr = _.find(roles, function (item) {
                return item.id === FLO_MGR_ID || item.name === FLO_MGR;
            });

            return isFloMgr ? true : false;
        })(hotelDetails.current_user.roles);

        $rootScope.$on('bussinessDateChanged', function (e, newBussinessDate) {
            $scope.userInfo.business_date = newBussinessDate;
        });

        // Default Dashboard
        $rootScope.default_dashboard = hotelDetails.current_user.default_dashboard;
        $rootScope.userName = userInfoDetails.first_name + ' ' + userInfoDetails.last_name;
        $rootScope.userId = hotelDetails.current_user.id;

        $scope.isDepositBalanceScreenOpened = false;
        $scope.$on('UPDATE_DEPOSIT_BALANCE_FLAG', function (e, value) {
            $scope.isDepositBalanceScreenOpened = value;
        });
        $scope.isCancelReservationPenaltyOpened = false;
        $scope.$on('UPDATE_CANCEL_RESERVATION_PENALTY_FLAG', function (e, value) {
            $scope.isCancelReservationPenaltyOpened = value;
        });
        $scope.isStayCardDepositScreenOpened = false;
        $scope.$on('UPDATE_STAY_CARD_DEPOSIT_FLAG', function (e, value) {
            $scope.isStayCardDepositScreenOpened = value;
        });
        $scope.searchBackButtonCaption = '';

        /**
         * reciever function used to change the heading according to the current page
         * if there is any trnslation, please use that
         * param1 {object}, javascript event
         * param2 {String}, Backbutton's caption
         */
        $scope.$on('UpdateSearchBackbuttonCaption', function (event, caption) {
            event.stopPropagation();
            // chnaging the heading of the page
            $scope.searchBackButtonCaption = caption; // if it is not blank, backbutton will show, otherwise dont
        });

        if ($rootScope.adminRole === 'Hotel Admin' || $rootScope.adminRole === 'Chain Admin') {
            $scope.isHotelAdmin = true;
        }
        /**
         * menu - forming & associate logic
         * NOTE: Menu forming and logic and things are in service rvMenuSrv
         * @return - None
         */
        $scope.formMenu = function () {
            // if it standalone
            if ($rootScope.isStandAlone) {
                $scope.menu = rvMenuSrv.getMainMenuForStandAloneRover();
                $scope.mobileMenu = rvMenuSrv.getMobileMenuForStandAloneRover();
            }
            // connected
            else {
                $scope.menu = rvMenuSrv.getMainMenuForConnectedRover();
                $scope.mobileMenu = rvMenuSrv.getMobileMenuForConnectedRover();
            }
            $scope.settingsSubmenu = rvMenuSrv.getSettingsSubmenu();
        };

        /**
         * method to determine the visibility of availability
         * will check the permission & standalone status
         * @return {Boolean}
         */
        $scope.shouldShowAvailabilityHouseButton = function () {
            return ($rootScope.isStandAlone &&
                rvPermissionSrv.getPermissionValue('AVAILABILITY_HOUSE_STATUS'));
        };

        /**
         * method to determine the visibility of multiproperty switch
         * will check the permission & number of hotels returned from API
         * @return {Boolean}
         */
        $scope.shouldShowMultiPropertySwitch = function () {
            return (hotelDetails.userHotelsData.hotel_list.length > 0 &&
                rvPermissionSrv.getPermissionValue('MULTI_PROPERTY_SWITCH'));
        };

        /**
         * utility method to openup the settings popup
         * @return - None
         */
        var openUpdatePasswordPopup = function () {
            // Show a loading message until promises are not resolved
            $scope.$emit('showLoader');

            jsMappings.fetchAssets(['staffpasswordchange'])
                .then(function () {
                    $scope.$emit('hideLoader');
                    ngDialog.open({
                        template: '/assets/partials/settings/rvStaffSettingModal.html',
                        controller: 'RVStaffsettingsModalController',
                        className: 'calendar-modal'
                    });
                });
        };

        /*
         * to run angular digest loop,
         * will check if it is not running
         * return - None
         */
        $scope.runDigestCycle = function () {
            if (!$scope.$$phase) {
                $scope.$digest();
            }
        };
        $scope.showDeviceConnectivityStatus = false;

        document.addEventListener('OBSERVE_DEVICE_STATUS_CHANGE', function (e) {
            $scope.$emit('closeDrawer');
            $scope.deviceDetails = e.detail;
            $scope.showDeviceConnectivityStatus = true;
            $scope.runDigestCycle();
        });

        $scope.connectedDeviceDetails = [];

        /*
        * Show the connected devices status
         */
        $scope.fetchDeviceStatus = function () {
            var callBacks = {
                'successCallBack': function (response, versionDetails) {
                    $scope.connectedDeviceDetails = response;
                    $scope.serviceDetails = versionDetails;
                    $scope.widthStyle = (response.length === 1) ? {
                        'width': '320px'
                    } : '';
                    ngDialog.open({
                        template: '/assets/partials/settings/rvDeviceStatus.html',
                        scope: $scope,
                        className: 'calendar-modal',
                        controller: 'rvDeviceStatusCtrl'
                    });
                    $scope.runDigestCycle();
                },
                'failureCallBack': function (errorMessage) {
                    $scope.errorMessage = errorMessage;
                }
            };

            $scope.showDeviceConnectivityStatus = false;
            $scope.connectedDeviceDetails = [];

            if (sntapp.desktopCardReader.isActive) {
                sntapp.desktopCardReader.getConnectedDeviceDetails(callBacks);
            } else {
                sntapp.cardReader.getConnectedDeviceDetails(callBacks);
            }
        };

        $scope.refreshDeviceStatus = function () {
            $scope.$emit('showLoader');
            $timeout(function () {
                ngDialog.close();
                $scope.$emit('hideLoader');
                $scope.fetchDeviceStatus();
            }, 1000);
        };

        $rootScope.updateSubMenu = function (idx, item) {
            if (item && item.submenu && item.submenu.length > 0) {
                $scope.showSubMenu = true;
                $scope.activeSubMenu = item.submenu;
            } else if (item && item[1] && item[1].submenu && item[1].submenu.length > 0) {
                $scope.showSubMenu = true;
                $scope.activeSubMenu = item[1].submenu;
            } else {
                $scope.showSubMenu = false;
                $scope.activeSubMenu = [];
                $scope.toggleDrawerMenu();
            }
            $scope.isSettingSubMenuActive = false;
        };

        $scope.$on('updateSubMenu', function (idx, item) {
            $rootScope.updateSubMenu(idx, item);
        });

        // as settings is seperate section,need to handle seperately
        $rootScope.updateSettingsSubMenu = function (item) {
            $scope.isSettingSubMenuActive = true;
            if (item && item.submenu && item.submenu.length > 0) {
                $scope.showSubMenu = true;
                $scope.activeSubMenu = item.submenu;
            } else {
                $scope.showSubMenu = false;
                $scope.toggleDrawerMenu();
            }
        };
        $scope.$on('updateSettingsSubMenu', function (e, item) {
            $rootScope.updateSettingsSubMenu(item);
        });


        $scope.$on('closeDrawer', function () {
            $scope.menuOpen = false;
            $scope.isMenuOpen();
        });

        $scope.isMenuOpen = function () {
            return $scope.menuOpen ? true : false;
        };

        $scope.$on('SHOW_SIX_PAY_LOADER', function () {
            $scope.showSixPayLoader = true;
        });
        $scope.$on('HIDE_SIX_PAY_LOADER', function () {
            $scope.showSixPayLoader = false;
        });
        /**
         * in case of we want to reinitialize left menu based on new $rootScope values or something
         * which set during it's creation, we can use
         */
        $scope.$on('refreshLeftMenu', function (event) {
            setupLeftMenu();
        });


        $scope.init = function () {
            BaseCtrl.call(this, $scope);
            $rootScope.adminRole = '';
            $scope.selectedMenuIndex = 0;
            $scope.formMenu();

            // if menu is open, close it
            $scope.isMenuOpen();

            $scope.menuOpen = false;

            $rootScope.hotelPaymentConfig = {
                isStandAlone: $rootScope.isStandAlone,
                paymentGateway: $rootScope.paymentGateway,
                emvTimeout: $rootScope.emvTimeout,
                mliMerchantId: $rootScope.MLImerchantId,
                currencySymbol: $rootScope.currencySymbol,
                isManualCCEntryEnabled: $rootScope.isManualCCEntryEnabled,
                isEMVEnabled: $rootScope.isMLIEMVEnabled
            };

            $scope.menuOpen = false;
            $rootScope.showNotificationForCurrentUser = true;

            if ($rootScope.paymentGateway === 'CBA' && sntapp.cordovaLoaded) {
                doCBAPowerFailureCheck();
                $rootScope.disableObserveForSwipe = true;
            }

            // for iPad we need to show the connected device status
            if (sntapp.browser === 'rv_native' && sntapp.cordovaLoaded) {
                $scope.isIpad = true;
                $rootScope.iosAppVersion = null;
                // check for the method getAppInfo via rvcardplugin, if it does not exist,
                // leave app_version null. Only latest versions of APP returns APP version
                // and methods to fetch device status
                $timeout(function () {
                    cordova.exec(function (response) {
                        if (response && response.AppVersion) {
                            $rootScope.iosAppVersion = response.AppVersion;
                            // reset the left menu (add device status)
                            $scope.formMenu();
                        }
                    }, function () {

                    }, 'RVCardPlugin', 'getAppInfo', []);

                }, 500);
            }
        };

        $scope.init();

        /*
         * update selected menu class
         */
        $scope.$on('updateRoverLeftMenu', function (e, value) {
            $scope.selectedMenuIndex = value;
        });


        /*
         * toggle action of drawer
         */
        $scope.toggleDrawerMenu = function (e) {
            if (!!e) {
                e.stopPropagation();
            }

            $scope.menuOpen = !$scope.menuOpen;

            // Bug fix for CICO-15718
            // Found that the issue appears when the keyboard comes over the screen
            // Added workaround to focus out from the search box
            $('#dashboard-query').focus();
            $('#dashboard-query').blur();

            $scope.showHotelSwitchList = false;
            // save contact info in guestcard if any changes has been done -CICO-14273
            $scope.$broadcast('saveContactInfo');
            $scope.$broadcast('SAVELIKES');
        };

        $scope.toggleHotelList = function (e) {
            $scope.showHotelSwitchList = !$scope.showHotelSwitchList;
        };

        $scope.closeDrawerMenu = function () {
            $scope.menuOpen = false;
        };

        $scope.logout = function () {
            var redirUrl = '/logout/';

            $timeout(function () {
                $window.location.href = redirUrl;
            }, 300);
        };

        var openEndOfDayPopup = function () {
            // Show a loading message until promises are not resolved
            $scope.$emit('showLoader');

            jsMappings.fetchAssets(['endofday'])
                .then(function () {
                    $scope.$emit('hideLoader');
                    ngDialog.open({
                        template: '/assets/partials/endOfDay/rvEndOfDayModal.html',
                        controller: 'RVEndOfDayModalController',
                        className: 'end-of-day-popup ngdialog-theme-plain'
                    });
                });
        };

        var openPostChargePopup = function () {
            // Show a loading message until promises are not resolved
            $scope.$emit('showLoader');

            jsMappings.fetchAssets(['postcharge', 'directives'])
                .then(function () {
                    $scope.isOutsidePostCharge = true;
                    $scope.$emit('hideLoader');
                    ngDialog.open(
                        {
                            template: '/assets/partials/postCharge/rvPostChargeV2.html',
                            controller: 'RVOutsidePostChargeController',
                            scope: $scope,
                            className: ''
                        });
                });
        };

        // subemenu actions
        $scope.subMenuAction = function (subMenu) {
            $scope.toggleDrawerMenu();

            if (subMenu === 'postcharges') {
                openPostChargePopup();
            }
            else if (subMenu === 'endOfDay') {
                openEndOfDayPopup();
            }
            else if (subMenu === 'adminSettings') {
                // CICO-9816 bug fix - Akhila
                $('body').addClass('no-animation');

                // CICO-41410 Set card readers to offline
                if (sntapp.cordovaLoaded && 'rv_native' === sntapp.browser) {
                    sntapp.cardReader.stopReader({
                        'successCallBack': function (data) {
                            $log.info('device set to offline', data);
                            $window.location.href = '/admin/h/' + sntAuthorizationSrv.getProperty();
                        },
                        'failureCallBack': function (data) {
                            $log.info('failed to set device to offline', data);
                            $window.location.href = '/admin/h/' + sntAuthorizationSrv.getProperty();
                        }
                    });
                } else {
                    $window.location.href = '/admin/h/' + sntAuthorizationSrv.getProperty();
                }

            }
            else if (subMenu === 'changePassword') {
                openUpdatePasswordPopup();
            }
            else if (subMenu === 'deviceStatus') {
                $scope.fetchDeviceStatus();
            }
        };

        // in order to prevent url change(in rover specially coming from admin/or fresh url entering with states)
        // (bug fix to) https://stayntouch.atlassian.net/browse/CICO-7975

        //
        // DEPRICATED!
        // since custom event emit and listning is breaking the
        // ng-animation associated with ui-view change
        //
        // REASON: There is a limited amount of time b/w the two $scopes dies and come into existance
        // '$emit' and '$on' somehow get more priority, by the time they are execured, $scopes have shifted
        // thus cancelling out animation, feels like animations are never considered
        //

        // when state change start happens, we need to show the activity activator to prevent further clicking
        // this will happen when prefetch the data

        // https://ui-router.github.io/guide/transitions#transition-lifecycle
        $transitions.onCreate({}, function (transition) {
            sntActivity.start('STATE_CHANGE' + transition.to().name.toUpperCase());

            // if menu is open, close it
            if ($scope.menuOpen) {
                $scope.menuOpen = !$scope.menuOpen;
                $scope.showSubMenu = false;
            }

            return true;
        });

        $transitions.onStart({}, function (transition) {
            $rootScope.previousState = transition.from();
            $rootScope.previousStateParams = transition.from().params;
        });


        $transitions.onSuccess({}, function (transition) {
            sntActivity.stop('STATE_CHANGE' + transition.to().name.toUpperCase());
        });

        $transitions.onError({}, function (transition) {
            sntActivity.stop('STATE_CHANGE' + transition.to().name.toUpperCase());
            $log.error('showErrorMessage', transition.error());
        });

        // This variable is used to identify whether guest card is visible
        // Depends on $scope.guestCardVisible in rvguestcardcontroller.js
        $scope.isGuestCardVisible = false;
        $scope.$on('GUESTCARDVISIBLE', function (event, data) {
            $scope.isGuestCardVisible = false;
            if (data) {
                // inoder to refresh the scroller in tab's and I dont knw why 'GUESTCARDVISIBLE' listened here :(
                $scope.$broadcast('REFRESH_ALL_CARD_SCROLLERS');
                $scope.isGuestCardVisible = true;
            }
        });

        $rootScope.$on('BROADCAST_SWIPE_ACTION', function (event, data) {
            $scope.$broadcast('SWIPE_ACTION', data);
        });

        $scope.successCallBackSwipe = function (data) {
            $scope.$broadcast('SWIPE_ACTION', data);
        };

        $scope.failureCallBackSwipe = function (errorMessage) {
            $scope.errorMessage = errorMessage;
        };

        $scope.uuidServiceSuccessCallBack = function (response) {
            // latest versions of RoverService return the device identifier as a string!
            $rootScope.UUID = response.Data || response;
        };

        $scope.uuidServiceFailureCallBack = function (error) {
            $scope.errorMessage = error;
            $rootScope.UUID = 'DEFAULT';
        };


        var options = {};

        options['successCallBack'] = $scope.successCallBackSwipe;
        options['failureCallBack'] = $scope.failureCallBackSwipe;
        options['uuidServiceSuccessCallBack'] = $scope.uuidServiceSuccessCallBack;
        options['uuidServiceFailureCallBack'] = $scope.uuidServiceFailureCallBack;

        $scope.numberOfCordovaCalls = 0;

        var initiateDesktopCardReader = function () {
            sntapp.desktopCardReader.setDesktopUUIDServiceStatus(true);
            sntapp.desktopCardReader.startDesktopReader($rootScope.ccSwipeListeningPort, options, $rootScope.ccSwipeListeningUrl);
        };

        /**
         * @returns {undefined} undefined
         */
        function doCBAPowerFailureCheck() {
            var maxTrials = 60,
                trialInterval = 1000,
                checkPendingPayments = function () {
                    $scope.$emit('CBA_PAYMENT_POWER_FAILURE_CHECK');
                },
                observeDevice = function () {
                    sntapp.cardReader.observeCBADeviceConnection({
                        successCallBack: checkPendingPayments,
                        failureCallBack: function (err) {
                            $log.warn('failure callback from observeCBADeviceConnection method', err);
                        }
                    });
                };

            // try to make this cordova call providing 1 min for cordova loading
            if (sntapp.browser === 'rv_native' && sntapp.cordovaLoaded) {
                observeDevice();
            } else {
                observeDeviceInterval = $interval(function () {
                    if (sntapp.browser === 'rv_native' && sntapp.cordovaLoaded) {
                        $interval.cancel(observeDeviceInterval);
                        observeDevice();
                    }
                }, trialInterval, maxTrials);
            }

            jsMappings.loadPaymentMapping().then(function () {
                jsMappings.loadPaymentModule().then(checkPendingPayments);
            });
        }

        /* Enabling desktop Swipe if we access the app from desktop ( not from devices) and
         * desktopSwipeEnabled flag is true
        */
        if (!rvUtilSrv.checkDevice.any()) {
            sntapp.desktopCardReader.isDesktopSwipeEnabled = $rootScope.desktopSwipeEnabled;
            $rootScope.isDesktopUUIDServiceInvoked = true;
            initiateDesktopCardReader();
        }

        /*
         * To show add new payment modal
         * @param {{passData}} information to pass to popup - from view, reservationid. guest id userid etc
         * @param {{object}} - payment data - used for swipe
         */

        /*
         * Call payment after CONTACT INFO
         */
        $scope.$on('GUESTPAYMENTDATA', function (event, paymentData) {
            $scope.$broadcast('GUESTPAYMENT', paymentData);
        });

        $scope.$on('SHOWGUESTLIKES', function () {
            $scope.$broadcast('SHOWGUESTLIKESINFO');
        });
        $scope.guestInfoToPaymentModal = {};
        $scope.$on('SETGUESTDATA', function (event, guestData) {
            $scope.guestInfoToPaymentModal = guestData;

        });
        $scope.$on('CLOSE_AVAILIBILTY_SLIDER', function () {
            $scope.$broadcast('CLOSED_AVAILIBILTY_SLIDER');
        });

        $rootScope.modalClosing = false;

        /*
         * Tp close dialog box
         */
        $scope.closeDialog = function () {
            document.activeElement.blur();
            $scope.$emit('hideLoader');

            $rootScope.modalClosing = true;
            setTimeout(function () {
                ngDialog.close();
                $rootScope.modalClosing = false;
                window.scrollTo(0, 0);
                $scope.$apply();
            }, 700);
        };

        $scope.closeDialogImmediately = function () {
            ngDialog.close();
        };
        /*
         * To fix issue with ipad keypad - 7702
         */
        $scope.setPosition = function () {
            if (document.activeElement.nodeName !== 'INPUT' && document.activeElement.nodeName !== 'SELECT') {
                document.activeElement.blur();
                setTimeout(function () {
                    window.scrollTo(0, 0);
                }, 700);
            }
        };

        $rootScope.showWebsocketConnectionError = function () {


            // Hide loading message
            $scope.$emit('hideLoader');
            ngDialog.open({
                template: '/assets/partials/desktopSwipe/rvWebsocketConnectionError.html',
                className: 'ngdialog-theme-default1 modal-theme1',
                closeByDocument: false,
                scope: $scope
            });
        };

        /**
         * Handles the OWS error - Shows a popup having OWS connection test option
         */
        $rootScope.showOWSError = function () {
            // Hide loading message
            $scope.$emit('hideLoader');
            if (!$rootScope.isOWSErrorShowing) {
                // close existing popups
                ngDialog.closeAll();
                $timeout(function () {
                    $rootScope.isOWSErrorShowing = true;
                    ngDialog.open({
                        template: '/assets/partials/housekeeping/rvHkOWSError.html',
                        className: 'ngdialog-theme-default1 modal-theme1',
                        controller: 'RVOWSErrorCtrl',
                        closeByDocument: false,
                        scope: $scope
                    });
                }, 700);
            }
        };

        // CICO-13582 Display a timeout error message, without try again button.
        // We are using the same message as that of OWS timeout as of now.
        // Keeping the two popup separate since the message may change in future.
        $rootScope.showTimeoutError = function () {
            // Hide loading message
            $scope.$emit('hideLoader');
            ngDialog.open({
                template: '/assets/partials/errorPopup/rvTimeoutError.html',
                className: 'ngdialog-theme-default1 modal-theme1',
                controller: 'RVTimeoutErrorCtrl',
                closeByDocument: false,
                scope: $scope
            });
        };

        /**
         * Handles the bussiness date change in progress
         */

        $rootScope.LastngDialogId = '';

        $scope.closeBussinnesDatePopup = function () {
            ngDialog.close($rootScope.LastngDialogId, '');
        };

        $rootScope.$on('ngDialog.opened', function (e, $dialog) {
            $rootScope.LastngDialogId = $dialog.attr('id');
        });

        $rootScope.showBussinessDateChangingPopup = function () {

            // Hide loading message
            $scope.$emit('hideLoader');
            // if already shown no need to show again and again
            if (!$rootScope.isBussinessDateChanging && $rootScope.isStandAlone && !$rootScope.isCurrentUserChangingBussinessDate) {
                $rootScope.isBussinessDateChanging = true;
                var $dialog = ngDialog.open({
                    template: '/assets/partials/common/bussinessDateChangingPopup.html',
                    className: 'ngdialog-theme-default1 modal-theme1',
                    closeByDocument: false,
                    scope: $scope
                });
            }
        };

        $rootScope.$on('bussinessDateChangeInProgress', function () {
            $rootScope.showBussinessDateChangingPopup();
        });

        $scope.goToDashboard = function () {
            ngDialog.close();
            // to reload app in case the bussiness date is changed
            $window.location.reload();
        };

        /**
         * Handles the bussiness date change completion
         */
        $rootScope.showBussinessDateChangedPopup = function (message) {
            $rootScope.isBussinessDateChanging = false;
            $scope.bussinessDateMessage = message;
            // Hide loading message
            $scope.$emit('hideLoader');
            if (!$rootScope.isBussinessDateChanged) {
                $rootScope.isBussinessDateChanged = true;
                ngDialog.open({
                    template: '/assets/partials/common/rvBussinessDateChangedPopup.html',
                    className: 'ngdialog-theme-default1 modal-theme1',
                    closeByDocument: false,
                    scope: $scope
                });
            }
        };


        /**
         * function to execute on clicking latecheckout button
         */
        $scope.clickedOnHeaderLateCheckoutIcon = function () {
            if ($rootScope.default_dashboard !== 'HOUSEKEEPING') {
                var type = 'LATE_CHECKOUT';

                $state.go('rover.search', {
                    'type': type,
                    'from_page': 'DASHBOARD'
                });
            }
        };

        $scope.clickedOnQueuedRoomsIcon = function () {
            if ($rootScope.default_dashboard === 'HOUSEKEEPING') {
                $state.go('rover.housekeeping.roomStatus', {
                    'roomStatus': 'QUEUED_ROOMS'
                });
            } else {
                $state.go('rover.search', {
                    'type': 'QUEUED_ROOMS',
                    'from_page': 'DASHBOARD'
                });
            }
        };

        $scope.$on('UPDATE_QUEUE_ROOMS_COUNT', function (event, data) {
            if (data === 'remove') {
                $scope.userInfo.queue_rooms_count = parseInt($scope.userInfo.queue_rooms_count) - parseInt(1);
            } else {
                $scope.userInfo.queue_rooms_count = parseInt($scope.userInfo.queue_rooms_count) + parseInt(1);
            }

        });

        $scope.openPaymentDialogModal = function (passData, paymentData) {
            $scope.passData = passData;
            $scope.paymentData = paymentData;
            ngDialog.open({
                template: '/assets/partials/roverPayment/rvAddPayment.html',
                controller: 'RVPaymentAddPaymentCtrl',
                scope: $scope
            });
        };

        $scope.redirectToHotel = function (hotel) {
            var redirUrl = '/staff/h/' + hotel.hotel_uuid;

            setTimeout(function () {
                $window.location.href = redirUrl;
            }, 300);
        };

        /*
         *  CICO-27519 - Handle inline styles inside ng-bind-html directive.
         *  Let   =>  $scope.htmlData = "<p style='font-size:8pt;''>Sample Text</p>";
         *  Usage =>  <td data-ng-bind-html="trustAsHtml(htmlData)"></td>
         *  REF   =>  https://docs.angularjs.org/api/ng/service/$sce
         */
        $rootScope.trustAsHtml = function (string) {
            return $sce.trustAsHtml(string);
        };

        /**
         * Converts charactors to their html encoded value
         * @param  {string} str input value
         * @return {string}     encoded value
         */
        var toHTMLSpecials = function (str) {
            if (typeof str === 'string' && !!str) {
                str = str.replace(/&/g, '&amp;');
                str = str.replace(/"/g, '&quot;');
                str = str.replace(/'/g, '&#039;');
                str = str.replace(/</g, '&lt;');
                str = str.replace(/>/g, '&gt;');
            }
            return str;
        };

        /**
         * Forms highlighted html content to use with ng-bind-html
         * Handles case when there are special charactors
         * @param  {string} text text to format
         * @param  {string} queryString search query
         * @return {Object} trusted HTML object
         */
        $rootScope.getHighlightedHTML = function (text, query) {
            text = text || '';
            query = query || '';

            if (!query) {
                return $rootScope.trustAsHtml(toHTMLSpecials(text));
            }

            // convert HTML syntax charactors to their encoded value ex: < to &lt;
            text = text.split(query).map(toHTMLSpecials);
            query = toHTMLSpecials(query);
            text = text.join('<span class="highlight">' + query + '</span>');

            return $rootScope.trustAsHtml(text);
        };


        var MENU_SCROLLER = 'MENU_SCROLLER';
        var setupScrolls = function () {
            var scrollerOptions = {
                tap: true,
                preventDefault: false,
                showScrollbar: true
            };

            $scope.setScroller(MENU_SCROLLER, scrollerOptions);
        };

        setupScrolls();
        var refreshScroll = function (name, reset) {
            $scope.refreshScroller(name);
            /**/
            if (!!reset && $scope.myScroll.hasOwnProperty(name)) {
                $scope.myScroll[name].scrollTo(0, 0, 100);
            }
        };

        $scope.refreshMenuScroll = function (reset) {
            refreshScroll(MENU_SCROLLER, reset);
        };

        $scope.startActivity = function (activity) {
            sntActivity.start(activity);
        };

        $scope.stopActivity = function (activity) {
            sntActivity.stop(activity);
        };

        // CICO-45043 Add Device Status Menu
        document.addEventListener('WS_CONNECTION_ESTABLISHED', function () {
            $scope.formMenu();
        });

        document.addEventListener('WS_CONNECTION_LOST', function () {
            $scope.formMenu();
        });

        (function() {
            if ($window.dataLayer) {
                $window.dataLayer.push({
                    hotelCode: hotelDetails.hotel_code,
                    userRole: (_.values(hotelDetails.current_user.roles)).
                        map(function(r) {return r.name;}).
                        join(', ')
                });
            }
        })();

    }
]);
