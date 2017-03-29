const {connect} = ReactRedux;

const mapStateToRateManagerGridLeftSideHeadButtonContainerProps = (state) => {

    var propsToReturn = {
        mode: state.mode,
        fromDate: state.dates[0],
        toDate: state.dates[state.dates.length - 1]
    };

    if(state.mode === RM_RX_CONST.SINGLE_RATE_EXPANDABLE_VIEW_MODE) {
        propsToReturn.shouldShowPagination = false;
        // propsToReturn.openAllCallbackForSingleRateView = state.callBacksFromAngular.openAllCallbackForSingleRateView;
        // propsToReturn.closeAllCallbackForSingleRateView = state.callBacksFromAngular.openAllCallbackForSingleRateView;
    }
    else if(state.mode === RM_RX_CONST.RATE_VIEW_MODE) {
        propsToReturn.shouldShowPagination = true;
        propsToReturn.goToPrevPage = state.callBacksFromAngular.goToPrevPage;
        propsToReturn.goToNextPage = state.callBacksFromAngular.goToNextPage;
        propsToReturn.paginationStateData = state.paginationState;
        // propsToReturn.openAllCallbackForRateView = state.callBacksFromAngular.openAllRestrictionsForRateView;
        // propsToReturn.closeAllCallbackForRateView = state.callBacksFromAngular.closeAllRestrictionsForRateView;
        // propsToReturn.rate_ids = _.pluck(state.list.slice(0), 'id'); //first row will be having any id, just for all restrictions
        // propsToReturn.mode = state.mode;
        // propsToReturn.fromDate = state.dates[0];
        // propsToReturn.toDate = state.dates[state.dates.length-1];
    }
    else if(state.mode ===  RM_RX_CONST.ROOM_TYPE_VIEW_MODE) {
        propsToReturn.shouldShowPagination = false;
        // propsToReturn.openAllCallbackForRoomTypeView = state.callBacksFromAngular.openAllRestrictionsForRoomTypeView;
        // propsToReturn.closeAllCallbackForRoomTypeView = state.callBacksFromAngular.closeAllRestrictionsForRoomTypeView;
    }
    else if(state.mode ===  RM_RX_CONST.RATE_TYPE_VIEW_MODE) {
        propsToReturn.shouldShowPagination = true;
    }

    return propsToReturn;
};

let getPreviousPageButtonText = (mode, paginationStateData) => {
    let previousPageButtonText = "PREVIOUS "
    switch(mode) {
        case RM_RX_CONST.RATE_VIEW_MODE:
                previousPageButtonText += paginationStateData.perPage + " RATES";
            break;
        default:
            break;
    };
    return previousPageButtonText;
};

let getNextPageButtonText = (mode, paginationStateData) => {
    let nextPageButtonText = "NEXT "
    switch(mode) {
        case RM_RX_CONST.RATE_VIEW_MODE:
            if (Math.ceil(paginationStateData.totalRows / paginationStateData.perPage) === paginationStateData.page + 1) {
                // In case of navigation to last page; show remaining
                nextPageButtonText += paginationStateData.totalRows - (paginationStateData.perPage * paginationStateData.page) + " RATES";
            } else {
                nextPageButtonText += paginationStateData.perPage + " RATES";
            }
            break;
        default:
            break;
    };
    return nextPageButtonText;
};


const mapActionToRateManagerGridLeftSideHeadButtonContainerProps =(stateProps, dispatchProps, ownProps)=>{
    return {
        ...stateProps,
        goToPrevPage: stateProps.goToPrevPage,
        goToNextPage: stateProps.goToNextPage,
        isFirstPage: stateProps.mode != RM_RX_CONST.RATE_VIEW_MODE || stateProps.paginationStateData.page === 1,
        isLastPage: stateProps.mode != RM_RX_CONST.RATE_VIEW_MODE ||
            Math.ceil(stateProps.paginationStateData.totalRows / stateProps.paginationStateData.perPage) ===  stateProps.paginationStateData.page,
        prevPageButtonText: getPreviousPageButtonText(stateProps.mode, stateProps.paginationStateData),
        nextPageButtonText: getNextPageButtonText(stateProps.mode, stateProps.paginationStateData)
    }
};

const RateManagerGridLeftSideHeadButtonContainer = connect(
  mapStateToRateManagerGridLeftSideHeadButtonContainerProps,
  null,
  mapActionToRateManagerGridLeftSideHeadButtonContainerProps
)(RateManagerGridLeftSideHeadButtonComponent);