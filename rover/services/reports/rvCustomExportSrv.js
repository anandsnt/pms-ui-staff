angular.module('sntRover').service('RVCustomExportSrv', [
    '$q',
    'sntBaseWebSrv',
    'RVreportsSubSrv',
    function (
        $q,
        sntBaseWebSrv,
        reportSubSrv ) {
        const FILTER_KEYS = {
            'BOOKING_ORIGIN_CODE': 'booking_origin_code',
            'MARKET_CODE': 'market_code',
            'RESERVATION_STATUS': 'reservation_status',
            'ROOM_NO': 'room_no',
            'ROOM_TYPE': 'room_type',
            'SEGMENT_CODE': 'segment_code',
            'SOURCE_CODE': 'source_code'
        };

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
            promises['durations'] = this.getExportDurations(params);

            $q.all(promises).then(function (data) {
                deferred.resolve(data);
            }, function () {
                deferred.resolve([]);
            });

            return deferred.promise;

        };

        this.getExportFormats =  () => {
            var deferred = $q.defer(),
                url = 'admin/export_formats.json';

            sntBaseWebSrv.getJSON(url).then(function (response) {
                deferred.resolve(response.results);
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        this.getExportDeliveryTypes = ( params )  => {
            var deferred = $q.defer(),
                url = 'admin/export_delivery_types.json';

            sntBaseWebSrv.getJSON(url).then(function (response) {
                deferred.resolve(response.results);
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        this.getDataSpaceColumns = ( params ) => {
            var deferred = $q.defer(),
                url = 'api/reports/' + params.reportId + '/list_data_space_columns';

            sntBaseWebSrv.getJSON(url).then(function (columnData) {
                columnData = columnData.map((column) => ({
                    name: column,
                    selected: false
                }));

                deferred.resolve(columnData);
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        this.getExportDurations = ( params )  => {
            var deferred = $q.defer(),
                url = 'admin/export_time_periods.json';

            sntBaseWebSrv.getJSON(url).then(function (response) {
                deferred.resolve(response.results);
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        this.processFilterSelections = ( filterValues ) => {
            var promises = [],
                deferred = $q.defer();

            _.each(filterValues, function (value, key) {
                switch (key) {
                    case FILTER_KEYS['BOOKING_ORIGIN_CODE']:
                        promises.push(reportSubSrv.fetchBookingOrigins());
                        break;
                    case FILTER_KEYS['MARKET_CODE']:
                        promises.push(reportSubSrv.fetchMarkets());
                        break;
                    case FILTER_KEYS['RESERVATION_STATUS']:
                        promises.push(reportSubSrv.fetchReservationStatus());
                        break;
                    
                    // case FILTER_KEYS['ROOM_NO']:
                    //     promises.push(reportSubSrv.fetchBookingOrigins());
                    //     break;
                    case FILTER_KEYS['ROOM_TYPE']:
                        promises.push(reportSubSrv.fetchRoomTypeList());
                        break;
                    case FILTER_KEYS['SEGMENT_CODE']:
                        promises.push(reportSubSrv.fetchSegments());
                        break;
                    case FILTER_KEYS['SOURCE_CODE']:
                        promises.push(reportSubSrv.fetchSources());
                        break;
                    default:
                }
            });

            $q.all(promises).then(function (data) {
                deferred.resolve(data);
            }, function () {
                deferred.resolve([]);
            });

            return deferred.promise;
        };


    }]);