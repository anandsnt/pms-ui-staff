admin.directive("customRateSearch", function() {

    return {
        restrict: 'E',
        replace: true,
        scope: {
            rateCode: '=rateCode',
            rateName: '=rateName',
            showSearch: '=showSearch'
        },
        templateUrl: '/assets/directives/customRateSearch/customRateSearch.html',
        controller: function($scope, ADRateSequenceSrv) {
            var searchFilteringCall = null;

            $scope.rateSearchResults = [];
            $scope.showRates = false;
            $scope.refreshScroller = function (key) {
                setTimeout(function() {
                    if ( !!$scope.$parent && $scope.$parent.myScroll ) {
                        if ( key in $scope.$parent.myScroll ) {
                            $scope.$parent.myScroll[key].refresh();
                        }
                    }
                }, $scope.timeOutForScrollerRefresh);
            };

            var successCallBackForRateSearch = function(data) {
                    if (data.results && data.results.length) {
                        // change results set to suite our needs
                        $scope.rateSearchResults = data.results;
                        $scope.showRates = true;
                        $scope.refreshScroller('rateList');
                    } else {
                        $scope.showRates = false;
                    }
                },
                onError = function (err) {
                    $scope.errorMessage = err;
                    $scope.$emit('hideLoader');
                };

            $scope.rateKeyEntered = function() {
                if (searchFilteringCall !== null) {
                    clearTimeout(searchFilteringCall);
                }
                searchFilteringCall = setTimeout(function() {
                    $scope.rateName.trim();
                    if ( $scope.rateName.length === 0 ) {
                        $scope.rateCode = null;
                        $scope.rateName = null;
                        $scope.rateSearchResults = [];
                        setTimeout(function() {
                            $scope.$apply();
                        }, 10);
                    } else {
                        initiateSearch();
                    }
                }, 800);
            };

            var initiateSearch = function() {
                var params = {
                    query: $scope.rateName
                };

                ADRateSequenceSrv.searchRates(params).then(successCallBackForRateSearch, onError);
            };

            /**
           * Set the charge code to item selected from auto complete list
           * @param {Integer} charge code value
           */
            $scope.selectRate = function(id, name) {
                $scope.rateCode = id;
                $scope.rateName = name;
                $scope.showRates = false;
            };
            $scope.clearErrorMessage = function() {
                $scope.errorMessage = [];
            };

        }
    };

});
