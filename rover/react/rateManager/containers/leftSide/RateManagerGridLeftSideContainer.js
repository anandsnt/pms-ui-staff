const {connect} = ReactRedux;

const mapStateToRateManagerGridLeftFirstRowComponentProps = (state) => {
  return {
    expandedClass: (!!state.flags&&state.flags.showRateDetail)?'expanded':'',
    isHierarchyHouseRestrictionEnabled: state.isHierarchyHouseRestrictionEnabled,
    isHierarchyRoomTypeRestrictionEnabled: state.isHierarchyRoomTypeRestrictionEnabled,
    isHierarchyRateTypeRestrictionEnabled: state.isHierarchyRateTypeRestrictionEnabled,
    showGridLeftFirstRowComponent: state.mode === RM_RX_CONST.SINGLE_RATE_EXPANDABLE_VIEW_MODE || !state.isHierarchyHouseRestrictionEnabled
  }
};

const RateManagerGridLeftSideContainer = connect(
  mapStateToRateManagerGridLeftFirstRowComponentProps
)(RateManagerGridLeftSideComponent);