const { connect } = ReactRedux;

let convertRowReadyToComponent = (roomsList, selectedRoomId) => {

    roomsList.map((room) => {
        room.roomClass = (room.id === selectedRoomId) ? 'grid-row highlighted' : 'grid-row';
    });
    return roomsList;
};

const mapStateToNightlyDiaryReservationsListContainerProps = (state) => ({
    reservationsListToComponent: convertRowReadyToComponent(state.reservationsList, state.selectedRoomId),
    roomRowClass: "grid-reservations firstday-" + getWeekDayName((new Date(state.diaryInitialDayOfDateGrid)).getDay(), 3),
    selectedReservationId: state.selectedReservationId,
    selectedRoomId: state.selectedRoomId,
    showUnAssignedRooms: state.isAvaialbleRoomSlotActive,
    state: state
});

const NightlyDiaryReservationsListContainer = connect(
    mapStateToNightlyDiaryReservationsListContainerProps
)(NightlyDiaryReservationsListComponent);