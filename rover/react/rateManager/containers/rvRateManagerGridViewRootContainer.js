const {connect} = ReactRedux;

const mapStateToRateManagerGridViewRootComponentProps = (state) => {
  return {
    shouldShow: (state.mode !== 'NOT_CONFIGURED'),
    zoomLevel: state.zoomLevel
  }
};

const RateManagerGridViewRootContainer = connect(
  mapStateToRateManagerGridViewRootComponentProps
)(RateManagerGridViewRootComponent);