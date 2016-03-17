const rateManagerModeReducer = (state, action) => {
  switch (action.type) {
    case 'RATE_VIEW_CHANGED':
     	return 'RATE_VIEW';
  	default:
  		return state;
  }
}