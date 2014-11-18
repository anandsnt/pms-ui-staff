sntRover.controller('RVDiaryConfirmationCtrl', [ '$scope', 
                                                 '$rootScope', 
                                                 '$state', 
                                                 '$vault', 
                                                 'ngDialog',
                                                 'rvDiarySrv',
    function($scope, $rootScope, $state, $vault, ngDialog, rvDiarySrv) {
        BaseCtrl.call(this, $scope);

        $scope.title = ($scope.selectedReservations.length > 1 ? 'these rooms' : 'this room');

        $scope.initSelections = function() {
            (function() {
                    var convertTimeFormat = function(fn, obj){
                        var arrival             = new Date(obj.arrival),
                            departure           = new Date(obj.departure);

                            return fn(arrival.toComponents(),  
                                      departure.toComponents());
                    },
                    dFormat = function(arrival, departure) {
                        return {
                            arrival_time:   arrival.time.toString(true),
                            arrival_date:   arrival.date.day + ' ' + arrival.date.monthName + ' ' + arrival.date.year,
                            departure_time: departure.time.toString(true),
                            departure_date: departure.date.day + ' ' + departure.date.monthName + ' ' + departure.date.year
                        };
                    },
                    vFormat = function(arrival, departure) {
                        return {
                            arrival_date: arrival.date.year + '-' + (arrival.date.month + 1) + '-' + arrival.date.day,
                            arrival_time: arrival.time.toReservationFormat(false),
                            departure_date: departure.date.year + '-' + (departure.date.month + 1) + '-' + departure.date.day,
                            departure_time: departure.time.toReservationFormat(false)
                        };
                    }, 
                    occupancy = ($scope.selectedReservations.length > 0 ) ? $scope.selectedReservations[0].occupancy : undefined;

                $scope.selection        = {
                    rooms: []
                };

                $scope.vaultSelections = {
                    rooms: []
                };

                if(occupancy) {
                    $scope.reservationsSettings = rvDiarySrv.ArrivalFromCreateReservation();

                    _.extend($scope.vaultSelections, convertTimeFormat(vFormat, occupancy));
                    _.extend($scope.selection, convertTimeFormat(dFormat, occupancy)); 

                    _.each($scope.selectedReservations, function(obj, idx, list) {
                        var item = {
                            room_id:        obj.room.id,
                            room_no:        obj.room.room_no,
                            room_type:      obj.room.room_type_name,
                            amount:         obj.occupancy.amount,
                            rateId:         obj.occupancy.rate_id,
                            numAdults:      ($scope.reservationsSettings ? $scope.reservationsSettings.adults : 1),
                            numChildren:    ($scope.reservationsSettings ? $scope.reservationsSettings.children : 0),
                            numInfants:     ($scope.reservationsSettings ? $scope.reservationsSettings.infants : 0)
                        };

                        $scope.vaultSelections.rooms.push(item);
                        $scope.selection.rooms.push(item); 
                    })
                }
            })();
        };

        $scope.initSelections();

        $scope.selectAdditional = function() {
            ngDialog.close();
        };

        $scope.removeSelectedOccupancy = function(idx) {
            var removed = $scope.selectedReservations.splice(idx, 1);

            removed[0].occupancy.selected = false;

            if($scope.selectedReservations.length === 0) {
                ngDialog.close();
            } else {
                this.initSelections();
            }

            $scope.renderGrid();
        };

        $scope.routeToSummary = function() {
            $scope.saveToVault('temporaryReservationDataFromDiaryScreen', $scope.vaultSelections);
            
            $state.go('rover.reservation.staycard.mainCard.summaryAndConfirm', {
                reservation: 'HOURLY'
            });

            ngDialog.close();
        };

        // save data to $vault
        // @param {String} - 'key', the name
        // @param {Object} - 'value', to be saved
        // @return {String} - saved value in $vault
        $scope.saveToVault = function(key, value) {
            // $vault.set will only accept numbers & strings
            $vault.set( key, JSON.stringify(value) );

            // return the same value string back
            return $vault.get( key ) || false;
        };

        // read data from $vault
        // @param {String} - 'key', the name
        // @return {Object} - parsed, saved value from $value
        $scope.readFromVault = function(key) {
            return !!$vault.get( key ) ? JSON.parse( $vault.get(key) ) : false; 
        };

        // may be moved to utils or to a deeper scope into react
        $scope.dateToMs = function(date) {
            return  Object.prototype.toString.apply( date ) == '[object Date]' ? date.getTime() : false;
        };
        $scope.msToDate = function(ms) {
            return Object.prototype.toString.apply( new Date(ms) ) == '[object Date]' ? new Date(ms) : false;
        };

        $scope.cancelSelection = function() {
             var removed = $scope.selectedReservations.pop();

            removed.occupancy.selected = false;

            ngDialog.close();

            $scope.renderGrid();                   
        };

        $scope.closeDialog = function() {
            ngDialog.close();
            $scope.renderGrid();
        };
}]);
