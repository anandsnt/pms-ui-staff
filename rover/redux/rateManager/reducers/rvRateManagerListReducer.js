const rateManagerListReducer = (state = [], action) => {
  switch (action.type) {
    case RM_RX_CONST.RATE_VIEW_CHANGED:
    	return action.rateRestrictionData;
    case RM_RX_CONST.ROOM_TYPE_VIEW_CHANGED:
    	return action.roomTypeRestrictionData;
    case RM_RX_CONST.SINGLE_RATE_EXPANDABLE_VIEW_CHANGED:
    	return action.singleRateRestrictionData;     	      	
  	default:
  		return state;    	
  }	
};