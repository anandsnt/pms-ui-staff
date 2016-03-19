const {connect} = ReactRedux;

/**
 * to convert the rates data coming from reducers to props
 * @param  {array} rates
 * @return {array}
 */
let convertRatesDataForLeftListing = (rates) => {
	return rates.map((rate, index) => {
		rate.trClassName = ('cell rate ' + (((index + 1) === rates.length) ? 'last' : ''));
		rate.tdClassName = 'first-row force-align';
		rate.leftSpanClassName = 'name ' + (rate.based_on_rate_id ? 'gray' : 'base-rate');
		rate.showIconBeforeText = !rate.based_on_rate_id;
		rate.iconClassBeforeText = !rate.based_on_rate_id ? 'base-rate-indicator': '';
		rate.textInIconArea = !rate.based_on_rate_id ? 'B' : '';
		rate.leftSpanText = rate.name;
		rate.showRightSpan = true;
		rate.rightSpanClassName = 'icons icon-double-arrow rotate-right';
		return rate;
	});
};

/**
 * to convert the room type data coming from reducers to props
 * @param  {array} room types
 * @return {array}
 */
let convertRoomTypesDataForLeftListing = (roomTypes) => {
	return roomTypes.map((roomType, index) => {
		roomType.trClassName = ('cell rate ' + (((index + 1) === roomTypes.length) ? 'last' : ''));
		roomType.tdClassName = 'first-row force-align';
		roomType.leftSpanClassName = 'name ';
		roomType.showIconBeforeText = false;
		roomType.textInIconArea = '';
		roomType.leftSpanText = roomType.name;
		roomType.showRightSpan = false;
		return roomType;
	});
};

const mapStateToRateManagerGridLeftRowsContainerProps = (state) => {
	if(state.mode === RM_RX_CONST.RATE_VIEW_MODE) {
		let actualRateList = state.list.slice(1, state.list.length); //first index contains all restrcition for all rates
		return {
			list: convertRatesDataForLeftListing(actualRateList)
		};
	}
	if(state.mode === RM_RX_CONST.ROOM_TYPE_VIEW_MODE) {
		let actualRoomTypeList = state.list.slice(1, state.list.length); //first index contains all restrcition for all room types
		return {
			list: convertRoomTypesDataForLeftListing(actualRoomTypeList)
		};
	}	
};

const mapDispatchToRateManagerGridLeftRowsContainerProps = (dispatch) => {
	return {      
	}
};

const RateManagerGridLeftRowsContainer = connect(
  mapStateToRateManagerGridLeftRowsContainerProps, 
  mapDispatchToRateManagerGridLeftRowsContainerProps
)(RateManagerGridLeftRowsComponent);