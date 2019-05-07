function BaseCtrl($scope) {

    $scope.businessDate = '';

    $scope.fetchedCompleted = function(data) {
        $scope.$emit('hideLoader');
    };

    $scope.clearErrorMessage = function() {
        $scope.errorMessage = '';
        $scope.successMessage = '';
    };
    $scope.clearErrorMessage();
    $scope.showErrorMessage = function(errorMessage) {

    };

    // function that converts a null value to a desired string.
    // if no replace value is passed, it returns an empty string
    $scope.escapeNull = function(value, replaceWith) {
        var newValue = '';

        if (typeof replaceWith !== 'undefined' && replaceWith !== null) {
            newValue = replaceWith;
        }
        var valueToReturn = value === null || typeof value === 'undefined' ? newValue : value;

        return valueToReturn;
    };
    $scope.debuggingCardPayment = function(btn) {
        console.info('sntZestStation.cardSwipeDebug: ', sntZestStation.cardSwipeDebug);
        var url = document.location,
            inDevEnvironment = false;

        if (url.hostname && btn) { // if btn === true, then the user is clicking continue to bypass cc screen in dev environment
            if (typeof url.hostname === typeof 'str') {
                if (url.hostname.indexOf('pms-dev') !== -1 ||
                    url.hostname.indexOf('pms-release') !== -1 ||
                    url.hostname.indexOf('192.168.1.218') !== -1 ||
                    url.hostname.indexOf('192.168.1.239') !== -1 ||
                    url.hostname.indexOf('localhost') !== -1) {

                    inDevEnvironment = true;
                }
            }
        }

        if (zestSntApp.cardSwipeDebug || inDevEnvironment) { // in production, dont allow this function unless manually called for debugging via console like [   zestSntApp.cardSwipeDebug(true)   ]
            return true;
        } else { return false; }
    };
    $scope.inProd = function() {
        var inDevEnvironment = false;
        var url = true ? document.location : window.location;

        if (url.hostname) {
            if (typeof url.hostname === typeof 'str') {
                if (url.hostname.indexOf('pms-dev') !== -1 ||
                    url.hostname.indexOf('pms-release') !== -1 ||
                    url.hostname.indexOf('192.168.1') !== -1 ||
                    url.hostname.indexOf('localhost') !== -1) {
                    inDevEnvironment = true;
                }
            }
        }
        return !inDevEnvironment;
    };
    $scope.fetchedFailed = function(errorMessage) {
        $scope.$emit('hideLoader');
        // scroll to top of the page where error message is shown
        if (angular.element(document.querySelector('.content')).find('.error_message').length) {
            angular.element(document.querySelector('.content')).scrollTop(0);
        }
        if ($scope.hasOwnProperty('errorMessage')) {
            $scope.errorMessage = errorMessage;
            $scope.successMessage = '';
        } else {
            $scope.$emit('showErrorMessage', errorMessage);
        }
        // if needed ,to be handled as per requirements in controllers (scroll to top,empty fields)
        $scope.$broadcast('scrollToErrorMessage');
        $scope.$emit('GENERAL_ERROR', errorMessage);
    };

    $scope.invokeApi = function(serviceApi, params, successCallback, failureCallback, loaderType) {
        // loaderType options are "BLOCKER", "NONE"

        if (typeof loaderType === 'undefined') {
            loaderType = 'BLOCKER';
        }
        if (loaderType.toUpperCase() === 'BLOCKER') {
            $scope.$emit('showLoader');
        }
        successCallback = typeof successCallback === 'undefined' ? $scope.fetchedCompleted : successCallback;
        failureCallback = typeof failureCallback === 'undefined' ? $scope.fetchedFailed : failureCallback;

        return serviceApi(params).then(successCallback, failureCallback);

    };

    $scope.callAPI = function(serviceApi, options) {
        var identifier = _.uniqueId('API_REQ_'),
            options = options ? options : {},
            params = options['params'] ? options['params'] : null,
            loader = options['loader'] ? options['loader'] : 'BLOCKER',
            showLoader = loader.toUpperCase() === 'BLOCKER' ? true : false,
            successCallBack = options['successCallBack'] ? options['successCallBack'] : options['onSuccess'] ? options['onSuccess'] : $scope.fetchedCompleted,
            failureCallBack = options['failureCallBack'] ? options['failureCallBack'] : options['onFailure'] ? options['onFailure'] : $scope.fetchedFailed,
            successCallBackParameters = options['successCallBackParameters'] ? options['successCallBackParameters'] : null,
            failureCallBackParameters = options['failureCallBackParameters'] ? options['failureCallBackParameters'] : null;

        if (showLoader) {
            if ($scope.startActivity) {
                $scope.startActivity(identifier);
            }
        }

        return serviceApi(params).then(
            // success call back
            function(data) {
                if (showLoader) {
                    if ($scope.stopActivity) {
                        $scope.stopActivity(identifier);
                    }
                }
                if (successCallBack) {
                    if (successCallBackParameters) {
                        successCallBack(data, successCallBackParameters);
                    } else {
                        successCallBack(data);
                    }
                }
            },
            // failure callback
            function(error) {
                if (showLoader) {
                    if ($scope.stopActivity) {
                        $scope.stopActivity(identifier);
                    }
                }
                if (failureCallBack) {
                    if (failureCallBackParameters) {
                        failureCallBack(error, failureCallBackParameters);
                    } else {
                        failureCallBack(error);
                    }
                }
            }
        );
    };

    // handle drag and drop events
    $scope.hideCurrentDragItem = function(ev, ui) {
        $(ev.target).hide();
    };

    $scope.showCurrentDragItem = function(ev, ui) {
        $(ev.target).show();
    };

    /**
     * function to get day against a date
     * if you give today's date it will return 'Today', Tomorrow will return against tomorrow's date
     * for others, it will return week day (Sunday, Monday..)
     */

    $scope.getSimplifiedDayName = function(date) {
        var returnText = '';

        try {
            var passedDate = tzIndependentDate(date);
            var currentDate = tzIndependentDate($scope.businessDate);
            var timeDiff = passedDate.getTime() - currentDate.getTime();
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if (diffDays === 0) {
                returnText = 'Today';
            } else if (diffDays === 1) {
                returnText = 'Tomorrow';
            } else {
                var weekday = new Array(7);

                weekday[0] = 'Sunday';
                weekday[1] = 'Monday';
                weekday[2] = 'Tuesday';
                weekday[3] = 'Wednesday';
                weekday[4] = 'Thursday';
                weekday[5] = 'Friday';
                weekday[6] = 'Saturday';
                returnText = weekday[passedDate.getDay()];
            }
            return returnText;
        } catch (e) {
            return date;
        }
    };

    /*
     * To set the title of each navigation
     */
    $scope.setTitle = function(title) {
        document.title = title;
    };

    $scope.goBack = function($rootScope, $state) {

        if ($rootScope.previousStateParam) {
            $state.go($rootScope.previousState, {
                menu: $rootScope.previousStateParam
            });
        } else if ($rootScope.previousState) {
            $state.go($rootScope.previousState);
        } else {
            $state.go('admin.dashboard', {
                menu: 0
            });
        }

    };

    /*
        this is the default scroller options used by controllers
        this can be modified through setScroller function
    */
    $scope.timeOutForScrollerRefresh = 300;
    var defaultScrollerOptions = {
        snap: false,
        scrollbars: 'custom',
        hideScrollbar: false,
        click: false,
        scrollX: false,
        scrollY: true,
        preventDefault: true,
        preventDefaultException: {
            tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A)$/
        }
    };

    /*
      function to handle scroll related things
      @param1: string as key
      @param2: object as scroller options
    */
    $scope.setScroller = function(key, scrollerOptions) {
        if (typeof scrollerOptions === 'undefined') {
            scrollerOptions = {};
        }
        // we are merging the settings provided in the function call with defaults
        var tempScrollerOptions = angular.copy(defaultScrollerOptions);

        angular.extend(tempScrollerOptions, scrollerOptions); // here is using a angular function to extend,
        scrollerOptions = tempScrollerOptions;
        // checking whether scroll options object is already initilised in parent controller
        // if so we need add a key, otherwise initialise and add
        var isEmptyParentScrollerOptions = isEmptyObject($scope.$parent.myScrollOptions);

        if (isEmptyParentScrollerOptions) {
            $scope.$parent.myScrollOptions = {};
        }

        if (key === 'res-details') {
            scrollerOptions.click = true;
            scrollerOptions.preventDefault = false;
        }

        $scope.$parent.myScrollOptions[key] = scrollerOptions;
    };

    /*
      function to refresh the scroller
      @param1: string as key
    */
    $scope.refreshScroller = function(key) {
        setTimeout(function() {
            if (!!$scope.$parent && $scope.$parent.myScroll) {
                if (key in $scope.$parent.myScroll) {
                    $scope.$parent.myScroll[key].refresh();
                }
            }
            if ($scope.hasOwnProperty('myScroll') && key in $scope.myScroll) {
                $scope.myScroll[key].refresh();
            }
        }, $scope.timeOutForScrollerRefresh);
    };

    $scope.getScroller = function(key) {
        if (!!$scope.$parent && $scope.$parent.myScroll) {
            if (key in $scope.$parent.myScroll) {
                return $scope.$parent.myScroll[key];
            }
        }

        if ($scope.hasOwnProperty('myScroll') && key in $scope.myScroll) {
            return $scope.myScroll[key];
        }
        return null;
    };

    /*
     * MLI integration
     */

    $scope.fetchMLI = function(sessionDetails, successCallback, failureCallback) {

        var success = function(response) {
            $scope.$emit('hideLoader');
            successCallback(response);
            $scope.$apply();
        };
        var failure = function(data) {
            $scope.$emit('hideLoader');
            var errorMessage = ['There is a problem with your credit card'];

            failureCallback(errorMessage);
            $scope.$apply();
        };

        if (sessionDetails.cardNumber.length > 0) {
            try {
                $scope.$emit('showLoader');
                sntapp.MLIOperator.fetchMLISessionDetails(sessionDetails, success, failure);
            } catch (err) {
                $scope.$emit('hideLoader');
                var errorMessage = ['There was a problem connecting to the payment gateway.'];

                failureCallback(errorMessage);
            }
        } else {
            var errorMessage = ['There is a problem with your credit card'];

            failureCallback(errorMessage);
        }

    };

    var getIpadType = function(s, zs) {
        if ((s.width === '768' || s.width === 768) && (s.height === 1024 || s.height === '1024')) {
            return 'iPad Mini, iPad Air';
        } else if ((s.width === '834' || s.width === 834) && (s.height === 1112 || s.height === '1112')) {
            return 'iPad Pro 10.5';
        } else if ((s.width === '1024' || s.width === 1024) && (s.height === 1366 || s.height === '1366')) {
            return 'iPad Pro 12.9';
        } else {
            if (zs.isIpad) {
                return 'iPhone / Watch';
            } else {
                return 'Non-Ipad';
            }
        }

    };

    $scope.reservationHasPassportsScanned = function(guestData) {
        var areAllRequiredIdsScanned = true;

        if ($scope.zestStationData.check_in_collect_passport || $scope.zestStationData.kiosk_scan_all_guests) {
            _.each(guestData.accompanying_guests_details, function(guest) {
                if (!guest.is_passport_present) {
                    areAllRequiredIdsScanned = false;
                }
            });
        }
        if (areAllRequiredIdsScanned && !guestData.primary_guest_details.is_passport_present) {
            areAllRequiredIdsScanned = false;
        }

        return areAllRequiredIdsScanned;
    };

    $scope.trackEvent = function(event_name, event_type, from, at) {
        // ie. _gaq.push(['_trackEvent', eventLabel, 'clicked']);
        // 
        // console.log('calling track event: ', 'trackAnalyticEvent', arguments);
        var zs = {};

        if ($scope && $scope.$parent || $scope.zestStationData) {
            zs = $scope.$parent.zestStationData ? $scope.$parent.zestStationData : $scope.zestStationData;
            if (zs) {

                // JSON format to parse from a string 
                var today = new Date();
                var currentTime = today.toString();

                var status = {
                    'theme': zs.theme + '_' + zs.hotel_id,
                    'workstation_name': zs.workstationName,
                    'workstation_status': zs.workstationStatus,
                    'OOO_treshold': zs.kioskOutOfOrderTreshold,
                    'consecutive_key_fails': zs.consecutiveKeyFailure,
                    'handler_connected_status': zs.stationHandlerConnectedStatus,
                    'hourly_rate_on': zs.isHourlyRateOn,
                    'key_encoder_id': zs.key_encoder_id,
                    'ipad': zs.isIpad ? 'ipad' : 'non-ipad',
                    'width_height': screen.width + ', ' + screen.height,
                    'type': getIpadType(screen, zs),
                    // one session = until a kiosk is 'refreshed', the OOS reasons will be added as an array of objects, reason + timestamp
                    'session_oos_reasons': zs.sessionOosReason,
                    'historical_oos_reasons': zs.historicalOosReason,
                    // session_activity, ie.  [ {'cn': '234211', 'activity':'reservation found', 'time': Tue/12/12/12, } ] 
                    'session_activity': zs.sessionActivity,

                    'ipad_version': zs.appVersion ? zs.appVersion : 'unknown-version', // include version here once cordova passes the info

                    'current_screen': at ? at : '',
                    'from_screen': from ? from : '',

                    'idle_timer': {
                        'enabled': zs.idle_timer ? zs.idle_timer.enabled : false,
                        'max': zs.idle_timer ? zs.idle_timer.max : "",
                        'prompt': zs.idle_timer ? zs.idle_timer.prompt : ""
                    },
                    'upsell_addons_enabled': false,
                    'upsell_rooms_enabled': false,
                    'kiosk_time': currentTime,
                    'origin': location.origin ? location.origin : location.href
                };

                if ($scope.goingOffline) {
                    status.current_screen = 'device.going_offline';
                }

                if (!navigator.onLine) {
                    $scope.wasOffline = true;

                } else if (navigator.onLine && $scope.wasOffline) {
                    $scope.wasOffline = false;
                    status.current_screen = 'device.back_online';
                    // detect if kiosk was offline, then came back online
                    $scope.trackSessionActivity('STATION_ONLINE', 'BackOnline', '', '', true);
                }

                if (event_type === 'status_update' || event_type === 'activity_update') {
                    // 
                    // This data goes through Google Analytics, therefore- be very explicit in the data to send
                    // DO NOT send any Personal Identifiable information, Credit Card info, or IP address 
                    // configurations.
                    // 
                    // Only send metrics and settings like CC_SWIPE ON/OFF, or Handler ON/OFF, etc.
                    // if you do not know if something will contain personal info, do not include it.
                    // 
                    // console.log(zs);
                    // 
                    event_name = JSON.stringify(status);
                }
                try {
                    // throw 500; // test catch
                    trackAnalyticEvent(event_name, event_type);
                    $scope.zestStationData.ltrack = 'online';
                } catch (err) {
                    // visually see on ipad if analytics are being sent ok or not
                    // if not, check from diagnostics info > top-right > addt'l info (tap)
                    $scope.zestStationData.ltrack = 'offline';
                    console.warn('diagnostics logging failed: ', err);

                }
            }


        }

        /*
          We'll also append some hotel identifer information
          Hotel Name + Theme
          Workstation Name
          Encoder Name + Encoder ID
          Idle Timer (enabled, prompt, timeout)
          Hourly Rate
          kioskOutOfOrderTreshold
          stationHandlerConnectedStatus
          isIpad
         */
    };


    $scope.wasOffline = true;

    $scope.addReasonToOOSLog = function(reason) {
        // for each session of this station, send along the OOS reason(s) with timestamps
        // for now, just include the workstation time
        // 
        var today = new Date();
        var currentTime = today.toString(),
            onlineOffline = navigator.onLine ?  'online' : 'offline';
            
        var oosReason = {
            'reason': reason,
            'datetime': currentTime,
            'internet_status': onlineOffline
        };

        if (reason === 'GET_CONFIGURATION_FAILED' || reason === 'GET_WORKSTATION_FAILED') {
            oosReason.reason += ': (' + onlineOffline + ')';
        }
        // append to localstorage log in case device is offline
        $scope.$emit('PUSH_OOS_REASON', oosReason);

        $scope.zestStationData.sessionOosReason.push(oosReason);
        $scope.zestStationData.lastOOSReason = $scope.$filter('translate')(oosReason.reason) ? $scope.$filter('translate')(oosReason.reason) : oosReason.reason;
        // at the next status-update, the kiosk will log the "$scope.zestStationData.sessionOosReason" array with all OOS reason events
    };


    $scope.resetTrackers = function() {
        $scope.zestStationData.session_conf = '';
        $scope.zestStationData.sessionActivity = [];
    };

    $scope.trackSessionActivity = function(flow, activity, conf, mode, send) {
        // for each session of this station, send along the OOS reason(s) with timestamps
        // for now, just include the workstation time
        // 
        var today = new Date();
        var currentTime = today.toString();

        if (activity === 'APP_CLOSE_EVT') {
            $scope.goingOffline = true;
        }

        $scope.zestStationData.sessionActivity.push({
            'flow': flow ? flow : '',
            'activity': activity,
            'conf': conf ? conf : '',
            'mode': mode ? mode : '',
            'datetime': currentTime
        });
        if (send) {
            $scope.trackEvent('health_check', 'activity_update');
        }
        // at the next status-update, the kiosk will log the "$scope.zestStationData.sessionOosReason" array with all OOS reason events
    };


}
