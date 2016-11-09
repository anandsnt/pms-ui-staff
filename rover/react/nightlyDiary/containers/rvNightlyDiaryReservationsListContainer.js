const {connect} = ReactRedux;

let convertReservationsListReadyToComponent = (roomsList, diaryInitialDayOfDateGrid) => {
  //  console.log("--------Initial day-->>"+diaryInitialDayOfDateGrid)
   // console.log(diaryInitialDayOfDateGrid)
    roomsList.map((room) => {
       // reservation.duration = 140;
       // reservation.reservation_status = "inhouse";
       if(room.reservations.length > 0){
            room.reservations.map((reservation) => {
                reservation.duration = 140;
                reservation.reservation_status = "inhouse";

            })
        }

    })
    return roomsList;
}


const mapStateToNightlyDiaryReservationsListContainerProps = (state) => ({
    reservationsListToComponent: convertReservationsListReadyToComponent(state.reservationsList, state.diaryInitialDayOfDateGrid)
});

const NightlyDiaryReservationsListContainer = connect(
  mapStateToNightlyDiaryReservationsListContainerProps
)(NightlyDiaryReservationsListComponent);