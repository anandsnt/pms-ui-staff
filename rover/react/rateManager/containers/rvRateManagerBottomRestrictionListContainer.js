const {connect} = ReactRedux;

const convertRestrictionsIntoProps = (restrictionTypes) => {
	var restrictionTypeConstObj = null,
		_restrictionTypes = [];
	
	_restrictionTypes = restrictionTypes.map((restrictionType) => {
		restrictionTypeConstObj = RateManagerRestrictionTypes[restrictionType.value];
		return {
			...restrictionType,
			...restrictionTypeConstObj
		};
	});

	//'more restrictions' will not be in API, it is adding from the UI

	restrictionTypeConstObj = RateManagerRestrictionTypes['MORE_RESTRICTIONS'];

	_restrictionTypes.push({
		...restrictionTypeConstObj
	});

	return _restrictionTypes;
};

const mapStateToRateManagerBottomRestrictionListProps = (state) => ({
	ulClassNames: 'restriction-legends',
	restrictionTypes: convertRestrictionsIntoProps(state.restrictionTypes)
});

const RateManagerBottomRestrictionListContainer = connect(
  mapStateToRateManagerBottomRestrictionListProps
)(RateManagerBottomRestrictionListComponent);
