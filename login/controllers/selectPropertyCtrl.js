angular.module('login').controller('selectPropertyCtrl', ['$scope', 'selectPropertySrv', 'loginSrv', '$window', '$state', '$stateParams', 'ngDialog',
    function($scope, selectPropertySrv, loginSrv, $window, $state, $stateParams, ngDialog) {
        
        BaseCtrl.call(this, $scope);
        var init = function() {
            $scope.errorMessage = "";
            $scope.propertyResults = [];
            $scope.searchData = "";
            $scope.selectedProperty = null;
            $scope.data = {};
            $scope.$emit('hideloader');
            $scope.setScroller('property-results', {click: true});
            $scope.modalClosing = false;
            $scope.successCallbackGetVersion = function(response) {
                var versionNumber = response.data.data.split("-")[0];

                $scope.data.roverVersion = versionNumber;
            };
            loginSrv.getApplicationVersion({}, $scope.successCallbackGetVersion, $scope.failureCallBackGetVersion);
        };

        /*
         * Function to highlight text
         * @param text of data to be filtered
         * @param text to be highlight
         */
        $scope.highlight = function(text, search) {
            if (!search) {
                return text;
            }
            return text.replace(new RegExp(search, 'gi'), '<span class="highlight">$&</span>');
        };

        /*
         * Success callback of Search property
         * @param object of data
         */
        var successCallBackSearchProperty = function(data) {
            $scope.propertyResults = [];
            $scope.propertyResults = data;
            $scope.refreshScroller('property-results');
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
                // CICO-33518 fix
                $scope.selectedProperty = null;
            }
        };

        /*
         * clear search box
         */
        $scope.clearQuery = function() {
            $scope.searchData = "";
            $scope.propertyResults = [];
            $scope.selectedProperty = null;
        };

        /*
         * successCallback of select property
         * @param {object} status of select property
         */
        var successCallback = function() {
            var redirUrl = '/staff/h/' + $scope.selectedProperty.uuid;

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
            $scope.selectedProperty = property;
            $scope.searchData = property.name;
        };

        /*
         * on property select
         */
        $scope.submitProperty = function(property) {
            $scope.hasLoader = true;
            $scope.propertyResults = [];
            var data = {
                hotel_id: $scope.selectedProperty.id
            };

            $scope.invokeApi(selectPropertySrv.setProperty, data, successCallback, failureCallBack);
        };

        $scope.closeDialog = function() {
          $scope.modalClosing = true;
            setTimeout(function () {
                ngDialog.close();
                $scope.modalClosing = false;
                $scope.$apply();
            }, 700);
        };

        $scope.onClickSupportLink = function () {
            if (sntapp.cordovaLoaded) {
                ngDialog.open({
                    template: '/assets/partials/freshdesk.html',
                    className: '',
                    controller: '',
                    scope: $scope
                });
            } else {
                $window.open('https://stayntouch.freshdesk.com/support/home', '_blank');
            }
        };

        init();
    }
]);
