const {connect} = ReactRedux;

let convertRatesDataForRightSideListing = (rates, restrictionTypes) => {

    //adding the css class and all stuff for restriction types
    restrictionTypes = restrictionTypes.map((restrictionType) => ({
        ...restrictionType,
        ...RateManagerRestrictionTypes[restrictionType.value]
    }));

    var restrictionTypeIDS = _.pluck(restrictionTypes, 'id'),
        restrictionTypesBasedOnIDs = _.object(restrictionTypeIDS, restrictionTypes); //for quicker access

    var restrictionForMoreThanMaxAllowed = RateManagerRestrictionTypes['MORE_RESTRICTIONS'];
    restrictionForMoreThanMaxAllowed.days = restrictionForMoreThanMaxAllowed.defaultText;

    rates = rates.map((rate) => {
        rate.restrictionList = rate.restrictionList.map((dayRestrictionList) => {
            //If we cross max restriction allowed in a single column, we will replace with single restriction
            if(dayRestrictionList.length >= RM_RX_CONST.MAX_RESTRICTION_IN_COLUMN) {
                return [{ ...restrictionForMoreThanMaxAllowed }];
            }
            return dayRestrictionList.map((restriction) => ({
                ...restriction,
                ...restrictionTypesBasedOnIDs[restriction.restriction_type_id] 
            }));
        });
        return rate;
    });

    return rates;
};

const mapStateToRateManagerGridRightSideRestrictionRowsContainerProps = (state) => {
  return {
    restrictionRows: convertRatesDataForRightSideListing(state.list, state.restrictionTypes),
    mode: state.mode
  };
};

const mapDispatchToRateManagerGridRightSideRestrictionRowsContainerProps = (dispatch) => {
  return {
  	refreshScrollers: () => {
        dispatch({
            type: 'REFRESH_SCROLLER_ME'
        });
    }     
  }
};

const RateManagerGridRightSideRestrictionRowsContainer = 
	connect(mapStateToRateManagerGridRightSideRestrictionRowsContainerProps, mapDispatchToRateManagerGridRightSideRestrictionRowsContainerProps)
	(RateManagerGridRightSideRestrictionRowsComponent);