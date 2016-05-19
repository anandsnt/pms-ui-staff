const {connect} = ReactRedux;

/**
 * we need date related information in restriction list view(like is week end or past date..)
 * @param  {array} dateList
 * @param  {Object} businessDate
 * @return {array}
 */
let convertDateListForRestrictionAndAmountView = (dateList, businessDate) => {
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
 * @param  {array} expandedRows [array containing index of row to expand]
 * @return {array}
 */
let applyRestrictionLogicForSingleRateView = (listingData, restrictionTypes, expandedRows) => {

    //adding the css class and all stuff for restriction types
    restrictionTypes = restrictionTypes.map((restrictionType) => ({
        ...restrictionType,
        ...RateManagerRestrictionTypes[restrictionType.value]
    }));

    var restrictionTypeIDS = _.pluck(restrictionTypes, 'id'),
        restrictionTypesBasedOnIDs = _.object(restrictionTypeIDS, restrictionTypes); //for quicker access

    var restrictionForMoreThanMaxAllowed = RateManagerRestrictionTypes['MORE_RESTRICTIONS'];
    restrictionForMoreThanMaxAllowed.days = restrictionForMoreThanMaxAllowed.defaultText;
    var listingDataToReturn = [];
    listingData.map((data, index) => {
        listingDataToReturn.push({
            ...data,
            expanded: (expandedRows.indexOf(index) > -1),
            restrictionList: data.restrictionList.map((dayRestrictionList) => {
                //If we cross max restriction allowed in a single column, we will replace with single restriction
                if(dayRestrictionList.length >= RM_RX_CONST.MAX_RESTRICTION_IN_COLUMN) {
                    return [{ ...restrictionForMoreThanMaxAllowed }];
                }
                return dayRestrictionList.map((restriction) => ({
                    ...restriction,
                    ...restrictionTypesBasedOnIDs[restriction.restriction_type_id] 
                }));
            })
        });
    });

    return listingDataToReturn;
};

const mapStateToRateManagerGridRightSideRowsRestrictionListAndAmountContainerProps = (state) => {
    var shouldFormRowsData = state.mode === RM_RX_CONST.SINGLE_RATE_EXPANDABLE_VIEW_MODE,
    roomTypeRowsData = shouldFormRowsData ? 
        applyRestrictionLogicForSingleRateView(state.list, state.restrictionTypes, state.expandedRows) : [];
    return {
        roomTypeRowsData,
        mode: state.mode,
        dateList: convertDateListForRestrictionAndAmountView(state.dates, state.businessDate),
        dates: state.dates,
        clickedOnRoomTypeAndAmountCell: state.callBacksFromAngular.clickedOnRoomTypeAndAmountCell
    };
};

const mapDispatchToRateManagerGridRightSideRowsRestrictionListAndAmountContainerContainer = (stateProps, dispatchProps, ownProps) => {
    var onTdClick = () => {};
    switch(stateProps.mode) {
        case RM_RX_CONST.SINGLE_RATE_EXPANDABLE_VIEW_MODE:
            onTdClick = (e, rowIndex, colIndex) => {
                var date = stateProps.dates[colIndex],
                    roomTypeIDs = [stateProps.roomTypeRowsData[rowIndex].id];
                    
                return stateProps.clickedOnRoomTypeAndAmountCell({
                    roomTypeIDs,
                    date
                });
            };
            break;
    }

    return {
        onTdClick,
        ...stateProps
    };    
};
const RateManagerGridRightSideRowsRestrictionListAndAmountContainer = 
	connect(mapStateToRateManagerGridRightSideRowsRestrictionListAndAmountContainerProps,
        null,
        mapDispatchToRateManagerGridRightSideRowsRestrictionListAndAmountContainerContainer)
	(RateManagerGridRightSideRowsRestrictionListAndAmountComponent);