const rateManagerListReducer = (state = [], action) => {
  switch (action.type) {
    case 'RATE_VIEW_CHANGED':
    	return rateManagerRateListReducer(state, action);
  	default:
  		return state;    	
  }	
};