const nightlyDiaryRoomsListReducer = (state = [], action) => {
  switch (action.type) {
    case 'DIARY_VIEW_CHANGED':
        return action.diaryRoomsListData.rooms;
    default:
        return state.roomsList;
  }
};