const nightlyDiaryDatesGridReducer = (state = [], action) => {
  switch (action.type) {
    case '7_DAYS':
        let datesGridData = {
            "dates_array": action.datesGridData.dates,
            "selected_mode": action.mode
        }
        return datesGridData;
    default:
        return state;
  }
};