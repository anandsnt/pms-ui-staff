const nightlyDiaryRoomsListReducer = (state = [], action) => {
  switch (action.type) {
    case '7_DAYS':
        return action.diaryRoomsListData.rooms;
    default:
        return state;
  }
};