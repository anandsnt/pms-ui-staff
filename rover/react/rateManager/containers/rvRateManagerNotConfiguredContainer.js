const {connect} = ReactRedux;

const mapStateToRateManagerNotConfiguredComponentProps = (state) => {
  return {
    shouldShow: (state.mode === 'NOT_CONFIGURED')
  }
};

const RateManagerNotConfiguredContainer = connect(
  mapStateToRateManagerNotConfiguredComponentProps
)(RateManagerNotConfiguredComponent);