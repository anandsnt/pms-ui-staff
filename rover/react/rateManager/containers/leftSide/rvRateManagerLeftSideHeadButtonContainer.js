const {connect} = ReactRedux;

/**
 * to get whether all restrcitions are closed
 * @param  {array} restrictions [array of array of restrictions]
 * @return {Boolean}
 */
const getCloseRestrictionCountForTopHeader = (restrictions, restrictionTypes) => {
  var closedRestriction = _.findWhere(restrictionTypes, { value : RM_RX_CONST.CLOSED_RESTRICTION_VALUE }),
    closedRestrictionsCount = 0;
  
  restrictions.map(eachDayRestrictionList => {
    closedRestrictionsCount = _.findWhere(eachDayRestrictionList, {restriction_type_id: closedRestriction.id}) ?
      ++closedRestrictionsCount : closedRestrictionsCount;
  });
  return (closedRestrictionsCount);
};

const mapStateToRateManagerGridLeftSideHeadButtonContainerProps = (state) => {
    var closedRestrictionsCount = getCloseRestrictionCountForTopHeader( state.list[0].restrictionList,
        state.restrictionTypes),
        openAllEnabled = closedRestrictionsCount > 0,
        closeAllEnabled = closedRestrictionsCount < state.list[0].restrictionList.length;

    var propsToReturn = {
        openAllClass: openAllEnabled ? 'green': '',
        closeAllClass: closeAllEnabled ? 'red': '',
        openAllEnabled,
        closeAllEnabled,
        mode: state.mode,
        fromDate: state.dates[0],
        toDate: state.dates[state.dates.length - 1],
        closedRestriction: _.findWhere(state.restrictionTypes, { value: RM_RX_CONST.CLOSED_RESTRICTION_VALUE })
    };

    if(state.mode === RM_RX_CONST.SINGLE_RATE_EXPANDABLE_VIEW_MODE) {
        propsToReturn.openAllCallbackForSingleRateView = state.callBacksFromAngular.openAllCallbackForSingleRateView;
        propsToReturn.closeAllCallbackForSingleRateView = state.callBacksFromAngular.openAllCallbackForSingleRateView;
    }
    else if(state.mode === RM_RX_CONST.RATE_VIEW_MODE) {
        propsToReturn.openAllCallbackForRateView = state.callBacksFromAngular.openAllRestrictionsForRateView;
        propsToReturn.closeAllCallbackForRateView = state.callBacksFromAngular.closeAllRestrictionsForRateView;
        propsToReturn.rate_ids = _.pluck(state.list.slice(1), 'id'); //first row will be having any id, just for all restrictions
    }
    else if(state.mode ===  RM_RX_CONST.ROOM_TYPE_VIEW_MODE) {
        propsToReturn.openAllCallbackForRoomTypeView = state.callBacksFromAngular.openAllRestrictionsForRoomTypeView;
        propsToReturn.closeAllCallbackForRoomTypeView = state.callBacksFromAngular.closeAllRestrictionsForRoomTypeView;
    }

    return propsToReturn;
};

const mapDispatchToRateManagerGridLeftSideHeadButtonContainerProps = (stateProps, dispatchProps, ownProps) => {
  return {
    onOpenAllClick: (e) => {
    	e.preventDefault();
        let paramsForOpeningRestriction = {
            details: [{
                from_date: stateProps.fromDate,
                to_date: stateProps.toDate,
                restrictions: [{
                    action: 'remove',
                    restriction_type_id: stateProps.closedRestriction.id
                }]
            }]
        };
        if(stateProps.mode ===  RM_RX_CONST.SINGLE_RATE_EXPANDABLE_VIEW_MODE) {
            //rate_id: will be adding from the controller (openAllRestrictionsForSingleRateView)
            stateProps.openAllCallbackForSingleRateView(paramsForOpeningRestriction);
        }
        else if(stateProps.mode ===  RM_RX_CONST.ROOM_TYPE_VIEW_MODE) {
            stateProps.openAllCallbackForRoomTypeView(paramsForOpeningRestriction);
        }        
        else if(stateProps.mode ===  RM_RX_CONST.RATE_VIEW_MODE) {
            paramsForOpeningRestriction.rate_ids =  stateProps.rate_ids;
            stateProps.openAllCallbackForRateView(paramsForOpeningRestriction);
        }
    },
    onCloseAllClick: (e) => {
    	e.preventDefault();
        let paramsForClosingRestriction = {
            details: [{
                from_date: stateProps.fromDate,
                to_date: stateProps.toDate,
                restrictions: [{
                    action: 'add',
                    restriction_type_id: stateProps.closedRestriction.id
                }]
            }]
        };        
        if(stateProps.mode ===  RM_RX_CONST.SINGLE_RATE_EXPANDABLE_VIEW_MODE) {
            stateProps.closeAllCallbackForSingleRateView(paramsForClosingRestriction);
        }
        else if(stateProps.mode ===  RM_RX_CONST.ROOM_TYPE_VIEW_MODE) {
            stateProps.closeAllCallbackForRoomTypeView(paramsForClosingRestriction);
        }         
        else if(stateProps.mode ===  RM_RX_CONST.RATE_VIEW_MODE) {
            paramsForClosingRestriction.rate_ids = stateProps.rate_ids;
            stateProps.closeAllCallbackForRateView(paramsForClosingRestriction);
        }       
    },
    ...stateProps      
  }
};

const RateManagerGridLeftSideHeadButtonContainer = connect(
  mapStateToRateManagerGridLeftSideHeadButtonContainerProps,
  null,
  mapDispatchToRateManagerGridLeftSideHeadButtonContainerProps
)(RateManagerGridLeftSideHeadButtonComponent);