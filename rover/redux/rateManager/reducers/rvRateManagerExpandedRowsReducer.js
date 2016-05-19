const rateManagerExpandedRowsReducer = (state, action) => {
  switch (action.type) {
    case RM_RX_CONST.RATE_VIEW_CHANGED:
     	return [];
    case RM_RX_CONST.ROOM_TYPE_VIEW_CHANGED:
    	return [];       	
    case RM_RX_CONST.SINGLE_RATE_EXPANDABLE_VIEW_CHANGED:
    	return []; 
    case RM_RX_CONST.TOGGLE_EXPAND_COLLAPSE_ROW:
      let indexToDelete = state.indexOf(action.payLoad.index);
      if(indexToDelete === -1) {
        return [
          ...state,
          action.payLoad.index
        ];
      }
      else {
        return [
          ...state.slice(0, indexToDelete),
          ...state.slice(indexToDelete + 1)
        ];
      }
  	default:
  		return state;
  }
}