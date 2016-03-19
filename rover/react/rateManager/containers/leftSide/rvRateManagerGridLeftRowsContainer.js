const {connect} = ReactRedux;

/**
 * to convert the rates data coming from reducers to props
 * @param  {array} rates
 * @return {array}
 */
let convertRatesDataForLeftListing = (rates) => {
	return rates.map((rate) => {
		rate.greyedOut = rate.based_on_rate_id;
		rate.iconClassBeforeText = !rate.based_on_rate_id ? 'base-rate-indicator': '';
		rate.showIconBeforeText = !rate.based_on_rate_id;
		rate.textInIconArea = !rate.based_on_rate_id ? 'B' : '';
		rate.showArrowIcon = true;
		rate.arrowDirection = 'right';
		return rate;
	});
};

/**
 * to convert the room type data coming from reducers to props
 * @param  {array} room types
 * @return {array}
 */
let convertRoomTypesDataForLeftListing = (roomTypes) => {
	return roomTypes.map((roomType) => {
		roomType.greyedOut = false;
		roomType.iconClassBeforeText = '';
		roomType.showIconBeforeText = false;
		roomType.textInIconArea = '';
		roomType.showArrowIcon = false;
		roomType.arrowDirection = '';
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