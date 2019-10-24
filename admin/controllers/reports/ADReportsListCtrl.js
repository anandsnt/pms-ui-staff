admin.controller('ADReportsListCtrl', ['$scope', '$rootScope', 'reports', 'adReportsSrv',
    function($scope, $rootScope, reports, adReportsSrv) {
        BaseCtrl.call(this, $scope);

        // Object for state variables
        $scope.reportsState = {
            list: reports,
            isSuperAdmin: $rootScope.adminRole === "snt-admin"
        };

        var initialize = function() {
            // TODO: Controller Initialization goes here
        };


        $scope.toggleFilter = function(e, report) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }

            // TODO: Fetch Data for the filters

            // Toggle View  Filters
            if (!report.viewFilters) {
                $scope.invokeApi(adReportsSrv.fetchFilterData, report.key, function() {
                    $scope.$emit('hideLoader');
                    report.viewFilters = true;
                }, function() {
                    $scope.$emit('hideLoader');
                });
            } else {
                report.viewFilters = false;
            }
        };

        $scope.getFilterTemplate = function(report) {
            switch (report.key) {
                case 'CLIENT_USAGE':
                    return "/assets/partials/reports/filters/ADClientUsageReportFilter.html";
                default:
                    return '/assets/partials/reports/filters/ADDefaultReportFilter.html';
            }
        };

        // Init Controller
        initialize();
    }
]);
