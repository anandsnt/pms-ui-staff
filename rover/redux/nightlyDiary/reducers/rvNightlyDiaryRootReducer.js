const nightlyDiaryRootReducer = (state, action) => (
    {

        roomsList: nightlyDiaryRoomsListReducer(state, action),
        datesGridData: nightlyDiaryDatesGridReducer(state, action)
    }
);