const callBackReducer = (state = [], action) => {
  switch (action.type) {
    case 'DIARY_VIEW_CHANGED':
        return action.callBackFromAngular;
    case 'RESERVATION_SELECTED':
        return state.callBackFromAngular;
    default:
        return state.callBackFromAngular;
  }
};