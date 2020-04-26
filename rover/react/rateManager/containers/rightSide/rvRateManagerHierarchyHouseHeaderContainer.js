const {connect} = ReactRedux;

const mapStateForRateManagerHierarchyHouseHeaderContainerProps = (state) => {
    var rvRMUtils = new rvRateManagerRightSideContainerUtils();
    // for every mode (all rate view, room type, single rate view), this is same
    var propsToReturn =  {
        mode: state.mode,
        restrictionSummary: rvRMUtils.convertDataForRestrictionListing(state.summary[0].houseRestrictionSummary, state.restrictionTypes, true),
        dateList: rvRMUtils.convertDateListForRestrictionView(state.dates, state.businessDate),
        dates: state.dates
    };

    switch(state.mode) {
        case RM_RX_CONST.RATE_VIEW_MODE:
            propsToReturn.clickedOnRateCellOnRateView = state.callBacksFromAngular.clickedOnRateViewCell;
            break;

        case RM_RX_CONST.ROOM_TYPE_VIEW_MODE:
            propsToReturn.clickedOnRoomTypeViewCell = state.callBacksFromAngular.clickedOnRoomTypeViewCell;
            break;

        case RM_RX_CONST.SINGLE_RATE_EXPANDABLE_VIEW_MODE:
            propsToReturn.clickedOnRoomTypeAndAmountCell = state.callBacksFromAngular.clickedOnRoomTypeAndAmountCell;
            break;

        case RM_RX_CONST.RATE_TYPE_VIEW_MODE:
            propsToReturn.clickedOnRateTypeViewCell = state.callBacksFromAngular.clickedOnRateTypeViewCell;
            break;

        default:
            break;
    }

    return propsToReturn;
};

const mapDispatchForRateManagerHierarchyHouseHeaderContainerProps = (stateProps,dispatch) => {

    var onTdClick = () => {};

    switch(stateProps.mode) {
        case RM_RX_CONST.RATE_VIEW_MODE:
            onTdClick = (e, colIndex) => {
                var date = stateProps.dates[colIndex],
                    rateIDs = [];

                return stateProps.clickedOnRateCellOnRateView({
                    rateIDs,
                    date
                });
            };
            break;
        case RM_RX_CONST.ROOM_TYPE_VIEW_MODE:
            onTdClick = (e, colIndex) => {
                var date = stateProps.dates[colIndex],
                    roomTypeIDs = [];

                return stateProps.clickedOnRoomTypeViewCell({
                    roomTypeIDs,
                    date
                });
            };
            break;
        case RM_RX_CONST.SINGLE_RATE_EXPANDABLE_VIEW_MODE:
            onTdClick = (e, colIndex) => {
                var date = stateProps.dates[colIndex],
                    roomTypeIDs = [];

                return stateProps.clickedOnRoomTypeAndAmountCell({
                    roomTypeIDs,
                    date
                });
            };
            break;

        case RM_RX_CONST.RATE_TYPE_VIEW_MODE:
            onTdClick = (e, colIndex) => {
                var date = stateProps.dates[colIndex],
                    rateTypeIDs = [];

                return stateProps.clickedOnRateTypeViewCell({
                    rateTypeIDs,
                    date
                });
            };
            break;

        default:
            break;
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
