const { connect } = ReactRedux;

let convertRowReadyToComponent = (roomsList, selectedRoomId, state) => {

    roomsList.map((room, iterator) => {

        let dateList = [];

        if (room.reservations.length !== 0) {

            /*
             *  Retrieve Date List in a row ( against each room)
             *  where reservations present in it.
             */
            _.each(room.reservations,
                function(item) {
                    dateList.push(item.arrival_date);
                }
            );
            dateList = _.unique(dateList);

            /*
             *  Mapping dateList Vs reservations
             *  Find overlap count ( how many reservations exist in a day the selected room )
             */
            _.each(dateList, 
                function(date) {
                    let count = 0;

                    _.each(room.reservations,
                        function(res) {
                            if (date === res.arrival_date) {
                               res.overlapCount = count;
                               count ++;
                            }
                        }
                    );
                }
            );

            /*
             *  Find Max overlap count
             *  Max no of overlaps in a row.
             */
            room.maxOverlap = _.max(room.reservations, 
                                function(item) { 
                                    return item.overlapCount; 
                                }).overlapCount;
        }

        if (room.id === selectedRoomId) {
            room.roomClass = (room.maxOverlap >= 0) ? 'grid-row highlighted overlap-' + room.maxOverlap : 'grid-row highlighted';
        }
        else {
            room.roomClass = (room.maxOverlap >= 0) ? 'grid-row overlap-' + room.maxOverlap : 'grid-row';
        }
    });

    return roomsList;
};

const mapStateToNightlyDiaryReservationsListContainerProps = (state) => ({
    reservationsListToComponent: convertRowReadyToComponent(state.reservationsList, state.selectedRoomId, state),
    roomRowClass: "grid-reservations firstday-" + getWeekDayName((new Date(state.diaryInitialDayOfDateGrid)).getDay(), 3),
    selectedReservationId: state.selectedReservationId,
    selectedRoomId: state.selectedRoomId,
    showAssignRooms: state.isAssignRoomViewActive,
    showMoveRooms: state.isMoveRoomViewActive,
    showBookRooms: state.isBookRoomViewActive,
    state: state
});

const NightlyDiaryReservationsListContainer = connect(
    mapStateToNightlyDiaryReservationsListContainerProps
)(NightlyDiaryReservationsListComponent);