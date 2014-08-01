sntRover.controller('RVReservationBaseSearchCtrl', ['$rootScope', '$scope', 'RVReservationBaseSearchSrv', 'dateFilter', 'ngDialog', '$state', '$timeout', '$stateParams',
    function($rootScope, $scope, RVReservationBaseSearchSrv, dateFilter, ngDialog, $state, $timeout, $stateParams) {
        BaseCtrl.call(this, $scope);
        $scope.$parent.hideSidebar = false;

        // default max value if max_adults, max_children, max_infants is not configured
        var defaultMaxvalue = 5;

        var init = function() {
            $scope.viewState.identifier = "CREATION";
            $scope.reservationData.rateDetails = [];

            $scope.$emit('setHeading', 'Reservations');
            // Check flag to retain the card details
            if (!$scope.reservationData.isSameCard) {
                $scope.initReservationData();
                $scope.initReservationDetails();
            } else {
                //$scope.reservationData.isSameCard = false;
                //TODO: 1. User gets diverted to the Search screen (correct) 
                //but Guest Name and Company / TA cards are not copied into the respective search fields. 
                //They are added to the reservation by default later on, 
                //but should be copied to the Search screen as well
                $scope.viewState.reservationStatus.confirm = false;
                $scope.searchData.guestCard.guestFirstName = $scope.reservationData.guest.firstName;
                $scope.searchData.guestCard.guestLastName = $scope.reservationData.guest.lastName;
                $scope.companySearchText = (function() {
                    if ($scope.reservationData.company.id != null && $scope.reservationData.company.id != "") {
                        return $scope.reservationData.company.name;
                    } else if ($scope.reservationData.travelAgent.id != null && $scope.reservationData.travelAgent.id != "") {
                        return $scope.reservationData.travelAgent.name;
                    }
                    return "";
                })();

            }

            if ($scope.reservationData.arrivalDate == '') {
                $scope.reservationData.arrivalDate = dateFilter($scope.otherData.businessDate, 'yyyy-MM-dd');
            }
            if ($scope.reservationData.departureDate == '') {
                $scope.setDepartureDate();
            }
            $scope.otherData.fromSearch = true;
            $scope.$emit('hideLoader');
        };

        $scope.setDepartureDate = function() {

            var dateOffset = $scope.reservationData.numNights;
            if ($scope.reservationData.numNights == null || $scope.reservationData.numNights == '') {
                dateOffset = 1;
            }
            // var newDate = new Date($scope.reservationData.arrivalDate);
            var newDate = tzIndependentDate($scope.reservationData.arrivalDate);
            newDay = newDate.getDate() + parseInt(dateOffset);
            newDate.setDate(newDay);
            // $scope.reservationData.departureDate = dateFilter(new Date(newDate), 'yyyy-MM-dd');
            $scope.reservationData.departureDate = dateFilter(newDate, 'yyyy-MM-dd');
        }

        $scope.setNumberOfNights = function() {

            // var arrivalDate = new Date($scope.reservationData.arrivalDate);
            var arrivalDate = tzIndependentDate($scope.reservationData.arrivalDate);
            arrivalDay = arrivalDate.getDate();
            // var departureDate = new Date($scope.reservationData.departureDate);
            var departureDate = tzIndependentDate($scope.reservationData.departureDate);
            departureDay = departureDate.getDate();
            var dayDiff = Math.floor((Date.parse(departureDate) - Date.parse(arrivalDate)) / 86400000);

            // to make sure that the number of
            // dates the guest stays must not be less than 1
            if (dayDiff < 1) {

                // user tried set the departure date
                // before the arriaval date
                $scope.reservationData.numNights = 1;

                // need delay
                $timeout($scope.setDepartureDate, 1);
            } else {
                $scope.reservationData.numNights = dayDiff;
            }
        }

        $scope.arrivalDateChanged = function() {
            $scope.reservationData.arrivalDate = dateFilter($scope.reservationData.arrivalDate, 'yyyy-MM-dd');
            $scope.setDepartureDate();
            $scope.setNumberOfNights();
        };


        $scope.departureDateChanged = function() {
            $scope.reservationData.departureDate = dateFilter($scope.reservationData.departureDate, 'yyyy-MM-dd');
            $scope.setNumberOfNights();
        };

        $scope.navigate = function() {
            /*  The following method helps to initiate the staydates object across the period of 
             *  stay. The occupany selected for each room is taken assumed to be for the entire period of the
             *  stay at this state.
             *  The rates for these days have to be popuplated in the subsequent states appropriately
             */
            var initStayDates = function(roomNumber) {
                    if (roomNumber == 0) {
                        $scope.reservationData.stayDays = [];
                    }
                    for (var d = [], ms = new Date($scope.reservationData.arrivalDate) * 1, last = new Date($scope.reservationData.departureDate) * 1; ms <= last; ms += (24 * 3600 * 1000)) {
                        if (roomNumber == 0) {
                            $scope.reservationData.stayDays.push({
                                date: dateFilter(new Date(ms), 'yyyy-MM-dd'),
                                dayOfWeek: dateFilter(new Date(ms), 'EEE'),
                                day: dateFilter(new Date(ms), 'dd')
                            });
                        }
                        $scope.reservationData.rooms[roomNumber].stayDates[dateFilter(new Date(ms), 'yyyy-MM-dd')] = {
                            guests: {
                                adults: parseInt($scope.reservationData.rooms[roomNumber].numAdults),
                                children: parseInt($scope.reservationData.rooms[roomNumber].numChildren),
                                infants: parseInt($scope.reservationData.rooms[roomNumber].numInfants)
                            },
                            rate: {
                                id: "",
                                name: ""
                            }
                        }
                    }
                }
                /*  For every room initate the stayDates object 
                 *   The total room count is taken from the roomCount value in the reservationData object
                 */
            for (var roomNumber = 0; roomNumber < $scope.reservationData.roomCount; roomNumber++) {
                initStayDates(roomNumber);
            }

            if ($scope.checkOccupancyLimit()) {
                $state.go('rover.reservation.staycard.mainCard.roomType', {
                    from_date: $scope.reservationData.arrivalDate,
                    to_date: $scope.reservationData.departureDate
                });
            }
        };



        /**
         *   Validation conditions
         *
         *   Either adults or children can be 0,
         *   but one of them will have to have a value other than 0.
         *
         *   Infants should be excluded from this validation.
         */
        $scope.validateOccupant = function(room, from) {

            // just in case
            if (!room) {
                return;
            };

            var numAdults = parseInt(room.numAdults),
                numChildren = parseInt(room.numChildren);

            if (from === 'adult' && (numAdults === 0 && numChildren === 0)) {
                room.numChildren = 1;
            } else if (from === 'children' && (numChildren === 0 && numAdults === 0)) {
                room.numAdults = 1;
            }
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

                angular.forEach(data.accounts, function(item) {
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

                // call response callback function
                // with the processed results array
                response(companyCardResults);
            };

            // fetch data from server
            var fetchData = function() {
                if (request.term != '' && lastSearchText != request.term) {
                    $scope.invokeApi(RVReservationBaseSearchSrv.fetchCompanyCard, {
                        'query': request.term
                    }, processDisplay);
                    lastSearchText = request.term;
                }
            }

            // quite simple to understand
            if (request.term.length === 0) {
                companyCardResults = [];
                lastSearchText = "";
            } else if (request.term.length > 2) {
                fetchData();
            }
        }

        var autoCompleteSelectHandler = function(event, ui) {
            if (ui.item.type === 'COMPANY') {
                $scope.reservationData.company.id = ui.item.id;
                $scope.reservationData.company.name = ui.item.label;
                $scope.reservationData.company.corporateid = ui.item.corporateid;
            } else {
                $scope.reservationData.travelAgent.id = ui.item.id;
                $scope.reservationData.travelAgent.name = ui.item.label;
                $scope.reservationData.travelAgent.iataNumber = ui.item.iataNumber;
            };

            // DO NOT return false;
        };

        $scope.autocompleteOptions = {
            delay: 0,
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
                $('<div id="ui-datepicker-overlay" class="transparent" />').insertAfter('#ui-datepicker-div');
            },
            onClose: function(dateText, inst) {
                $('#ui-datepicker-div').removeClass('reservation arriving');
                $('#ui-datepicker-overlay').remove();
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
                $('<div id="ui-datepicker-overlay" class="transparent" />').insertAfter('#ui-datepicker-div');
            },
            onClose: function(dateText, inst) {
                $('#ui-datepicker-div').removeClass('reservation departing');
                $('#ui-datepicker-overlay').remove();
            }
        };

    }
]);

// This code will be assimilated, resistance is futile
// Code will be assimilated to become part of a better IMH234
// auto complete feature
sntRover.directive('autoComplete', ['highlightFilter',
    function(highlightFilter) {
        return {
            restrict: 'A',
            scope: {
                autoOptions: '=autoOptions',
                ngModel: '='
            },
            link: function(scope, el, attrs) {
                $(el).autocomplete(scope.autoOptions)
                    .data('ui-autocomplete')
                    ._renderItem = function(ul, item) {
                        ul.addClass('find-cards');

                        var $content = highlightFilter(item.label, scope.ngModel),
                            $result = $("<a></a>").html($content),
                            defIcon = item.type === 'COMPANY' ? 'icon-company' : 'icon-travel-agent',
                            $image = '';

                        if (item.image) {
                            $image = '<img src="' + item.image + '">';
                        } else {
                            $image = '<span class="icons ' + defIcon + '"></span>';
                        }

                        $($image).prependTo($result);

                        return $('<li></li>').append($result).appendTo(ul);
                };
            }
        };
    }
]);