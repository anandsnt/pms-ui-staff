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
    if (state.mode === RM_RX_CONST.SINGLE_RATE_EXPANDABLE_VIEW_MODE) {
      list.push('All room types');
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