const nightlyDiaryRoomsListReducer = (state = [], action) => {
  switch (action.type) {
    case 'DIARY_VIEW_CHANGED':
        return action.roomsList;
    default:
        return state.roomsList;
  }
};