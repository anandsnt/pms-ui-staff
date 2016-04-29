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

const mapStateToRateManagerGridViewRootComponentProps = (state) => {
	var propsToReturn = {
	    shouldShow 	 		: shouldShowGridViewRootContainer(state),
	    mode 				: state.mode,
	    refreshScrollers 	: (state.action === RM_RX_CONST.REFRESH_SCROLLERS),
        scrollTo            : state.scrollTo
	};

	if(state.mode === RM_RX_CONST.RATE_VIEW_MODE) {
		propsToReturn.scrollReachedBottom = state.callBacksFromAngular.allRatesScrollReachedBottom;
        propsToReturn.scrollReachedTop = state.callBacksFromAngular.allRatesScrollReachedTop;
	}

	return propsToReturn;
};

const mapDispatchToRateManagerGridViewRootComponentProps = (stateProps, dispatchProps, ownProps) => {
    var scrollReachedBottom = () => {},
        scrollReachedTop = () => {};
    switch(stateProps.mode) {
        case RM_RX_CONST.RATE_VIEW_MODE:
            scrollReachedBottom = (xScrollPosition, maxScrollX, yScrollPosition, maxScrollY) => {
                return stateProps.scrollReachedBottom(xScrollPosition, maxScrollX, yScrollPosition, maxScrollY);
            };
            scrollReachedTop = (xScrollPosition, maxScrollX, yScrollPosition, maxScrollY) => {
                return stateProps.scrollReachedTop(xScrollPosition, maxScrollX, yScrollPosition, maxScrollY);
            };
            break;
    }

    return {
    	...stateProps,
        scrollReachedBottom,
        scrollReachedTop
    };    
};

const RateManagerGridViewRootContainer = connect(
  mapStateToRateManagerGridViewRootComponentProps,
  null,
  mapDispatchToRateManagerGridViewRootComponentProps
)(RateManagerGridViewRootComponent);