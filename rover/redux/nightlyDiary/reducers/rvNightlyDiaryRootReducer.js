const nightlyDiaryRootReducer = (state, action) => (
    {

        roomsList: nightlyDiaryRoomsListReducer(state, action),
        callBackFromAngular: callBackReducer(state, action)
    }
);