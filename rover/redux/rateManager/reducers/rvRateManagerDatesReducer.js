const rateManagerDatesReducer = (state = [], action) => {
  switch (action.type) {
    case RM_RX_CONST.RATE_VIEW_CHANGED:
    	return rateManagerRateDatesReducer(state, action);
  	default:
  		return state;    	
  }	
};