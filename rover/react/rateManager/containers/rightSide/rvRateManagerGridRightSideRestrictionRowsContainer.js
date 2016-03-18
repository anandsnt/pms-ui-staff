const {connect} = ReactRedux;

const mapStateToRateManagerGridRightSideRestrictionRowsContainerProps = (state) => {
  return {
    restrictionRows: state.list,
    mode: state.mode
  };
};

const mapDispatchToRateManagerGridRightSideRestrictionRowsContainerProps = (dispatch) => {
  return {};
};

const RateManagerGridRightSideRestrictionRowsContainer = 
	connect(mapStateToRateManagerGridRightSideRestrictionRowsContainerProps, mapDispatchToRateManagerGridRightSideRestrictionRowsContainerProps)
	(RateManagerGridRightSideRestrictionRowsComponent);