const {connect} = ReactRedux;

const mapStateToRateManagerGridRightSideRestrictionRowsContainerProps = (state) => {
    // app/assets/rover/react/rateManager/utils/rvRateManagerGridRightSideContainerUtils.js
    var utilMethods = new rvRateManagerRightSideContainerUtils(),
        restrictionRows = utilMethods.convertDataForRestrictionListing(state.list, state.restrictionTypes),
        propsToReturn = {};

    propsToReturn = {
        restrictionRows,
        mode: state.mode,
        dateList: utilMethods.convertDateListForRestrictionView(state.dates, state.businessDate),
        dates: state.dates
    };
    switch(state.mode) {
        case RM_RX_CONST.RATE_VIEW_MODE:
            propsToReturn.clickedOnRateCellOnRateView = state.callBacksFromAngular.clickedOnRateViewCell;
            break;
        
        case RM_RX_CONST.ROOM_TYPE_VIEW_MODE:
            propsToReturn.clickedOnRoomTypeViewCell = state.callBacksFromAngular.clickedOnRoomTypeViewCell;
            break;

        default:
            break;
    }
    return propsToReturn;
};

const mapDispatchToRateManagerGridRightSideRowsRestrictionContainer = (stateProps, dispatchProps, ownProps) => {
    var onTdClick = () => {};
    switch(stateProps.mode) {
        case RM_RX_CONST.RATE_VIEW_MODE:
            onTdClick = (e, rowIndex, colIndex) => {
                var date = stateProps.dates[colIndex],
                    rateIDs = [];
                    
                rateIDs = [stateProps.restrictionRows[rowIndex].id];
                
                return stateProps.clickedOnRateCellOnRateView({
                    rateIDs,
                    date
                });
            };
            break;

        case RM_RX_CONST.ROOM_TYPE_VIEW_MODE:
            onTdClick = (e, rowIndex, colIndex) => {
                var date = stateProps.dates[colIndex],
                    roomTypeIDs = [];

                roomTypeIDs = [stateProps.restrictionRows[rowIndex].id];              
                return stateProps.clickedOnRoomTypeViewCell({
                    roomTypeIDs,
                    date
                });
            };
            break;                        
        default:
            break;
    };

    return {
        onTdClick,
        ...stateProps
    };
}

const RateManagerGridRightSideRowsRestrictionContainer = 
	connect(mapStateToRateManagerGridRightSideRestrictionRowsContainerProps,
        null,
        mapDispatchToRateManagerGridRightSideRowsRestrictionContainer)
	(RateManagerGridRightSideRowsRestrictionComponent);