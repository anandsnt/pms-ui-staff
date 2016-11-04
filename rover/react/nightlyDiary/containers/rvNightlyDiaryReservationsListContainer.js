const {connect} = ReactRedux;

let convertReservationsListReadyToComponent = (reservationsList, diaryInitialDayOfDateGrid) => {
    console.log("--------Initial day-->>"+diaryInitialDayOfDateGrid)
    console.log(diaryInitialDayOfDateGrid)
    // roomsList.map((room, index) => {
    //     room.room_class = "room-number "+room.hk_status
    //     room.isSuitesAvailable = (room.suite_room_details.length > 0) ? true : false;
    // })
    return reservationsList;
}


const mapStateToNightlyDiaryReservationsListContainerProps = (state) => ({
    reservationsListToComponent: convertReservationsListReadyToComponent(state.reservationsList)
});

const NightlyDiaryReservationsListContainer = connect(
  mapStateToNightlyDiaryReservationsListContainerProps
)(NightlyDiaryReservationsListComponent);