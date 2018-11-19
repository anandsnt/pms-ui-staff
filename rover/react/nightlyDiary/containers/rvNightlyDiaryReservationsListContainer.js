const { connect } = ReactRedux;

let convertRowReadyToComponent = (roomsList, selectedRoomId) => {

    roomsList.map((room) => {
        room.roomClass = (room.id === selectedRoomId) ? 'grid-row highlighted' : 'grid-row';
        room.availableSlots = ['2018-10-10', '2018-10-12'];
    });
    return roomsList;
};

const mapStateToNightlyDiaryReservationsListContainerProps = (state) => ({
    reservationsListToComponent: convertRowReadyToComponent(state.reservationsList, state.selectedRoomId),
    roomRowClass: "grid-reservations firstday-" + getWeekDayName((new Date(state.diaryInitialDayOfDateGrid)).getDay(), 3),
    selectedReservationId: state.selectedReservationId,
    selectedRoomId: state.selectedRoomId,
    showUnAssignedRooms: state.isAvailableRoomSlotActive,
    state: state
});

const NightlyDiaryReservationsListContainer = connect(
    mapStateToNightlyDiaryReservationsListContainerProps
)(NightlyDiaryReservationsListComponent);