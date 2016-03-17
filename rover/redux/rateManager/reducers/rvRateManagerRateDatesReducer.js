let convertDateDataForRateViewHeader = (dates) => {
	var headerDateData = [],
		copiedDate = null,
		copiedDateComponents = null,
		day = null,
		totalWeekIndexes = 6,
		isWeekEnd = false,
		isPastDate = false,
		headerConditionalClass = '',
		cellConditionalClass = '';

	dates.map(date => {
		copiedDate = tzIndependentDate(date);
		copiedDateComponents = copiedDate.toComponents().date; //refer util.js in diary folder
		
		day = copiedDateComponents.day.toString();
		isWeekEnd = ((totalWeekIndexes - copiedDate.getDay()) <= 1);
		isPastDate = false; //TODO: change with by comparing business date

		headerConditionalClass = isWeekEnd ? 'weekend_day' : '';
		cellConditionalClass = isWeekEnd ? 'weekend_day' : '';
		if(isPastDate) {
			headerConditionalClass = '';
			cellConditionalClass = 'isHistory-cell-content';
		}
		headerDateData.push ({
			'headerClass': headerConditionalClass,
			'cellClass': 'date-header ' + cellConditionalClass,
			'topLabel': copiedDateComponents.weekday,
			'topLabelContainerClass': 'week-day',
			'bottomLabel': copiedDateComponents.monthName + ' ' + ((day.length === 1) ? ('0' + day) : day),
			'bottomLabelContainerClass': ''
		});
	});

	return headerDateData;
};

const rateManagerRateDatesReducer= (state = [], action) => {
  switch (action.type) {
    case 'RATE_VIEW_CHANGED':
    	return convertDateDataForRateViewHeader(action.dates);
  	default:
  		return state;    	
  }	
};