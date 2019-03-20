const { connect } = ReactRedux;

let calculateHourlyRoomsPositionAndDuration = (diaryInitialDayOfDateGrid, hourly_data, numberOfDays) => {
    let nightDuration = NIGHTLY_DIARY_CONST.RESERVATION_ROW_WIDTH / numberOfDays;
    let noOfDaysBtwInitialAndArrivalDate = diffBtwInitialAndStartDate / oneDay;
    let unHourlyRoomPosition = noOfDaysBtwInitialAndArrivalDate * nightDuration;

    // CICO-61621 : durationOfHourlydRoom = 60, maximum duration for single half.
    let durationOfHourlydRoom = 60;

    returnData.style = {};
    returnData.style.width = durationOfHourlydRoom + "px";
    returnData.style.transform = "translateX(" + unHourlyRoomPosition + "px)";
    return returnData;
};

const mapStateToNightlyDiaryHourlyContainerProps = (state, ownProps) => ({
    hourly_data: calculateHourlyRoomsPositionAndDuration(
        state.diaryInitialDayOfDateGrid, ownProps.hourlyItem, state.numberOfDays
    ),
    state
});

const NightlyDiaryHourlyContainer = connect(
    mapStateToNightlyDiaryHourlyContainerProps
)(NightlyDiaryHourlyComponent);