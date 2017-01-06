const {connect} = ReactRedux;

let convertCurrentSelectedReservation = (currentSelectedReservation, selectedReservationId) => {
    currentSelectedReservation.style = {};
    if (selectedReservationId) {
        currentSelectedReservation.style.transform = 'translateX(' + currentSelectedReservation.arrivalPosition + ')';
    }
    // TO DO: Add momentjs and do date formatting using momentjs
    // We have to show date in hotel's date format
    currentSelectedReservation.arrival_date = currentSelectedReservation.arrival_date;
    return currentSelectedReservation;
};

const mapStateToNightlyDiaryStayRangeContainerProps = (state) => ({
    currentSelectedReservation: convertCurrentSelectedReservation(state.currentSelectedReservation, state.selectedReservationId)

});

const NightlyDiaryStayRangeContainer = connect(
  mapStateToNightlyDiaryStayRangeContainerProps
)(NightlyDiaryStayRangeComponent);