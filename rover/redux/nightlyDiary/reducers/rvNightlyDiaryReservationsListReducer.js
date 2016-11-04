const nightlyDiaryReservationsListReducer = (state = [], action) => {
  switch (action.type) {
    case 'DIARY_VIEW_CHANGED':
        return action.diaryReservationsListData.rooms; //getting reservations in each room
    default:
        return state;
  }
};