const {connect} = ReactRedux;

const mapStateForRateManagerHierarchyRoomTypeHeaderContainerProps = (state) => {
    var rvRMUtils = new rvRateManagerRightSideContainerUtils();
    // for every mode (all rate view, room type, single rate view), this is same
    var propsToReturn =  {
        mode: state.mode,
        restrictionSummary: rvRMUtils.convertDataForRestrictionListing(state.summary[0].roomTypeRestrictionSummary, state.restrictionTypes, true),
        dateList: rvRMUtils.convertDateListForRestrictionView(state.dates, state.businessDate),
        dates: state.dates,
        cellClicked: state.callBacksFromAngular.clickedOnHierarchyRoomTypeCell
    };

    return propsToReturn;
};

const mapDispatchForRateManagerHierarchyRoomTypeHeaderContainerProps = (stateProps,dispatch) => {

    var onTdClick = (e, colIndex) => {
        var date = stateProps.dates[colIndex],
            roomTypeIDs = [];

        return stateProps.cellClicked({
            roomTypeIDs,
            date
        });
    };

    return {
        onTdClick,
        ...stateProps,
        refreshScrollers: () => {
            dispatch({
                type: RM_RX_CONST.REFRESH_SCROLLERS
            });
        }
    };
};

const RateManagerHierarchyRoomTypeHeaderContainer = connect(
    mapStateForRateManagerHierarchyRoomTypeHeaderContainerProps,
    null,
    mapDispatchForRateManagerHierarchyRoomTypeHeaderContainerProps
)(RateManagerGridRightSideHierarchyHeaderCellComponent);
