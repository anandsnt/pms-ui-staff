const rateManagerRootReducer = (state, action) => (
	{
		list: rateManagerListReducer(state.data, action),
		mode: rateManagerModeReducer(state.mode, action)
	}
);
