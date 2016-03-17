const rateManagerModeReducer = (state, action) => {
  switch (action.type) {
    case RM_RX_CONST.RATE_VIEW_CHANGED:
     	return RM_RX_CONST.RATE_VIEW_MODE;
  	default:
  		return state;
  }
}