const nightlyDiaryRoomsListReducer = (state = [], action) => {
  switch (action.type) {
    case 'INITIAL_RENDERING':
    console.log("reached reducer")
        return action.roomsListData;
    default:
        return state;
  }
};