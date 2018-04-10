angular.module('sntRover').service('RVReportsInboxSrv', [
    '$q',
    'rvBaseWebSrvV2',
    'RVReportApplyIconClass',
    'RVReportApplyFlags',
    'RVReportSetupDates',        
    function($q, rvBaseWebSrvV2, applyIconClass, applyFlags, setupDates) {
        this.PER_PAGE = 10;

        var reportInboxSampleData = [
            {
                id: 1,
                report_id: 8,
                user_id: 102,
                status_id: 2,
                from_date: "11-12-2018",
                to_date: "13-12-2018",
                name: "Arrival"
            },
            {
                id: 1,
                report_id: 7,
                user_id: 102,
                status_id: 2,
                from_date: "11-12-2018",
                to_date: "13-12-2018",
                name: "Departure"
            },
            {
                id: 1,
                report_id: 8,
                user_id: 102,
                status_id: 2,
                from_date: "11-12-2018",
                to_date: "13-12-2018",
                name: "Departure"
            },
            {
                id: 1,
                report_id: 7,
                user_id: 102,
                status_id: 2,
                from_date: "11-12-2018",
                to_date: "13-12-2018",
                name: "Arrival"
            }
        ]

        this.fetchReportInbox = function(params) {
            var deferred = $q.defer();
            deferred.resolve(reportInboxSampleData);
            /*var url = '/api/generated_reports';

            rvBaseWebSrvV2.getJSON(url, params)
            .then(function(data) {                
                deferred.resolve(reportInboxSampleData);
            }, function(error) {
                deferred.reject(error);
            });*/

            return deferred.promise;
        };

        this.processReports = function(report) {
            for (var i = 0, j = report.length; i < j; i++) {               

                // apply icon class based on the report name
                applyIconClass.init( report[i] );
                
            }
        };
        
    }
]);
