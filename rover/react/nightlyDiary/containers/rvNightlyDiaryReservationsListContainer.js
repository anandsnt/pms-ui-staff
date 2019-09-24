const { connect } = ReactRedux;

let convertRowReadyToComponent = (roomsList, selectedRoomId, state) => {

    roomsList.map((room) => {

        if (room.reservations.length !== 0) {
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