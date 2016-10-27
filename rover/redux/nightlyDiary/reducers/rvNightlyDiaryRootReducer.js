const nightlyDiaryRootReducer = (state, action) => (
    {
        roomsList: nightlyDiaryRoomsListReducer(state.list, action)
    }
);