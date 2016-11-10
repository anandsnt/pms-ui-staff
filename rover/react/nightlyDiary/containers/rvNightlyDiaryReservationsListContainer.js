const {connect} = ReactRedux;


let  calculateReservationDurationAndPosition = (diaryInitialDayOfDateGrid, reservation, numberOfDays) => {
    let nightDuration = NIGHTLY_DIARY_CONST.RESERVATION_ROW_WIDTH/numberOfDays;

    let diaryInitialDayOfDateGridSplit = diaryInitialDayOfDateGrid.split("-");
    let reservationArrivalDateSplit    = reservation.arrival_date.split("-");
    let reservationDepartureDateSplit  = reservation.dept_date.split("-");
    let diaryInitialDate               = new Date(diaryInitialDayOfDateGridSplit[0], diaryInitialDayOfDateGridSplit[1], diaryInitialDayOfDateGridSplit[2]);
    let reservationArrivalDate         = new Date(reservationArrivalDateSplit[0], reservationArrivalDateSplit[1], reservationArrivalDateSplit[2]);
    let reservationDepartureDate       = new Date(reservationDepartureDateSplit[0], reservationDepartureDateSplit[1], reservationDepartureDateSplit[2]);
    let finalDayOfDiaryGrid            = diaryInitialDate.getTime()  + (numberOfDays -1)*24*60*60*1000;//Minusing 1 bcoz otherwise last date end value (gettime) and next days start will be same.

    let oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    //Get the number of days between initial day of diary grid and arrival date
    let noOfDaysBtwInitialAndArrivalDate = Math.abs((diaryInitialDate.getTime() - reservationArrivalDate.getTime()) / (oneDay));
    // Position is calculated like this:
    // Step 1 - [ first-day - arrival-date ] = X Days
    // - Get how many X days are between arrival date and first day shown in the diary. If that number is negative (res. started in past), your position is 0 and you're done here.
    // - If the arrival date is the first day ( X == 0 ) in the grid, position is again 0 and you're done here.

    // Step 2
    // - Multiply that number by {night-duration}
    // Step 3
    // - Add 10 to that number if showing 21 days, or 15 if showing 7 days
    let reservationPosition = 0;
    if(noOfDaysBtwInitialAndArrivalDate > 0){
      reservationPosition = noOfDaysBtwInitialAndArrivalDate*nightDuration;
    }
    if(numberOfDays === NIGHTLY_DIARY_CONST.DAYS_7) {
      reservationPosition = reservationPosition + NIGHTLY_DIARY_CONST.DAYS_POSITION_ADD_7;
    }else if(numberOfDays === NIGHTLY_DIARY_CONST.DAYS_21) {
      reservationPosition = reservationPosition + NIGHTLY_DIARY_CONST.DAYS_POSITION_ADD_21;
    }
    //return reservationPosition;
    let durationOfReservation = 0;
    if((reservationDepartureDate.getTime() > diaryInitialDate.getTime())
        && (reservationDepartureDate.getTime() < finalDayOfDiaryGrid)
        && (reservationArrivalDate.getTime() !== reservationDepartureDate.getTime()))
    {
        let numberOfNightsVisibleInGrid = Math.abs((reservationDepartureDate.getTime() - reservationArrivalDate.getTime()) / (oneDay));
        if(reservationArrivalDate.getTime() < diaryInitialDate.getTime()){
          numberOfNightsVisibleInGrid = Math.abs((reservationDepartureDate.getTime() - diaryInitialDate.getTime()) / (oneDay));
        }
        durationOfReservation = numberOfNightsVisibleInGrid * nightDuration;
        if(reservationPosition === 0){
          durationOfReservation = durationOfReservation + 10;
        } else if(reservationPosition > 0){
          durationOfReservation = durationOfReservation - 5;
        }
    } else if (reservationArrivalDate.getTime() === reservationDepartureDate.getTime()){
        if(numberOfDays === NIGHTLY_DIARY_CONST.DAYS_7) {
          durationOfReservation = nightDuration - NIGHTLY_DIARY_CONST.DAYS_POSITION_ADD_7;
        }else if(numberOfDays === NIGHTLY_DIARY_CONST.DAYS_21) {
          durationOfReservation = reservationPosition - NIGHTLY_DIARY_CONST.DAYS_POSITION_ADD_21;
        }
     } else if(reservationDepartureDate.getTime() > finalDayOfDiaryGrid){
        let noOfDaysBtwFinalAndArrivalDate = Math.abs((finalDayOfDiaryGrid - reservationArrivalDate.getTime()) / (oneDay));
        //Considering the day when the reservation starts (if past or first day = 1, second day = 2, ....)
       // let reservationArrivalDay = noOfDaysBtwFinalAndDepartureDate + 1;
        let daysInsideTheGrid = 0;
        if(numberOfDays === NIGHTLY_DIARY_CONST.DAYS_7){
          daysInsideTheGrid = noOfDaysBtwFinalAndArrivalDate + 1;
          durationOfReservation = (nightDuration * daysInsideTheGrid) - NIGHTLY_DIARY_CONST.DAYS_POSITION_ADD_7;
        } else if(numberOfDays === NIGHTLY_DIARY_CONST.DAYS_21) {
          daysInsideTheGrid = noOfDaysBtwFinalAndArrivalDate + 1;
          durationOfReservation = (nightDuration * daysInsideTheGrid) - NIGHTLY_DIARY_CONST.DAYS_POSITION_ADD_21;
        }

     }
     var returnData = {};
     returnData.durationOfReservation = durationOfReservation;
     returnData.reservationPosition   = reservationPosition;

     return returnData;
    //console.log(reservationPosition);
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
                let duration = positionAndDuration.durationOfReservation+"px";
                reservation.style = {};
                reservation.style.width = duration;
                reservation.style.transform = "translateX("+positionAndDuration.reservationPosition+"px)";



                reservation.reservationClass = "reservation inhouse"

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