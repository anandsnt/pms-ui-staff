const {connect} = ReactRedux;

const mapStateToRateManagerGridLeftFirstRowComponentProps = (state) => {
  let hideTopHeader = (
    state.isHierarchyHouseRestrictionEnabled ||
    (
      state.isHierarchyRoomTypeRestrictionEnabled &&
      state.mode === RM_RX_CONST.ROOM_TYPE_VIEW_MODE
    ) ||
    (
      state.isHierarchyRateTypeRestrictionEnabled &&
      state.mode === RM_RX_CONST.RATE_TYPE_VIEW_MODE
    )
  );

  return {
    expandedClass: (!!state.flags&&state.flags.showRateDetail)?'expanded':'',
    isHierarchyHouseRestrictionEnabled: state.isHierarchyHouseRestrictionEnabled,
    hideTopHeader: hideTopHeader
  }
};

const RateManagerGridLeftSideContainer = connect(
  mapStateToRateManagerGridLeftFirstRowComponentProps
)(RateManagerGridLeftSideComponent);