const {connect} = ReactRedux;

const mapStateToRateManagerGridRightSideRowsContainerProps = (state) => {
    return {
        mode: state.mode,
        action: state.action,
        list: state.list,
        expandedRows: state.expandedRows
    };
};

const mapDispatchToRateManagerGridRightSideRowsContainerProps = (dispatch) => {
  return {
  	refreshScrollers: () => {
        dispatch({
            type: RM_RX_CONST.REFRESH_SCROLLERS
        });
    },
    hideLoader: () => {
        dispatch({
            type: RM_RX_CONST.ACT_HIDE_ACTIVITY_INDICATOR
        });
    }    
  }
};

const RateManagerGridRightSideRowsContainer = 
	connect(mapStateToRateManagerGridRightSideRowsContainerProps,
		mapDispatchToRateManagerGridRightSideRowsContainerProps)(RateManagerGridRightSideRowsComponent);