const { connect } = ReactRedux;

let calculateReservationDurationAndPosition = (diaryInitialDayOfDateGrid, reservation, numberOfDays) => {
    let nightDuration = NIGHTLY_DIARY_CONST.RESERVATION_ROW_WIDTH / numberOfDays;
    let diaryInitialDate = tzIndependentDate(diaryInitialDayOfDateGrid);
    let reservationArrivalDate = tzIndependentDate(reservation.arrival_date);
    let reservationDepartureDate = tzIndependentDate(reservation.dept_date);
    let finalDayOfDiaryGrid = diaryInitialDate.getTime() + (numberOfDays - 1) * 24 * 60 * 60 * 1000; // Minusing 1 bcoz otherwise last date end value (gettime) and next days start will be same.

    let oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    // Get the number of days between initial day of diary grid and arrival date
    let diffBtwInitialAndArrivalDate = reservationArrivalDate.getTime() - diaryInitialDate.getTime();
    let noOfDaysBtwInitialAndArrivalDate = 0;

    if (diffBtwInitialAndArrivalDate > 0) {
        noOfDaysBtwInitialAndArrivalDate = Math.abs((diffBtwInitialAndArrivalDate) / (oneDay));
    }
    else if (diffBtwInitialAndArrivalDate < 0) {
        noOfDaysBtwInitialAndArrivalDate = -1; // setting -ve number
    }
    // Position is calculated like this:
    // Step 1 - [ first-day - arrival-date ] = X Days
    // - Get how many X days are between arrival date and first day shown in the diary. If that number is negative (res. started in past), your position is 0 and you're done here.
    // - If the arrival date is the first day ( X == 0 ) in the grid, position is again 0 and you're done here.

    // Step 2
    // - Multiply that number by {night-duration}
    // Step 3
    // - Add 10 to that number if showing 21 days, or 15 if showing 7 days
    let reservationPosition = 0;

    if (noOfDaysBtwInitialAndArrivalDate > 0) {
        reservationPosition = noOfDaysBtwInitialAndArrivalDate * nightDuration;
    }
    if (noOfDaysBtwInitialAndArrivalDate >= 0) {
        if (numberOfDays === NIGHTLY_DIARY_CONST.DAYS_7) {
            reservationPosition = reservationPosition + NIGHTLY_DIARY_CONST.DAYS_POSITION_ADD_7;
        } else if (numberOfDays === NIGHTLY_DIARY_CONST.DAYS_21) {
            reservationPosition = reservationPosition + NIGHTLY_DIARY_CONST.DAYS_POSITION_ADD_21;
        }
    }


    // {duration} - Duration is calculated like this:

    // Case: Departures within the grid || Not Stay-Day Reservations

    //     Step 1
    //     - Get the number of nights (if we have an arrival-date from the past, then calculate only the nights from the first day in the grid )
    //     - Multiply {no. of nights} with {night-duration}.
    //     Step 2:
    //      Case:
    //         Position == 0 -
    //          - Add 10 to the value
    //         Position > 0
    //          - Substract 5 from the value
    // Case: Stay-Day Reservations
    //       Reservations that have the same arrival and departure date ( nights == 0 )
    //       21 Days:
    //       - {night-duration} - 10
    //       7 Days:
    //       - {night-duration} - 15
    // Case: Departures outside the grid
    //       All reservations that have their departure outside the grid
    //       {max-departure-day} : 7 (if 7days), 21 (if 21days)
    //       {arrival-day} : the day when the reservation starts (if past or first day = 1, second day = 2, ....)

    //       Step 1:
    //       - Get the number of days that are still inside the grid
    //       {max-departure-day - arrival-day + 1} // Adding the 1 night fix
    //       // Example: Arrival is the last day (7) => 7 - 7 = 0, 0 + 1 = 1 -> 1 night that we do show
    //       // Example: Arrival is the first day (1) => 7 - 1 = 6, 6 + 1 = 7 -> we want to show all the nights through the grid
    //       - Step 2:
    //       21 Days:
    //         - Substract 10 from it
    //       7 Days:
    //         - Substract 15 from it

    let durationOfReservation = 0,
        isDepartureFlagVisible = true;
    let numberOfNightsVisibleInGrid = Math.abs((reservationDepartureDate.getTime() - reservationArrivalDate.getTime()) / (oneDay));

    if ((reservationDepartureDate.getTime() >= diaryInitialDate.getTime())
        && (reservationDepartureDate.getTime() <= finalDayOfDiaryGrid)
        && (reservationArrivalDate.getTime() !== reservationDepartureDate.getTime())) {


        if (reservationArrivalDate.getTime() < diaryInitialDate.getTime()) {
            numberOfNightsVisibleInGrid = Math.abs((reservationDepartureDate.getTime() - diaryInitialDate.getTime()) / (oneDay));
        }
        durationOfReservation = numberOfNightsVisibleInGrid * nightDuration;
        if (reservationPosition === 0) {
            durationOfReservation = durationOfReservation + 10;
        } else if (reservationPosition > 0) {
            durationOfReservation = durationOfReservation - 5;
        }
    } else if (reservationArrivalDate.getTime() === reservationDepartureDate.getTime()) {
        if (numberOfDays === NIGHTLY_DIARY_CONST.DAYS_7) {
            durationOfReservation = nightDuration - NIGHTLY_DIARY_CONST.DAYS_POSITION_ADD_7;
        } else if (numberOfDays === NIGHTLY_DIARY_CONST.DAYS_21) {
            durationOfReservation = nightDuration - NIGHTLY_DIARY_CONST.DAYS_POSITION_ADD_21;
        }
    } else if (reservationDepartureDate.getTime() > finalDayOfDiaryGrid) {
        let noOfDaysBtwFinalAndArrivalDate = Math.abs((finalDayOfDiaryGrid - reservationArrivalDate.getTime()) / (oneDay));
        // Considering the day when the reservation starts (if past or first day = 1, second day = 2, ....)
        // let reservationArrivalDay = noOfDaysBtwFinalAndDepartureDate + 1;
        let daysInsideTheGrid = 0;

        isDepartureFlagVisible = false;
        if (numberOfDays === NIGHTLY_DIARY_CONST.DAYS_7) {
            daysInsideTheGrid = noOfDaysBtwFinalAndArrivalDate + 1;
            durationOfReservation = (nightDuration * daysInsideTheGrid) - NIGHTLY_DIARY_CONST.DAYS_POSITION_ADD_7;
        } else if (numberOfDays === NIGHTLY_DIARY_CONST.DAYS_21) {
            daysInsideTheGrid = noOfDaysBtwFinalAndArrivalDate + 1;
            durationOfReservation = (nightDuration * daysInsideTheGrid) - NIGHTLY_DIARY_CONST.DAYS_POSITION_ADD_21;
        }

    }
    var returnData = {};

    returnData.durationOfReservation = durationOfReservation;
    returnData.reservationPosition = reservationPosition;
    returnData.numberOfNightsVisibleInGrid = numberOfNightsVisibleInGrid;
    returnData.isArrivalFlagVisible = (diffBtwInitialAndArrivalDate < 0) ? false : true;
    returnData.isDepartureFlagVisible = isDepartureFlagVisible;
    return returnData;
};
/*
 * Adding different classes to the reservation
 */

