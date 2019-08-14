angular.module('sntRover')
.controller('rvDiaryUnassignedListController',
    [
        '$scope',
        '$rootScope',
        'rvDiarySrv',
        function($scope, $rootScope, rvDiarySrv) {

            /**
             * Function to fetch the unassigned reservations on loading the controller
             * 
             */
            var fetchUdReservationList = function () {
                var successCallBackFetchList = function(data) {
                        $scope.errorMessage = '';
                        $scope.udReservationsData = data;
                    },
                    postData = {
                        'date': $scope.gridProps.filter.arrival_date
                    },
                    options = {
                        params: postData,
                        successCallBack: successCallBackFetchList
                    };
    
                    $scope.callAPI(rvDiarySrv.fetchUnassignedRoomList, options);
                }, __getTimeDiff = function(arrivalDate, arrivalTime, departureDate, departureTime) {
                    var arrival = {},
                        departure = {},
                        dateParts,
                        timeParts,
                        fullArrivalDate,
                        fullDepartureDate,
                        difference,
                        hour_difference,
                        min_difference;
            
                    var arrivalTimeFix, departureTimeFix;
            
                    if ( ! arrivalTime || ! departureTime ) {
                        arrivalTimeFix = '00:00';
                        departureTimeFix = '04:00';
                    } else {
                        arrivalTimeFix = arrivalTime;
                        departureTimeFix = departureTime;
                    }
            
                    dateParts = arrivalDate.split('-');
                    arrival.year = parseInt( dateParts[0] );
                    arrival.month = parseInt( dateParts[1] ) - 1;
                    arrival.date = parseInt( dateParts[2] );
                    /**/
                    timeParts = arrivalTimeFix.split(':');
                    arrival.hour = parseInt( timeParts[0]);
                    arrival.mins = parseInt( timeParts[1]);
            
                    dateParts = departureDate.split('-');
                    departure.year = parseInt( dateParts[0] );
                    departure.month = parseInt( dateParts[1] ) - 1;
                    departure.date = parseInt( dateParts[2] );
                    /**/
                    timeParts = departureTimeFix.split(':');
                    departure.hour = parseInt( timeParts[0] );
                    departure.mins = parseInt( timeParts[1] );
            
                    fullArrivalDate = new Date(arrival.year, arrival.month, arrival.date, arrival.hour, arrival.mins);
                    fullDepartureDate = new Date(departure.year, departure.month, departure.date, departure.hour, departure.mins);
            
                    difference = Math.abs( fullDepartureDate - fullArrivalDate );
                    hour_difference = Math.floor(difference / 36e5);
                    min_difference = Math.floor((difference % 36e5) / 6e4);
            
                    // fraction = Math.ceil( ((difference < 1.0) ? difference : (difference % Math.floor(difference))) * 10 );
                    // difference = Math.floor(difference);
            
                    return {
                        hh: hour_difference,
                        mm: min_difference,
                        hhs: hour_difference + 'h'
                    };
                };

            BaseCtrl.call(this, $scope);

            $scope.businessDate = $rootScope.businessDate;

            /**
             * Function to toggle the visibility of the unassigned panel
             * @return {boolean}
             */
            $scope.showUnassignedListPanel = function() {
                // === true ? 'visible' : ''; - toggle visibility with style instead of angular directive
                return $scope.gridProps.unassignedRoomList.open ? 'visible' : '';
            };

            /**
             * 
             */
            $scope.clickedUnassignedReservation = function(reservation) {
                var params = {
                    arrival_date: reservation.arrival_date,
                    arrival_time: reservation.arrival_time,
                    departure_date: reservation.departure_date,
                    departure_time: reservation.departure_time,

                    reservationId: reservation.reservation_id,
                    adults: reservation.adults,
                    children: reservation.children,
                    infants: reservation.infants,
                    rate_id: reservation.rate_id,
                    room_type_id: reservation.room_type_id,
                    is_hourly: reservation.is_hourly,

                    stay_span: __getTimeDiff(reservation.arrival_date, reservation.arrival_time, reservation.departure_date, reservation.departure_time)
                };

                $scope.selectedIndex = reservation.reservation_id;
                $scope.$emit('UNASSIGNED_RESERVATION_SELECTED', params);
            };

            fetchUdReservationList();
        }
    ]
);
