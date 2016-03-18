const {connect} = ReactRedux;

const mapStateToRateManagerGridViewRootComponentProps = (state) => {
  return {
    shouldShow: (state.mode !== RM_RX_CONST.NOT_CONFIGURED_MODE),
    zoomLevel: state.zoomLevel,
    refreshScroller: (state.action === RM_RX_CONST.REFRESH_SCROLLERS)
  }
};

const RateManagerGridViewRootContainer = connect(
  mapStateToRateManagerGridViewRootComponentProps
)(RateManagerGridViewRootComponent);