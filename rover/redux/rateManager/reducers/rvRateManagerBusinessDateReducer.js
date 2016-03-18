const rateManagerBusinessDateReducer = (state, action) => {
  switch (action.type) {
    case RM_RX_CONST.RATE_VIEW_CHANGED:
    	return action.businessDate;
  	default:
  		return state;    	
  }	
};