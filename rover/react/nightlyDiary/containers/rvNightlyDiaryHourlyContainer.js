const { connect } = ReactRedux;

let calculateHourlyRoomsPositionAndDuration = (diaryInitialDayOfDateGrid, hourly_data, numberOfDays) => {
    let nightDuration = NIGHTLY_DIARY_CONST.RESERVATION_ROW_WIDTH / numberOfDays;
    let diaryInitialDate = tzIndependentDate(diaryInitialDayOfDateGrid);
    let arrivalTime = tzIndependentDate(hourly_data.arrival_date);
    let diffBtwInitialAndStartDate = arrivalTime.getTime() - diaryInitialDate.getTime();
    let oneDay = 24 * 60 * 60 * 1000;
    let noOfDaysBtwInitialAndArrivalDate = diffBtwInitialAndStartDate / oneDay;
    let unHourlyRoomPosition = noOfDaysBtwInitialAndArrivalDate * nightDuration;

    // CICO-61621 : durationOfHourlydRoom = 30 or 60, maximum duration for single half. for 7/21 modes.
    let durationOfHourlydRoom = (numberOfDays === NIGHTLY_DIARY_CONST.DAYS_21) ? 30 : 60;
    let returnData = {};

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