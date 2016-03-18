const {connect} = ReactRedux;

const mapStateToRateManagerGridRightSideRowsContainerProps = (state) => {
  return {
    list: state.list,
    mode: state.mode
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
	connect(mapStateToRateManagerGridRightSideRowsContainerProps, mapDispatchToRateManagerGridRightSideRowsContainerProps)
	(RateManagerGridRightSideRowsComponent);