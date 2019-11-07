admin.controller('ADRatesAddonsCtrl', [
    '$scope',
    '$state',
    '$rootScope',
    'ADRatesAddonsSrv',
    '$filter',
    'ngTableParams',
    'ngDialog',
    '$timeout',
    'addonUpsellSettings',
    function($scope, $state, $rootScope, ADRatesAddonsSrv, $filter, ngTableParams, ngDialog, $timeout, addonUpsellSettings) {


        // extend base controller
        $scope.init = function() {
            ADBaseTableCtrl.call(this, $scope, ngTableParams);
            // higlight the selected Main menu (can come to this screen using the addon shortcuts)
            $scope.$emit("changedSelectedMenu", $scope.findMainMenuIndex('Rates'));

            // various addon data holders
            $scope.data = [];
            
            $scope.errorMessage = "";
            $scope.successMessage = "";

            $scope.isConnectedToPMS = !$rootScope.isStandAlone;
            $scope.showZestWebSettings = addonUpsellSettings.zest_web_addon_upsell_availability;
            $scope.showZestStationSettings = addonUpsellSettings.zest_station_addon_upsell_availability;

        };

        $scope.init();

        $scope.fetchTableData = function($defer, params) {
            var getParams = $scope.calculateGetParams(params);

            $scope.currentClickedAddon = -1;

            var fetchSuccessOfItemList = function(data) {
                $scope.totalCount = data.total_count;
                $scope.totalPage = Math.ceil(data.total_count / $scope.displyCount);

                $scope.currentPage = params.page();
                params.total(data.total_count);

                // sort the results
                $scope.data = (params.sorting() && params.orderBy()[0].slice(1, 9) !== 'end_date') ?
                    $filter('orderBy')(data.results, params.orderBy()) :
                    data.results;

                $defer.resolve($scope.data);

                $scope.$emit('hideLoader');
            };

            $scope.invokeApi(ADRatesAddonsSrv.fetch, getParams, fetchSuccessOfItemList);
        };

        $scope.loadTable = function() {
            $scope.currentClickedAddon = -1;
            $scope.tableParams = new ngTableParams({
                page: 1, // show first page
                count: $scope.displyCount, // count per page
                sorting: {
                    name: 'asc' // initial sorting
                }
            }, {
                total: 0, // length of data
                getData: $scope.fetchTableData
            });
        };

        $scope.loadTable();

        // to add new addon
        $scope.addNew = function() {
            $state.go ('admin.ratesAddonDetails', { addonId: "" });
        };

        $scope.editSingle = function() {
            $state.go ('admin.ratesAddonDetails', { addonId: this.item.id });
        };

        // on delete addon
        $scope.deleteAddon = function() {
            var item = this.item;

            $scope.currentClickedAddon = -1;

            var callback = function() {
                var withoutThis = _.without($scope.data, item);

                $scope.data = withoutThis;

                $scope.$emit('hideLoader');


            };

            var data = {
                id: item.id
            };

            $scope.invokeApi(ADRatesAddonsSrv.deleteAddon, data, callback);
        };

        
        $scope.sortByName = function() {
            if ($scope.currentClickedAddon === -1) {
                $scope.tableParams.sorting({
                    'name': $scope.tableParams.isSortBy('name', 'asc') ? 'desc' : 'asc'
                });
            }
        };
        $scope.sortByActiveDate = function() {
            if ($scope.currentClickedAddon === -1) {
                $scope.tableParams.sorting({
                    'end_date': $scope.tableParams.isSortBy('end_date', 'asc') ? 'desc' : 'asc'
                });
            }
        };

        $scope.getActiveDate = function(item) {
            var dateStr = '';

            if (!item.begin_date && !item.end_date) {
                dateStr = 'N/A';
            } else {
                dateStr = (item.begin_date ? item.begin_date : 'N/A') + ' to ' + (item.end_date ? item.end_date : 'N/A');
            }
            return dateStr;
        };

        $scope.isAddOnExpired = function(item) {
            var endDate, businessDate;

            if (!item.end_date) {
                return false;
            }
            endDate = new Date(item.end_date);
            businessDate = new Date($rootScope.businessDate);
            if ( endDate < businessDate) {
                return true;
            }
            return false;
        };

        /**
         * To import the package details from MICROS PMS.
         */
        $scope.importFromPms = function(event) {

            event.stopPropagation();

            $scope.successMessage = "Collecting package details from PMS and adding to Rover...";

            var fetchSuccessOfPackageList = function(data) {
                $scope.$emit('hideLoader');
                $scope.successMessage = "Completed!";
                $timeout(function() {
                    $scope.successMessage = "";
                }, 1000);
            };

            $scope.invokeApi(ADRatesAddonsSrv.importPackages, {}, fetchSuccessOfPackageList);
        };

        // on change activation
        $scope.switchActivation = function() {
            var item = this.item;

            var activateCallback = function() {
                item.activated = !item.activated;

                $scope.$emit('hideLoader');
            };

            var data = {
                id: item.id,
                status: !item.activated
            };

            $scope.invokeApi(ADRatesAddonsSrv.switchActivation, data, activateCallback);
        };        

        $scope.returnAddonUpseellClass = function(addon) {
            var styleClass;

            if (addon.zest_station_upsell && !addon.zest_web_upsell) {
                styleClass = 'kiosk-upsell';
            } else if (!addon.zest_station_upsell && addon.zest_web_upsell) {
                styleClass = 'web-upsell';
            } else if (addon.zest_station_upsell && addon.zest_web_upsell) {
                styleClass = 'zs-n-web-upsell';
            } else {
                styleClass = 'no-upsell';
            }
            return styleClass;

        };
    }
]);
