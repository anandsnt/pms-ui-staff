const {connect} = ReactRedux;

let processDataForHeader = (results, businessDate) => {
    if (!results) {
        return [];
    }
    
    var headerDateData = [],
        copiedDate = null,
        isWeekEnd = false,
        isPastDate = false,
        headerConditionalClass = '',
        cellConditionalClass = '';

    results.map(availabilityInfo => {
        copiedDate = tzIndependentDate(availabilityInfo.date);

        isWeekEnd = (copiedDate.getDay() === 6 || copiedDate.getDay() === 0);
        isPastDate = copiedDate < businessDate;

        headerConditionalClass = isWeekEnd ? 'weekend_day' : '';

        if (isPastDate) {
            cellConditionalClass = 'isHistory-cell-content';
        } else {
            cellConditionalClass = '';
        }

        headerDateData.push({
            'headerClass': headerConditionalClass,
            'count': availabilityInfo.available_rooms
        });

    });

    return headerDateData;
};

const mapStateToRateManagerGridRightSideAvailableRoomsHeaderContainerProps = (state) => {
    var propsToReturn =  {
        houseAvailability: processDataForHeader(state.houseAvailability, state.businessDate),
        hideAvailableRoomsHeader: state.mode === RM_RX_CONST.ROOM_TYPE_VIEW_MODE
    };

    return propsToReturn;
};

const RateManagerGridRightSideAvailableRoomsHeaderContainer = connect(mapStateToRateManagerGridRightSideAvailableRoomsHeaderContainerProps)(RateManagerGridRightSideAvailableRoomsHeaderComponent);
