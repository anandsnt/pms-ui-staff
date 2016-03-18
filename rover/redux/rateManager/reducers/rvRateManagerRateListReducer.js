let convertRatesData = (rates, zoomLevel, restrictionTypes) => {

	//adding the css class and all stuff for restriction types
	restrictionTypes = restrictionTypes.map((restrictionType) => ({
		...restrictionType,
		...RateManagerRestrictionTypes[restrictionType.value]
	}));

	var restrictionTypeIDS = _.pluck(restrictionTypes, 'id'),
		idBasedRestrictionTypes = _.object(restrictionTypeIDS, restrictionTypes);

	var restrictionForMoreThanMaxAllowed = RateManagerRestrictionTypes['MORE_RESTRICTIONS'];
	restrictionForMoreThanMaxAllowed.days = restrictionForMoreThanMaxAllowed.defaultText;
	
	rates = rates.map((rate) => {
		rate.greyedOut = rate.based_on_rate_id;
		rate.iconClassBeforeText = !rate.based_on_rate_id ? 'base-rate-indicator': '';
		rate.showIconBeforeText = !rate.based_on_rate_id;
		rate.textInIconArea = !rate.based_on_rate_id ? 'B' : '';
		rate.showArrowIcon = true;
		rate.arrowDirection = 'right';
		rate.restrictionList = rate.restrictionList.map((dayRestrictionList) => {
			//If we cross max restriction allowed in a single column, we will replace with single restriction
			if(dayRestrictionList.length >= RM_RX_CONST.MAX_RESTRICTION_IN_COLUMN) {
				return [{
					...restrictionForMoreThanMaxAllowed
				}];
			}

			return dayRestrictionList.map((restriction) => ({
				...restriction,
				...idBasedRestrictionTypes[restriction.restriction_type_id]	
			}));
		});
		return rate;
	});
	return rates;
};

const rateManagerRateListReducer = (state, action) => {
  switch (action.type) {
    case RM_RX_CONST.RATE_VIEW_CHANGED:
     	return convertRatesData(action.data, action.zoomLevel, action.restrictionTypes);
  	default:
  		return state;
  }
};