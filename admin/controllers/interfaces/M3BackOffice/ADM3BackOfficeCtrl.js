admin.controller('ADM3BackOfficeCtrl', ['$scope', 'config', 'adInterfacesSrv', '$filter',
    function($scope, config, adInterfacesSrv, $filter) {
        console.log("hello from inisde of adm3backofficeCtrl!!! config from router:", config)
        console.log("hello from inisde of adm3backofficeCtrl!!! adInterfacesSrv :", adInterfacesSrv)

    BaseCtrl.call(this, $scope);

    $scope.state = {
        activeTab: 'SETTING'
    };

    $scope.integration = 'M3BACKOFFICE'
    
    /**
     * when clicked on check box to enable/diable letshare
     * @return {undefiend}
     */
    $scope.toggleEnabled = function () {
        $scope.config.enabled = !$scope.config.enabled;
        console.log("toggling enabled", $scope.config.enabled)
    };

    $scope.changeTab = function(name) {
        $scope.state.activeTab = name;
        console.log("changing tab, ", $scope.state.activeTab)
    }

    $scope.chosenSelectedReports = [],
        $scope.chosenAvailableReports = [];

    var resetChosenReports = function() {
        $scope.chosenAvailableReports = [];
        $scope.chosenSelectedReports = [];
    };

    /**
     * when the save is success
     */
    var successCallBackOfSaveAfasSetup = function(data) {
        $scope.goBackToPreviousState();
    };

    /**
     * when we clicked on save button
     * @return {undefiend}
     */
    $scope.saveSetup = function() {
        console.log("Saving Setup via new endpoint: ")
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
        })


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

    $scope.exportData = function() {
        // SYNC!!!
        // migrate this API call to IFC 
        // adInterfacesSrv
      $scope.callAPI(ADM3SetupSrv.sync, {
         params: {
            from_date: $filter('date')($scope.config.fromDate, 'yyyy-MM-dd'),
            to_date: $filter('date')($scope.config.toDate, 'yyyy-MM-dd')
         },
         onSuccess: function () {
             $scope.errorMessage = '';
             $scope.successMessage = 'SUCCESS: Synchronization Initiated!';
         }
       });
    };
    console.log("M3 Controller scope: ", $scope)
    /**
     * Initialization stuffs
     * @return {undefiend}
     */
    var initializeMe = (function() {
        console.log("beginning of iife, before scope.config defined: ", config)
        console.log("beginning of iife, before scope.config defined: ", $scope.config)
        // $scope.config.selected_reports = ["test1", "test2"]
        console.log("before debugger")
        // debugger
        console.log("after debugger")
        // if (!config.available_reports) {
        //     config.available_reports = [
        //         "financial_journal_charge_codes", 
        //         "financial_journal_rates", 
        //         "financial_journal_room_types", 
        //         "financial_journal_market_segments", 
        //         "reservation_count_rates", 
        //         "reservation_count_room_types", 
        //         "reservation_count_market_segments", 
        //         "rooms_occupied", 
        //         "rooms_arrival", 
        //         "rooms_departure", 
        //         "rooms_ooo", 
        //         "rooms_comp", 
        //         "guest_opening_balance", 
        //         "guest_closing_balance", 
        //         "deposit_opening_balance", 
        //         "deposit_closing_balance", 
        //         "ar_opening_balance", 
        //         "ar_closing_balance", 
        //         "rooms_oos", 
        //         "rooms_occupancy", 
        //         "financial_journal_charge_codes_no_tax", 
        //         "financial_journal_rates_no_tax", 
        //         "financial_journal_room_types_no_tax", 
        //         "financial_journal_market_segments_no_tax"
        //     ]
        // }

        // if (!config.selected_reports) {
        //     config.selected_reports = [];
        // }
        $scope.config = config;
        console.log("m3 iife, config ", $scope.config)
    }());
}]);
