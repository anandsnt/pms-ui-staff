const {connect} = ReactRedux;

const mapStateToRateManagerGridLeftSideHeadButtonContainerProps = (state) => {

    var propsToReturn = {
        mode: state.mode,
        fromDate: state.dates[0],
        toDate: state.dates[state.dates.length - 1]
    };

    if(state.mode === RM_RX_CONST.SINGLE_RATE_EXPANDABLE_VIEW_MODE) {
        propsToReturn.shouldShowPagination = false;
    }
    else if(state.mode === RM_RX_CONST.RATE_VIEW_MODE) {
        propsToReturn.shouldShowPagination = true;
        propsToReturn.goToPrevPage = state.callBacksFromAngular.goToPrevPage;
        propsToReturn.goToNextPage = state.callBacksFromAngular.goToNextPage;
        propsToReturn.paginationStateData = state.paginationState;
    }
    else if(state.mode ===  RM_RX_CONST.ROOM_TYPE_VIEW_MODE) {
        propsToReturn.shouldShowPagination = false;
    }
    else if(state.mode ===  RM_RX_CONST.RATE_TYPE_VIEW_MODE) {
        propsToReturn.shouldShowPagination = true;
        propsToReturn.goToPrevPage = state.callBacksFromAngular.goToPrevPage;
        propsToReturn.goToNextPage = state.callBacksFromAngular.goToNextPage;
        propsToReturn.paginationStateData = state.paginationState;
    }

    return propsToReturn;
};

let getPreviousPageButtonText = (mode, paginationStateData) => {
    let previousPageButtonText = "PREVIOUS "
    switch(mode) {
        case RM_RX_CONST.RATE_VIEW_MODE:
        case RM_RX_CONST.RATE_TYPE_VIEW_MODE:
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
        case RM_RX_CONST.RATE_TYPE_VIEW_MODE:
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


const mapActionToRateManagerGridLeftSideHeadButtonContainerProps = (stateProps, dispatchProps, ownProps) => {
    var isFirstPage = false, isLastPage = false;
    
    if (stateProps.mode ===  RM_RX_CONST.RATE_VIEW_MODE || stateProps.mode ===  RM_RX_CONST.RATE_TYPE_VIEW_MODE) {
        if (stateProps.paginationStateData.page === 1) {
            isFirstPage = true;
        }
        if (Math.ceil(stateProps.paginationStateData.totalRows / stateProps.paginationStateData.perPage) ===  stateProps.paginationStateData.page) {
            isLastPage = true;
        }
    }

    return {
        ...stateProps,
        goToPrevPage: stateProps.goToPrevPage,
        goToNextPage: stateProps.goToNextPage,
        isFirstPage: isFirstPage,
        isLastPage: isLastPage,
        prevPageButtonText: getPreviousPageButtonText(stateProps.mode, stateProps.paginationStateData),
        nextPageButtonText: getNextPageButtonText(stateProps.mode, stateProps.paginationStateData)
    }
};

const RateManagerGridLeftSideHeadButtonContainer = connect(
  mapStateToRateManagerGridLeftSideHeadButtonContainerProps,
  null,
  mapActionToRateManagerGridLeftSideHeadButtonContainerProps
)(RateManagerGridLeftSideHeadButtonComponent);