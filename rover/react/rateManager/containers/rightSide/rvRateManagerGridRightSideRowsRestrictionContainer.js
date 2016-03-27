const {connect} = ReactRedux;

/**
 * we need date related information in restriction list view(like is week end or past date..)
 * @param  {array} dateList
 * @param  {Object} businessDate
 * @return {array}
 */
let convertDateListForRestrictionView = (dateList, businessDate) => {
    //we will compute date related information first and will use this information in
    //the view component
    var newDateList = [],
        copiedDate = null,
        copiedDateComponents =  null,
        isWeekEnd = false,
        isPastDate = false;

    dateList.map(date => {
        copiedDate = tzIndependentDate(date);
        copiedDateComponents = copiedDate.toComponents().date; //refer util.js in diary folder
        isWeekEnd = (copiedDate.getDay() === 6 || copiedDate.getDay() === 0);
        isPastDate = copiedDate < businessDate;
        newDateList.push({
            date: copiedDate,
            isWeekEnd,
            isPastDate
        });
    });

    return newDateList;
};

/**
 * convert data coming from reducer to props for restriction only displaying
 * @param  {array} listingData 
 * @param  {array} restrictionTypes
 * @return {array}
 */
let convertDataForRestrictionListing = (listingData, restrictionTypes) => {

    //adding the css class and all stuff for restriction types
    restrictionTypes = restrictionTypes.map((restrictionType) => ({
        ...restrictionType,
        ...RateManagerRestrictionTypes[restrictionType.value]
    }));

    var restrictionTypeIDS = _.pluck(restrictionTypes, 'id'),
        restrictionTypesBasedOnIDs = _.object(restrictionTypeIDS, restrictionTypes); //for quicker access

    var restrictionForMoreThanMaxAllowed = RateManagerRestrictionTypes['MORE_RESTRICTIONS'];
    restrictionForMoreThanMaxAllowed.days = restrictionForMoreThanMaxAllowed.defaultText;

    listingData = listingData.map((data) => {
        data.restrictionList = data.restrictionList.map((dayRestrictionList, index) => {
            //If we cross max restriction allowed in a single column, we will replace with single restriction
            if(dayRestrictionList.length >= RM_RX_CONST.MAX_RESTRICTION_IN_COLUMN) {
                return [{ ...restrictionForMoreThanMaxAllowed }];
            }
            return dayRestrictionList.map((restriction) => ({
                ...restriction,
                ...restrictionTypesBasedOnIDs[restriction.restriction_type_id] 
            }));
        });
        return data;
    });

    return listingData;
};

const mapStateToRateManagerGridRightSideRestrictionRowsContainerProps = (state) => {
    var restrictionRows = convertDataForRestrictionListing(state.list, state.restrictionTypes),
        propsToReturn = {};

    propsToReturn = {
        restrictionRows,
        mode: state.mode,
        dateList: convertDateListForRestrictionView(state.dates, state.businessDate),
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

                if(rowIndex === 0) {
                    rateIDs = _.pluck(stateProps.restrictionRows.slice(1), 'id');
                }
                else if(rowIndex > 0) {
                    rateIDs = [stateProps.restrictionRows[rowIndex].id];
                }

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

                if(rowIndex > 0) {
                    roomTypeIDs = [stateProps.restrictionRows[rowIndex].id];
                }                
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