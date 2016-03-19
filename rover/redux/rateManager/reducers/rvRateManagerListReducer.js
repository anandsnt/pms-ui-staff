const rateManagerListReducer = (state, action) => {
  switch (action.type) {
    case RM_RX_CONST.RATE_VIEW_CHANGED:
    	return action.data;
    case RM_RX_CONST.ROOM_TYPE_VIEW_CHANGED:
    	return action.data;       	
  	default:
  		return state;    	
  }	
};