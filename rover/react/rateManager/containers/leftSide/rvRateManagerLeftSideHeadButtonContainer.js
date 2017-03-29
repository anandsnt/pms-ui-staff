const {connect} = ReactRedux;

const mapStateToRateManagerGridLeftSideHeadButtonContainerProps = (state) => {
    const closedRestriction = _.findWhere(state.restrictionTypes, { value: RM_RX_CONST.CLOSED_RESTRICTION_VALUE });

    var closedRestrictionsCount = 0,
        openAllEnabled = true,
        closeAllEnabled = true,
        showOpenAll = false,
        showCloseAll = false;
        let flags ={};

    if(closedRestriction) {
        showOpenAll = true;
        showCloseAll = true;
    }
    if(!!state.flags){
        flags = state.flags; 
    }else{
        flags.showRateDetail = false;
    }
    var propsToReturn = {
        openAllClass: openAllEnabled ? 'green': '',
        showOpenAll,
        closeAllClass: closeAllEnabled ? 'red': '',
        showCloseAll,
        openAllEnabled,
        closeAllEnabled,
        mode: state.mode,
        fromDate: state.dates[0],
        toDate: state.dates[state.dates.length - 1],
        closedRestriction,
        flags: flags

    };

    if(state.mode === RM_RX_CONST.SINGLE_RATE_EXPANDABLE_VIEW_MODE) {
        propsToReturn.shouldShowToggle = false;
        propsToReturn.openAllCallbackForSingleRateView = state.callBacksFromAngular.openAllCallbackForSingleRateView;
        propsToReturn.closeAllCallbackForSingleRateView = state.callBacksFromAngular.openAllCallbackForSingleRateView;
    }
    else if(state.mode === RM_RX_CONST.RATE_VIEW_MODE) {
        propsToReturn.shouldShowToggle = true;
        propsToReturn.openAllCallbackForRateView = state.callBacksFromAngular.openAllRestrictionsForRateView;
        propsToReturn.closeAllCallbackForRateView = state.callBacksFromAngular.closeAllRestrictionsForRateView;
        propsToReturn.rate_ids = _.pluck(state.list.slice(0), 'id'); //first row will be having any id, just for all restrictions
    }
    else if(state.mode ===  RM_RX_CONST.ROOM_TYPE_VIEW_MODE) {
        propsToReturn.shouldShowToggle = false;
        propsToReturn.openAllCallbackForRoomTypeView = state.callBacksFromAngular.openAllRestrictionsForRoomTypeView;
        propsToReturn.closeAllCallbackForRoomTypeView = state.callBacksFromAngular.closeAllRestrictionsForRoomTypeView;
    }
    else if(state.mode ===  RM_RX_CONST.RATE_TYPE_VIEW_MODE) {
        propsToReturn.shouldShowToggle = false;
    }

    return propsToReturn;
};

const mapActionToRateManagerGridLeftSideHeadButtonContainerProps =(stateProps, dispatchProps, ownProps)=>{
    return {
    toggleClicked : (e)=>{
        e.preventDefault();
        let { dispatch } = dispatchProps;       
        dispatch({
                    type: RM_RX_CONST.RATE_VIEW_WITH_ADDRESS,
                    flags: {
                        showRateDetail: !stateProps.flags.showRateDetail
                    }
                });
        },
        ...stateProps
    }
};

const RateManagerGridLeftSideHeadButtonContainer = connect(
  mapStateToRateManagerGridLeftSideHeadButtonContainerProps,
  null,
  mapActionToRateManagerGridLeftSideHeadButtonContainerProps
)(RateManagerGridLeftSideHeadButtonComponent);