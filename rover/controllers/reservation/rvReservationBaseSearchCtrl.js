sntRover.controller('RVReservationBaseSearchCtrl', [
    '$rootScope',
    '$scope',
    'RVReservationBaseSearchSrv',
    'dateFilter',
    'ngDialog',
    '$state',
    '$timeout',
    '$stateParams',
    '$vault',
    'baseData',
    'activeCodes',
    'flyerPrograms',
    'loyaltyPrograms',
    '$filter',
    'RVReservationTabService',
    function($rootScope, $scope, RVReservationBaseSearchSrv, dateFilter, ngDialog, $state, $timeout, $stateParams, $vault, baseData, activeCodes, flyerPrograms, loyaltyPrograms, $filter, RVReservationTabService) {
        BaseCtrl.call(this, $scope);
        $scope.$parent.hideSidebar = false;

        $scope.setScroller('search_reservation', {
            preventDefault: false
        });

        // default max value if max_adults, max_children, max_infants is not configured
        var defaultMaxvalue = 5;

        $scope.activeCodes = activeCodes.promotions;
        $scope.loyaltyPrograms = loyaltyPrograms.data;
        $scope.flyerPrograms = flyerPrograms.data;


        /*
         * To setup departure time based on arrival time and hours selected
         *
         */
        $scope.setDepartureHours = function() {
            // must not allow user to set hours less than 3
            var correctHours = function(value) {
                $scope.reservationData.resHours = value;
            };
            if ($scope.reservationData.resHours && $scope.reservationData.resHours < 3) {
                $timeout(correctHours.bind(null, 3), 100);
            };

            var checkinHour = parseInt($scope.reservationData.checkinTime.hh);
            var checkoutHour = parseInt($scope.reservationData.checkoutTime.hh);
            var checkinAmPm = $scope.reservationData.checkinTime.ampm;
            var checkoutAmPm = $scope.reservationData.checkoutTime.ampm;
            var selectedHours = parseInt($scope.reservationData.resHours);
            //if selected hours is greater than a day
            if ((checkinHour + selectedHours) > 24) {
                var extraHours = (checkinHour + selectedHours) % 24;
                //if extra hours is greater than half a day
                if (extraHours >= 12) {
                    $scope.reservationData.checkoutTime.hh = (extraHours === 12 || extraHours === 0) ? 12 : extraHours - 12;
                    $scope.reservationData.checkoutTime.ampm = (checkinAmPm === "AM") ? "PM" : "AM";
                } else {
                    $scope.reservationData.checkoutTime.hh = extraHours;
                    $scope.reservationData.checkoutTime.ampm = checkinAmPm;
                    $scope.reservationData.checkoutTime.hh = ($scope.reservationData.checkoutTime.hh.toString().length === 1) ? ("0" + $scope.reservationData.checkoutTime.hh) : $scope.reservationData.checkoutTime.hh;
                }
            }
            //if selected hours is greater than half a day
            else if ((checkinHour + selectedHours) >= 12) {
                var extraHours = (checkinHour + selectedHours) % 12;
                $scope.reservationData.checkoutTime.hh = (extraHours === 0) ? 12 : extraHours;
                $scope.reservationData.checkoutTime.ampm = ($scope.reservationData.checkinTime.ampm === "AM") ? "PM" : "AM";
            } else {
                $scope.reservationData.checkoutTime.hh = checkinHour + selectedHours;
                $scope.reservationData.checkoutTime.ampm = checkinAmPm;
            }
            $scope.reservationData.checkoutTime.hh = ($scope.reservationData.checkoutTime.hh.toString().length === 1) ? ("0" + $scope.reservationData.checkoutTime.hh) : $scope.reservationData.checkoutTime.hh;
            $scope.reservationData.checkoutTime.mm = $scope.reservationData.checkinTime.mm;
        };


        // strip $scope.fullCheckinTime to generate hh, mm, ampm
        // map $scope.fullCheckinTime to $scope.reservationData.checkinTime
        $scope.mapToCheckinTime = function() {
            // strip 'fullCheckinTime' to generate hh, mm, ampm
            var ampm = $scope.fullCheckinTime.split(' ')[1];
            var time = $scope.fullCheckinTime.split(' ')[0];
            var hh = time.length ? time.split(':')[0] : '';
            var mm = time.length ? time.split(':')[1] : '';

            // map fullCheckinTime to $scope.reservationData.checkinTime
            $scope.reservationData.checkinTime.hh = isNaN(parseInt(hh)) ? '' : parseInt(hh) < 10 ? '0' + hh : hh;
            $scope.reservationData.checkinTime.mm = mm || '';
            $scope.reservationData.checkinTime.ampm = ampm || '';

            $scope.setDepartureHours();
        };


        /*
         * To setup arrival time based on hotel time
         *
         */
        var fetchCurrentTimeSucess = function(data) {
                var intHrs = parseInt(data.hotel_time.hh),
                    intMins = parseInt(data.hotel_time.mm),
                    ampm = '';

                // first conver 24hr time to 12hr time
                if (intHrs > 12) {
                    intHrs -= 12;
                    ampm = 'PM';
                } else {
                    ampm = 'AM';
                }


                // the time must be rounded to next 15min position
                // if the guest came in at 3:10AM it should be rounded to 3:15AM
                if (intMins > 45 && intHrs + 1 < 12) {
                    intHrs += 1;
                    intMins = '00';
                } else if (intMins > 45 && intHrs + 1 === 12) {
                    if (ampm === 'AM') {
                        intHrs = '00';
                        intMins = '00';
                        ampm = 'PM';
                    } else {
                        intHrs = '00';
                        intMins = '00';
                        ampm = 'AM';
                    }
                } else if (intMins === 15 || intMins === 30 || intMins === 45) {
                    intMins += 15;
                } else {
                    do {
                        intMins += 1;
                        if (intMins === 15 || intMins === 30 || intMins === 45) {
                            break;
                        }
                    } while (intMins !== 15 || intMins !== 30 || intMins !== 45);
                };

                // finally append zero and convert to string -- only for $scope.reservationData.checkinTime
                $scope.reservationData.checkinTime = {
                    hh: (intHrs < 10 && intHrs.length < 2) ? '0' + intHrs : intHrs.toString(),
                    mm: intMins.toString(),
                    ampm: ampm
                };

                // NOTE: on UI we are no appending a leading '0' for hours less than 12
                // This could change in future, only God knows
                $scope.fullCheckinTime = intHrs + ':' + intMins + ' ' + ampm;
                $scope.setDepartureHours();
            },
            refreshScroller = function() {
                $scope.refreshScroller('search_reservation');
            };

        var fetchMinTimeSucess = function(data) {
            var intVal = parseInt(data.min_hours);

            if (isNaN(intVal) || intVal < 3) {
                $scope.reservationData.resHours = 3;
            } else {
                $scope.reservationData.resHours = intVal;
            };
        };

        /**
         *   We have moved the fetching of 'baseData' form 'rover.reservation' state
         *   to the state where this controller is set as the state controller
         *
         *   Now we do want the original parent controller 'RVReservationMainCtrl' to bind that data
         *   so we have created a 'callFromChildCtrl' method on the 'RVReservationMainCtrl' $scope.
         *
         *   Once we fetch the baseData here we are going call 'callFromChildCtrl' method
         *   while passing the data, this way all the things 'RVReservationMainCtrl' was doing with
         *   'baseData' will be processed again
         *
         *   The number of '$parent' used is based on how deep this state is wrt 'rover.reservation' state
         */
        var rvReservationMainCtrl = $scope.$parent.$parent;
        rvReservationMainCtrl.callFromChildCtrl(baseData);



        var init = function() {
            $scope.viewState.identifier = "CREATION";
            $scope.reservationData.rateDetails = [];

            $scope.heading = 'Reservations';
            $scope.setHeadingTitle($scope.heading);

            // Check flag to retain the card details
            if (!$scope.reservationData.isSameCard) {
                $scope.initReservationData();
                $scope.initReservationDetails();
            } else {

                //TODO: 1. User gets diverted to the Search screen (correct)
                //but Guest Name and Company / TA cards are not copied into the respective search fields.
                //They are added to the reservation by default later on,
                //but should be copied to the Search screen as well
                $scope.viewState.reservationStatus.confirm = false;
                // Reset addons as part CICO-10657
                $scope.resetAddons();
                if ($scope.reservationDetails.guestCard.id !== '') {
                    $scope.searchData.guestCard.guestFirstName = $scope.reservationData.guest.firstName;
                    $scope.searchData.guestCard.guestLastName = $scope.reservationData.guest.lastName;
                }
                $scope.companySearchText = (function() {
                    if (!!$scope.reservationData.group.id) {
                        return $scope.reservationData.group.name;
                    } else if (!!$scope.reservationData.company.id) {
                        return $scope.reservationData.company.name;
                    } else if (!!$scope.reservationData.travelAgent.id) {
                        return $scope.reservationData.travelAgent.name;
                    }
                    return "";
                })();
                $scope.codeSearchText = (function() {
                    if (!!$scope.reservationData.group.id) {
                        return $scope.reservationData.group.code;
                    } else if (!!$scope.reservationData.code) {
                        return $scope.reservationData.code.value;;
                    }
                    return "";
                })();

            }

            if ($scope.reservationData.arrivalDate === '') {
                $scope.reservationData.arrivalDate = dateFilter($scope.otherData.businessDate, 'yyyy-MM-dd');
            }
            if ($scope.reservationData.departureDate === '') {
                $scope.setDepartureDate();
            }
            if ($rootScope.isHourlyRateOn) {
                $scope.shouldShowToggle = true;
                $scope.isNightsActive = false;
                $scope.shouldShowNights = false;
                $scope.shouldShowHours = true;

                $scope.invokeApi(RVReservationBaseSearchSrv.fetchMinTime, {}, fetchMinTimeSucess);
                $scope.invokeApi(RVReservationBaseSearchSrv.fetchCurrentTime, {}, fetchCurrentTimeSucess);
            } else {
                $scope.isNightsActive = true;
                $scope.shouldShowNights = true;
                $scope.shouldShowHours = false;
                $scope.shouldShowToggle = false;
                $scope.shouldShowHours = false;
            }
            $scope.otherData.fromSearch = true;
            $scope.$emit('hideLoader');
        };

        $scope.setDepartureDate = function() {

            var dateOffset = $scope.reservationData.numNights;
            if ($scope.reservationData.numNights === null || $scope.reservationData.numNights === '') {
                dateOffset = 1;
            }
            var newDate = tzIndependentDate($scope.reservationData.arrivalDate);
            newDay = newDate.getDate() + parseInt(dateOffset);
            newDate.setDate(newDay);
            $scope.reservationData.departureDate = dateFilter(newDate, 'yyyy-MM-dd');
        };

        $scope.setNumberOfNights = function() {
            var arrivalDate = tzIndependentDate($scope.reservationData.arrivalDate);
            arrivalDay = arrivalDate.getDate();
            var departureDate = tzIndependentDate($scope.reservationData.departureDate);
            departureDay = departureDate.getDate();
            var dayDiff = Math.floor((Date.parse(departureDate) - Date.parse(arrivalDate)) / 86400000);

            // to make sure that the number of
            // dates the guest stays must not be less than ZERO [In order to handle day reservations!]
            if (dayDiff < 0) {

                // user tried set the departure date
                // before the arriaval date
                $scope.reservationData.numNights = 1;

                // need delay
                $timeout($scope.setDepartureDate, 1);
            } else {
                $scope.reservationData.numNights = dayDiff;
            }

        };

        $scope.arrivalDateChanged = function() {
            $scope.reservationData.arrivalDate = dateFilter($scope.reservationData.arrivalDate, 'yyyy-MM-dd');
            $scope.setDepartureDate();
            $scope.setNumberOfNights();
        };


        $scope.departureDateChanged = function() {
            $scope.reservationData.departureDate = dateFilter($scope.reservationData.departureDate, 'yyyy-MM-dd');
            $scope.setNumberOfNights();
        };
        /*  The following method helps to initiate the staydates object across the period of
         *  stay. The occupany selected for each room is taken assumed to be for the entire period of the
         *  stay at this state.
         *  The rates for these days have to be popuplated in the subsequent states appropriately
         */
        var initStayDates = function(roomNumber) {
            if (roomNumber === 0) {
                $scope.reservationData.stayDays = [];
            }
            for (var d = [], ms = new tzIndependentDate($scope.reservationData.arrivalDate) * 1, last = new tzIndependentDate($scope.reservationData.departureDate) * 1; ms <= last; ms += (24 * 3600 * 1000)) {
                if (roomNumber === 0) {
                    $scope.reservationData.stayDays.push({
                        date: dateFilter(new tzIndependentDate(ms), 'yyyy-MM-dd'),
                        dayOfWeek: dateFilter(new tzIndependentDate(ms), 'EEE'),
                        day: dateFilter(new tzIndependentDate(ms), 'dd')
                    });
                }
                $scope.reservationData.rooms[roomNumber].stayDates[dateFilter(new tzIndependentDate(ms), 'yyyy-MM-dd')] = {
                    guests: {
                        adults: parseInt($scope.reservationData.rooms[roomNumber].numAdults),
                        children: parseInt($scope.reservationData.rooms[roomNumber].numChildren),
                        infants: parseInt($scope.reservationData.rooms[roomNumber].numInfants)
                    },
                    rate: {
                        id: "",
                        name: ""
                    }
                };
            };
        };
        $scope.navigate = function() {
            //if selected thing is 'hours'
            if (!$scope.isNightsActive) {
                var reservationDataToKeepinVault = {},
                    roomData = $scope.reservationData.rooms[0];

                reservationDataToKeepinVault.fromDate = new tzIndependentDate($scope.reservationData.arrivalDate).getTime();
                reservationDataToKeepinVault.toDate = new tzIndependentDate($scope.reservationData.departureDate).getTime();
                reservationDataToKeepinVault.arrivalTime = $scope.reservationData.checkinTime;
                reservationDataToKeepinVault.departureTime = $scope.reservationData.checkoutTime;
                reservationDataToKeepinVault.minHours = $scope.reservationData.resHours;
                reservationDataToKeepinVault.adults = roomData.numAdults;
                reservationDataToKeepinVault.children = roomData.numChildren;
                reservationDataToKeepinVault.infants = roomData.numInfants;
                reservationDataToKeepinVault.roomTypeID = roomData.roomTypeId;
                reservationDataToKeepinVault.guestFirstName = $scope.searchData.guestCard.guestFirstName;
                reservationDataToKeepinVault.guestLastName = $scope.searchData.guestCard.guestLastName;
                reservationDataToKeepinVault.companyID = $scope.reservationData.company.id;
                reservationDataToKeepinVault.travelAgentID = $scope.reservationData.travelAgent.id;

                $vault.set('searchReservationData', JSON.stringify(reservationDataToKeepinVault));

                $state.go('rover.diary', {
                    isfromcreatereservation: true
                });
            }
            //if selected thing is 'nights'
            else {
                /*  For every room initate the stayDates object
                 *   The total room count is taken from the roomCount value in the reservationData object
                 */
                for (var roomNumber = 0; roomNumber < $scope.reservationData.rooms.length; roomNumber++) {
                    initStayDates(roomNumber);
                }

                if ($scope.checkOccupancyLimit()) {
                    $state.go('rover.reservation.staycard.mainCard.roomType', {
                        from_date: $scope.reservationData.arrivalDate,
                        to_date: $scope.reservationData.departureDate,
                        fromState: $state.current.name,
                        company_id: $scope.reservationData.company.id,
                        travel_agent_id: $scope.reservationData.travelAgent.id,
                        group_id: $scope.reservationData.group.id
                    });
                }
            }

        };

        $scope.alertOverbooking = function(close) {
            var tabIndex = 0,
                timer = 0;
            if (close) {
                $scope.closeDialog();
                timer = 1000
            }
            $timeout(function() {
                for (; tabIndex < $scope.reservationData.tabs.length; tabIndex++) {
                    var tab = $scope.reservationData.tabs[tabIndex];
                    if ((!tab.overbookingStatus.room || !tab.overbookingStatus.house) && !tab.overbookingStatus.alerted) {
                        tab.overbookingStatus.alerted = true;
                        ngDialog.open({
                            template: '/assets/partials/reservation/alerts/availabilityCheckOverbookingAlert.html',
                            scope: $scope,
                            controller: 'overbookingAlertCtrl',
                            closeByDocument: false,
                            closeByEscape: false,
                            data: JSON.stringify({
                                houseFull: !tab.overbookingStatus.house,
                                roomTypeId: tab.roomTypeId
                            })
                        });
                        break;
                    }
                }
                if (tabIndex === $scope.reservationData.tabs.length) {
                    $scope.navigate();
                }
            }, timer);
        };

        $scope.checkAvailability = function() {
            $scope.invokeApi(RVReservationBaseSearchSrv.checkOverbooking, {
                from_date: $scope.reservationData.arrivalDate,
                to_date: $scope.reservationData.departureDate
            }, function(availability) {
                $scope.availabilityData = availability;
                var houseAvailable = true,
                    roomtypesAvailable = _($scope.reservationData.tabs.length).times(function(n) {
                        return true
                    });
                _.each(availability, function(dailyStat) {
                    houseAvailable = houseAvailable && (dailyStat.house.availability > 0);
                    _.each($scope.reservationData.tabs, function(tab, tabIndex) {
                        if (!!tab.roomTypeId) {
                            roomtypesAvailable[tabIndex] = roomtypesAvailable[tabIndex] &&
                                (dailyStat.room_types[tab.roomTypeId] > 0);
                        }
                    });
                });

                if (houseAvailable && _.reduce(roomtypesAvailable, function(a, b) {
                        return a && b
                    })) {
                    $scope.navigate();
                } else {
                    // initiate flags in the tabs data model
                    _.each($scope.reservationData.tabs, function(tab, tabIndex) {
                        tab.overbookingStatus = {
                            house: houseAvailable,
                            room: roomtypesAvailable[tabIndex],
                            alerted: false
                        }
                    });
                    $scope.alertOverbooking();
                }

                $scope.$emit('hideLoader');

            }, function(errorMessage) {
                $scope.$emit('hideLoader');
                $scope.errorMessage = errorMessage;
            });
            // 
        };



        // jquery autocomplete Souce handler
        // get two arguments - request object and response callback function
        var autoCompleteSourceHandler = function(request, response) {

            var companyCardResults = [],
                lastSearchText = '',
                eachItem = {},
                hasItem = false;

            // process the fetched data as per our liking
            // add make sure to call response callback function
            // so that jquery could show the suggestions on the UI
            var processDisplay = function(data) {
                $scope.$emit("hideLoader");

                _.each(data.accounts, function(item) {
                    eachItem = {};

                    eachItem = {
                        label: item.account_name,
                        value: item.account_name,
                        image: item.company_logo,

                        // only for our understanding
                        // jq-ui autocomplete wont use it
                        type: item.account_type,
                        id: item.id,
                        corporateid: '',
                        iataNumber: ''
                    };

                    // making sure that the newly created 'eachItem'
                    // doesnt exist in 'companyCardResults' array
                    // so as to avoid duplicate entry
                    hasItem = _.find($scope.companyCardResults, function(item) {
                        return eachItem.id === item.id;
                    });

                    // yep we just witnessed an loop inside loop, its necessary
                    // worst case senario - too many results and 'eachItem' is-a-new-item
                    // will loop the entire 'companyCardResults'
                    if (!hasItem) {
                        companyCardResults.push(eachItem);
                    };
                });

                if ($scope.reservationData.rooms.length === 1 && !!data.groups && data.groups.length > 0) {
                    _.each(data.groups, function(group) {
                        companyCardResults.push({
                            label: group.name,
                            value: group.name,
                            type: 'GROUP',
                            id: group.id,
                            code: group.code
                        });
                    });
                }
                // call response callback function
                // with the processed results array
                response(companyCardResults);
            };

            // fetch data from server
            var fetchData = function() {
                if (request.term !== '' && lastSearchText !== request.term) {
                    $scope.invokeApi(RVReservationBaseSearchSrv.fetchCompanyCard, {
                        'query': request.term,
                        'include_group': $scope.reservationData.rooms.length === 1,
                        'from_date': $scope.reservationData.arrivalDate,
                        'to_date': $scope.reservationData.departureDate,
                    }, processDisplay);
                    lastSearchText = request.term;
                }
            };

            // quite simple to understand
            if (request.term.length === 0) {
                companyCardResults = [];
                lastSearchText = "";
                if (!!$scope.reservationData.group.id) { // Reset in case of group
                    $scope.reservationData.group = {
                        id: "",
                        name: "",
                        code: ""
                    };
                    $scope.codeSearchText = "";
                    $scope.companySearchText = "";
                }
            } else if (request.term.length > 2) {
                fetchData();
            }
        };

        var autoCompleteSelectHandler = function(event, ui) {
            if (ui.item.type === 'COMPANY') {
                $scope.reservationData.company.id = ui.item.id;
                $scope.reservationData.company.name = ui.item.label;
                $scope.reservationData.company.corporateid = ui.item.corporateid;
            } else if (ui.item.type === 'GROUP') {
                $scope.reservationData.group = {
                    id: ui.item.id,
                    name: ui.item.label,
                    code: ui.item.code
                };
                $scope.codeSearchText = ui.item.code;
            } else {
                $scope.reservationData.travelAgent.id = ui.item.id;
                $scope.reservationData.travelAgent.name = ui.item.label;
                $scope.reservationData.travelAgent.iataNumber = ui.item.iataNumber;
            };

            // DO NOT return false
        };

        $scope.autocompleteOptions = {
            delay: 0,
            minLength: 0,
            position: {
                my: 'left bottom',
                at: 'left top',
                collision: 'flip'
            },
            source: autoCompleteSourceHandler,
            select: autoCompleteSelectHandler
        };

        // init call to set data for view
        init();


        $scope.arrivalDateOptions = {
            showOn: 'button',
            dateFormat: 'MM-dd-yyyy',
            numberOfMonths: 2,
            yearRange: '-0:',
            minDate: tzIndependentDate($scope.otherData.businessDate),
            beforeShow: function(input, inst) {
                $('#ui-datepicker-div').addClass('reservation arriving');
            },
            onClose: function(dateText, inst) {
                //in order to remove the that flickering effect while closing
                $timeout(function() {
                    $('#ui-datepicker-div').removeClass('reservation arriving');
                }, 200);

            }
        };

        $scope.departureDateOptions = {
            showOn: 'button',
            dateFormat: 'MM-dd-yyyy',
            numberOfMonths: 2,
            yearRange: '-0:',
            minDate: tzIndependentDate($scope.otherData.businessDate),
            beforeShow: function(input, inst) {
                $('#ui-datepicker-div').addClass('reservation departing');
            },
            onClose: function(dateText, inst) {
                //in order to remove the that flickering effect while closing
                $timeout(function() {
                    $('#ui-datepicker-div').removeClass('reservation arriving');
                }, 200);
            }
        };

        /**
        Fix for CICO-9573: ng: Rover: Create Reservation - Guest Card details are not refreshed when user tries to create reservation against another guest
        **/
        $scope.reservationGuestSearchChanged = function() {
            // check whether guest card attached and remove if attached.
            $scope.reservationDetails.guestCard.id = '';
        };

        $scope.switchNightsHours = function() {
            if ($scope.isNightsActive) {
                $scope.shouldShowNights = false;
                $scope.shouldShowHours = true;
            } else {
                $scope.shouldShowNights = true;
                $scope.shouldShowHours = false;
                $scope.clearArrivalAndDepartureTime();
            };
        };

        // CICO-18204

        /**
         * Source handler for the codes autocomplete
         * jquery autocomplete Souce handler
         * get two arguments - request object and response callback function
         */

        var codeACSourceHandler = function(request, response) {
            var codeResults = [],
                lastSearchText = '';
            if (request.term.length === 0) {
                codeResults = [];
                lastSearchText = "";
                if (!!$scope.reservationData.group.id) { // Reset in case of group
                    $scope.reservationData.group = {
                        id: "",
                        name: "",
                        code: ""
                    };
                    $scope.codeSearchText = "";
                    $scope.companySearchText = "";
                }
            } else if (request.term.length > 0) {
                if (request.term !== '' && lastSearchText !== request.term) {
                    lastSearchText = request.term;
                    $scope.invokeApi(RVReservationBaseSearchSrv.autoCompleteCodes, {
                        'code': request.term,
                        'include_group': $scope.reservationData.rooms.length === 1,
                        'from_date': $scope.reservationData.arrivalDate,
                        'to_date': $scope.reservationData.departureDate,
                    }, function(filteredCodes) {
                        codeResults = [];
                        angular.forEach(filteredCodes.promotions, function(item) {
                            eachItem = {
                                label: item.name,
                                value: item.name,
                                type: 'PROMO',
                                id: item.id,
                                discount: item.discount,
                                from: item.from_date,
                                to: item.to_date
                            };
                            codeResults.push(eachItem);
                        });
                        angular.forEach(filteredCodes.groups, function(item) {
                            eachItem = {
                                label: item.name,
                                value: item.code,
                                type: 'GROUP',
                                id: item.id,
                                from: item.from_date,
                                to: item.to_date,
                                name: item.name
                            };
                            codeResults.push(eachItem);
                        });
                        $scope.$emit("hideLoader");
                        response(codeResults);
                    });
                }
            }
        };

        var codeACSelectHandler = function(event, code) {
            if (code.item.type === "PROMO") {
                $scope.reservationData.code = code.item;
            } else if (code.item.type === "GROUP") {
                $scope.reservationData.group = {
                    id: code.item.id,
                    name: code.item.name,
                    code: code.item.value
                };
                $scope.codeSearchText = code.item.value;
                $scope.companySearchText = code.item.name;
            }
        };

        // Autocomplete options for promo/group code
        $scope.codesACOptions = {
            delay: 0,
            minLength: 0,
            position: {
                my: 'left bottom',
                at: 'left top',
                collision: 'flip'
            },
            source: codeACSourceHandler,
            select: codeACSelectHandler
        };

        $scope.onMemberRateToggle = function() {
            if ($rootScope.isHLPActive && $scope.loyaltyPrograms.length > 0) {
                $scope.reservationData.member.value = $scope.loyaltyPrograms[0].hl_value;
                return;
            }
            if ($rootScope.isFFPActive && $scope.flyerPrograms.length > 0) {
                $scope.reservationData.member.value = $scope.flyerPrograms[0].ff_value;
            }
        };

        $scope.addTab = function(tabIndex) {
            if (!$scope.reservationData.tabs[tabIndex].roomTypeId) {
                return false; // Need to select room type before adding another row
            }
            $scope.reservationData.tabs = $scope.reservationData.tabs.concat(RVReservationTabService.newTab());
            $scope.reservationData.rooms = $scope.reservationData.rooms.concat(RVReservationTabService.newRoom());
            devlogRoomsArray();
            refreshScroller();
        };

        var devlogRoomsArray = function() {
            console.log({
                size: $scope.reservationData.rooms.length,
                contents: $scope.reservationData.rooms
            });
        }

        $scope.onRoomTypeChange = function(tabIndex) {
            var index = 0,
                currentRoomCount = parseInt($scope.reservationData.tabs[tabIndex].roomCount, 10),
                roomType = parseInt($scope.reservationData.tabs[tabIndex].roomTypeId, 10),
                i;
            $scope.reservationData.tabs[tabIndex].roomTypeId = roomType;
            for (i = 0; i < tabIndex; i++) {
                index += parseInt($scope.reservationData.tabs[i].roomCount, 10);
            }
            for (i = index; i < index + currentRoomCount; i++) {
                $scope.reservationData.rooms[i].roomTypeId = roomType;
            }
        };

        $scope.onOccupancyChange = function(type, tabIndex) {
            var currentRoomTypeId = $scope.reservationData.tabs[tabIndex].roomTypeId,
                firstIndex = _.indexOf($scope.reservationData.rooms, _.findWhere($scope.reservationData.rooms, {
                    roomTypeId: currentRoomTypeId
                })),
                lastIndex = _.lastIndexOf($scope.reservationData.rooms, _.last(_.where($scope.reservationData.rooms, {
                    roomTypeId: currentRoomTypeId
                }))),
                i;
            for (i = firstIndex; i <= lastIndex; i++) {
                $scope.reservationData.rooms[i][type] = parseInt($scope.reservationData.tabs[tabIndex][type], 10);
            }
            devlogRoomsArray();
        };

        $scope.isRoomTypeSelected = function(tabIndex, roomTypeId) {
            var chosen = false;
            _.each($scope.reservationData.tabs, function(tabData, index) {
                if (parseInt(tabData.roomTypeId, 10) === roomTypeId && tabIndex != index) {
                    chosen = true;
                }
            });
            return chosen;
        };

    }
]);