const {connect} = ReactRedux;

const mapStateForRateManagerGridRightSideHeaderAllRoomTypesContainerProps = (state) => {
    var rvRMUtils = new rvRateManagerRightSideContainerUtils();
    // for every mode (all rate view, room type, single rate view), this is same
    var propsToReturn =  {
        mode: state.mode,
        restrictionSummary: rvRMUtils.convertDataForRestrictionListing(state.summary[0].rateRestrictionSummary, state.restrictionTypes),
        dateList: rvRMUtils.convertDateListForRestrictionView(state.dates, state.businessDate),
        dates: state.dates,
        cellClicked: state.callBacksFromAngular.clickedOnRoomTypeAndAmountCell
    };

    return propsToReturn;
};

const mapDispatchForRateManagerGridRightSideHeaderAllRoomTypesContainerProps = (stateProps, dispatch) => {

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

const RateManagerGridRightSideHeaderAllRoomTypesContainer = connect(
    mapStateForRateManagerGridRightSideHeaderAllRoomTypesContainerProps,
    null,
    mapDispatchForRateManagerGridRightSideHeaderAllRoomTypesContainerProps
)(RateManagerGridRightSideHierarchyHeaderCellComponent);
