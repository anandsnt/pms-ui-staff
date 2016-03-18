const rateManagerRestrictionTypesReducer = (state, action) => {
  switch (action.type) {
    case RM_RX_CONST.RATE_VIEW_CHANGED:
     	return _.chain(action.restrictionTypes)
     		.filter({ 'activated': true })
     		.filter({ 'editable': false })
     		.sortBy('id')
     		.value();
  	default:
  		return state;
  }
};