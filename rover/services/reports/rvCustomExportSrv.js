angular.module('sntRover').service('RVCustomExportSrv', [
    '$q',
    'sntBaseWebSrv',
    function ($q, sntBaseWebSrv) {
        var scheduledExports = [
            {
                id: 1,
                export_name: 'My exports1',
                desc: 'Created for Revenue'
            },
            {
                id: 2,
                export_name: 'My exports2',
                desc: 'Created for Revenue'
            },
            {
                id: 3,
                export_name: 'My exports3',
                desc: 'Created for Revenue'
            }
        ];

        this.getAvailableDataSpaces = function () {
            var deferred = $q.defer(),
                url = 'api/reports?show_only_redshift_reports=true';

            sntBaseWebSrv.getJSON(url).then(function (response) {
                deferred.resolve(response.results);
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        this.getScheduledCustomExports = function () {
            var deferred = $q.defer(),
                url = 'api/custom_exports_schedules.json';

            deferred.resolve(scheduledExports);
            // sntBaseWebSrv.getJSON(url).then(function (response) {
            //     deferred.resolve(scheduledExports);
            // }, function (error) {
            //     deferred.reject(error);
            // });

            return deferred.promise;
        };

        this.getDataSpaceColumns = function (params) {
            var deferred = $q.defer(),
                url = 'api/reports/' + params.reportId + '/list_data_space_columns';

            sntBaseWebSrv.getJSON(url).then(function (columnData) {
                columnData = columnData.map(( column) => ({
                                name: column,
                                selected: false
                            }));
                            
                deferred.resolve(columnData);
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };


    }]);