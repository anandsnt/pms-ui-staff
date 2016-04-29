const {connect} = ReactRedux;

const mapStateToRateManagerNoResultsFoundComponentProps = (state) => ({
	shouldShow: (state.mode === RM_RX_CONST.NO_RESULTS_FOUND_MODE)
});

const RateManagerNoResultsFoundContainer = connect(
  mapStateToRateManagerNoResultsFoundComponentProps
)(RateManagerNoResultsFoundComponent);