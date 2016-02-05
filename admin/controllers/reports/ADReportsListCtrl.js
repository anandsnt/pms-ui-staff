admin.controller('ADReportsListCtrl', ['$scope', 'reports',
    function ($scope, reports) {
        BaseCtrl.call(this, $scope);
        
        // Object for state variables
        $scope.reportsState = {
            list: reports
        };

        var initialize = function () {
            console.log($scope.reportsState.list);
        };


        $scope.toggleFilter = function (e, report) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            };
            
            // TODO: Fetch Data for the filters
            
            // Toggle View  Filters
            report.viewFilters = ! report.viewFilters ;
        };

        $scope.getFilterTemplate = function (report) {
            return "/assets/partials/reports/filters/ADClientUsageReportFilter.html"
        }
      
        // Init Controller
        initialize();
    }
]);