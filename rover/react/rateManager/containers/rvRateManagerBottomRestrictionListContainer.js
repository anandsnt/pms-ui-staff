const {connect} = ReactRedux;

const convertRestrictionsIntoProps = (restrictionTypes) => {
	var restrictionTypeConstObj = null,
		_restrictionTypes = [];
	
	_restrictionTypes = restrictionTypes.map((restrictionType) => {
		restrictionTypeConstObj = RateManagerRestrictionTypes[restrictionType.value];
		restrictionType.className = restrictionTypeConstObj.className;
		restrictionType.defaultText = restrictionTypeConstObj.defaultText;
		return restrictionType;
	});

	//'more restrictions' will not be in API, it is adding from the UI

	restrictionTypeConstObj = RateManagerRestrictionTypes['MORE_RESTRICTIONS'];

	_restrictionTypes.push({
		className : restrictionTypeConstObj.className,
		defaultText : restrictionTypeConstObj.defaultText,
		description : restrictionTypeConstObj.description
	});

	return _restrictionTypes;
};

const mapStateToRateManagerBottomRestrictionListProps = (state) => {
  return {
    divClassNames: 'pinned-bottom',
    ulClassNames: 'restriction-legends',
    restrictionTypes: convertRestrictionsIntoProps(state.restrictionTypes)
  };
};

const RateManagerBottomRestrictionListContainer = connect(
  mapStateToRateManagerBottomRestrictionListProps
)(RateManagerBottomRestrictionListComponent);
