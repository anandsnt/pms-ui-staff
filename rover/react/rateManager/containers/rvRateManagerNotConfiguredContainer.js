const {connect} = ReactRedux;

const mapStateToRateManagerNotConfiguredComponentProps = (state) => ({
	shouldShow: (state.mode === RM_RX_CONST.NOT_CONFIGURED_MODE)
});

const RateManagerNotConfiguredContainer = connect(
  mapStateToRateManagerNotConfiguredComponentProps
)(RateManagerNotConfiguredComponent);