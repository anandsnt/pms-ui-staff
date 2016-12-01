const {connect} = ReactRedux;

const mapStateToNightlyDiaryReservationContainerProps = (state, ownProps) => ({
    reservation: ownProps.reservation,
    selectReservation: state.callBackFromAngular.selectReservation,
    selectReservationId: state.selectReservationId
});

const mapDispatchToNightlyDiaryReservationContainerProps = (stateProps) => {

    let selectReservation = () => {};

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