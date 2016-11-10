const {connect} = ReactRedux;


let  calculateReservationDurationAndPosition = (diaryInitialDayOfDateGrid, reservation, numberOfDays) => {
    let nightDuration = NIGHTLY_DIARY_CONST.RESERVATION_ROW_WIDTH/numberOfDays;

    let diaryInitialDayOfDateGridSplit = diaryInitialDayOfDateGrid.split("-");
    let reservationArrivalDateSplit    = reservation.arrival_date.split("-");
    let diaryInitialDate               = new Date(diaryInitialDayOfDateGridSplit[0], diaryInitialDayOfDateGridSplit[1], diaryInitialDayOfDateGridSplit[2]);
    let reservationArrivalDate         = new Date(reservationArrivalDateSplit[0], reservationArrivalDateSplit[1], reservationArrivalDateSplit[2]);
    //let diffBtwInitialAndArrivalDate   = diaryInitialDate.getTime() - reservationArrivalDate.getTime();

    let oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    let noOfDaysBtwInitialAndArrivalDate = Math.abs((diaryInitialDate.getTime() - reservationArrivalDate.getTime()) / (oneDay));
    let reservationPosition = 0;
    if(noOfDaysBtwInitialAndArrivalDate > 0){
      reservationPosition = noOfDaysBtwInitialAndArrivalDate*nightDuration;
    }

    if(numberOfDays === NIGHTLY_DIARY_CONST.DAYS_7) {
      reservationPosition = reservationPosition + NIGHTLY_DIARY_CONST.DAYS_POSITION_ADD_7;
    }else if(numberOfDays === NIGHTLY_DIARY_CONST.DAYS_21) {
      reservationPosition = reservationPosition + NIGHTLY_DIARY_CONST.DAYS_POSITION_ADD_21;
    }
    return reservationPosition;
    console.log(reservationPosition);
};

let convertReservationsListReadyToComponent = (roomsList, diaryInitialDayOfDateGrid, numberOfDays) => {
  //  console.log("--------Initial day-->>"+diaryInitialDayOfDateGrid)
   // console.log(diaryInitialDayOfDateGrid)
  // console.log("--"+NIGHTLY_DIARY_CONST.RESERVATION_ROW_WIDTH)
    roomsList.map((room) => {
       // reservation.duration = 140;
       // reservation.reservation_status = "inhouse";
       if(room.reservations.length > 0){
            room.reservations.map((reservation) => {
                let positionAndDuration = calculateReservationDurationAndPosition(diaryInitialDayOfDateGrid, reservation , numberOfDays)
                let duration = "140px";
                reservation.style = {};
                reservation.style.width = duration;
                reservation.style.transform = positionAndDuration+"px";



                reservation.reservation_status = "inhouse";

            })
            console.log(room.reservations)

        }

    })
    return roomsList;
};



const mapStateToNightlyDiaryReservationsListContainerProps = (state) => ({
    reservationsListToComponent: convertReservationsListReadyToComponent(state.reservationsList, state.diaryInitialDayOfDateGrid, state.numberOfDays)
});

const NightlyDiaryReservationsListContainer = connect(
  mapStateToNightlyDiaryReservationsListContainerProps
)(NightlyDiaryReservationsListComponent);