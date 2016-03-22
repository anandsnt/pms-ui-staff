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
    closeAllEnabled: !allRestrictionsContainClose
  }
};

const mapDispatchToRateManagerGridLeftSideHeadButtonContainerProps = (dispatch) => {
  return {
    onOpenAllClick: (e) => {
    	e.preventDefault();
    },
    onCloseAllClick: (e) => {
    	e.preventDefault();
    }        
  }
};

const RateManagerGridLeftSideHeadButtonContainer = connect(
  mapStateToRateManagerGridLeftSideHeadButtonContainerProps, 
  mapDispatchToRateManagerGridLeftSideHeadButtonContainerProps
)(RateManagerGridLeftSideHeadButtonComponent);