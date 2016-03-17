const rateManagerRootReducer = (state, action) => (
	{
		list: rateManagerListReducer(state.list, action),
		mode: rateManagerModeReducer(state.mode, action),
		zoomLevel: rateManagerZoomLevelReducer(state.zoomLevel, action),
		dates: rateManagerDatesReducer(state.dates, action),
		action: rateManagerActionReducer(state.action, action)
	}
);
