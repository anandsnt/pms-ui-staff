const {connect} = ReactRedux;

const mapStateToRateManagerGridLeftFirstRowComponentProps = (state) => {
  return {
    isHierarchyHouseRestrictionEnabled: state.isHierarchyHouseRestrictionEnabled,
    isHierarchyRoomTypeRestrictionEnabled: state.isHierarchyRoomTypeRestrictionEnabled,
    isHierarchyRateTypeRestrictionEnabled: state.isHierarchyRateTypeRestrictionEnabled
  }
};

const RateManagerGridLeftSideContainer = connect(
  mapStateToRateManagerGridLeftFirstRowComponentProps
)(RateManagerGridLeftSideComponent);