const nightlyDiaryRootReducer = (state, action) => (
    {

        roomsList: nightlyDiaryRoomsListReducer(state, action)
    }
);