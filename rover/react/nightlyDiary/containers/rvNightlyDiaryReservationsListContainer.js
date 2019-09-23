const { connect } = ReactRedux;

let convertRowReadyToComponent = (roomsList, selectedRoomId, state) => {

    roomsList.map((room, iterator) => {

        var reservations = [],
            overlappedReservationsCount = 0;

        if (roomsList[iterator].reservations.length !== 0) {
            roomsList[iterator].reservations.map((roomItem, itr) => {
                reservations.push(roomsList[iterator].reservations[itr]);
            })
        }
        overlappedReservationsCount = reservations.length - 1;
        
        if(roomsList[iterator].hourly_reservations.length !== 0) {
            overlappedReservationsCount ++;
        }

        if (room.id === selectedRoomId) {
            room.roomClass = (overlappedReservationsCount >= 0) ? 'grid-row highlighted overlap-' + overlappedReservationsCount : 'grid-row highlighted';
        }
        else {
            room.roomClass = (overlappedReservationsCount >= 0) ? 'grid-row overlap-' + overlappedReservationsCount : 'grid-row';
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