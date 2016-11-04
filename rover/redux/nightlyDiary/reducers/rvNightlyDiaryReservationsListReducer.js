const nightlyDiaryReservationsListReducer = (state = [], action) => {
  switch (action.type) {
    case '7_DAYS':
        return action.diaryReservationsListData.rooms; //getting reservations in each room
    default:
        return state;
  }
};