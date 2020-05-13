const {connect} = ReactRedux;

const mapStateForRateManagerHierarchyRateTypeHeaderContainerProps = (state) => {
    var rvRMUtils = new rvRateManagerRightSideContainerUtils();
    // for every mode (all rate view, room type, single rate view), this is same
    var propsToReturn =  {
        mode: state.mode,
        restrictionSummary: rvRMUtils.convertDataForRestrictionListing(state.summary[0].rateTypeRestrictionSummary, state.restrictionTypes),
        dateList: rvRMUtils.convertDateListForRestrictionView(state.dates, state.businessDate),
        dates: state.dates,
        cellClicked: state.callBacksFromAngular.clickedOnHierarchyRateTypeCell
    };

    return propsToReturn;
};

const mapDispatchForRateManagerHierarchyRateTypeHeaderContainerProps = (stateProps, dispatch) => {

    var onTdClick = (e, colIndex) => {
        var date = stateProps.dates[colIndex],
            rateTypeIDs = [];

        return stateProps.cellClicked({
            rateTypeIDs,
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

const RateManagerHierarchyRateTypeHeaderContainer = connect(
    mapStateForRateManagerHierarchyRateTypeHeaderContainerProps,
    null,
    mapDispatchForRateManagerHierarchyRateTypeHeaderContainerProps
)(RateManagerGridRightSideHierarchyHeaderCellComponent);
