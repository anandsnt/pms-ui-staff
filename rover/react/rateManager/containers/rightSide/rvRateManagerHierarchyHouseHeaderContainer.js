const {connect} = ReactRedux;

const mapStateForRateManagerHierarchyHouseHeaderContainerProps = (state) => {
    var rvRMUtils = new rvRateManagerRightSideContainerUtils();
    // for every mode (all rate view, room type, single rate view), this is same
    var propsToReturn =  {
        mode: state.mode,
        restrictionSummary: rvRMUtils.convertDataForRestrictionListing(state.summary[0].houseRestrictionSummary, state.restrictionTypes, true),
        dateList: rvRMUtils.convertDateListForRestrictionView(state.dates, state.businessDate),
        dates: state.dates,
        cellClicked: state.callBacksFromAngular.clickedOnHierarchyHouseCell
    };

    return propsToReturn;
};

const mapDispatchForRateManagerHierarchyHouseHeaderContainerProps = (stateProps, dispatch) => {

    var onTdClick = (e, colIndex) => {
        var date = stateProps.dates[colIndex],
            rateIDs = [];

        return stateProps.cellClicked({
            rateIDs,
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

const RateManagerHierarchyHouseHeaderContainer = connect(
    mapStateForRateManagerHierarchyHouseHeaderContainerProps,
    null,
    mapDispatchForRateManagerHierarchyHouseHeaderContainerProps
)(RateManagerGridRightSideHierarchyHeaderCellComponent);
