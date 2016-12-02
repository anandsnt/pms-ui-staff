const {connect} = ReactRedux;

let convertRowReadyToComponent = (roomsList, selectedRoomId) => {

    roomsList.map((room) => {
        room.roomClass = (room.id === selectedRoomId) ? 'grid-row highlighted' : 'grid-row';
    });
    return roomsList;
};

const mapStateToNightlyDiaryReservationsListContainerProps = (state) => ({
    reservationsListToComponent: convertRowReadyToComponent(state.reservationsList, state.paginationData.selectedRoomId),
    roomRowClass: "grid-reservations firstday-" + getWeekDayName((new Date(state.diaryInitialDayOfDateGrid)).getDay(), 3),
    selectReservationId: state.selectReservationId,
    selectedRoomId: state.selectedRoomId
});


const NightlyDiaryReservationsListContainer = connect(
  mapStateToNightlyDiaryReservationsListContainerProps
)(NightlyDiaryReservationsListComponent);