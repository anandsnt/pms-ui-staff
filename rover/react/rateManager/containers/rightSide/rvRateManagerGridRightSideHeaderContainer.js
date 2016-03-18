const {connect} = ReactRedux;

const mapStateToRateManagerGridRightSideHeaderContainerProps = (state) => {
  return {
    headerDataList: state.dates
  };
};

const mapDispatchToRateManagerGridRightSideHeaderContainerProps = (dispatch) => {
  return {
  	refreshScrollers: () => {
        dispatch({
            type: RM_RX_CONST.REFRESH_SCROLLERS
        });
    }     
  }
};

const RateManagerGridRightSideHeaderContainer = 
	connect(mapStateToRateManagerGridRightSideHeaderContainerProps, mapDispatchToRateManagerGridRightSideHeaderContainerProps)
	(RateManagerGridRightSideHeaderComponent);