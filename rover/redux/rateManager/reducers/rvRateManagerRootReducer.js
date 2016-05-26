const rateManagerRootReducer = (state, action) => (
	{
		list: rateManagerListReducer(state.list, action),
		mode: rateManagerModeReducer(state.mode, action),
		dates: rateManagerDatesReducer(state.dates, action),
		summary: rateManagerRestrictionSummaryReducer(state.summary, action),
		action: rateManagerActionReducer(state.action, action),
		businessDate: rateManagerBusinessDateReducer(state.businessDate, action),
		expandedRows: rateManagerExpandedRowsReducer(state.expandedRows, action),
		restrictionTypes: rateManagerRestrictionTypesReducer(state.restrictionTypes, action),
		loader: rateManagerLoaderReducer(state.loader, action),
		callBacksFromAngular: rateManagerCallbacksFromAngularReducer(state.callBacksFromAngular, action),
		scrollTo: rateManagerScrollToReducer(state.scrollTo, action),
		paginationState: rateManagerPaginationStateDataReducer(state.paginationState, action)
	}
);

//callBacksFromAngular: rateManagerCallbacksFromAngularReducer(state.callBacksFromAngular, action)