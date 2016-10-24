const rateManagerFlagsReducer = (state, action) => {
  switch (action.type) {
  case RM_RX_CONST.RATE_VIEW_WITH_ADDRESS:
    return action.flags;
  case RM_RX_CONST.SINGLE_RATE_EXPANDABLE_VIEW_CHANGED :
  	return {showRateDetail:false};
  default:
  	return state;    	
  }	
}	