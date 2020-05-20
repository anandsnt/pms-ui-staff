const {connect} = ReactRedux;

const mapStateForRateManagerHierarchyRateHeaderContainerProps = (state) => {
    var rvRMUtils = new rvRateManagerRightSideContainerUtils();
    // for every mode (all rate view, room type, single rate view), this is same
    var propsToReturn =  {
        mode: state.mode,
        restrictionSummary: rvRMUtils.convertDataForRestrictionListing(state.summary[0].rateRestrictionSummary, state.restrictionTypes, true),
        dateList: rvRMUtils.convertDateListForRestrictionView(state.dates, state.businessDate),
        dates: state.dates,
        cellClicked: state.callBacksFromAngular.clickedOnHierarchyRateCell
    };

    return propsToReturn;
};

const mapDispatchForRateManagerHierarchyRateHeaderContainerProps = (stateProps, dispatch) => {

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

const RateManagerHierarchyRateHeaderContainer = connect(
    mapStateForRateManagerHierarchyRateHeaderContainerProps,
    null,
    mapDispatchForRateManagerHierarchyRateHeaderContainerProps
)(RateManagerGridRightSideHierarchyHeaderCellComponent);
