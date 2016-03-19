const {connect} = ReactRedux;

const mapStateToRateManagerGridViewRootComponentProps = (state) => ({
    shouldShow: (state.mode !== RM_RX_CONST.NOT_CONFIGURED_MODE),
    zoomLevel: state.zoomLevel,
    refreshScrollers: (state.action === RM_RX_CONST.REFRESH_SCROLLERS)
});


const RateManagerGridViewRootContainer = connect(
  mapStateToRateManagerGridViewRootComponentProps
)(RateManagerGridViewRootComponent);