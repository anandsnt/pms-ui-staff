const {connect} = ReactRedux;

const mapStateToRateManagerGridLeftFirstRowComponentProps = (state) => {
  return {
    expandedClass: (!!state.flags&&state.flags.showRateDetail)?'expanded':'',
    isHierarchyRestrictionEnabled: state.isHierarchyRestrictionEnabled
  }
};

const RateManagerGridLeftSideContainer = connect(
  mapStateToRateManagerGridLeftFirstRowComponentProps
)(RateManagerGridLeftSideComponent);