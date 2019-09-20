const { connect } = ReactRedux;

let convertRowReadyToComponent = (roomsList, selectedRoomId, state) => {

    roomsList.map((room) => {
        room.roomClass = (room.id === selectedRoomId) ? 'grid-row highlighted' : 'grid-row';
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