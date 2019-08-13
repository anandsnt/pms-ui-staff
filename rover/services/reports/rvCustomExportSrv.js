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
                url = 'api/generic_export_data_spaces/list.json';

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


    }]);