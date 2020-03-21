const {connect} = ReactRedux;

const mapStateToRateManagerGridLeftFirstRowComponentProps = (state) => {
  return {
    expandedClass: (!!state.flags&&state.flags.showRateDetail)?'expanded':'',
    isHierarchyHouseRestrictionEnabled: state.isHierarchyHouseRestrictionEnabled
  }
};

const RateManagerGridLeftSideContainer = connect(
  mapStateToRateManagerGridLeftFirstRowComponentProps
)(RateManagerGridLeftSideComponent);