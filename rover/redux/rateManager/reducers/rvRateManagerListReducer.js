const rateManagerListReducer = (state, action) => {
  switch (action.type) {
    case RM_RX_CONST.RATE_VIEW_CHANGED:
    	return rateManagerRateListReducer(state, action)
  	default:
  		return state;    	
  }	
};