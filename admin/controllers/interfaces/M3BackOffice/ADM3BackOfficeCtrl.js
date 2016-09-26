admin.controller('ADM3BackOfficeCtrl', ['$scope', 'm3AccountingSetupValues', 'ADM3SetupSrv', function($scope, m3AccountingSetupValues, ADM3SetupSrv) {
    BaseCtrl.call(this, $scope);

    $scope.chosenSelectedReports = [],
        $scope.chosenAvailableReports = [];

    var resetChosenReports = function() {
        $scope.chosenAvailableReports = [];
        $scope.chosenSelectedReports = [];
    };

    /**
     * when clicked on check box to enable/diable letshare
     * @return {undefiend}
     */
    $scope.toggleActivation = function() {
        $scope.m3Accounting.enabled = !$scope.m3Accounting.enabled;
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
                selected_reports: $scope.m3Accounting.selected_reports
            },
            successCallBack: successCallBackOfSaveAfasSetup
        };
        $scope.callAPI(ADM3SetupSrv.saveConfig, options);
    };

    /**
     * Toggle chosen reports in selected column
     * @param reportIndex
     */
    $scope.chooseSelectedReport = function(reportIndex) {
        if ($scope.chosenSelectedReports.indexOf(reportIndex) > -1) {
            $scope.chosenSelectedReports = _.without($scope.chosenSelectedReports, reportIndex)
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
            $scope.chosenAvailableReports = _.without($scope.chosenAvailableReports, reportIndex)
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

    /**
     * Initialization stuffs
     * @return {undefiend}
     */
    var initializeMe = function() {
        $scope.m3Accounting = {
            enabled: m3AccountingSetupValues.enabled,
            emails: m3AccountingSetupValues.emails,
            hotelCode: m3AccountingSetupValues.facility_id,
            available_reports: m3AccountingSetupValues.available_reports,
            selected_reports: m3AccountingSetupValues.selected_reports || []
        };
    }();
}])