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
    }
  }
};

const RateManagerGridRightSideRowsContainer = 
	connect(mapStateToRateManagerGridRightSideRowsContainerProps,
		mapDispatchToRateManagerGridRightSideRowsContainerProps)(RateManagerGridRightSideRowsComponent);