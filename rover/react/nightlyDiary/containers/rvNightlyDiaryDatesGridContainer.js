const {connect} = ReactRedux;

let convertDatesReadyToComponent = datesGridData => {

    let datesGridDataToComponent = [];
    datesGridData.map((dateGrid, index) => {
           let eachDatesGridData = {};
           eachDatesGridData.date = dateGrid;
           let currentDateInLoop = new Date(dateGrid);
           eachDatesGridData.dateValue  = currentDateInLoop.getDate();
           eachDatesGridData.day   = getWeekDayName(currentDateInLoop.getDay(), 9);
           eachDatesGridData.month = getMonthName(currentDateInLoop.getMonth());
           eachDatesGridData.year  = currentDateInLoop.getFullYear();
           datesGridDataToComponent.push(eachDatesGridData);
        }

    )
    return datesGridDataToComponent;
}


const mapStateToNightlyDiaryDatesContainerProps = (state, action) => ({

    isSevenModeChosen : (state.datesGridData.selected_mode === "7_DAYS_MODE"),
    datesToComponent: convertDatesReadyToComponent(state.datesGridData.dates_array)
});

const NightlyDiaryDatesContainer = connect(
  mapStateToNightlyDiaryDatesContainerProps
)(NightlyDiaryDatesComponent);