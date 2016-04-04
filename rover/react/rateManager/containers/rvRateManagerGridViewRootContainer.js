const {connect} = ReactRedux;

const mapStateToRateManagerGridViewRootComponentProps = (state) => ({
    shouldShow: (state.mode !== RM_RX_CONST.NOT_CONFIGURED_MODE),
    mode: state.mode,
    zoomLevel: state.zoomLevel,
    refreshScrollers: (state.action === RM_RX_CONST.REFRESH_SCROLLERS)
});

const mapDispatchToRateManagerGridViewRootComponentProps = (stateProps, dispatchProps, ownProps) => {
    var onTdClick = () => {};
    switch(stateProps.mode) {
        case RM_RX_CONST.SINGLE_RATE_EXPANDABLE_VIEW_MODE:
            onTdClick = (e, rowIndex, colIndex) => {
                var date = stateProps.dates[colIndex],
                    roomTypeIDs = [];

                if(rowIndex > 0) {
                    roomTypeIDs = [stateProps.roomTypeRowsData[rowIndex].id];
                }
                return stateProps.clickedOnRoomTypeAndAmountCell({
                    roomTypeIDs,
                    date
                });
            };
            break;
    }

    return {
        onTdClick,
        ...stateProps
    };    
};

const RateManagerGridViewRootContainer = connect(
  mapStateToRateManagerGridViewRootComponentProps
)(RateManagerGridViewRootComponent);