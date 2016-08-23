login.controller('selectPropertyCtrl', ['$scope', 'selectPropertySrv', '$window', '$state', '$stateParams',
    function($scope, selectPropertySrv, $window, $state, $stateParams) {
        BaseCtrl.call(this, $scope);
        $scope.errorMessage = "";
        $scope.propertyResults = [];
        $scope.searchData = "";
        $scope.selectedPropertyId = "";
        $scope.$emit('hideloader');

        /*
         * Success callback of Search property
         * @param object of data
         */
        var successCallBackSearchProperty = function(data) {
            $scope.propertyResults = [];
            $scope.propertyResults = data;
            $scope.$emit('hideLoader');
        };

        /*
         * Search available properties
         */
        $scope.filterByQuery = function() {
            if ($scope.searchData.length >= 3) {
                // To search available properties - via search query
                var params = {
                    "query": $scope.searchData.toLowerCase(),
                    "per_page": 10
                };
                $scope.invokeApi(selectPropertySrv.searchChargeCode, params, successCallBackSearchProperty);
            } else {
                $scope.propertyResults = [];
            }
        };

        /*
         * clear search box
         */
        $scope.clearQuery = function() {
            $scope.searchData = "";
            $scope.propertyResults = [];
            $scope.selectedPropertyId = "";
            console.log($scope);
        };

        /*
         * successCallback of select property
         * @param {object} status of select property
         */
        var successCallback = function(data) {
            var redirUrl = '/staff';
            setTimeout(function() {
                $window.location.href = redirUrl;
            }, 300);
        };
        /*
         * Failure call back of select property
         */
        var failureCallBack = function(errorMessage) {
            $scope.hasLoader = false;
            $scope.errorMessage = errorMessage[0];
        };

        /*
         * on property select
         */
        $scope.onSelect = function(property) {
            $scope.selectedPropertyId = property.id;
            $scope.searchData = property.name;
        };

        /*
         * on property select
         */
        $scope.submitProperty = function(property) {
            $scope.hasLoader = true;
            $scope.propertyResults = [];
            var data = {
                hotel_id: $scope.selectedPropertyId
            };
            $scope.invokeApi(selectPropertySrv.setProperty, data, successCallback, failureCallBack);
        };

    }
]);
