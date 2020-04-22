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
	return {
        shouldShow          : shouldShowGridViewRootContainer(state),
        mode                : state.mode,
        refreshScrollers    : (state.action === RM_RX_CONST.REFRESH_SCROLLERS),
        scrollTo            : state.scrollTo,
        paginationStateData : state.paginationState,
        hierarchyRestrictionClass: state.hierarchyRestrictionClass,
        toggleFunction: state.callBacksFromAngular && state.callBacksFromAngular.handlePanelToggle,
        frozenPanelClass: state.frozenPanelClass
    };
};

const mapDispatchToRateManagerGridViewRootComponentProps = (stateProps, dispatchProps, ownProps) => {
    var wrapperClass = 'calendar-wraper',
        isLastPage = stateProps.mode === RM_RX_CONST.RATE_VIEW_MODE &&
            Math.ceil(stateProps.paginationStateData.totalRows / stateProps.paginationStateData.perPage) ===  stateProps.paginationStateData.page;

    if(stateProps.mode === RM_RX_CONST.RATE_VIEW_MODE && stateProps.paginationStateData.page > 1){
        wrapperClass += ' load-top';
    }

    if(stateProps.mode === RM_RX_CONST.RATE_VIEW_MODE && !isLastPage){
        wrapperClass += ' load-bottom';
    }

    if (stateProps.toggleFunction) {
        var handleToggler = () => {
            stateProps.toggleFunction(stateProps.frozenPanelClass);
        };
    }

    return {
    	...stateProps,
        wrapperClass,
        handleToggler 
    };    
};

const RateManagerGridViewRootContainer = connect(
  mapStateToRateManagerGridViewRootComponentProps,
  null,
  mapDispatchToRateManagerGridViewRootComponentProps
)(RateManagerGridViewRootComponent);