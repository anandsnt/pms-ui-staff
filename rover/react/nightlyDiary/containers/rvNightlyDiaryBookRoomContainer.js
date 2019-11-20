const { connect } = ReactRedux;

let calculateBookRoomPositionAndDuration = (diaryInitialDayOfDateGrid, uarData, numberOfDays) => {
    let nightDuration = NIGHTLY_DIARY_CONST.RESERVATION_ROW_WIDTH / numberOfDays;
    let diaryInitialDate = tzIndependentDate(diaryInitialDayOfDateGrid);
    let moveRoomStartDate = tzIndependentDate(uarData.fromDate);

    let oneDay = 24 * 60 * 60 * 1000;
    let diffBtwInitialAndStartDate = moveRoomStartDate.getTime() - diaryInitialDate.getTime();
    let noOfDaysBtwInitialAndArrivalDate = (diffBtwInitialAndStartDate) / (oneDay);

    let moveRoomPosition = 0;

    if (noOfDaysBtwInitialAndArrivalDate > 0) {
        moveRoomPosition = noOfDaysBtwInitialAndArrivalDate * nightDuration;
    }
    if (noOfDaysBtwInitialAndArrivalDate >= 0) {
        if (numberOfDays === NIGHTLY_DIARY_CONST.DAYS_7) {
            moveRoomPosition = moveRoomPosition + NIGHTLY_DIARY_CONST.DAYS_POSITION_ADD_7;
        } else if (numberOfDays === NIGHTLY_DIARY_CONST.DAYS_21) {
            moveRoomPosition = moveRoomPosition + NIGHTLY_DIARY_CONST.DAYS_POSITION_ADD_21;
        }
    }
    
    let numberOfNightsVisibleInGrid = (uarData.nights <= 1) ? 1 : uarData.nights;
    let durationOfMoveRoom = numberOfNightsVisibleInGrid * nightDuration;
        
    if (numberOfDays === NIGHTLY_DIARY_CONST.DAYS_7 && uarData.nights === 0) {
        durationOfMoveRoom = durationOfMoveRoom - NIGHTLY_DIARY_CONST.DAYS_7_OFFSET;
    }
    else if (numberOfDays === NIGHTLY_DIARY_CONST.DAYS_7) {
        durationOfMoveRoom = durationOfMoveRoom - NIGHTLY_DIARY_CONST.EXTEND_7_DAYS / 2;
    }
    else if (numberOfDays === NIGHTLY_DIARY_CONST.DAYS_21 && uarData.nights === 0) {
        durationOfMoveRoom = durationOfMoveRoom - NIGHTLY_DIARY_CONST.DAYS_7_OFFSET / 2;
    }
    else {
        durationOfMoveRoom = durationOfMoveRoom - NIGHTLY_DIARY_CONST.EXTEND_21_DAYS / 2;
    }
    
    var returnData = {};

    returnData.numberOfNightsVisibleInGrid = numberOfNightsVisibleInGrid;
    returnData.style = {};
    returnData.style.width = durationOfMoveRoom + "px";
    returnData.style.transform = "translateX(" + moveRoomPosition + "px)";

    return returnData;
};

const mapStateToNightlyDiaryBookRoomContainerProps = (state) => ({
    uar_data: calculateBookRoomPositionAndDuration(
        state.diaryInitialDayOfDateGrid, state.availableSlotsForBookRooms, state.numberOfDays
    ),
    bookRoom: state.callBackFromAngular.clickedBookRoom,
    availableSlotsForBookRooms: state.availableSlotsForBookRooms,
    diaryMode: state.diaryMode
});

const NightlyDiaryBookRoomContainer = connect(
    mapStateToNightlyDiaryBookRoomContainerProps
)(NightlyDiaryBookRoomComponent);