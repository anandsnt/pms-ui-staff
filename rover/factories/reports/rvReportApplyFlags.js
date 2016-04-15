angular.module('reportsModule')
    .factory('RVReportApplyFlags', [
        'RVReportNamesConst',
        function(reportNames) {
            return {
                init: function ( report ) {
                    var flags = {
                        'BOOKING_SOURCE_MARKET_REPORT' : ['canRemoveDate'],
                        'LOGIN_AND_OUT_ACTIVITY'       : ['hasUserFilter'],
                        'DEPOSIT_REPORT'               : ['canRemoveDate'],
                        'IN_HOUSE_GUEST'               : ['canRemoveDate'],
                        'OCCUPANCY_REVENUE_SUMMARY'    : ['hasPrevDateLimit'],
                        'RESERVATIONS_BY_USER'         : ['hasUserFilter', 'canRemoveDate'],
                        'MARKET_SEGMENT_STAT_REPORT'   : ['hasDateLimit'],
                        'ROOMS_QUEUED'                 : ['hasSysDateLimit'],
                        'RATE_ADJUSTMENTS_REPORT'      : ['hasDateLimit', 'canRemoveDate'],
                        'ADDON_FORECAST'               : ['canRemoveDate'],
                        'DAILY_PRODUCTION_ROOM_TYPE'   : ['canRemoveDate', 'hasOneYearLimit'],
                        'DAILY_PRODUCTION_DEMO'        : ['hasOneYearLimit'],
                        'DAILY_PRODUCTION_RATE'        : ['hasOneYearLimit'],
                        'RATE_RESTRICTION_REPORT'      : ['hasOneMonthLimit'],
                        'FINANCIAL_TRANSACTIONS_ADJUSTMENT_REPORT' : ['hasUserFilter'],
                        'CANCELLATION_NO_SHOW'          : ['canRemoveDate']
                    };

                    var reportName = _.findKey(reportNames, function(value, key){ return value === report['title'] });

                    if ( !! reportName ) {
                        _.each(flags[reportName], function(flag) {
                            report[flag] = true;
                        });
                    };
                }
            }
        }
    ]);