const rateManagerActionReducer = (state, action) => {
  switch (action.type) {
    case RM_RX_CONST.REFRESH_SCROLLERS:
     	return RM_RX_CONST.REFRESH_SCROLLERS;
  	default:
  		return '';
  }
}