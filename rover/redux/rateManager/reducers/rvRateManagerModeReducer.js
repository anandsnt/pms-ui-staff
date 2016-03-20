const rateManagerModeReducer = (state, action) => {
  switch (action.type) {
    case RM_RX_CONST.RATE_VIEW_CHANGED:
     	return RM_RX_CONST.RATE_VIEW_MODE;
    case RM_RX_CONST.ROOM_TYPE_VIEW_CHANGED:
    	return RM_RX_CONST.ROOM_TYPE_VIEW_MODE;       	
    case RM_RX_CONST.SINGLE_RATE_EXPANDABLE_VIEW_CHANGED:
    	return RM_RX_CONST.SINGLE_RATE_EXPANDABLE_VIEW_MODE; 
  	default:
  		return state;
  }
}