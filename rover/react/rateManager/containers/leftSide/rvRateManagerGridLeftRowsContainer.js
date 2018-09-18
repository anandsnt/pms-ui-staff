const {connect} = ReactRedux;

/**
 * to convert the rates data coming from reducers to props
 * @param  {array} rates
 * @return {array}
 */
let convertRatesDataForLeftListing = (rates, mode) => {
	var ratesToReturn = [];
	var showIndicator = (mode == RM_RX_CONST.RATE_VIEW_MODE);

	rates.map((rate, index) => {
		ratesToReturn.push({
			id: rate.id,
			name: rate.name,
			trClassName: ('cell rate ' + (((index + 1) === rates.length) ? 'last' : '')),
			tdClassName: '',
			leftSpanClassName: 'name ' + (rate.based_on_rate_id && !rate.is_copied ? 'gray' : 'base-rate')+((rate.is_company_card||rate.is_travel_agent)?' contracted-rate':' contracted-rate contracted-rate-missing-info'),
			showIconBeforeText: !rate.based_on_rate_id,
			iconClassBeforeText: !rate.based_on_rate_id ? 'base-rate-indicator': '',
			textInIconArea: !rate.based_on_rate_id ? 'B' : '',
			leftSpanText: rate.name,
			address: rate.address,
			showRightSpan: true,
			contractLabel: rate.is_travel_agent?'ta':(rate.is_company_card?'c':''),
			contractClass: rate.is_travel_agent?'travel-agent':'',
			rightSpanClassName: 'icons icon-double-arrow rotate-right',
			accountName: rate.account_name,
			showIndicator: showIndicator
		})
	});

	return ratesToReturn;
};

let convertRateTypesDataForLeftListing = (rateTypes, mode) => {
	var rateTypesToReturn = [];
	var showIndicator = (mode == RM_RX_CONST.RATE_TYPE_VIEW_MODE);

	rateTypes.map((rateType, index) => {
		rateTypesToReturn.push({
			id: rateType.id,
			name: rateType.name,
			trClassName: ('cell rate ' + (((index + 1) === rateTypes.length) ? 'last' : '')),
			tdClassName: '',
			leftSpanClassName: 'name ' + (rateType.based_on_rate_id && !rateType.is_copied ? 'gray' : 'base-rate')+((rateType.is_company_card||rateType.is_travel_agent)?' contracted-rate':' contracted-rate contracted-rate-missing-info'),
			showIconBeforeText: !rateType.based_on_rate_id,
			iconClassBeforeText: !rateType.based_on_rate_id ? 'base-rate-indicator': '',
			textInIconArea: !rateType.based_on_rate_id ? 'B' : '',
			leftSpanText: rateType.name,
			// address: rate.address,
			showRightSpan: true,
			contractLabel: rateType.is_travel_agent?'ta':(rateType.is_company_card?'c':''),
			contractClass: rateType.is_travel_agent?'travel-agent':'',
			rightSpanClassName: 'icons icon-double-arrow rotate-right',
			// accountName: rate.account_name,
			showIndicator :showIndicator
		})
	});

	return rateTypesToReturn;
}

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
			leftListingData: convertRatesDataForLeftListing(state.list, state.mode),
			mode: state.mode,
			fromDate: state.dates[0],
			toDate: state.dates[state.dates.length-1],
			callBackForSingleRateFetch: state.callBacksFromAngular.singleRateViewCallback
		};
	}
	else if(state.mode === RM_RX_CONST.RATE_TYPE_VIEW_MODE) {
		return {
			leftListingData: convertRateTypesDataForLeftListing(state.list),
			mode: state.mode,
			fromDate: state.dates[0],
			toDate: state.dates[state.dates.length-1],
			callBackForSingleRateTypeFetch: state.callBacksFromAngular.singleRateTypeViewCallback
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
					selectedRates: [{id: clickedRate.id, name: clickedRate.name, accountName: clickedRate.accountName, address: clickedRate.address}]
				})
			}
			else if(stateProps.mode === RM_RX_CONST.RATE_TYPE_VIEW_MODE) {
				let clickedRateType = stateProps.leftListingData[index];

				stateProps.callBackForSingleRateTypeFetch({
					fromDate: stateProps.fromDate,
					toDate: stateProps.toDate,
					selectedRateTypes: [{id: clickedRateType.id, name: clickedRateType.name}]
				})
			}
		},
		leftListingData: stateProps.leftListingData
	}
};

const RateManagerGridLeftRowsContainer = connect(
  mapStateToRateManagerGridLeftRowsContainerProps,
  null,
  mapDispatchToRateManagerGridLeftRowsContainerProps
)(RateManagerGridLeftRowsComponent);

