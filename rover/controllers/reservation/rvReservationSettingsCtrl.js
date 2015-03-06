sntRover.controller('RVReservationSettingsCtrl', ['$scope', 'RVReservationBaseSearchSrv', '$state', '$stateParams', 'dateFilter', '$timeout',
    function($scope, RVReservationBaseSearchSrv, $state, $stateParams, dateFilter, $timeout) {
        $scope.reservationSettingsVisible = false;

        var resizableMinWidth = 30;
        var resizableMaxWidth = 260;
        $scope.reservationSettingsWidth = resizableMinWidth;
        $scope.isHourly = ($stateParams.reservation == 'HOURLY') ? true : false;
        /**
         * scroller options
         */
        $scope.resizableOptions = {
            minWidth: resizableMinWidth,
            maxWidth: resizableMaxWidth,
            handles: 'e',
            resize: function(event, ui) {

            },
            stop: function(event, ui) {
                preventClicking = true;
                $scope.eventTimestamp = event.timeStamp;
            }
        }

        window.setButtonsClickable = function() {
            $("#sidebar-nights button").css({
                position: 'absolute',
                top: '0',
                left: '0',
                'z-index': '99',
                cursor: 'pointer',
                width: '100%',
                height: '100%',
                border: '1px solid red',
                background: 'rgba(125,251,015,0.6)'
            })
        };

        $scope.setScroller('reservation-settings');

        $scope.refreshScroll = function() {
            $scope.refreshScroller('reservation-settings');
        };

        $scope.arrivalDateOptions = {
            showOn: 'button',
            dateFormat: 'MM-dd-yyyy',
            numberOfMonths: 2,
            yearRange: '-1:',
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
            yearRange: '-1:',
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

        var initStayDates = function(roomNumber) {
            if (roomNumber == 0) {
                $scope.reservationData.stayDays = [];
            }
            for (var d = [], ms = new tzIndependentDate($scope.reservationData.arrivalDate) * 1, last = new tzIndependentDate($scope.reservationData.departureDate) * 1; ms <= last; ms += (24 * 3600 * 1000)) {
                if (roomNumber == 0) {
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

        $scope.arrivalDateChanged = function() {
            $scope.reservationData.arrivalDate = dateFilter($scope.reservationData.arrivalDate, 'yyyy-MM-dd');
            $scope.setDepartureDate();
            $scope.setNumberOfNights();
            initStayDates(0);
            $scope.stayDatesClicked();
        };


        $scope.departureDateChanged = function() {
            $scope.reservationData.departureDate = dateFilter($scope.reservationData.departureDate, 'yyyy-MM-dd');
            $scope.setNumberOfNights();
            initStayDates(0);
            $scope.stayDatesClicked();
        };



        $scope.setDepartureDate = function() {

            var dateOffset = $scope.reservationData.numNights;
            if ($scope.reservationData.numNights == null || $scope.reservationData.numNights == '') {
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

        $scope.accordionInitiallyNotCollapsedOptions = {
            header: 'a.toggle',
            heightStyle: 'content',
            collapsible: true,
            activate: function(event, ui) {
                if (isEmpty(ui.newHeader) && isEmpty(ui.newPanel)) { //means accordion was previously collapsed, activating..
                    ui.oldHeader.removeClass('active');
                } else if (isEmpty(ui.oldHeader)) { //means activating..
                    ui.newHeader.addClass('active');
                }
                $scope.refreshScroll();
            }

        };

        $scope.accordionInitiallyCollapsedOptions = {
            header: 'a.toggle',
            collapsible: true,
            heightStyle: 'content',
            active: false,
            activate: function(event, ui) {
                if (isEmpty(ui.newHeader) && isEmpty(ui.newPanel)) { //means accordion was previously collapsed, activating..
                    ui.oldHeader.removeClass('active');
                } else if (isEmpty(ui.oldHeader)) { //means activating..
                    ui.newHeader.addClass('active');
                }
                $scope.refreshScroll();
            }

        };

        /**
         * function to execute click on Guest card
         */
        $scope.clickedOnReservationSettings = function($event) {
            if (getParentWithSelector($event, document.getElementsByClassName("ui-resizable-e")[0])) {
                if ($scope.reservationSettingsVisible) {
                    $scope.reservationSettingsWidth = resizableMinWidth;
                    $scope.reservationSettingsVisible = false;
                } else {
                    $scope.reservationSettingsVisible = true;
                    $scope.reservationSettingsWidth = resizableMaxWidth;
                }
            }
        };

        $scope.$on('closeSidebar', function() {
            $scope.reservationSettingsWidth = resizableMinWidth;
            $scope.reservationSettingsVisible = false;
        });

        $scope.$on('GETREFRESHACCORDIAN', function() {
            setTimeout($scope.refreshScroll, 3000);
        });
    }
]);