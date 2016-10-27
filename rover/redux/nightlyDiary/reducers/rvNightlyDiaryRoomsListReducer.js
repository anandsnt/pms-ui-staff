const nightlyDiaryRoomsListReducer = (state = [], action) => {
  switch (action.type) {
    case 'INITIAL_RENDERING':
    console.log("reached reducer")
        return action.diaryRenderData.rooms_list;
    default:
        return state;
  }
};