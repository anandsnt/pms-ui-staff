const rateManagerDatesReducer = (state = [], action) => {
  switch (action.type) {
    case 'RATE_VIEW_CHANGED':
    	return rateManagerRateDatesReducer(state, action);
  	default:
  		return state;    	
  }	
};