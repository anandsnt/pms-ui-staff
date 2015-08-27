sntRover.controller('overbookingAlertCtrl', ['$scope',
    function($scope) {
        BaseCtrl.call(this, $scope);

        var calendarData = {
                left: [],
                right: []
            },
            arrival = tzIndependentDate($scope.reservationData.arrivalDate);

        var renderFullCalendar = function() {
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
                ignoreTimezone: false, // For ignoring timezone,                 
            };

            $scope.leftCalendarOptions = dclone(fullCalendarOptions);
            //Setting events for right calendar
            $scope.rightCalendarOptions = dclone(fullCalendarOptions);

            //Set month of rigt calendar
            $scope.rightCalendarOptions.month = $scope.leftCalendarOptions.month + 1;

            _.each($scope.availabilityData, function(dailyStat) {
                var dayAvailabilityToDisplay;
                if ($scope.ngDialogData.houseFull || !$scope.ngDialogData.roomTypeId) {
                    dayAvailabilityToDisplay = dailyStat.house.availability
                } else {
                    dayAvailabilityToDisplay = dailyStat.room_types[$scope.ngDialogData.roomTypeId];
                }
                var eventData = {
                    className: (function() {
                        var classes = "";
                        if (dailyStat.date === $scope.reservationData.arrivalDate) {
                            classes += 'check-in ';
                        } else if (dailyStat.date === $scope.reservationData.departureDate) {
                            classes += 'check-out ';
                        }

                        if (dayAvailabilityToDisplay <= 0) {
                            classes += 'unavailable ';
                        } else if (dailyStat.date !== $scope.reservationData.departureDate) {
                            classes += 'available ';
                        }
                        return classes;
                    })(),
                    start: new tzIndependentDate(dailyStat.date),
                    end: new tzIndependentDate(dailyStat.date),
                    editable: false,
                    title: (function() {
                        if (dayAvailabilityToDisplay <= 0) {
                            return dayAvailabilityToDisplay.toString()
                        }
                    })()
                };
                if ($scope.leftCalendarOptions.month === new tzIndependentDate(dailyStat.date).getMonth()) {
                    calendarData.left.push(eventData);
                } else if ($scope.rightCalendarOptions.month === new tzIndependentDate(dailyStat.date).getMonth()) {
                    calendarData.right.push(eventData);
                }
            });

            $scope.eventSources = {
                left: [calendarData.left],
                right: [calendarData.right]
            }
            $scope.$emit('hideLoader');
        };
        renderFullCalendar();
    }
]);