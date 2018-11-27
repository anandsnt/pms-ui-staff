const { connect } = ReactRedux;

let calculateHourlyRoomsPositionAndDuration = (diaryInitialDayOfDateGrid, hourly_data, numberOfDays) => {
    let nightDuration = NIGHTLY_DIARY_CONST.RESERVATION_ROW_WIDTH / numberOfDays;
    let diaryInitialDate = tzIndependentDate(diaryInitialDayOfDateGrid);
    let arrivalTime = tzIndependentDate(hourly_data.arrival_date);
    let arrival_time_array = hourly_data.arrival_time.split(':');
    let depatureTime = tzIndependentDate(hourly_data.dept_date);
    let depature_time_array = hourly_data.dept_time.split(':');
    let oneDay = 24 * 60 * 60 * 1000;
    let diffBtwInitialAndStartDate = arrivalTime.getTime() - diaryInitialDate.getTime();
    let noOfDaysBtwInitialAndArrivalDate = Math.abs((diffBtwInitialAndStartDate) / (oneDay));

    let unHourlyRoomPosition = 0;

    if (noOfDaysBtwInitialAndArrivalDate > 0) {
        unHourlyRoomPosition = noOfDaysBtwInitialAndArrivalDate * nightDuration;
    }
    if (parseInt(arrival_time_array[0]) >= 12) {
        unHourlyRoomPosition = unHourlyRoomPosition + (nightDuration / 2);
    }

    arrivalTime.setHours(parseInt(arrival_time_array[0]));
    arrivalTime.setMinutes(parseInt(arrival_time_array[1]));
    depatureTime.setHours(parseInt(depature_time_array[0]));
    depatureTime.setMinutes(parseInt(depature_time_array[1]));

    let oneHour = 60 * 60 * 1000;
    let totalDurationInHours = arrivalTime.getTime() - depatureTime.getTime();
    totalDurationInHours = Math.abs((totalDurationInHours) / (oneHour));

    let durationOfHourlydRoom = 0;

    durationOfHourlydRoom = Math.ceil(totalDurationInHours / 12) * (nightDuration / 2);


    var returnData = {};

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