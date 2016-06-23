const {connect} = ReactRedux;

/**
 * to convert the rates data coming from reducers to props
 * @param  {array} rates
 * @return {array}
 */
let convertRatesDataForLeftListing = (rates) => {
	var ratesToReturn = [];
	rates.map((rate, index) => {
		ratesToReturn.push({
			id: rate.id,
			name: rate.name,
			trClassName: ('cell rate ' + (((index + 1) === rates.length) ? 'last' : '')),
			tdClassName: '',
			leftSpanClassName: 'name ' + (rate.based_on_rate_id ? 'gray' : 'base-rate'),
			showIconBeforeText: !rate.based_on_rate_id,
			iconClassBeforeText: !rate.based_on_rate_id ? 'base-rate-indicator': '',
			textInIconArea: !rate.based_on_rate_id ? 'B' : '',
			leftSpanText: rate.name,
			showRightSpan: true,
			rightSpanClassName: 'icons icon-double-arrow rotate-right'
		})
	});

	return ratesToReturn;
};

let getPreviousPageButtonText = (mode, paginationStateData) => {
	let previousPageButtonText = "PREVIOUS"
	switch(mode) {
        case RM_RX_CONST.RATE_VIEW_MODE:
				previousPageButtonText += " " + paginationStateData.perPage + " RATES";
            break;                           
        default:
            break;
    };
    return previousPageButtonText;
};

let getNextPageButtonText = (mode, paginationStateData) => {
	let nextPageButtonText = "NEXT"
	switch(mode) {
        case RM_RX_CONST.RATE_VIEW_MODE:
        	if (Math.ceil(paginationStateData.totalRows / paginationStateData.perPage) === paginationStateData.page + 1) {
				// In case of navigation to last page; show remaining 
                nextPageButtonText += " " + paginationStateData.totalRows - (paginationStateData.perPage * paginationStateData.page) + " RATES";
			} else {
           		nextPageButtonText += " " + paginationStateData.perPage + " RATES";
           	}
            break;                           
        default:
            break;
    };
    return nextPageButtonText;
};

/**
 * to convert the room type data coming from reducers to props
 * @param  {array} room types
 * @return {array}
 */
let convertRoomTypesDataForLeftListing = (roomTypes) => {
	var roomTypesToReturn = [];
	roomTypes.map((roomType, index) => {
		roomTypesToReturn.push({
			...roomType,
			trClassName: ('cell rate ' + (((index + 1) === roomTypes.length) ? 'last' : '')),
			tdClassName: '',
			leftSpanClassName: 'name ',
			showIconBeforeText: false,
			textInIconArea: '',
			leftSpanText: roomType.name,
			showRightSpan: false
		});
	});

	return roomTypesToReturn;
};

/**
 * to convert the single rate's room type data coming from reducers to props
 * @param  {array} room types
 * @param {array} expandedRows [array containing index of row to expand]
 * @return {array}
 */
let convertSingleRateRoomTypesDataForLeftListing = (roomTypes, expandedRows) => {
	var roomTypesToReturn = [], isExpandedRow = false;
	roomTypes.map((roomType, index) => {
		isExpandedRow = expandedRows.indexOf(index) > -1;
		roomTypesToReturn.push({
			...roomType,
			trClassName: (
				'cell rate' + 
				(((index + 1) === roomTypes.length) ? ' last' : '') + 
				( isExpandedRow ? ' expanded-row': '')
				),
			tdClassName: '',
			leftSpanClassName: 'name ',
			showIconBeforeText: false,
			textInIconArea: '',
			leftSpanText: roomType.name,
			showRightSpan: true,
			rightSpanClassName: 'icons icon-double-arrow' + (isExpandedRow ? ' rotate-up': ' rotate-down')
		})
	});
	return roomTypesToReturn;
};

const mapStateToRateManagerGridLeftRowsContainerProps = (state) => {
	if(state.mode === RM_RX_CONST.RATE_VIEW_MODE) {
		return {
			leftListingData: convertRatesDataForLeftListing(state.list),
			mode: state.mode,
			fromDate: state.dates[0],
			toDate: state.dates[state.dates.length-1],
			callBackForSingleRateFetch: state.callBacksFromAngular.singleRateViewCallback,
			goToPrevPage: state.callBacksFromAngular.goToPrevPage,
			goToNextPage: state.callBacksFromAngular.goToNextPage,
			paginationStateData: state.paginationState
		};
	}
	else if(state.mode === RM_RX_CONST.ROOM_TYPE_VIEW_MODE) {
		return {
			leftListingData: convertRoomTypesDataForLeftListing(state.list)
		};
	}
	else if(state.mode === RM_RX_CONST.SINGLE_RATE_EXPANDABLE_VIEW_MODE) {
		return {
			leftListingData: convertSingleRateRoomTypesDataForLeftListing(state.list, state.expandedRows),
			mode: state.mode
		};
	}	
};

const mapDispatchToRateManagerGridLeftRowsContainerProps = (stateProps, dispatchProps, ownProps) => {
	return {
		onItemClick:(e, index) => {
			let { dispatch } = dispatchProps;
			if (stateProps.mode === RM_RX_CONST.SINGLE_RATE_EXPANDABLE_VIEW_MODE) {
				dispatch({
			        type: RM_RX_CONST.TOGGLE_EXPAND_COLLAPSE_ROW,
			        payLoad: {
			        	index: index
			        }
		    	});
			}
			else if(stateProps.mode === RM_RX_CONST.RATE_VIEW_MODE) {
				let clickedRate = stateProps.leftListingData[index];
				stateProps.callBackForSingleRateFetch({
					fromDate: stateProps.fromDate,
					toDate: stateProps.toDate,
					selectedRates: [{id: clickedRate.id, name: clickedRate.name}]
				})
			}				
		},
		leftListingData: stateProps.leftListingData,
		goToPrevPage: stateProps.goToPrevPage,
		goToNextPage: stateProps.goToNextPage,
		isFirstPage: stateProps.mode != RM_RX_CONST.RATE_VIEW_MODE || stateProps.paginationStateData.page === 1,
		isLastPage: stateProps.mode != RM_RX_CONST.RATE_VIEW_MODE ||
			Math.ceil(stateProps.paginationStateData.totalRows / stateProps.paginationStateData.perPage) ===  stateProps.paginationStateData.page,
		topPageButtonText: getPreviousPageButtonText(stateProps.mode, stateProps.paginationStateData),
		bottomPageButtonText: getNextPageButtonText(stateProps.mode, stateProps.paginationStateData)
	}
};

const RateManagerGridLeftRowsContainer = connect(
  mapStateToRateManagerGridLeftRowsContainerProps,
  null,
  mapDispatchToRateManagerGridLeftRowsContainerProps
)(RateManagerGridLeftRowsComponent);

