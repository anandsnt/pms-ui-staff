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
			trClassName: ('cell rate ' + (((index + 1) === rates.length) ? 'last' : '')),
			tdClassName: 'first-row force-align',
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
			tdClassName: 'first-row force-align',
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
	var roomTypesToReturn = [];
	roomTypes.map((roomType, index) => {
		roomTypesToReturn.push({
			...roomType,
			trClassName: (
				'cell rate' + 
				(((index + 1) === roomTypes.length) ? ' last' : '') + 
				(expandedRows.indexOf(index) > -1 ? ' expandedFirstRow': '')
				),
			tdClassName: 'first-row force-align',
			leftSpanClassName: 'name ',
			showIconBeforeText: false,
			textInIconArea: '',
			leftSpanText: roomType.name,
			showRightSpan: true,
			rightSpanClassName: 'icons icon-double-arrow rotate-down'
		})
	});
	return roomTypesToReturn;
};

const mapStateToRateManagerGridLeftRowsContainerProps = (state) => {
	if(state.mode === RM_RX_CONST.RATE_VIEW_MODE) {
		let actualRateList = state.list.slice(1, state.list.length); //first index contains all restrcition for all rates
		return {
			leftListingData: convertRatesDataForLeftListing(actualRateList)
		};
	}
	else if(state.mode === RM_RX_CONST.ROOM_TYPE_VIEW_MODE) {
		let actualRoomTypeList = state.list.slice(1, state.list.length); //first index contains all restrcition for all room types
		return {
			leftListingData: convertRoomTypesDataForLeftListing(actualRoomTypeList)
		};
	}
	else if(state.mode === RM_RX_CONST.SINGLE_RATE_EXPANDABLE_VIEW_MODE) {
		let actualRoomTypeList = state.list.slice(1, state.list.length); //first index contains all restrcition for all room types
		return {
			leftListingData: convertSingleRateRoomTypesDataForLeftListing(actualRoomTypeList, state.expandedRows),
			onItemClickActionType: RM_RX_CONST.TOGGLE_EXPAND_COLLAPSE_ROW 
		};
	}	
};

const mapDispatchToRateManagerGridLeftRowsContainerProps = (stateProps, dispatchProps, ownProps) => {
	const { dispatch } = dispatchProps;
	return {
		onItemClick:(e, index) => {
		    dispatch({
		        type: stateProps.onItemClickActionType,
		        payLoad: {
		        	index: index
		        }
		    });				
		},
		leftListingData: stateProps.leftListingData
	}
};

const RateManagerGridLeftRowsContainer = connect(
  mapStateToRateManagerGridLeftRowsContainerProps,
  null,
  mapDispatchToRateManagerGridLeftRowsContainerProps
)(RateManagerGridLeftRowsComponent);

