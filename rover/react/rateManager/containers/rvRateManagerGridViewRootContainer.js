const {connect} = ReactRedux;

const mapStateToRateManagerGridViewRootComponentProps = (state) => {
	var propsToReturn = {
	    shouldShow: (state.mode !== RM_RX_CONST.NOT_CONFIGURED_MODE),
	    mode: state.mode,
	    zoomLevel: state.zoomLevel,
	    refreshScrollers: (state.action === RM_RX_CONST.REFRESH_SCROLLERS)
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
            scrollReachedBottom = (e) => {
                return stateProps.scrollReachedBottom();
            };
            scrollReachedTop = (e) => {
                return stateProps.scrollReachedTop();
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