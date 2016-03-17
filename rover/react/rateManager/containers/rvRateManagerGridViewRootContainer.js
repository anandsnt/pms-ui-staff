const {connect} = ReactRedux;

const mapStateToRateManagerGridViewRootComponentProps = (state) => {
  return {
    shouldShow: (state.mode !== 'NOT_CONFIGURED'),
    zoomLevel: state.zoomLevel,
    refreshScroller: state.action === 'REFRESH_SCROLLERS'
  }
};

const RateManagerGridViewRootContainer = connect(
  mapStateToRateManagerGridViewRootComponentProps
)(RateManagerGridViewRootComponent);