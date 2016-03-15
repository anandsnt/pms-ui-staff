const {connect} = ReactRedux;

const mapStateToRateManagerCalendarViewRootProps = (state) => {
  return {
    shouldShow: (state.mode !== 'NOT_CONFIGURED')
  }
};

const RateManagerCalendarViewRootContainer = connect(
  mapStateToRateManagerCalendarViewRootProps
)(RateManagerCalendarViewRoot);