const rateManagerActionReducer = (state, action) => {
  switch (action.type) {
	case RM_RX_CONST.RATE_VIEW_CHANGED:
	case RM_RX_CONST.ROOM_TYPE_VIEW_CHANGED:
	case RM_RX_CONST.SINGLE_RATE_EXPANDABLE_VIEW_CHANGED:
		return '';
    case RM_RX_CONST.REFRESH_SCROLLERS:
    	return RM_RX_CONST.REFRESH_SCROLLERS;   	
  	default:
  		return state;    	
  }	
}