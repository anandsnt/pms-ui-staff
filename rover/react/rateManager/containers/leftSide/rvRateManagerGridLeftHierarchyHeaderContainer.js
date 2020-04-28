const {connect} = ReactRedux;

let getActiveHierarchyRestrictions = (state) => {
    let list = [];
    
    if (state.isHierarchyHouseRestrictionEnabled) {
        list.push('HOUSE');
    }
    if (state.isHierarchyRoomTypeRestrictionEnabled) {
        list.push('ROOM TYPE');
    }
    if (state.isHierarchyRateTypeRestrictionEnabled) {
        list.push('RATE TYPE');
    }
    if (state.isHierarchyRateRestrictionEnabled) {
        list.push('RATE');
    }

	return list;
};

const mapStateToRateManagerLeftHierarchyHeaderComponentProps = (state) => {
  return {
    activeRestrictions: getActiveHierarchyRestrictions(state)
  };
};

const RateManagerGridLeftHierarchyHeaderContainer = connect(
  mapStateToRateManagerLeftHierarchyHeaderComponentProps
)(RateManagerLeftHierarchyHeaderComponent);