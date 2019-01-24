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
    let noOfDaysBtwInitialAndArrivalDate = diffBtwInitialAndStartDate / oneDay;

    let unHourlyRoomPosition = 0;

    unHourlyRoomPosition = noOfDaysBtwInitialAndArrivalDate * nightDuration;

    if (parseInt(arrival_time_array[0]) >= 12) {
        unHourlyRoomPosition = unHourlyRoomPosition + (nightDuration / 2);
    }

    if ((arrival_time_array[0]) < 12) {
        arrivalTime.setHours(parseInt('00'));
        arrivalTime.setMinutes(parseInt('00'));
    }
    else if (arrival_time_array[0] >= 12) {
        arrivalTime.setHours(parseInt('12'));
        arrivalTime.setMinutes(parseInt('00'));
    }
    if ((depature_time_array[0]) < 12) {
        depatureTime.setHours(parseInt('12'));
        depatureTime.setMinutes(parseInt('00'));
    }
    else if (depature_time_array[0] > 12) {
        depatureTime.setHours(parseInt('23'));
        depatureTime.setMinutes(parseInt('59'));
    }
    else if (parseInt(depature_time_array[0]) === 12) {
        depatureTime.setHours(parseInt('12'));
        depatureTime.setMinutes(parseInt('00'));
        if (depature_time_array[1] > 0) {
            depatureTime.setHours(parseInt('23'));
            depatureTime.setMinutes(parseInt('59'));
        }
    }

    let oneHour = 60 * 60 * 1000;
    let totalDurationInHours = depatureTime.getTime() - arrivalTime.getTime();

    totalDurationInHours = Math.abs((totalDurationInHours) / (oneHour));

    let durationOfHourlydRoom = 0;

    durationOfHourlydRoom = Math.abs(totalDurationInHours / 12) * (nightDuration / 2);
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