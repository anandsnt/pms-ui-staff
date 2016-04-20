const {connect} = ReactRedux;

/**
 * to determine whether we need to show Grid view
 * @param  {Object} state
 * @return {Boolean}
 */
const shouldShowGridViewRootContainer = (state) => {
	var listOfModesNotShowing = [
		RM_RX_CONST.NO_RESULTS_FOUND_MODE,
		RM_RX_CONST.NOT_CONFIGURED_MODE
	];
	return (listOfModesNotShowing.indexOf(state.mode) === -1);
};

const mapStateToRateManagerGridViewRootComponentProps = (state) => ({
    shouldShow 			: shouldShowGridViewRootContainer(state),
    refreshScrollers 	: (state.action === RM_RX_CONST.REFRESH_SCROLLERS)
});


const RateManagerGridViewRootContainer = connect(
  mapStateToRateManagerGridViewRootComponentProps
)(RateManagerGridViewRootComponent);