let getReservationClasses = function (reservation, currentBusinessDate, diaryInitialDayOfDateGrid, numberOfDays) {
    let diaryInitialDate = tzIndependentDate(diaryInitialDayOfDateGrid);
    let businessDate = tzIndependentDate(currentBusinessDate);
    let reservationArrivalDate = tzIndependentDate(reservation.arrival_date);
    let reservationDepartureDate = tzIndependentDate(reservation.dept_date);
    // Minusing 1 bcoz otherwise last date end value (gettime) and next days start will be same.
    let finalDayOfDiaryGrid = diaryInitialDate.getTime() + ((numberOfDays - 1) * 24 * 60 * 60 * 1000);
    // {passed} - class 'passed' should be applied on all reservations that ended before today's date. If you don't have today's date shown in the diary, this class shoudl not be applied to reservations even if they're all in the past
    let passedClass = '';

    if (businessDate.getTime() >= diaryInitialDate.getTime() && businessDate.getTime() <= finalDayOfDiaryGrid) {
        if (reservationDepartureDate.getTime() < businessDate.getTime()) {
            passedClass = 'passed';
        }
    }
    // {day-stay} - class 'day-stay' should be applied to all reservations or OOO/OOS statuses which have the same arrival and departure date,
    // even if in the past or future.
    // This class enables us to show person initials instad of full name.
    let dayStayClass = '';

    if (reservationArrivalDate.getTime() === reservationDepartureDate.getTime()) {
        dayStayClass = 'day-stay';
    }
    return passedClass + " " + dayStayClass;

};
/*
 * Find if the reservation is day stay or not
 * @param reservation object
 * return boolean
 */
let findIsReservationDayStay = (reservation) => {
    return (reservation.number_of_nights === 0) ? true : false;
};
/*
 * Find if the reservation is day stay or not
 * @param reservation object
 * return boolean
 */
let findIsReservationFuture = (reservation, currentBusinessDate) => {
    let reservationArrivalDate = tzIndependentDate(reservation.arrival_date);
    let businessDate = tzIndependentDate(currentBusinessDate);
    let isFuture = false;

    if (reservationArrivalDate.getTime() > businessDate.getTime()) {
        isFuture = true;
    }
    return isFuture;
};
/*
 * Adding different logics to the reservations to pass to component
 */

