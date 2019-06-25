admin.controller('ADM3asCtrl', ['$scope', 'config', 'adInterfacesSrv',
    function($scope, config, adInterfacesSrv) {
    BaseCtrl.call(this, $scope);

    $scope.state = {
        activeTab: 'SETTING'
    };

    $scope.integration = 'M3AS';
    
    /**
     * when clicked on check box to enable/diable letshare
     * @return {undefiend}
     */
    $scope.toggleEnabled = function () {
        $scope.config.enabled = !$scope.config.enabled;
    };

    $scope.toggleRoomRevenue = function () {
        $scope.config.room_revenue_only = !$scope.config.room_revenue_only;
    };

    $scope.changeTab = function(name) {
        $scope.state.activeTab = name;
    };

    $scope.chosenSelectedReports = [],
        $scope.chosenAvailableReports = [];

    var resetChosenReports = function() {
        $scope.chosenAvailableReports = [];
        $scope.chosenSelectedReports = [];
    };

    /**
     * when we clicked on save button
     * @return {undefiend}
     */
    $scope.saveSetup = function() {
        $scope.callAPI(adInterfacesSrv.updateSettings, {
            params: {
                integration: $scope.integration.toLowerCase(),
                settings: {
                    enabled: $scope.config.enabled,
                    emails: $scope.config.emails,
                    facility_id: $scope.config.facility_id,
                    selected_reports: $scope.config.selected_reports,
                    room_revenue_only: $scope.config.room_revenue_only
                }
            },
            onSuccess: function() {
                $scope.errorMessage = '';
                $scope.successMessage = 'SUCCESS: Settings Updated!';
            }
        });
    };

    /**
     * Toggle chosen reports in selected column
     * @param reportIndex
     */
    $scope.chooseSelectedReport = function(reportIndex) {
        if ($scope.chosenSelectedReports.indexOf(reportIndex) > -1) {
            $scope.chosenSelectedReports = _.without($scope.chosenSelectedReports, reportIndex);
        } else {
            $scope.chosenSelectedReports.push(reportIndex);
        }

    };

    /**
     * Toggle chosen reports in the available column
     * @param reportIndex
     */
    $scope.chooseAvailableReport = function(reportIndex) {
        if ($scope.chosenAvailableReports.indexOf(reportIndex) > -1) {
            $scope.chosenAvailableReports = _.without($scope.chosenAvailableReports, reportIndex);
        } else {
            $scope.chosenAvailableReports.push(reportIndex);
        }
    };

    /**
     * Method to obtain the displayable title case text from the API provided snake case name of the reports
     * @param str
     * @returns {string}
     */
    $scope.getTitleCase = function(str) {
        return str.toLowerCase()
            .split('_')
            .map(function(i) {
                /** CICO-39843
                 *  The exceptions for title case are shown as all caps
                 */
                if (_.contains(['ar', 'ooo', 'oos'], i)) {
                    return i.toUpperCase();
                }
                return i[0].toUpperCase() + i.substring(1);
            })
            .join(' ');
    };

    /**
     * Handle a selection event
     */
    $scope.onSelectReport = function() {
        resetChosenReports();
    };

    /**
     * * Handle a un-selection event
     */
    $scope.onUnSelectReport = function() {
        resetChosenReports();
    };

    /**
     * Method to move chosen reports from available column to the selected column
     */
    $scope.selectChosen = function() {
        var chosenAvailableReportValues = [];

        _.each($scope.chosenAvailableReports, function(reportIndex) {
            chosenAvailableReportValues.push($scope.config.available_reports[reportIndex]);
        });
        $scope.config.selected_reports = $scope.config.selected_reports.concat(chosenAvailableReportValues);
        $scope.config.available_reports = _.difference($scope.config.available_reports, chosenAvailableReportValues);

        resetChosenReports();
    };

    /**
     * Method to move chosen reports from selected column to the available column
     */
    $scope.unSelectChosen = function() {
        var chosenSelectedReportValues = [];

        _.each($scope.chosenSelectedReports, function(reportIndex) {
            chosenSelectedReportValues.push($scope.config.selected_reports[reportIndex]);
        });
        $scope.config.available_reports = $scope.config.available_reports.concat(chosenSelectedReportValues);
        $scope.config.selected_reports = _.difference($scope.config.selected_reports, chosenSelectedReportValues);

        resetChosenReports();
    };

    /**
     * Move all reports to the selected column
     */
    $scope.selectAll = function() {
        $scope.config.selected_reports = $scope.config.selected_reports.concat($scope.config.available_reports);
        $scope.config.available_reports = [];
        resetChosenReports();
    };

    /**
     * Move all reports to the available column
     */
    $scope.unSelectAll = function() {
        $scope.config.available_reports = $scope.config.available_reports.concat($scope.config.selected_reports);
        $scope.config.selected_reports = [];
        resetChosenReports();
    };

    /**
     * Initialization stuffs
     * @return {undefiend}
     */
    var initializeMe = (function() {
        config.available_reports = [
            'financial_journal_charge_codes',
            'financial_journal_rates',
            'financial_journal_room_types',
            'financial_journal_market_segments',
            'reservation_count_rates',
            'reservation_count_room_types',
            'reservation_count_market_segments',
            'rooms_occupied',
            'deposit_opening_balance',
            'deposit_closing_balance',
            'ar_opening_balance',
            'ar_closing_balance',
            'rooms_arrival',
            'rooms_departure',
            'rooms_ooo',
            'rooms_comp',
            'guest_opening_balance',
            'guest_closing_balance',
            'rooms_oos',
            'rooms_occupancy',
            'financial_journal_charge_codes_no_tax',
            'financial_journal_rates_no_tax',
            'financial_journal_room_types_no_tax',
            'financial_journal_market_segments_no_tax'
        ];

        // if selected_reports returned from IFC, remove them from available_reports
        if (config.selected_reports) {
            config.selected_reports = JSON.parse(config.selected_reports);
            for(i = 0; i < config.selected_reports.length; i++) {
                var idx = config.available_reports.indexOf(config.selected_reports[i])
                if (idx >= 0) {
                    config.available_reports.splice(idx, 1);
                }
            }
        } else {
        // if no selected_reports returned from IFC, initialize as empty array
            config.selected_reports = [];
        }
        $scope.config = config;
    }());
}]);
