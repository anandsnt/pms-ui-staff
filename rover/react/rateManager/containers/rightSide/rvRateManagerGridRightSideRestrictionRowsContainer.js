const {connect} = ReactRedux;

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
        data.restrictionList = data.restrictionList.map((dayRestrictionList) => {
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
    var restrictionRows = [];
    if(state.mode === RM_RX_CONST.RATE_VIEW_MODE 
        || state.mode === RM_RX_CONST.ROOM_TYPE_VIEW_MODE) {
        restrictionRows = convertDataForRestrictionListing(state.list, state.restrictionTypes);
    }
    if(restrictionRows.length > 0) {
        return {
            restrictionRows,
            mode: state.mode,
            action: state.action
        };
    }
};

const mapDispatchToRateManagerGridRightSideRestrictionRowsContainerProps = (dispatch) => {
  return {
  	refreshScrollers: () => {
        dispatch({
            type: RM_RX_CONST.REFRESH_SCROLLERS
        });
    }     
  }
};

const RateManagerGridRightSideRestrictionRowsContainer = 
	connect(mapStateToRateManagerGridRightSideRestrictionRowsContainerProps, 
        mapDispatchToRateManagerGridRightSideRestrictionRowsContainerProps)
	(RateManagerGridRightSideRestrictionRowsComponent);