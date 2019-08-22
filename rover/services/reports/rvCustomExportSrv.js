angular.module('sntRover').service('RVCustomExportSrv', [
    '$q',
    'sntBaseWebSrv',
    function ($q, sntBaseWebSrv) {
        var scheduledExports = [
            {
                report: {
                    id: 1,
                    title: "My exports1",
                    description: "My Custom Exports"
                }
            },
            {
                report: {
                    id: 2,
                    title: "Stay dates export",
                    description: "My stay dates exports"
                }
            },
            {
                report: {
                    id: 3,
                    title: "Reservation data space",
                    description: "My reservation data space exports"
                }
            }
        ];

        this.getAvailableDataSpaces = () => {
            var deferred = $q.defer(),
                url = 'api/reports?show_only_redshift_reports=true';

            sntBaseWebSrv.getJSON(url).then(function (response) {
                deferred.resolve(response.results);
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        this.getScheduledCustomExports = () => {
            var deferred = $q.defer(),
                url = 'admin/export_schedules.json?show_only_redshift_reports=true';

            //deferred.resolve(scheduledExports);
            sntBaseWebSrv.getJSON(url).then(function (response) {
                deferred.resolve(response.results);
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        this.getRequestData = ( params ) => {
            var promises = {},
                deferred = $q.defer();

            promises['columns'] = this.getDataSpaceColumns(params);
            promises['exportFormats'] = this.getExportFormats(params);
            promises['deliveryTypes'] = this.getExportDeliveryTypes(params);

            $q.all(promises).then(function (data) {
                deferred.resolve(data);
            }, function () {
                deferred.resolve([]);
            });

            return deferred.promise;

        };

        this.getExportFormats =  (params) => {
            var deferred = $q.defer(),
                url = 'admin/export_formats.json';

            sntBaseWebSrv.getJSON(url).then(function (response) {
                deferred.resolve(response.results);
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        this.getExportDeliveryTypes = (params)  => {
            var deferred = $q.defer(),
                url = 'admin/export_delivery_types.json';

            sntBaseWebSrv.getJSON(url).then(function (response) {
                deferred.resolve(response.results);
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        this.getDataSpaceColumns = (params) => {
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