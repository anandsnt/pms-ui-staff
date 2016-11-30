const {connect} = ReactRedux;

const mapStateToNightlyDiaryReservationContainerProps = (state, ownProps) => ({
    reservation: ownProps.reservation,
    selectReservation: state.callBackFromAngular.selectReservation,
    selectReservationId : state.selectReservationId
});

// // const NightlyDiaryReservationsListContainer = connect(
// //   mapStateToNightlyDiaryReservationsListContainerProps
// // )(NightlyDiaryReservationsListComponent);

const mapDispatchToNightlyDiaryReservationContainerProps = (stateProps, dispatchProps) => {
    //  let clickedRate = stateProps;
    //  let dis = dispatchProps;
    //  let own = ownProps;
    // // stateProps.goToReservationStayCard({
    // //     //fromDate: stateProps.fromDate,
    // //    // toDate: stateProps.toDate,
    // //    // selectedRates: [{id: clickedRate.id, name: clickedRate.name, accountName: clickedRate.accountName, address: clickedRate.address}]
    // // })

    let selectReservation = () => {};

    selectReservation = (reservation) => {
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