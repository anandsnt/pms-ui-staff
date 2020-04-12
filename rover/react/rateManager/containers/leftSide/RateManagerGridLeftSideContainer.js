const {connect} = ReactRedux;

const mapStateToRateManagerGridLeftFirstRowComponentProps = (state) => {
  return {
    expandedClass: (!!state.flags&&state.flags.showRateDetail)?'expanded':'',
    isHierarchyHouseRestrictionEnabled: state.isHierarchyHouseRestrictionEnabled,
    isHierarchyRoomTypeRestrictionEnabled: state.isHierarchyRoomTypeRestrictionEnabled,
    isHierarchyRateTypeRestrictionEnabled: state.isHierarchyRateTypeRestrictionEnabled,
    isHierarchyRateRestrictionEnabled: state.isHierarchyRateRestrictionEnabled
  }
};

const RateManagerGridLeftSideContainer = connect(
  mapStateToRateManagerGridLeftFirstRowComponentProps
)(RateManagerGridLeftSideComponent);