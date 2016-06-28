sntRover.controller('overbookingAlertCtrl', ['$scope',
    function($scope) {
        BaseCtrl.call(this, $scope);

        var calendarData = {
                left: [],
                right: []
            },
            arrivalDateString = $scope.ngDialogData.arrivalDate || $scope.reservationData.arrivalDate,
            departureDateString = $scope.ngDialogData.departureDate || $scope.reservationData.departureDate,
            arrival = tzIndependentDate(arrivalDateString),
            computeCalendarData = function() {
                //https://github.com/angular-ui/ui-calendar/issues/219
                $scope.stateVariables.eventSources.left.length = 0;
                $scope.stateVariables.eventSources.right.length = 0;

                calendarData = {
                    left: [],
                    right: []
                };

                _.each($scope.availabilityData, function(dailyStat) {
                    var dayAvailabilityToDisplay;
                    if ($scope.ngDialogData.activeView === 'HOUSE') {
                        dayAvailabilityToDisplay = dailyStat.house.availability
                    } else {
                        dayAvailabilityToDisplay = dailyStat.room_types[$scope.ngDialogData.roomTypeId];
                        if ($scope.ngDialogData.isGroupRate) {
                            dayAvailabilityToDisplay = dailyStat.group_room_types[$scope.ngDialogData.roomTypeId];
                        }
                    }
                    var eventData = {
                        day: (function() {
                            if (dailyStat.date >= arrivalDateString || dailyStat.date <= departureDateString) {
                                return new tzIndependentDate(dailyStat.date).getDate().toString();
                            }
                            return "";
                        })(),
                        className: (function() {
                            var classes = "";
                            if (dailyStat.date === arrivalDateString) {
                                classes += 'check-in ';
                            } else if (dailyStat.date === departureDateString) {
                                classes += 'check-out ';
                            }

                            if (dayAvailabilityToDisplay <= 0) {
                                classes += 'unavailable ';
                            } else if (dailyStat.date !== departureDateString) {
                                classes += 'available ';
                            }
                            return classes;
                        })(),
                        start: new tzIndependentDate(dailyStat.date),
                        end: new tzIndependentDate(dailyStat.date),
                        editable: false,
                        title: (function() {
                            if (dayAvailabilityToDisplay <= 0) {
                                return dayAvailabilityToDisplay.toString();
                            }
                            return "";
                        })()
                    };

                    if ($scope.leftCalendarOptions.month === new tzIndependentDate(dailyStat.date).getMonth()) {
                        calendarData.left.push(eventData);
                    } else if ($scope.rightCalendarOptions.month === new tzIndependentDate(dailyStat.date).getMonth()) {
                        calendarData.right.push(eventData);
                    }
                });

                //https://github.com/angular-ui/ui-calendar/issues/219
                $scope.stateVariables.eventSources.left.push(calendarData.left);
                $scope.stateVariables.eventSources.right.push(calendarData.right);

            },
            renderFullCalendar = function() {
                //calender options used by full calender, related settings are done here
                var fullCalendarOptions = {
                    height: 300,
                    editable: true,
                    droppable: false,
                    header: {
                        left: '',
                        center: 'title',
                        right: ''
                    },
                    year: arrival.getFullYear(), // Check in year
                    month: arrival.getMonth(), // Check in month (month is zero based)
                    day: arrival.getDate(), // Check in day
                    editable: true,
                    disableResizing: false,
                    contentHeight: 240,
                    weekMode: 'fixed',
                    ignoreTimezone: false // For ignoring timezone,
                };

                $scope.leftCalendarOptions = dclone(fullCalendarOptions);
                //Setting events for right calendar
                $scope.rightCalendarOptions = dclone(fullCalendarOptions);

                //Set month of rigt calendar
                $scope.rightCalendarOptions.month = $scope.leftCalendarOptions.month + 1;
                computeCalendarData();
                $scope.$emit('hideLoader');
            };

        $scope.stateVariables = {
            eventSources: {
                left: [],
                right: []
            }
        };

        $scope.toggleCalendarView = function() {
            $scope.ngDialogData.activeView = $scope.ngDialogData.activeView === 'HOUSE' ? 'ROOM' : 'HOUSE';
            computeCalendarData();
        };

        $scope.viewRoomRatesCalendar = function() {
            $scope.toggleCalendar();
            $scope.closeDialog();
        };

        renderFullCalendar();
    }
]);