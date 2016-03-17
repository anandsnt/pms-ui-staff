const rateManagerBusinessDateReducer = (state, action) => {
  switch (action.type) {
    case 'RATE_VIEW_CHANGED':
    	return action.businessDate;
  	default:
  		return state;    	
  }	
};