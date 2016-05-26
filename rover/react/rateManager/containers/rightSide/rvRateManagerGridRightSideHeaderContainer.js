const {connect} = ReactRedux;

let convertDateDataForHeader = (dates, businessDate) => {
    var headerDateData = [],
        copiedDate = null,
        copiedDateComponents = null,
        day = null,
        isWeekEnd = false,
        isPastDate = false,
        headerConditionalClass = '',
        cellConditionalClass = '';

    dates.map(date => {
        copiedDate = tzIndependentDate(date);
        copiedDateComponents = copiedDate.toComponents().date; //refer util.js in diary folder

        day = copiedDateComponents.day.toString();
        isWeekEnd = (copiedDate.getDay() === 6 || copiedDate.getDay() === 0);
        isPastDate = copiedDate < businessDate;

        headerConditionalClass = isWeekEnd ? 'weekend_day' : '';
        cellConditionalClass = isWeekEnd ? 'weekend_day' : '';

        if (isPastDate) {
            headerConditionalClass = '';
            cellConditionalClass = 'isHistory-cell-content';
        }

        headerDateData.push({
            'headerClass': headerConditionalClass,
            'cellClass': 'date-header ' + cellConditionalClass,
            'topLabel': copiedDateComponents.weekday,
            'topLabelContainerClass': 'week-day',
            'bottomLabel': copiedDateComponents.monthName + ' ' + ((day.length === 1) ? ('0' + day) : day),
            'bottomLabelContainerClass': ''
        });

    });

  return headerDateData;
};

const mapStateToRateManagerGridRightSideHeaderContainerProps = (state) => {
    // app/assets/rover/react/rateManager/utils/rvRateManagerGridRightSideContainerUtils.js
    var utilMethods = new rvRateManagerRightSideContainerUtils();
    //for every mode (all rate view, room type, single rate view), this is same
    var propsToReturn =  {
        mode: state.mode,   
        headerDataList: convertDateDataForHeader(state.dates, state.businessDate),
        summary: utilMethods.convertDataForRestrictionListing(state.summary, state.restrictionTypes),
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

        case RM_RX_CONST.SINGLE_RATE_EXPANDABLE_VIEW_MODE:
            propsToReturn.clickedOnRoomTypeAndAmountCell = state.callBacksFromAngular.clickedOnRoomTypeAndAmountCell;
            break;
        default:
            break;
    }

    return propsToReturn;
};

const mapDispatchToRateManagerGridRightSideHeaderContainerProps = (stateProps,dispatch) => {

    var onTdClick = () => {};
    switch(stateProps.mode) {
        case RM_RX_CONST.RATE_VIEW_MODE:
            onTdClick = (e, rowIndex, colIndex) => {
                var date = stateProps.dates[colIndex],
                    rateIDs = [];
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
                return stateProps.clickedOnRoomTypeViewCell({
                    roomTypeIDs,
                    date
                });
            };
            break; 
        case RM_RX_CONST.SINGLE_RATE_EXPANDABLE_VIEW_MODE:
            onTdClick = (e, rowIndex, colIndex) => {
                var date = stateProps.dates[colIndex],
                    roomTypeIDs = [];

                return stateProps.clickedOnRoomTypeAndAmountCell({
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
        ...stateProps,
        refreshScrollers: () => {
            dispatch({
                type: RM_RX_CONST.REFRESH_SCROLLERS
            });
        }
    };
};

const RateManagerGridRightSideHeaderContainer =
        connect(mapStateToRateManagerGridRightSideHeaderContainerProps,
        null, 
        mapDispatchToRateManagerGridRightSideHeaderContainerProps)
    (RateManagerGridRightSideHeaderComponent);
