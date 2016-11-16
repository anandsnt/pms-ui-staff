const nightlyDiaryReservationsListReducer = (state = [], action) => {
  switch (action.type) {
    case 'DIARY_VIEW_CHANGED':
        return action.reservationsList; // Getting reservations in each room
    default:
        return state.reservationsList;
  }
};