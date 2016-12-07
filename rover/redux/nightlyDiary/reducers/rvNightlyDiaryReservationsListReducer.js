const nightlyDiaryReservationsListReducer = (state = [], action) => {
  switch (action.type) {
    case 'DIARY_VIEW_CHANGED':
    case 'RESERVATION_SELECTED':
        return action.reservationsList; // Getting reservations in each room
    default:
        return state.reservationsList;
  }
};