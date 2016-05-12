const rvRateManagerRightSideContainerUtils = function() {
	var self = this;

	/**
	 * we need date related information in restriction list view(like is week end or past date..)
	 * @param  {array} dateList
	 * @param  {Object} businessDate
	 * @return {array}
	 */
	self.convertDateListForRestrictionView = function(dateList, businessDate) {
		//we will compute date related information first and will use this information in
		//the view component
		var newDateList = [],
			copiedDate = null,
			copiedDateComponents = null,
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
	self.convertDataForRestrictionListing = (listingData, restrictionTypes) => {

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
				if (dayRestrictionList.length >= RM_RX_CONST.MAX_RESTRICTION_IN_COLUMN) {
					return [{...restrictionForMoreThanMaxAllowed
					}];
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

	return {
		convertDateListForRestrictionView: self.convertDateListForRestrictionView,
		convertDataForRestrictionListing: self.convertDataForRestrictionListing
	}
}