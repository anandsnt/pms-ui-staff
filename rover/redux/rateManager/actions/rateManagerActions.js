const rateManagerActions = {
	rateViewChanged (ratesAndRestrictions) {
		return {
			mode: RM_RX_CONST.RATE_VIEW_CHANGED
		}
	}
};