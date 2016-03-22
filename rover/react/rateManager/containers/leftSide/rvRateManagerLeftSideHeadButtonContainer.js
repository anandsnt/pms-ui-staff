const {connect} = ReactRedux;

/**
 * to get whether all restrcitions are closed
 * @param  {array} restrictions [array of array of restrictions]
 * @return {Boolean}
 */
const whetherAllRestrictionContainClosed = (restrictions, restrictionTypes) => {
  var closedRestriction = _.findWhere(restrictionTypes, { value : "CLOSED" }),
    closedRestrictionsCount = 0;
  
  restrictions.map(eachDayRestrictionList => {
    closedRestrictionsCount = _.findWhere(eachDayRestrictionList, {restriction_type_id: closedRestriction.id}) ?
      ++closedRestrictionsCount : closedRestrictionsCount;
  });
  return (closedRestrictionsCount === restrictions.length);
};

const mapStateToRateManagerGridLeftSideHeadButtonContainerProps = (state) => {
  var allRestrictionsContainClose = whetherAllRestrictionContainClosed(
      state.list[0].restrictionList, state.restrictionTypes);
  return {
    openAllClass: allRestrictionsContainClose ? 'green': '',
    closeAllClass: !allRestrictionsContainClose ? 'red': '',
    openAllEnabled: allRestrictionsContainClose,
    closeAllEnabled: !allRestrictionsContainClose,
    mode: state.mode,
    closeAllCallback: state.callBacksFromAngular.closeAllCallback
  }
};

const mapDispatchToRateManagerGridLeftSideHeadButtonContainerProps = (stateProps, dispatchProps, ownProps) => {
  return {
    onOpenAllClick: (e) => {
    	e.preventDefault();

    },
    onCloseAllClick: (e) => {
    	e.preventDefault();
    },
    ...stateProps      
  }
};

const RateManagerGridLeftSideHeadButtonContainer = connect(
  mapStateToRateManagerGridLeftSideHeadButtonContainerProps,
  null,
  mapDispatchToRateManagerGridLeftSideHeadButtonContainerProps
)(RateManagerGridLeftSideHeadButtonComponent);