const rateManagerZoomLevelReducer = (state, action) => {
  switch (action.type) {
    case 'RATE_VIEW_CHANGED':
     	return action.zoomLevel;
  	default:
  		return state;
  }
}