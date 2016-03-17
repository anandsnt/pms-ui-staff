const {connect} = ReactRedux;

const mapStateToRateManagerGridRightSideHeaderContainerProps = (state) => {
  return {
    headerDataList: state.dates
  };
};

const RateManagerGridRightSideHeaderContainer = 
	connect(mapStateToRateManagerGridRightSideHeaderContainerProps)(RateManagerGridRightSideHeaderComponent);