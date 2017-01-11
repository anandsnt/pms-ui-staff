const {connect} = ReactRedux;

let convertCurrentSelectedReservation = (currentSelectedReservation, selectedReservationId, dateFormat) => {
    currentSelectedReservation.arrivalStyle = {};
    currentSelectedReservation.departureStyle = {};
    let stayRangeArrivalClass = "grid-stay-range";

    if (selectedReservationId) {
        currentSelectedReservation.arrivalStyle.transform = 'translateX(' + currentSelectedReservation.arrivalPosition + ')';
        currentSelectedReservation.departureStyle.transform = 'translateX(' + currentSelectedReservation.departurePosition + ')';
    } else {
        stayRangeArrivalClass = stayRangeArrivalClass + " hidden";
    }
    currentSelectedReservation.class = stayRangeArrivalClass;
    // TO DO: Add momentjs and do date formatting using momentjs
    // We have to show date in hotel's date format
    currentSelectedReservation.arrivalDate = moment(currentSelectedReservation.arrival_date, "YYYY-MM-DD").format(dateFormat.toUpperCase());
    currentSelectedReservation.deptDate = moment(currentSelectedReservation.dept_date, "YYYY-MM-DD").format(dateFormat.toUpperCase());
    return currentSelectedReservation;
};


const mapStateToNightlyDiaryStayRangeContainerProps = (state) => ({
    currentSelectedReservation: convertCurrentSelectedReservation(state.currentSelectedReservation, state.selectedReservationId, state.dateFormat)
    //currentSelectedReservation: state.currentSelectedReservation

});

const NightlyDiaryStayRangeContainer = connect(
  mapStateToNightlyDiaryStayRangeContainerProps
)(NightlyDiaryStayRangeComponent);