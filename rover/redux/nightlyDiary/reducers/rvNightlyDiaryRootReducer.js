const nightlyDiaryRootReducer = (state, action) => (
    {
        roomsList: nightlyDiaryRoomsListReducer(state, action),
        reservationsList: nightlyDiaryReservationsListReducer(state, action),
        diaryInitialDayOfDateGrid: (action.type === 'DIARY_VIEW_CHANGED') ? action.diaryInitialDayOfDateGrid : state.diaryInitialDayOfDateGrid,
        numberOfDays: (action.type === 'DIARY_VIEW_CHANGED') ? action.numberOfDays : state.numberOfDays,
        currentBusinessDate: (action.type === 'DIARY_VIEW_CHANGED') ? action.currentBusinessDate : state.currentBusinessDate,
        callBackFromAngular: callBackReducer(state, action),
        paginationData: paginationDataReducer(state, action),
        selectReservationId: (action.type === 'RESERVATION_SELECTED' || action.type === 'CANCEL_RESERVATION_EDITING')
                            ? action.selectReservationId
                            : state.selectReservationId,
        selectedRoomId: (action.type === 'DIARY_VIEW_CHANGED') ? action.selectedRoomId : state.selectedRoomId
    }
);

