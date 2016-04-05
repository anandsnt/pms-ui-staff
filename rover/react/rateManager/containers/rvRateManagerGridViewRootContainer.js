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
	}

	return propsToReturn;
};

const mapDispatchToRateManagerGridViewRootComponentProps = (stateProps, dispatchProps, ownProps) => {
    var scrollReachedBottom = () => {};
    switch(stateProps.mode) {
        case RM_RX_CONST.RATE_VIEW_MODE:
            scrollReachedBottom = (e) => {
                return stateProps.scrollReachedBottom();
            };
            break;
    }

    return {
    	...stateProps,
        scrollReachedBottom
    };    
};

const RateManagerGridViewRootContainer = connect(
  mapStateToRateManagerGridViewRootComponentProps,
  null,
  mapDispatchToRateManagerGridViewRootComponentProps
)(RateManagerGridViewRootComponent);