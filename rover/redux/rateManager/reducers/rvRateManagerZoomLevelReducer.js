const rateManagerZoomLevelReducer = (state, action) => {
  switch (action.type) {
    case RM_RX_CONST.RATE_VIEW_CHANGED:
     	return action.zoomLevel;
  	default:
  		return state;
  }
}