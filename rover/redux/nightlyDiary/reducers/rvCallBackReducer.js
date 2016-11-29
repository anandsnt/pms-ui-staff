const callBackReducer = (state = [], action) => {
  switch (action.type) {
    case 'DIARY_VIEW_CHANGED':
        return action.callbackFromAngular;
    case 'RESERVATION_SELECTED':
        return action.callBackFromAngular;
    default:
        return state.callbackFromAngular;
  }
};