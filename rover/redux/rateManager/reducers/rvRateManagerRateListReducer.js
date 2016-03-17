

let convertRatesData = (rates) => {
	return rates.map( (rate) => {
		rate.greyedOut = rate.based_on_rate_id;
		rate.iconClassBeforeText = !rate.based_on_rate_id ? 'base-rate-indicator': '';
		rate.showIconBeforeText = !rate.based_on_rate_id;
		rate.textInIconArea = !rate.based_on_rate_id ? 'B' : '';
		rate.showArrowIcon = true;
		rate.arrowDirection = 'right';
		
		return rate;
	});
};

const rateManagerRateListReducer = (state, action) => {
  switch (action.type) {
    case 'RATE_VIEW_CHANGED':
     	return convertRatesData(action.data);
  	default:
  		return state;
  }
};