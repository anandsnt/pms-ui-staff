const { connect } = ReactRedux;

let calculateAssignRoomPositionAndDuration = (diaryInitialDayOfDateGrid, uarData, numberOfDays) => {
    let nightDuration = NIGHTLY_DIARY_CONST.RESERVATION_ROW_WIDTH / numberOfDays;
    let diaryInitialDate = tzIndependentDate(diaryInitialDayOfDateGrid);
    let assignRoomStartDate = tzIndependentDate(uarData.fromDate);

    let oneDay = 24 * 60 * 60 * 1000;
    let diffBtwInitialAndStartDate = assignRoomStartDate.getTime() - diaryInitialDate.getTime();
    let noOfDaysBtwInitialAndArrivalDate = Math.abs((diffBtwInitialAndStartDate) / (oneDay));

    let assignRoomPosition = 0;

    if (noOfDaysBtwInitialAndArrivalDate > 0) {
        assignRoomPosition = noOfDaysBtwInitialAndArrivalDate * nightDuration;
    }
    if (noOfDaysBtwInitialAndArrivalDate >= 0) {
        if (numberOfDays === NIGHTLY_DIARY_CONST.DAYS_7) {
            assignRoomPosition = assignRoomPosition + NIGHTLY_DIARY_CONST.DAYS_POSITION_ADD_7;
        } else if (numberOfDays === NIGHTLY_DIARY_CONST.DAYS_21) {
            assignRoomPosition = assignRoomPosition + NIGHTLY_DIARY_CONST.DAYS_POSITION_ADD_21;
        }
    }

    let durationOfAssignRoom = 0;
    let numberOfNightsVisibleInGrid = (uarData.nights <= 1) ? 1 : uarData.nights;
    
    durationOfAssignRoom = numberOfNightsVisibleInGrid * nightDuration;
    if (numberOfDays === NIGHTLY_DIARY_CONST.DAYS_7) {
        durationOfAssignRoom = durationOfAssignRoom - 2 * NIGHTLY_DIARY_CONST.DAYS_POSITION_ADD_7;
    } else if (numberOfDays === NIGHTLY_DIARY_CONST.DAYS_21) {
        durationOfAssignRoom = durationOfAssignRoom - 2 * NIGHTLY_DIARY_CONST.DAYS_POSITION_ADD_21;
    }
    var returnData = {};

    returnData.numberOfNightsVisibleInGrid = numberOfNightsVisibleInGrid;
    returnData.style = {};
    returnData.style.width = durationOfAssignRoom + "px";
    returnData.style.transform = "translateX(" + assignRoomPosition + "px)";

    return returnData;
};

const mapStateToNightlyDiaryAssignRoomContainerProps = (state) => ({
    uar_data: calculateAssignRoomPositionAndDuration(
        state.diaryInitialDayOfDateGrid, state.availableSlotsForAssignRooms, state.numberOfDays
    ),
    assignRoom: state.callBackFromAngular.clickedAssignRoom,
    availableSlotsForAssignRooms: state.availableSlotsForAssignRooms
});

const NightlyDiaryAssignRoomContainer = connect(
    mapStateToNightlyDiaryAssignRoomContainerProps
)(NightlyDiaryAssignRoomComponent);