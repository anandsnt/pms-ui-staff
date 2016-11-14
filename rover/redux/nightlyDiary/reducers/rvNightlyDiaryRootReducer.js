const nightlyDiaryRootReducer = (state, action) => (
    {
        roomsList: nightlyDiaryRoomsListReducer(state, action),
        reservationsList: nightlyDiaryReservationsListReducer(state, action),
        diaryInitialDayOfDateGrid: state.initialDayOfDateGrid,
        numberOfDays : state.numberOfDays
    }
);

