const nightlyDiaryRoomsListReducer = (state = [], action) => {
  switch (action.type) {
    case NIGHTLY_DIARY_SEVEN_MODE:
    console.log("reached reducer")
        return action.roomsList;
    default:
        return state;
  }
};