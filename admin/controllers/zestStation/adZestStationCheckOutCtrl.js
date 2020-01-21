admin.controller('ADZestStationCheckOutCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'ADZestStationSrv', '$filter', 'ADItemSrv', function ($scope, $state, $rootScope, $stateParams, ADZestStationSrv, $filter, ADItemSrv) {
    BaseCtrl.call(this, $scope);

    $scope.data = {};

    $scope.fetchSettings = function () {
        var fetchSuccess = function (data) {
            $scope.zestSettings = data;
            $scope.fetchItems();
            $scope.$emit('hideLoader');
        };

        $scope.invokeApi(ADZestStationSrv.fetch, {}, fetchSuccess);
    };
    $scope.saveSettings = function () {
        var saveSuccess = function () {
            $scope.successMessage = 'Success';
            $scope.$emit('hideLoader');
        };
        var saveFailed = function (response) {
            $scope.errorMessage = 'Failed';
            $scope.$emit('hideLoader');
        };

        $scope.zestSettings.items_for_station = $scope.allowedItemsInZS;

        var dataToSend = {
            'kiosk': $scope.zestSettings
        };

        $scope.invokeApi(ADZestStationSrv.save, dataToSend, saveSuccess, saveFailed);
    };

    $scope.fetchItems = function () {
        /*
        * Success call back of fetch
        * @param {object} items list
        */
        var fetchSuccessOfItemList = function (data) {
            $scope.$emit('hideLoader');
            $scope.data = data;
            $scope.allowedItemsInZS = _.filter(data.items, function (item) {
                return item.station_item;
            });
            $scope.availableItems = _.filter(data.items, function (item) {
                return !item.station_item;
            });
        };

        $scope.invokeApi(ADItemSrv.fetchItemList, {}, fetchSuccessOfItemList);
    };

    $scope.init = function () {
        $scope.allowedItemsInZS = [];
        $scope.availableItems = [];

        $scope.fetchSettings();
    };

    $scope.init();

}]);