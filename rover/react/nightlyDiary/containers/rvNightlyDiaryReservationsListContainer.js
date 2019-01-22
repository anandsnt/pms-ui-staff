const { connect } = ReactRedux;

let convertRowReadyToComponent = (roomsList, selectedRoomId, state) => {

    roomsList.map((room) => {
        room.roomClass = (room.id === selectedRoomId) ? 'grid-row highlighted' : 'grid-row';
        if (state.isBookRoomViewActive) {
            state.availableSlotsForBookRooms.forEach(function (item) {
                if (item.room_id === room.id) {
                    room.availableSlotsForBookRooms = item.available_dates;
                }
            });
        }
    });
    return roomsList;
};

const mapStateToNightlyDiaryReservationsListContainerProps = (state) => ({
    reservationsListToComponent: convertRowReadyToComponent(state.reservationsList, state.selectedRoomId, state),
    roomRowClass: "grid-reservations firstday-" + getWeekDayName((new Date(state.diaryInitialDayOfDateGrid)).getDay(), 3),
    selectedReservationId: state.selectedReservationId,
    selectedRoomId: state.selectedRoomId,
    showUnAssignedRooms: state.isAssignRoomViewActive,
    state: state
});

const NightlyDiaryReservationsListContainer = connect(
    mapStateToNightlyDiaryReservationsListContainerProps
)(NightlyDiaryReservationsListComponent);