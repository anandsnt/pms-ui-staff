const {connect} = ReactRedux;

const mapStateToRateManagerHierarchyRestrictionsComponentProps = (state) => {
  return {
    isAddHierarchyRestrictions: state.isAddHierarchyRestrictions
  }
};

const RateManagerHierarchyRestrictionsContainer = connect(
  mapStateToRateManagerHierarchyRestrictionsComponentProps
)(RateManagerHierarchyRestrictionsComponent);