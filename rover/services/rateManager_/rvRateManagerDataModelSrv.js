sntRover.service('rvRateManagerDataModelSrv', [
    'rvRateManagerZoomLevelConstants',
    'rvRateManagerGroupByConstants',
    function(rvRateManagerZoomLevelConstants,
             rvRateManagerGroupByConstants) {

    this.getDataModel = () => (
        {
            filterOptions: {
                
                dateRange: {
                    from: null,
                    to: null
                },

                zoomLevel: {
                    selectedValue: '3', //default value
                    values: rvRateManagerZoomLevelConstants
                },

                orderBy: {
                    selectedValue: null, //will be assigning to the preferred from the admin
                    values: [], //will be filled from API once we get to the view
                },

                groupBy: {
                    selectedValue: '', //default value
                    values: rvRateManagerGroupByConstants
                },

                viewTypeSelection: {
                    chosenTab: 'SHOW_ALL', //list of values applicable: 'SHOW_ALL', 'SELECT_RATE'

                    showAllRates: true,
                    showAllRoomTypes: false,

                    rateTypes: [], //will be filled from API once we get to the view
                    selectedRateTypes: [],

                    rates:[], //will be filled from API once we get to the view
                    selectedRates: []
                },

                selectedCards: []
            }
        }
    );

}]);