const nightlyDiaryRootReducer = (state, action) => (
    {
        roomsList: nightlyDiaryRoomsListReducer(state, action),
        reservationsList: nightlyDiaryReservationsListReducer(state, action),
        diaryInitialDayOfDateGrid: action.diaryInitialDayOfDateGrid
    }
);