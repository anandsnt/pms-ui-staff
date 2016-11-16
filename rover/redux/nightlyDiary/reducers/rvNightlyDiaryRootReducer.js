const nightlyDiaryRootReducer = (state, action) => (
    {
        roomsList: nightlyDiaryRoomsListReducer(state, action),
        reservationsList: nightlyDiaryReservationsListReducer(state, action),
        diaryInitialDayOfDateGrid: (action.type === 'DIARY_VIEW_CHANGED') ? action.initialDayOfDateGrid : state.initialDayOfDateGrid,
        numberOfDays: (action.type === 'DIARY_VIEW_CHANGED') ? action.numberOfDays : state.numberOfDays,
        currentBusinessDate: (action.type === 'DIARY_VIEW_CHANGED') ? action.currentBusinessDate : state.currentBusinessDate,
        callBackFromAngular: callBackReducer(state, action),
        paginationData: paginationDataReducer(state, action)
    }
);

