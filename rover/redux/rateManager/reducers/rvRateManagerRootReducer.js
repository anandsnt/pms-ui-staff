const rateManagerRootReducer = (state, action) => (
	{
		list: rateManagerListReducer(state.data, action),
		mode: rateManagerModeReducer(state.mode, action),
		zoomLevel: rateManagerZoomLevelReducer(state.zoomLevel, action),
		dates: rateManagerDatesReducer(state.dates, action)
	}
);
