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
            type: 'REFRESH_SCROLLERS'
        });
    }     
  }
};

const RateManagerGridRightSideHeaderContainer = 
	connect(mapStateToRateManagerGridRightSideHeaderContainerProps, mapDispatchToRateManagerGridRightSideHeaderContainerProps)
	(RateManagerGridRightSideHeaderComponent);