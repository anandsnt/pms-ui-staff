admin.controller('adAnalyticSetupCtrl', ['$scope', 'adAnalyticSetupSrv', '$state', '$filter', '$stateParams', function($scope, adAnalyticSetupSrv, $state, $filter, $stateParams) {

    /*
     * To retrieve previous state
     */

    $scope.errorMessage = '';
    $scope.successMessage = '';
    $scope.isLoading = true;

    BaseCtrl.call(this, $scope);


    $scope.fetchAnalyticSetup = function() {

        var fetchAnalyticSetupSuccessCallback = function(data) {
            $scope.isLoading = false;
            $scope.$emit('hideLoader');

            // NOTE: This is required as the unset values are expected to be empty string and not null
            if (!data.product_customer_proprietary.selected_tracker) {
                data.product_customer_proprietary.selected_tracker = '';
            }
            $scope.data = data;

        };

        $scope.emailDatas = [];
        $scope.invokeApi(adAnalyticSetupSrv.fetchSetup, {}, fetchAnalyticSetupSuccessCallback);

    };
    $scope.fetchAnalyticSetup();

    $scope.saveAnalyticSetup = function() {

        var saveAnalyticSetupSuccessCallback = function() {
            $scope.isLoading = false;
            $scope.$emit('hideLoader');

        };
        var unwantedKeys = ['available_trackers'];
        var saveData = dclone($scope.data, unwantedKeys);

        $scope.invokeApi(adAnalyticSetupSrv.saveSetup, saveData, saveAnalyticSetupSuccessCallback);

    };

    $scope.showStationDashboard = false;
    $scope.toggleStationDashboard = function() {

        if ($scope.showDeviceDetails !== '') {
            $scope.showDeviceDetails = '';
        } else {

            $scope.showStationDashboard = !$scope.showStationDashboard;
            // if ($scope.showStationDashboard) {
            // }
        }

    };


    $scope.loading = false;
    $scope.signedIn = false;
    $scope.formattedDate = function(d) {
        var date = new Date(d);
        var options = {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        var formatted = date.toLocaleTimeString('en-us', options);

        return formatted;
    };
    $scope.clickedMask = function() {
        $scope.showDeviceDetails = '';
    };

    var getHotelNameFromId = function(id) {
        var hotels = {
            '4': 'NYC',
            '165': 'Boston',
            '166': 'Singapore',
            '53': 'Paris',
            '13': 'London Heathrow'
        };

        if (hotels[id]) {
            return hotels[id];
        }
        return id;

    };

    $scope.getHotelName = function(themeIdentifier) {
        if (themeIdentifier && themeIdentifier.indexOf('_') !== -1) {
            var nameSplit = themeIdentifier.split('_');
            var hotel_id = nameSplit[nameSplit.length - 1];
            var name = '';

            for (var n in nameSplit) {
                if (hotel_id !== nameSplit[n]) {
                    name += ' ' + nameSplit[n];
                    name = camelize(name);
                }
            }


            hotel_id = getHotelNameFromId(hotel_id);


            return name + ' (' + hotel_id + ')';
        }
        return 'unk';

    };

    $scope.hotelList = [];
    $scope.showHotelDetails = '';
    $scope.showDeviceDetails = '';
    $scope.deviceDetailsToShow = {};
    $scope.evtLimit = 50;
    $scope.defaultEvtLimit = 50;
    $scope.eventFilter = '';

    $scope.$watch('eventFilter', function() {
        if ($scope.eventFilter.length > 2) {
            $scope.evtLimit = $scope.deviceDetailsToShow.events.length;
        }
    });

    var limitStep = 25;

    $scope.limit = limitStep;
    $scope.incrementLimit = function(showAll) {

        $scope.evtLimit += limitStep;
        if (showAll) {
            $scope.evtLimit = $scope.deviceDetailsToShow.events.length;
        }
    };
    $scope.decrementLimit = function() {
        $scope.evtLimit -= limitStep;
    };

    $scope.viewDeviceDetails = function(device) {
        $scope.showEvts = '';
        $scope.evtLimit = $scope.defaultEvtLimit;

        if ($scope.showDeviceDetails === device.name) {
            $scope.showDeviceDetails = '';
            $scope.deviceDetailsToShow = {};
        } else {
            $scope.showDeviceDetails = device.name;
            $scope.deviceDetailsToShow = device;
        }

    };
    $scope.showEvts = '';
    $scope.showEvtDetails = function(e, index) {
        if ($scope.showEvts === index) {
            $scope.showEvts = '';
        } else {
            $scope.showEvts = index;
        }

        $scope.showOOSEvts = false;
    };

    $scope.showEvtOOSHistory = function() {
        $scope.showOOSEvts = !$scope.showOOSEvts;
    };

    $scope.hideEvtDetails = function() {
        $scope.showEvts = '';
    };

    $scope.viewHotelDetails = function(hotel) {

        if ($scope.showHotelDetails === hotel.name) {
            $scope.showHotelDetails = '';
        } else {
            $scope.showHotelDetails = hotel.name;
        }

    };

    $scope.$on('CLEAR_SCREEN', function() {
        $scope.hotelList = [];
    });

    $scope.showHotelInfo = function(hotel) {

        for (var i in $scope.hotelList) {
            if ($scope.hotelList[i].name === hotel.name) {
                return true;
            }
        }
        return false;
    };

    $scope.$on('UPDATE_DATA', function() {
        // update response returned,
        // update chart/visualizations
        $scope.$digest();
    });
    $scope.$on('LOADING_COMPLETE', function() {
        $scope.loading = false;
    });


    $(function() {
        $('#datepicker-from').datepicker();
        $('#datepicker-to').datepicker();
    });


    var overrideFromDate = false,
        overrideFromDateValue = '2017-07-24',
        overrideToDate = false,
        overrideToDateValue = '2017-07-24';

    var PMS_DEV = '147323835',
        PMS_PRODUCTION = '147335247',
        CLIENT_ID_LOCAL = '864320523517-3knpgsou4qd4nd878s4rs3fffuvoo4gg.apps.googleusercontent.com',
        CLIENT_ID_DEV = '864320523517-vpu1oua25tiavok0eqfen2tqt58gdtf0.apps.googleusercontent.com';

    var selectedEnv = {
        'PMS_DEV': PMS_DEV,
        'PMS_PRODUCTION': PMS_PRODUCTION
    };
    // clientsecret: 70WSoGx7nC_mmREHgvBn0JDu
    // 

    $scope.VIEW_ID_SELECTED = 'PMS_PRODUCTION';

    var VIEW_ID = selectedEnv[$scope.VIEW_ID_SELECTED],
        WEB_CLIENT_ID = CLIENT_ID_DEV,
        API_KEY = 'AIzaSyAvQKgo6elOcn6A49UPCiWVSmE5c24K3Yc',
        profile = {};

    /* 
    var getMonthN = function(mo) {
        var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        for (var i in monthNames) {
            if (monthNames[i].toLowerCase() === mo.toLowerCase() || monthNames[i].toLowerCase().indexOf(mo.toLowerCase()) !== -1) { // exact or not
                if (i < 10) {
                    return '0' + i;
                }
                return i;

            }
        }
    };
    
    var getTodayAsFormattedDateString = function() {
        var t = new Date();
        var to = t.toString();
        var tod = to.split(' ');

        var day = tod[2],
            month = getMonthN(tod[1]),
            yr = tod[3];

        // var today = yr + '-' + month + '-' + day;
        var today = yr + '-' + month + '-' + 25;
        return today;
    };
    */

    // metricLabelIndex is used to match the metric label with its value, 
    // the response data is returned in the same order as its passed
    var metricLabelIndex = [];
    // 

    var getReportMetric = function(startDate, endDate, expression, label, dimension, pageToken) {
        // returns a metric object used to fetch metrics for a given date range
        //
        metricLabelIndex.push(label);

        var requestObj = {
            'viewId': VIEW_ID,

            'dateRanges': [{
                'startDate': startDate,
                'endDate': endDate
            }],

            'metrics': [{
                'expression': expression
            }],
            'dimensions': [{
                // "name": "ga:city"
                'name': dimension ? dimension : 'ga:city'
            }]

        };

        if (pageToken) {
            requestObj.pageToken = pageToken;
        }

        return requestObj;
    };


    var updateHotelStatus = function($scope) {
        var hotel, device;

        for (var i in $scope.deviceByHotel) {
            hotel = $scope.deviceByHotel[i];

            for (var d in hotel.devices) {
                device = hotel.devices[d];
                // console.warn('device: [', device.workstation_name, ']: ', device.status);
                if (hotel.status === 'In-Order' && device.status !== 'In-Order') {
                    hotel.status = device.status;
                }
            }

            // hotel.devices[i];

            // if ($scope.deviceByHotel[hotel].status === 'In-Order' && e.workstation_status !== 'in-order') {
            //      $scope.deviceByHotel[hotel].status = $scope.deviceByHotel[hotel].devices[s].status
            //  }
        }
    };


    var camelize = function(str) {
        return str.replace(/\W+(.)/g, function(match, chr) {
            return chr.toUpperCase();
        });
    };


    var filterByHotel = function(events, $scope) {
        console.log('--filterByHotel--');
        $scope.deviceByHotel = {};
        // ie. deviceByHotel.yotel_131 = {
        //      events: [],
        //      info: {latest event JSON info}
        // }
        var e, 
            hotel, 
            station, 
            station_in_list, 
            // currentDeviceInfo, 
            // latestDeviceEvt, 
            hotelDevice, 
            hotelDeviceEvtTime; // station = device associated with the event

        // list of hotels for UI to loop through and render a hotel list
        // so users can select by hotel > then device
        // 
        // $scope.hotelList = [];
        console.warn(events.length + ' total events');
        for (var i in events) {
            e = events[i];

            if (typeof e.workstation_name === typeof undefined) {
                continue;
            }

            hotel = e.theme;
            station = e.workstation_name ? e.workstation_name.replace(/\s+/g, '') : '';
            // latestDeviceEvt = {};
            hotelDevice = {};
            hotelDeviceEvtTime = '';
            station_in_list = false;
            // currentDeviceInfo = {};

            if (!$scope.deviceByHotel[hotel]) {

                // init info for hotel
                // 
                // init workstation-specific event

                e.lastUpdate = $scope.formattedDate(e.kiosk_time);

                // HOTEL overview
                $scope.deviceByHotel[hotel] = {
                    'events': [e],
                    'info': e,
                    'name': $scope.getHotelName(e.theme),
                    'devices': [],
                    'status': e.workstation_status === 'in-order' ? 'In-Order' : 'Out-of-Order' // rollup of lowest kiosk status, if any kiosk has a lower status, then it should override this
                };

                // Station-Specific

                $scope.deviceByHotel[hotel].devices.push({
                    'workstation_name': station,
                    'events': [e],
                    'info': e,
                    'status': e.workstation_status === 'in-order' ? 'In-Order' : 'Out-of-Order'
                });

                $scope.hotelList.push($scope.deviceByHotel[hotel]);

            } else {
                $scope.deviceByHotel[hotel].events.push(e);
                // compare time stamps and use the latest info 
                if (e.kiosk_time) {
                    var thisEvent = new Date(e.kiosk_time),
                        currentInfo = new Date($scope.deviceByHotel[hotel].info.kiosk_time);

                    //
                    // if current workstation is not registered yet...
                    //
                    station_in_list = false;

                    for (var s in $scope.deviceByHotel[hotel].devices) {
                        hotelDevice = $scope.deviceByHotel[hotel].devices[s].info;


                        hotelDeviceEvtTime = new Date(hotelDevice.kiosk_time);


                        if (eventForCurrentWorkstation(hotelDevice, station)) {

                            station_in_list = true;

                            //
                            // if this event timestamp is later than the currently attached
                            // info timestamp, update status of device and append the other info as the 'latest known' info
                            // by assigning info as the latest event object
                            // 
                            if (thisEvent > hotelDeviceEvtTime) {

                                $scope.deviceByHotel[hotel].devices[s].info = e;
                                $scope.deviceByHotel[hotel].devices[s].info.lastUpdate = $scope.formattedDate(thisEvent);

                                $scope.deviceByHotel[hotel].devices[s].status = e.workstation_status === 'in-order' ? 'In-Order' : 'Out-of-Order';

                            }

                            // include the event to the device events
                            //
                            $scope.deviceByHotel[hotel].devices[s].events.push(e);
                        }
                    }

                    if (!station_in_list) {
                        addDeviceToHotel($scope, hotel, e, station);
                    }


                    if (thisEvent > currentInfo) {
                        $scope.deviceByHotel[hotel].info = e;
                    }


                }

            }

        }

        updateHotelStatus($scope);

        // TODO: Sort events for each hotel by date/time stamp in the event "kiosk_time"
        // 
        console.info($scope.hotelList);
        console.log(':: filterByHotel, COMPLETE::');
        sortHotelEvents();
    };

    var sortOOSReasonHistory = function(listOfHistory) {
        var aT, bT, aTime, bTime;

            listOfHistory.sort(function(a, b) {
                aT = new Date(a.datetime);
                bT = new Date(b.datetime);

                aTime = aT.valueOf();
                bTime = bT.valueOf();

                return aTime - bTime;
            });
            listOfHistory.reverse(); // reverse the list so the latest events display first
        return listOfHistory;
    };

    var sortHotelEvents = function() {
        var hotel, device, aT, bT, aTime, bTime;

        for (var a in $scope.deviceByHotel) {
            hotel = $scope.deviceByHotel[a];

            hotel.devices.sort(function(a, b) {
                aT = new Date(a.info.kiosk_time);
                bT = new Date(b.info.kiosk_time);

                aTime = aT.valueOf();
                bTime = bT.valueOf();

                return aTime - bTime;
            });
            hotel.devices.reverse(); // reverse the list so the latest events display first

            for (var d in hotel.devices) {
                device = hotel.devices[d];
                // reverse the list so the latest events display first
                if (device.events.length > 1) {
                    device.events.sort(function(a, b) {
                        aT = new Date(a.kiosk_time);
                        bT = new Date(b.kiosk_time);

                        aTime = aT.valueOf();
                        bTime = bT.valueOf();

                        return aTime - bTime;
                    });
                    device.events.reverse();
                }
            }
        }

        $scope.isLoading = false;
        $scope.$emit('hideLoader');
        $scope.$apply();
    };


    var eventForCurrentWorkstation = function(hotelDevice, station) {
        return hotelDevice.workstation_name.replace(/\s+/g, '') === station;
    };


    var addDeviceToHotel = function($scope, hotel, e, station) {
        /*
            deviceByHotel: an object of hotels,
                           which contains an array of devices
         */
        $scope.deviceByHotel[hotel].devices.push({
            'workstation_name': station,
            'events': [e],
            'info': e,
            'status': e.workstation_status === 'in-order' ? 'In-Order' : 'Out-of-Order'
        });


    };


    var renderEventData = function(events) {
        

        $scope.renderEventData = events;

        filterByHotel(events, $scope);

        $scope.$emit('LOADING_COMPLETE');
        $scope.$emit('UPDATE_DATA');
    };

    var getHistoricalOOSReasons = function(tmpHistorical) {
        var historicalEvt, historical_oos_reasons = [];

        for (var e in tmpHistorical) {
            if (tmpHistorical[e].indexOf('{') !== -1) {
                historicalEvt = JSON.parse(tmpHistorical[e]);
                historical_oos_reasons.push(historicalEvt);
            }
        }

        return historical_oos_reasons;
    };

    var visualizeEventData = function(data) {

        if (data.rows) {
            var status_update_events = [],
                rowData = data.rows;

            // pull out the events which have a theme associated to them,
            // other events not being used at this time
            // 
            // TODO: remove 2nd for loop to include parsing out the row data after validating format matches expected response
            // 
            for (var i in rowData) {
                if (rowData[i].dimensions[0].indexOf('theme') !== -1) {
                    status_update_events.push(rowData[i].dimensions[0]);
                }
            }

            var events = [], evtObj, tmpHistorical, historical_oos_reasons = [];

            for (var x in status_update_events) {
                if (status_update_events[x].indexOf('theme') !== -1 && status_update_events[x].indexOf('{') !== -1 && status_update_events[x].indexOf('}') !== -1) {
                    try {

                        evtObj = JSON.parse(status_update_events[x]);
                        if (evtObj.historical_oos_reasons && evtObj.historical_oos_reasons.indexOf('||') !== -1) {
                            tmpHistorical = evtObj.historical_oos_reasons.split('||');
                            
                            historical_oos_reasons = getHistoricalOOSReasons(tmpHistorical);

                            historical_oos_reasons = sortOOSReasonHistory(historical_oos_reasons);

                            evtObj.historical_oos_reasons = historical_oos_reasons;
                        }
                        events.push(evtObj);

                    } catch (er) {
                        console.log(status_update_events[x]);
                    }

                }
            }
            // 
            //
            renderEventData(events);

        } else {
            console.warn('an error occurred, invalid data');
            console.warn(data);
        }

    };

    // Query the API and print the results to the page.
    //
    // Latest query for reports metric data
    //
    // use this to test new reports or data
    //
    //

    var getNextPageToken = function(responseData) {
        try {
            if (responseData.result.reports[0].nextPageToken) {
                return responseData.result.reports[0].nextPageToken;
            }
        } catch (err) {
            return null;
        }

    };

    var getEventRequestParams = function(pageToken) {

        var fromDate = overrideFromDate ? overrideFromDateValue : 'today',
            toDate = overrideToDate ? overrideToDateValue : 'today';

        console.log('search from (', fromDate, '), to (', toDate, ')');
        var requestParams = {
            path: '/v4/reports:batchGet',
            root: 'https://analyticsreporting.googleapis.com/',
            method: 'POST',
            body: {
                reportRequests: [
                    // TODO: need to track which report's label should be at which index for the response data 
                    // ie. if i send ga:sessions as [1], then the response totals will be at:
                    //   --> reports[1].data.totals[0].values[0]
                    //   
                    //   
                    getReportMetric(fromDate, toDate, 'ga:sessions', 'Sessions', 'ga:eventCategory', pageToken)
                ]
            }
        };

        return requestParams;
    };

    $scope.searchByDate = function() {
        // update search env before fetching results
        VIEW_ID = selectedEnv[$scope.VIEW_ID_SELECTED];

        console.log('searching [' + $scope.VIEW_ID_SELECTED + '] view id: ', VIEW_ID);

        var from = $('#datepicker-from').val(),
            to = $('#datepicker-to').val();

        if (from) {
            var fromD = from.split('/');

            overrideFromDateValue = fromD[2] + '-' + fromD[0] + '-' + fromD[1];
            overrideFromDate = true;
        } else {
            overrideFromDate = false;
        }

        if (to) {
            var toD = to.split('/');

            overrideToDateValue = toD[2] + '-' + toD[0] + '-' + toD[1];
            overrideToDate = true;
        } else {
            overrideToDate = false;
        }
        // clears old data and then calls queryEvents

        $scope.queryEvents();
    };

    $scope.queryEvents = function() {

        $scope.hotelList = [];
        // $scope.$digest();
        $scope.isLoading = true;
        $scope.$emit('showLoader');

        var requestParams = getEventRequestParams();
        // 
        // fetch all pages of data first,
        // on-response of each fetch (page)
        // -dump into this array
        // 
        var dataToVisualize = {
                'rows': []
            },
            request = 0;

        var onRequestSuccess = function(eventDataResponse) {
            if (eventDataResponse.status !== 200) {
                onRequestFailure(eventDataResponse);
            } else {
                console.info(' ::RESPONSE ' + request + ':: '); // ,eventDataResponse);
                if (eventDataResponse.result) {
                    // dataToVisualize.rows.push();
                    Array.prototype.push.apply(dataToVisualize.rows, eventDataResponse.result.reports[0].data.rows);
                    console.warn('rows fetched: ', dataToVisualize.rows.length);
                }

                var next = getNextPageToken(eventDataResponse);

                var msg = next ? 'Fetching More...' : ':: Visualize Data ::';

                console.info(msg);

                if (!next) {
                    visualizeEventData(dataToVisualize);
                } else {
                    // 
                    // fetch next pages..
                    // 
                    requestParams = getEventRequestParams(next);
                    request++;
                    gapi.client.request(requestParams).then(onRequestSuccess, onRequestSuccess);
                }
            }

        };
        var onRequestFailure = function(response) {
            console.warn(response);

            if (response && response.status === 401) {
                

                $scope.loading = false;
                $scope.signedIn = false;
                $scope.$emit('hideLoader');
                $scope.$apply();
                setTimeout(function() {
                    alert('Please sign into google');
                }, 500);
            }
        };

        request++;
        gapi.client.request(requestParams).then(onRequestSuccess, onRequestSuccess);
    };

    $scope.signOut = function() {
        console.warn(': signOut: ');
        var auth2 = gapi.auth2.getAuthInstance();

        auth2.signOut().then(function() {
            console.log('User signed out.');
            $scope.signedIn = false;
            $('#sign-out-btn').hide();
            $('#sign-in-btn').show();
            

            $scope.$emit('CLEAR_SCREEN');
            $scope.$emit('UPDATE_DATA');
        });
    };


}]);


function onSigninSuccess(profileObject) {
    console.log(':: onSigninSuccess ::');
    $('#sign-in-btn').hide();
    $('#sign-out-btn').show();
    var scope = getScope();

    scope.signedIn = true;
    scope.$emit('CLEAR_SCREEN');
    scope.$apply();
}

function onSignInFailure() {
    var scope = getScope();

    console.warn('sign-in failed');
    scope.signedIn = false;
    console.info(arguments);

    scope.$emit('CLEAR_SCREEN');
    scope.$emit('UPDATE_DATA');

}

function getScope() {
    return angular.element(angular.element(document.querySelector('#header'))).scope();
}