let convertReservationsListReadyToComponent = (reservation, diaryInitialDayOfDateGrid, numberOfDays, currentBusinessDate, selectedReservationId, newArrivalPosition, newDeparturePosition, selectedRoomId, roomObject) => {

    let positionAndDuration = calculateReservationDurationAndPosition(diaryInitialDayOfDateGrid, reservation, numberOfDays);
    let duration = positionAndDuration.durationOfReservation + "px";

    // Added these params to reservation to avoid the calculation repetion
    // Same values needed in rvNightlyDiaryStayRange.html

    reservation.numberOfNightsVisibleInGrid = positionAndDuration.numberOfNightsVisibleInGrid;
    reservation.duration = positionAndDuration.durationOfReservation;
    reservation.arrivalPositionInt = positionAndDuration.reservationPosition;

    reservation.arrivalPosition = positionAndDuration.reservationPosition + "px";
    reservation.departurePosition = (positionAndDuration.durationOfReservation + positionAndDuration.reservationPosition) + "px";
    reservation.departurePositionInt = (positionAndDuration.durationOfReservation + positionAndDuration.reservationPosition);
    // used in stayrange container and component
    reservation.isArrivalFlagVisible = positionAndDuration.isArrivalFlagVisible;
    reservation.isDepartureFlagVisible = positionAndDuration.isDepartureFlagVisible;

    let isReservationFuture = findIsReservationFuture(reservation, currentBusinessDate);
    let isReservationDayStay = findIsReservationDayStay(reservation);

    reservation.status = (reservation.is_pre_checkin) ? "PRE_CHECKIN" : reservation.status;

    let reservationStatusClass = (!isReservationDayStay && !isReservationFuture)
        ? getReservationStatusClass(reservation.status)
        : (isReservationFuture) ? 'future' : '';
    let reservationClass = getReservationClasses(reservation, currentBusinessDate, diaryInitialDayOfDateGrid, numberOfDays);

    // CICO-41798, Show "Pending" if no name is given initially
    if (reservation.guest_details.first_name === null && reservation.guest_details.last_name === null) {
        reservation.guest_details.last_name = 'Pending';
        reservation.guest_details.first_name = '';
    }

    reservation.guest_details.full_name = reservation.guest_details.first_name + " " + reservation.guest_details.last_name;
    reservation.guest_details.short_name = reservation.guest_details.first_name.substring(0, 1) + "." + reservation.guest_details.last_name.substring(0, 1);
    reservation.isReservationDayStay = isReservationDayStay;

    let reservationEditClass = '';

    reservation.style = {};
    reservation.style.width = duration;
    reservation.style.transform = "translateX(" + positionAndDuration.reservationPosition + "px)";
    if (reservation.id === selectedReservationId && roomObject.id === selectedRoomId) {
        reservationEditClass = "editing";
        if (newArrivalPosition !== '' || newDeparturePosition !== '') {
            let newDuration = newDeparturePosition - newArrivalPosition;

            reservation.style.width = newDuration;
            reservation.style.transform = "translateX(" + newArrivalPosition + "px)";
        }

    }

    reservation.reservationClass = "reservation " + reservationStatusClass + " " + reservationClass + " " + reservationEditClass;
    return reservation;
};

const mapStateToNightlyDiaryReservationContainerProps = (state, ownProps) => ({
    reservation: convertReservationsListReadyToComponent(
        ownProps.reservation, state.diaryInitialDayOfDateGrid,
        state.numberOfDays, state.currentBusinessDate, state.selectedReservationId, state.newArrivalPosition, state.newDeparturePosition, state.selectedRoomId, ownProps.room, state),
    selectReservation: state.callBackFromAngular.selectReservation,
    selectedReservationId: state.selectedReservationId,
    selectedRoom: ownProps.room,
    isFromStayCard: state.isFromStayCard,
    gridDays: state.numberOfDays,
    newArrivalPosition: state.newArrivalPosition,
    newDeparturePosition: state.newDeparturePosition,
    isAvaialbleRoomSlotActive: state.isAvaialbleRoomSlotActive
});

const mapDispatchToNightlyDiaryReservationContainerProps = (stateProps) => {

    let selectReservation = () => { };

    selectReservation = () => {
        return stateProps.selectReservation();
    };
    return {
        selectReservation,
        ...stateProps
    };

};

const NightlyDiaryReservationContainer = connect(
    mapStateToNightlyDiaryReservationContainerProps,
    null,
    mapDispatchToNightlyDiaryReservationContainerProps
)(ReservationComponent);