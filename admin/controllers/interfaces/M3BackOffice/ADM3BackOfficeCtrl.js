admin.controller('ADM3BackOfficeCtrl', ['$scope', 'config', 'ADM3SetupSrv', '$filter',
    function($scope, config, ADM3SetupSrv, $filter) {
        console.log("hello from inisde of adm3backofficeCtrl!!! ", config)

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
        var options = {
            params: {
                enabled: $scope.m3Accounting.enabled,
                emails: $scope.m3Accounting.emails,
                facility_id: $scope.m3Accounting.hotelCode,
                selected_reports: $scope.m3Accounting.selected_reports,
                room_revenue_only: $scope.m3Accounting.roomRevenueOnly
            },
            successCallBack: successCallBackOfSaveAfasSetup
        };
        // migrate this API call to IFC
        $scope.callAPI(ADM3SetupSrv.saveConfig, options);
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
            chosenAvailableReportValues.push($scope.m3Accounting.available_reports[reportIndex]);
        });
        $scope.m3Accounting.selected_reports = $scope.m3Accounting.selected_reports.concat(chosenAvailableReportValues);
        $scope.m3Accounting.available_reports = _.difference($scope.m3Accounting.available_reports, chosenAvailableReportValues);

        resetChosenReports();
    };

    /**
     * Method to move chosen reports from selected column to the available column
     */
    $scope.unSelectChosen = function() {
        var chosenSelectedReportValues = [];

        _.each($scope.chosenSelectedReports, function(reportIndex) {
            chosenSelectedReportValues.push($scope.m3Accounting.selected_reports[reportIndex]);
        });
        $scope.m3Accounting.available_reports = $scope.m3Accounting.available_reports.concat(chosenSelectedReportValues);
        $scope.m3Accounting.selected_reports = _.difference($scope.m3Accounting.selected_reports, chosenSelectedReportValues);

        resetChosenReports();
    };

    /**
     * Move all reports to the selected column
     */
    $scope.selectAll = function() {
        $scope.m3Accounting.selected_reports = $scope.m3Accounting.selected_reports.concat($scope.m3Accounting.available_reports);
        $scope.m3Accounting.available_reports = [];
        resetChosenReports();
    };

    /**
     * Move all reports to the available column
     */
    $scope.unSelectAll = function() {
        $scope.m3Accounting.available_reports = $scope.m3Accounting.available_reports.concat($scope.m3Accounting.selected_reports);
        $scope.m3Accounting.selected_reports = [];
        resetChosenReports();
    };

    $scope.exportData = function() {
        // migrate this API call to IFC 
      $scope.callAPI(ADM3SetupSrv.sync, {
         params: {
            from_date: $filter('date')($scope.m3Accounting.fromDate, 'yyyy-MM-dd'),
            to_date: $filter('date')($scope.m3Accounting.toDate, 'yyyy-MM-dd')
         },
         onSuccess: function () {
             $scope.errorMessage = '';
             $scope.successMessage = 'SUCCESS: Synchronization Initiated!';
         }
       });
    };
    console.log("M3 COntroller scope: ", $scope)
    /**
     * Initialization stuffs
     * @return {undefiend}
     */
    var initializeMe = (function() {
        $scope.config = config;
        $scope.m3Accounting = {
            enabled: config.enabled,
            emails: config.emails,
            hotelCode: config.facility_id,
            available_reports: config.available_reports,
            selected_reports: config.selected_reports || [],
            roomRevenueOnly: config.room_revenue_only
        };
        console.log("m3 iife, config ", $scope.config)
    }());
}]);
