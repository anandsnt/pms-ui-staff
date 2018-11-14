const { connect } = ReactRedux;

let calculateUnassignedRoomsPositionAndDuration = (diaryInitialDayOfDateGrid, uarData, numberOfDays) => {
    let nightDuration = NIGHTLY_DIARY_CONST.RESERVATION_ROW_WIDTH / numberOfDays;
    let diaryInitialDate = tzIndependentDate(diaryInitialDayOfDateGrid);
    let unassignedRoomStartDate = tzIndependentDate(uarData.fromDate);

    let oneDay = 24 * 60 * 60 * 1000;
    let diffBtwInitialAndStartDate = unassignedRoomStartDate.getTime() - diaryInitialDate.getTime();
    let noOfDaysBtwInitialAndArrivalDate = Math.abs((diffBtwInitialAndStartDate) / (oneDay));

    let unAssignedRoomPosition = 0;

    if (noOfDaysBtwInitialAndArrivalDate > 0) {
        unAssignedRoomPosition = noOfDaysBtwInitialAndArrivalDate * nightDuration;
    }
    if (noOfDaysBtwInitialAndArrivalDate >= 0) {
        if (numberOfDays === NIGHTLY_DIARY_CONST.DAYS_7) {
            unAssignedRoomPosition = unAssignedRoomPosition + NIGHTLY_DIARY_CONST.DAYS_POSITION_ADD_7;
        } else if (numberOfDays === NIGHTLY_DIARY_CONST.DAYS_21) {
            unAssignedRoomPosition = unAssignedRoomPosition + NIGHTLY_DIARY_CONST.DAYS_POSITION_ADD_21;
        }
    }

    let durationOfUnAssignedRoom = 0;
    let numberOfNightsVisibleInGrid = uarData.nights;
    durationOfUnAssignedRoom = numberOfNightsVisibleInGrid * nightDuration;
    if (numberOfDays === NIGHTLY_DIARY_CONST.DAYS_7) {
        durationOfUnAssignedRoom = durationOfUnAssignedRoom - 2 * NIGHTLY_DIARY_CONST.DAYS_POSITION_ADD_7;
    } else if (numberOfDays === NIGHTLY_DIARY_CONST.DAYS_21) {
        durationOfUnAssignedRoom = durationOfUnAssignedRoom - 2 * NIGHTLY_DIARY_CONST.DAYS_POSITION_ADD_21;
    }
    var returnData = {};

    returnData.numberOfNightsVisibleInGrid = numberOfNightsVisibleInGrid;
    returnData.style = {};
    returnData.style.width = durationOfUnAssignedRoom + "px";
    returnData.style.transform = "translateX(" + unAssignedRoomPosition + "px)";

    return returnData;
};


const mapStateToNightlyDiaryUnAssignedContainerProps = (state) => ({
    uar_data: calculateUnassignedRoomsPositionAndDuration(
        state.diaryInitialDayOfDateGrid, state.avalableSlotsForAssignRooms, state.numberOfDays
    ),
    assignRoom: state.callBackFromAngular.unAssignedRoomSelect,
    avalableSlotsForAssignRooms: state.avalableSlotsForAssignRooms
});

const NightlyDiaryUnAssignedContainer = connect(
    mapStateToNightlyDiaryUnAssignedContainerProps
)(NightlyDiaryUnAssignedComponent);