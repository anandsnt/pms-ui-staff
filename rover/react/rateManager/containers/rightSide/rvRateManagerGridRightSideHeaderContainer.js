const {connect} = ReactRedux;

let convertDateDataForHeader = (dates, businessDate) => {
  var headerDateData = [],
    copiedDate = null,
    copiedDateComponents = null,
    day = null,
    isWeekEnd = false,
    isPastDate = false,
    headerConditionalClass = '',
    cellConditionalClass = '';

  dates.map(date => {
    copiedDate = tzIndependentDate(date);
    copiedDateComponents = copiedDate.toComponents().date; //refer util.js in diary folder

    day = copiedDateComponents.day.toString();
    isWeekEnd = (copiedDate.getDay() === 6 || copiedDate.getDay() === 0);
    isPastDate = copiedDate < businessDate;

    headerConditionalClass = isWeekEnd ? 'weekend_day' : '';
    cellConditionalClass = isWeekEnd ? 'weekend_day' : '';
    
    if (isPastDate) {
      headerConditionalClass = '';
      cellConditionalClass = 'isHistory-cell-content';
    }

    headerDateData.push({
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

const mapStateToRateManagerGridRightSideHeaderContainerProps = (state) => {
  //for every mode (all rate view, room type, single rate view), this is same
  return {
    headerDataList: convertDateDataForHeader(state.dates, state.businessDate)
  };
};

const mapDispatchToRateManagerGridRightSideHeaderContainerProps = (dispatch) => {
  return {
    refreshScrollers: () => {
      dispatch({
        type: RM_RX_CONST.REFRESH_SCROLLERS
      });
    }
  };
};

const RateManagerGridRightSideHeaderContainer =
  connect(mapStateToRateManagerGridRightSideHeaderContainerProps, 
    mapDispatchToRateManagerGridRightSideHeaderContainerProps)
  (RateManagerGridRightSideHeaderComponent);
