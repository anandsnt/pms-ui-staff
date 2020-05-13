const {connect} = ReactRedux;

let getListValues = () => {
	let list = [
		{
			name: 'House Restrictions',
			value: 'HOUSE'
		}
	];

	return list;
};

const mapStateToRateManagerHierarchyRestrictionsComponentProps = (state) => {
  return {
    listValues: getListValues(),
    changedHeirarchyRestriction: state.callBacksFromAngular.changedHeirarchyRestriction
  };
};

const RateManagerHierarchyRestrictionsContainer = connect(
  mapStateToRateManagerHierarchyRestrictionsComponentProps
)(RateManagerHierarchyRestrictionsComponent);