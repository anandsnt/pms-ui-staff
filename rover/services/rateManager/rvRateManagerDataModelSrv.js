sntRover.service('rvRateManagerDataModelSrv', [
    'rvRateManagerZoomLevelConstants',
    'rvRateManagerGroupByConstants',
    function(rvRateManagerZoomLevelConstants,
             rvRateManagerGroupByConstants) {

    this.getDataModel = () => (
        {
            filterOptions: {
                isVisible: false,

                dateRange: {
                    from: null,
                    to: null
                },

                zoomLevel: {
                    selectedValue: '3', //default value
                    values: rvRateManagerZoomLevelConstants
                },

                orderBy: {
                    selectedValue: 'ALPHABETICAL', //default value
                    values: [], //will be filled from API once we get to the view
                },

                groupBy: {
                    selectedValue: null, //default value
                    values: rvRateManagerGroupByConstants
                },

                viewTypeSelection: {
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