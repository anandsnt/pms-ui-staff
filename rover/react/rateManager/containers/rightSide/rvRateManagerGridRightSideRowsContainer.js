const {connect} = ReactRedux;

const mapStateToRateManagerGridRightSideRowsContainerProps = (state) => {
  return {
    list: state.list
  };
};

const mapDispatchToRateManagerGridRightSideRowsContainerProps = (dispatch) => {
  return {
  	refreshScrollers: () => {
        dispatch({
            type: 'REFRESH_SCROLLERS'
        });
    }     
  }
};

const RateManagerGridRightSideRowsContainer = 
	connect(mapStateToRateManagerGridRightSideRowsContainerProps, mapDispatchToRateManagerGridRightSideRowsContainerProps)
	(RateManagerGridRightSideRowsComponent);