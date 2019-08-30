const {connect} = ReactRedux;

const mapStateToRateManagerGridLeftFirstRowComponentProps = (state) => {
  return {
    expandedClass: (!!state.flags&&state.flags.showRateDetail)?'expanded':'',
    isAddHierarchyRestrictions: state.isAddHierarchyRestrictions
  }
};

const RateManagerGridLeftSideContainer = connect(
  mapStateToRateManagerGridLeftFirstRowComponentProps
)(RateManagerGridLeftSideComponent);