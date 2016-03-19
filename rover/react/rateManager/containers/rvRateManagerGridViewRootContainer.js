const {connect} = ReactRedux;

const mapStateToRateManagerGridViewRootComponentProps = (state) => ({
    shouldShow: (state.mode !== RM_RX_CONST.NOT_CONFIGURED_MODE),
    zoomLevel: state.zoomLevel,
    refreshScroller: (state.list && state.list.length > 0)
});

const mapDispatchToRateManagerGridViewRootComponentProps = (dispatch) => ({
  	scrollerRefreshed: () => {
        dispatch({
            type: RM_RX_CONST.SCROLLER_REFRESHED
        });
    }
});


const RateManagerGridViewRootContainer = connect(
  mapStateToRateManagerGridViewRootComponentProps, mapDispatchToRateManagerGridViewRootComponentProps
)(RateManagerGridViewRootComponent);